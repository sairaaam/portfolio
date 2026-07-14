import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { matchState } from '../../state/matchState'

// ── Journey (scroll 0 → 0.72): CatmullRom splines. The camera is frozen on
// the hero framing until p=0.15, then pulls back and rides the approach.
// Player walks z 1 → -1.8 (run-up mark behind the penalty spot).
const JOURNEY_POS = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0,    1.4,  4.5),   // hero: close, low, intimate
  new THREE.Vector3(0,    2.2,  6.0),   // pull back as the dribble starts
  new THREE.Vector3(-0.6, 3.2,  8.0),   // tactical pullback, left
  new THREE.Vector3(0.8,  3.4,  7.5),   // wide broadcast, right
  new THREE.Vector3(0,    2.4,  4.0),   // pushing in with the player
  new THREE.Vector3(0,    1.7,  1.2),   // ease in behind the player for the penalty view
])

const JOURNEY_LOOK = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0.8,  0.6),   // player chest (he stands at z=1)
  new THREE.Vector3(0, 0.6,  0),
  new THREE.Vector3(0, 0.5, -0.8),
  new THREE.Vector3(0, 0.5, -1.6),
  new THREE.Vector3(0, 0.5, -2.6),
  new THREE.Vector3(0, 0.6, -4.5),   // settling toward the goal for the penalty view
])

// ── Penalty sequence framings, selected by shot state (not scroll).
// The player stays at z=-2.8, 5.2 units in front of the goal (z=-8) — the
// shot framings keep BOTH in frame so the strike reads from a distance
// instead of the player looming inside the goalmouth.
const FRAMINGS = [
  // [posX, posY, posZ, lookX, lookY, lookZ, fov]
  [ 0,    1.8,  0.4,   0,    0.5, -5.5,  45],  // 0 WAITING — over the shoulder: player, ball, goal ahead
  [-5.5,  9,    2,     0.3, -0.3, -5.5,  48],  // 1 STRIKE  — eagle view: high, wide, whole penalty area below
  [-4.5,  8.5,  0.8,   0.6, -0.3, -6,    48],  // 2 FLIGHT  — slow aerial drift following the ball to the net
  [-3,    3,    0,     0,    1,   -3,    50],  // 3 CELEBRATE — elevated side angle
]

function framingIndex(t) {
  const { shot, launchedAt, netImpactAt } = matchState
  if (shot === 'idle') return 0
  if (shot === 'scored') {
    // hold the flight cam for a beat after the net ripples, then rise
    return netImpactAt >= 0 && t - netImpactAt > 1.0 ? 3 : 2
  }
  // 'requested' / 'shooting'
  return launchedAt >= 0 ? 2 : 1
}

function journeyFov(u) {
  if (u < 0.35) return THREE.MathUtils.lerp(42, 55, u / 0.35)
  if (u < 0.6) return 55
  return THREE.MathUtils.lerp(55, 38, (u - 0.6) / 0.4)
}

const posTarget = new THREE.Vector3()
const lookTarget = new THREE.Vector3()

export function CameraRig({ scrollProgress, isMobile, reducedMotion }) {
  const { camera } = useThree()
  const smoothPos = useRef(new THREE.Vector3(0, 1.4, 4.5))
  const smoothLook = useRef(new THREE.Vector3(0, 0.8, 0.6))
  const smoothFov = useRef(42)
  const frameIndex = useRef(-1)   // -1 = journey

  // getPoint allocates — pre-sample the curves into LUTs once
  const { posLUT, lookLUT } = useMemo(() => {
    const N = 200
    const posLUT = []
    const lookLUT = []
    for (let i = 0; i <= N; i++) {
      posLUT.push(JOURNEY_POS.getPoint(i / N))
      lookLUT.push(JOURNEY_LOOK.getPoint(i / N))
    }
    return { posLUT, lookLUT }
  }, [])

  useFrame((state, delta) => {
    if (isMobile) {
      camera.position.set(0, 2, 5)
      camera.lookAt(0, 0.5, 0)
      return
    }

    const p = THREE.MathUtils.clamp(scrollProgress.current, 0, 1)
    const t = state.clock.elapsedTime
    let targetFov
    let newIndex = -1

    if (p < 0.72) {
      // Journey — frozen on the hero frame until 0.15
      const u = (THREE.MathUtils.clamp(p, 0.15, 0.72) - 0.15) / 0.57
      const f = u * 200
      const i0 = Math.floor(f)
      const i1 = Math.min(i0 + 1, 200)
      const ft = f - i0
      posTarget.lerpVectors(posLUT[i0], posLUT[i1], ft)
      lookTarget.lerpVectors(lookLUT[i0], lookLUT[i1], ft)
      targetFov = journeyFov(u)
    } else {
      newIndex = framingIndex(t)
      const fr = FRAMINGS[newIndex]
      posTarget.set(fr[0], fr[1], fr[2])
      lookTarget.set(fr[3], fr[4], fr[5])
      targetFov = fr[6]
    }

    // Hard TV cut whenever the penalty sequence changes framing past the
    // stare-down (entering/leaving STRIKE, FLIGHT, CELEBRATE) — interpolating
    // those moves would sweep the camera through the player or the net
    const crossedCut =
      newIndex !== frameIndex.current &&
      (newIndex >= 1 || frameIndex.current >= 1) &&
      // STRIKE → FLIGHT is a gentle push-in on the same side view — glide it
      !(frameIndex.current === 1 && newIndex === 2)
    frameIndex.current = newIndex
    if (crossedCut) {
      smoothPos.current.copy(posTarget)
      smoothLook.current.copy(lookTarget)
      smoothFov.current = targetFov
    }

    // Cinematic pursuit — damp lambda 2.4 ≈ lerp 0.04/frame
    const L = 2.4
    smoothPos.current.x = THREE.MathUtils.damp(smoothPos.current.x, posTarget.x, L, delta)
    smoothPos.current.y = THREE.MathUtils.damp(smoothPos.current.y, posTarget.y, L, delta)
    smoothPos.current.z = THREE.MathUtils.damp(smoothPos.current.z, posTarget.z, L, delta)
    smoothLook.current.x = THREE.MathUtils.damp(smoothLook.current.x, lookTarget.x, L, delta)
    smoothLook.current.y = THREE.MathUtils.damp(smoothLook.current.y, lookTarget.y, L, delta)
    smoothLook.current.z = THREE.MathUtils.damp(smoothLook.current.z, lookTarget.z, L, delta)

    let x = smoothPos.current.x
    let y = smoothPos.current.y

    // Idle breathing on the static hero frame only — skipped for
    // prefers-reduced-motion (a subtle vestibular trigger some users flag)
    if (p < 0.15 && !reducedMotion) {
      y += Math.sin(t * 1.2) * 0.008
    }

    // Strike shake — while the kick winds up (camera on the side profile)
    if (newIndex === 1 && matchState.shot === 'shooting' && !reducedMotion) {
      x += Math.sin(t * 60) * 0.02
      y += Math.cos(t * 60) * 0.01
    }

    // Net-impact shake: random offsets with an exponential decay over ~0.45s
    const sinceImpact = matchState.netImpactAt >= 0 ? t - matchState.netImpactAt : Infinity
    if (sinceImpact < 0.45 && !reducedMotion) {
      const energy = Math.exp(-7 * sinceImpact) * 0.14
      x += (Math.random() - 0.5) * 2 * energy
      y += (Math.random() - 0.5) * 2 * energy
    }

    camera.position.set(x, y, smoothPos.current.z)
    camera.lookAt(smoothLook.current)

    smoothFov.current = THREE.MathUtils.damp(smoothFov.current, targetFov, 4, delta)
    if (Math.abs(camera.fov - smoothFov.current) > 0.01) {
      camera.fov = smoothFov.current
      camera.updateProjectionMatrix()
    }
  })

  return null
}
