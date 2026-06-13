import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { matchState } from '../../state/matchState'

const RADIUS = 0.11
const GROUND_Y = -0.89          // pitch (-1) + ball radius
const SPOT = { x: 0, y: GROUND_Y, z: -2.8 }      // penalty spot

// ── Shot trajectory ───────────────────────────────────────────────────────────
// Real-time flight (not scroll-scrubbed): X/Z travel linearly, Y is the linear
// chord plus a true gravity parabola 4·h·f·(1−f).
const NET_TARGET = { x: 2.5, y: 0.95, z: -8.3 }  // top-right corner, inside net
const ARC_HEIGHT = 1.9                            // peak height above the chord
const FLIGHT_TIME = 0.75                          // seconds, boot → net
const IMPACT_F = 0.96                             // flight fraction = net contact
const KICK_CONTACT = 0.35                         // kick-clip fraction of foot apex

const footWorld = new THREE.Vector3()
const prevPos = new THREE.Vector3()

export function Ball({ scrollProgress }) {
  const groupRef = useRef()
  const spin = useRef({ x: 0, z: 0 })
  const launchPos = useRef(new THREE.Vector3())
  const prevFlight = useRef(0)

  // Same cached GLTF instance the <Player> renders — bone world matrices are live
  const { scene } = useGLTF('/models/player.opt.glb', false)

  const footBone = useMemo(() => {
    // GLTFLoader strips ':' from node names: "mixamorig5:RightToeBase" → "mixamorig5RightToeBase"
    let bone =
      scene.getObjectByName('mixamorig5RightToeBase') ||
      scene.getObjectByName('mixamorig5RightFoot')
    if (!bone) {
      scene.traverse((o) => {
        if (!bone && o.isBone && /Right(ToeBase|Foot)/.test(o.name)) bone = o
      })
    }
    return bone
  }, [scene])

  useFrame((state, delta) => {
    const ball = groupRef.current
    if (!ball) return
    const p = scrollProgress.current
    const t = state.clock.elapsedTime
    const shot = matchState.shot
    ball.visible = true

    const inFlight =
      (shot === 'shooting' && matchState.kickProgress >= KICK_CONTACT) ||
      shot === 'scored'

    if (p < 0.72) {
      // ── Dribble / hero: follow the right-foot bone ──────────────────────────
      if (footBone) {
        footBone.getWorldPosition(footWorld)
        prevPos.copy(ball.position)

        // camera-side of the boot during the hero, goal-side while dribbling
        const zOff = p < 0.15 ? 0.28 : -0.12
        const targetX = footWorld.x
        const targetZ = footWorld.z + zOff
        let targetY = Math.max(GROUND_Y, footWorld.y - 0.06)

        // Micro-bounces: high-frequency, low-amplitude hops on the grass
        if (p >= 0.15) {
          targetY += Math.abs(Math.sin(t * 13)) * 0.03
        }

        ball.position.x = THREE.MathUtils.damp(ball.position.x, targetX, 18, delta)
        ball.position.z = THREE.MathUtils.damp(ball.position.z, targetZ, 18, delta)
        ball.position.y = THREE.MathUtils.damp(ball.position.y, targetY, 14, delta)

        // Rolling without slipping: θ = distance / radius, applied per axis
        spin.current.x += (ball.position.z - prevPos.z) / RADIUS
        spin.current.z -= (ball.position.x - prevPos.x) / RADIUS
        ball.rotation.set(spin.current.x, 0, spin.current.z)
      }
      prevFlight.current = 0

    } else if (!inFlight) {
      // ── Waiting at the spot (and the turn/wind-up before contact) ───────────
      prevPos.copy(ball.position)
      ball.position.x = THREE.MathUtils.damp(ball.position.x, SPOT.x, 10, delta)
      ball.position.z = THREE.MathUtils.damp(ball.position.z, SPOT.z, 10, delta)
      ball.position.y = THREE.MathUtils.damp(ball.position.y, SPOT.y, 10, delta)
      spin.current.x += (ball.position.z - prevPos.z) / RADIUS
      spin.current.z -= (ball.position.x - prevPos.x) / RADIUS
      ball.rotation.set(spin.current.x, 0, spin.current.z)
      prevFlight.current = 0

    } else {
      // ── Flight: real-time parabola from the spot to the top corner ──────────
      if (matchState.launchedAt < 0) {
        matchState.launchedAt = t
        launchPos.current.copy(ball.position)
      }
      const f = THREE.MathUtils.clamp((t - matchState.launchedAt) / FLIGHT_TIME, 0, 1)

      ball.position.x = THREE.MathUtils.lerp(launchPos.current.x, NET_TARGET.x, f)
      ball.position.z = THREE.MathUtils.lerp(launchPos.current.z, NET_TARGET.z, f)
      const chordY = THREE.MathUtils.lerp(launchPos.current.y, NET_TARGET.y, f)
      ball.position.y = chordY + ARC_HEIGHT * 4 * f * (1 - f)

      // Net impact — fires the camera shake, the GOOOAL flash and the
      // celebration exactly once per shot
      if (prevFlight.current < IMPACT_F && f >= IMPACT_F) {
        matchState.netImpactAt = t
        matchState.shot = 'scored'
      }
      prevFlight.current = f

      // heavy topspin while airborne, settles once the ball is in the net
      if (f < IMPACT_F) spin.current.x += delta * 26
      ball.rotation.set(spin.current.x, 0, 0)
    }
  })

  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[RADIUS, 24, 24]} />
        <meshStandardMaterial color="#f2f2f2" roughness={0.3} metalness={0.05} />
      </mesh>
      {/* Panel-seam suggestion */}
      <mesh>
        <icosahedronGeometry args={[0.114, 1]} />
        <meshBasicMaterial color="#111111" wireframe opacity={0.45} transparent />
      </mesh>
    </group>
  )
}
