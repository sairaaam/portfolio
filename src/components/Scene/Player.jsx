import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { LoopOnce, Box3, Vector3, MathUtils } from 'three'
import { matchState, resetShot } from '../../state/matchState'

const WAIT_Z = -1.8    // run-up mark, one stride behind the penalty spot
const SPOT_Z = -2.8    // penalty spot — the ball sits here, the kick lands here

// Pitch surface sits at world y ≈ -1. FOOT_SINK closes the last hair of gap so
// the boots rest on the grass instead of hovering — tweak between 0 and 0.12.
const PITCH_Y = -1
const FOOT_SINK = 0.06

// Scroll drives the approach; the shot itself is event-driven (SPACE key).
const getPhase = (p, shot) => {
  if (p < 0.15) return 'IDLE_FACING_CAMERA'
  if (p < 0.72) return 'DRIBBLING'
  if (shot === 'idle') return 'AWAITING_SHOT'
  if (shot === 'scored') return 'CELEBRATING'
  return 'SHOOTING'   // 'requested' or 'shooting'
}

export function Player({ scrollProgress, isMobile }) {
  const playerRef = useRef()
  const kickFired = useRef(false)
  const prevZ = useRef(1)           // for velocity → animation timeScale sync
  const currentAnim = useRef('Idle')   // name of the clip currently faded in
  const { scene, animations } = useGLTF('/models/player.opt.glb', false)

  // Kick and Celebration have root motion — the hips translate the skeleton
  // forward, which carries the player past the SPOT_Z clamp and into the goal
  // (the group clamp can't stop bone-level movement). The Mixamo armature is
  // axis-rotated, so the travel isn't guaranteed to be in local X/Z — pin all
  // three hip position components to the first keyframe so these clips play
  // fully in place. Idempotent, so re-running on the cached clips is safe.
  useMemo(() => {
    for (const clip of animations) {
      if (clip.name !== 'Kick' && clip.name !== 'Celebration') continue
      for (const track of clip.tracks) {
        if (!track.name.includes('Hips') || !track.name.endsWith('.position')) continue
        for (let i = 0; i < track.values.length; i += 3) {
          track.values[i] = track.values[0]
          track.values[i + 1] = track.values[1]
          track.values[i + 2] = track.values[2]
        }
      }
    }
  }, [animations])

  const { actions } = useAnimations(animations, playerRef)

  // Auto-scale: measure actual world-space height at scale=1, then pin feet to y=-1
  useEffect(() => {
    if (!scene || !playerRef.current) return
    playerRef.current.scale.set(1, 1, 1)
    playerRef.current.updateWorldMatrix(true, true)
    const box = new Box3().setFromObject(playerRef.current)
    const size = new Vector3()
    box.getSize(size)
    const targetH = isMobile ? 1.4 : 1.8
    const s = size.y > 0.0001 ? targetH / size.y : targetH
    playerRef.current.scale.setScalar(s)
    playerRef.current.updateWorldMatrix(true, true)
    const newBox = new Box3().setFromObject(playerRef.current)
    playerRef.current.position.y = PITCH_Y - newBox.min.y - FOOT_SINK
  }, [scene, isMobile])

  // Start in Idle so the hero frame has motion immediately
  useEffect(() => {
    if (!actions) return
    const idle = actions['Idle']
    if (idle) idle.reset().fadeIn(0.3).play()
  }, [actions])

  useFrame((_, delta) => {
    if (!playerRef.current || !actions || isMobile) return
    const p = scrollProgress.current
    const phase = getPhase(p, matchState.shot)

    const dribble = actions['Dribble']
    const kick = actions['Kick']

    // ── Position ─────────────────────────────────────────────────────────────
    // Walk z 1 → WAIT_Z over the dribble, hold at WAIT_Z while waiting, then
    // step onto the spot during the kick wind-up so the strike lands on the
    // ball. Hard clamp: never past SPOT_Z (goal is at z=-8).
    let z = 1
    if (phase === 'DRIBBLING') {
      const walk = MathUtils.clamp((p - 0.15) / 0.57, 0, 1)
      z = MathUtils.lerp(1, WAIT_Z, MathUtils.smoothstep(walk, 0, 1))
    } else if (phase === 'AWAITING_SHOT') {
      z = WAIT_Z
    } else if (phase !== 'IDLE_FACING_CAMERA') {
      // SHOOTING / CELEBRATING: advance with the kick wind-up, arrive at the
      // spot exactly when the foot reaches the contact frame (kickProgress 0.3)
      const stride = MathUtils.clamp(matchState.kickProgress / 0.3, 0, 1)
      z = MathUtils.lerp(WAIT_Z, SPOT_Z, MathUtils.smoothstep(stride, 0, 1))
    }
    playerRef.current.position.z = Math.max(z, SPOT_Z)

    // ── Foot-skating fix ──────────────────────────────────────────────────────
    const speed = Math.abs(playerRef.current.position.z - prevZ.current) / Math.max(delta, 1e-4)
    prevZ.current = playerRef.current.position.z

    // ── Rotation ──────────────────────────────────────────────────────────────
    // rotation.y = 0 faces the camera (+Z); Math.PI faces the goal (−Z).
    // Only the hero faces the camera — from the first dribble step through the
    // shot and celebration he stays squared up to the goal.
    const targetRotation = phase === 'IDLE_FACING_CAMERA' ? 0 : Math.PI
    playerRef.current.rotation.y = MathUtils.lerp(
      playerRef.current.rotation.y, targetRotation, 0.08
    )

    // ── Animation phase logic ─────────────────────────────────────────────────
    // One-shot crossfades keyed on the current clip name. NEVER call fadeOut/
    // fadeIn per frame: isRunning() stays true for a fading action, so the
    // "start idle if not running" guard never fires, and re-calling fadeOut
    // every frame restarts the fade so it never completes — that bug kept the
    // dribble playing at the penalty spot.
    const crossfadeTo = (name, fade = 0.3) => {
      if (currentAnim.current === name) return
      const next = actions[name]
      if (!next) return
      const prev = actions[currentAnim.current]
      if (prev && prev !== next) prev.fadeOut(fade)
      next.reset().fadeIn(fade).play()
      currentAnim.current = name
    }

    if (phase === 'IDLE_FACING_CAMERA' || phase === 'AWAITING_SHOT' || phase === 'DRIBBLING') {
      // Any pre-shot phase: make sure a stale shot is fully reset (this is
      // what makes scroll-back a clean replay)
      kickFired.current = false
      if (matchState.shot !== 'idle') resetShot()
    }

    if (phase === 'IDLE_FACING_CAMERA' || phase === 'AWAITING_SHOT') {
      crossfadeTo('Idle')

    } else if (phase === 'DRIBBLING') {
      // Dribble only while actually covering ground; the moment the walk stops
      // (scroll paused, or arrived at the run-up mark) he stands still in Idle
      if (speed > 0.15) {
        crossfadeTo('Dribble', 0.25)
        if (dribble) {
          const STRIDE_SPEED = 1.15
          dribble.timeScale = MathUtils.clamp(speed / STRIDE_SPEED, 0.35, 1.8)
        }
      } else {
        crossfadeTo('Idle', 0.25)
      }

    } else if (phase === 'SHOOTING') {
      if (matchState.shot === 'requested' && !kickFired.current && kick) {
        kickFired.current = true
        matchState.shot = 'shooting'
        kick.setLoop(LoopOnce, 1)
        kick.clampWhenFinished = true
        crossfadeTo('Kick', 0.15)
      }

    } else {
      // CELEBRATING
      crossfadeTo('Celebration')
    }

    // Restore normal playback rate whenever the dribble isn't driving the walk
    if (dribble && currentAnim.current !== 'Dribble') dribble.timeScale = 1

    // Publish normalized kick progress — Ball launches the ball at the exact
    // frame the striking foot reaches its forward apex (see Ball.jsx)
    matchState.kickProgress = kick?.isRunning()
      ? kick.time / kick.getClip().duration
      : kickFired.current ? 1 : 0
  })

  return (
    <primitive
      ref={playerRef}
      object={scene}
      scale={1}
      position={[0, -1, 1]}
      rotation={[0, 0, 0]}
    />
  )
}

useGLTF.preload('/models/player.opt.glb', false)
