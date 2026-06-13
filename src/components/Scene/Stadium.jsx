import { useRef, useMemo, forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import * as THREE from 'three'

// Soft radial glow texture for floodlight halos
function useGlowTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 128
    const ctx = canvas.getContext('2d')
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    g.addColorStop(0, 'rgba(255,250,235,0.9)')
    g.addColorStop(0.25, 'rgba(255,245,220,0.35)')
    g.addColorStop(1, 'rgba(255,245,220,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 128, 128)
    return new THREE.CanvasTexture(canvas)
  }, [])
}

function FloodlightTower({ position, glowMap, phase = 0 }) {
  const lampRef = useRef()
  const haloRef = useRef()

  // Subtle mains flicker — barely perceptible, sells "real lights"
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const flicker = Math.sin(t * 23.7 + phase) * 0.06 + Math.sin(t * 9.3 + phase * 2) * 0.04
    if (lampRef.current) lampRef.current.emissiveIntensity = 2.2 + flicker
    if (haloRef.current) haloRef.current.opacity = 0.85 + flicker * 0.4
  })

  return (
    <group position={position}>
      {/* Mast */}
      <mesh position={[0, 4.5, 0]}>
        <cylinderGeometry args={[0.08, 0.14, 9, 6]} />
        <meshStandardMaterial color="#222831" roughness={0.8} metalness={0.6} />
      </mesh>
      {/* Lamp head */}
      <mesh position={[0, 9.2, 0]}>
        <boxGeometry args={[1.8, 0.7, 0.3]} />
        <meshStandardMaterial
          ref={lampRef}
          color="#fffbe8"
          emissive="#fff6d8"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      {/* Halo */}
      <sprite position={[0, 9.2, 0]} scale={[5.5, 3.2, 1]}>
        <spriteMaterial
          ref={haloRef}
          map={glowMap}
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  )
}

// 200 faint stars in a dome above the stadium
function StarField() {
  const positions = useMemo(() => {
    const pos = new Float32Array(200 * 3)
    for (let i = 0; i < 200; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 0.4   // upper dome only
      const r = 55 + Math.random() * 15
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = 12 + r * Math.cos(phi) * 0.5
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    return pos
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={200} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.18} color="#ffffff" transparent opacity={0.4} sizeAttenuation depthWrite={false} fog={false} />
    </points>
  )
}

// Crowd as thousands of light points in sloped stands — reads as a packed
// floodlit stadium without geometry cost. Colours: white / light-blue / dark-
// blue (a crowd under stadium lights), with a gentle collective sway.
function Crowd() {
  const crowdRef = useRef()
  const { positions, colors } = useMemo(() => {
    const count = 2600
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const c = new THREE.Color()
    let i = 0

    const bands = [
      // [xMin, xMax, zMin, zMax] — two long sides, two ends
      [-24, -15.5, -26, 22],
      [15.5, 24, -26, 22],
      [-15, 15, -30, -19],
      [-15, 15, 15, 26],
    ]
    for (let n = 0; n < count; n++) {
      const b = bands[n % 4]
      const x = THREE.MathUtils.lerp(b[0], b[1], Math.random())
      const z = THREE.MathUtils.lerp(b[2], b[3], Math.random())
      // rake: farther from pitch = higher (±0.5 random variation)
      const d = Math.max(Math.abs(x) - 15, Math.abs(z) - 14, 0)
      const y = 0.5 + d * 0.85 + (Math.random() - 0.5)
      pos[i] = x; pos[i + 1] = y; pos[i + 2] = z
      // crowd colour mix: white, light blue, dark blue
      const r = Math.random()
      if (r < 0.34) c.setHSL(0.0, 0.0, 0.85)        // white
      else if (r < 0.67) c.setHSL(0.57, 0.55, 0.68)  // light blue
      else c.setHSL(0.62, 0.5, 0.34)                 // dark blue
      col[i] = c.r; col[i + 1] = c.g; col[i + 2] = c.b
      i += 3
    }
    return { positions: pos, colors: col }
  }, [])

  // Subtle, cheap ambient sway — the whole stand drifts ±0.06 on X
  useFrame((state) => {
    if (crowdRef.current) crowdRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.06
  })

  return (
    <points ref={crowdRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.1} vertexColors transparent opacity={0.85} sizeAttenuation depthWrite={false} />
    </points>
  )
}

// Dark raked stand silhouettes behind the crowd dots
function Stands() {
  const mat = <meshStandardMaterial color="#0b1018" roughness={1} />
  return (
    <group>
      {/* Long sides */}
      <mesh position={[-19.5, 3.2, -2]} rotation={[0, 0, 0.62]}>
        <boxGeometry args={[9, 0.4, 48]} />
        {mat}
      </mesh>
      <mesh position={[19.5, 3.2, -2]} rotation={[0, 0, -0.62]}>
        <boxGeometry args={[9, 0.4, 48]} />
        {mat}
      </mesh>
      {/* Ends */}
      <mesh position={[0, 3.2, -24]} rotation={[-0.62, 0, 0]}>
        <boxGeometry args={[40, 0.4, 11]} />
        {mat}
      </mesh>
      <mesh position={[0, 3.2, 20.5]} rotation={[0.62, 0, 0]}>
        <boxGeometry args={[40, 0.4, 11]} />
        {mat}
      </mesh>
    </group>
  )
}

// Forwarded ref so the parent can run the GSAP rise entrance.
// frustumCulled={false} on every mesh — thin cylinders have tight bounding
// volumes and Three.js wrongly culls parts of the goal at glancing angles,
// which is what made it render "cut in half".
const Goalpost = forwardRef(function Goalpost(_, ref) {
  const postMat = (
    <meshStandardMaterial color="#f5f5f5" roughness={0.25} metalness={0.3} />
  )
  return (
    // Start hidden below the pitch — useFrame rises it to y=-1 at p≥0.65.
    // visible={false} + y=-7 prevents a one-frame flash before useFrame runs.
    <group ref={ref} position={[0, -7, -8]} visible={false}>
      {/* Left post */}
      <mesh position={[-3.66, 1.22, 0]} castShadow frustumCulled={false}>
        <cylinderGeometry args={[0.06, 0.06, 2.44, 12]} />
        {postMat}
      </mesh>
      {/* Right post */}
      <mesh position={[3.66, 1.22, 0]} castShadow frustumCulled={false}>
        <cylinderGeometry args={[0.06, 0.06, 2.44, 12]} />
        {postMat}
      </mesh>
      {/* Crossbar — horizontal: cylinder Y-axis rotated 90° around Z */}
      <mesh position={[0, 2.44, 0]} rotation={[0, 0, Math.PI / 2]} castShadow frustumCulled={false}>
        <cylinderGeometry args={[0.06, 0.06, 7.32, 12]} />
        {postMat}
      </mesh>
      {/* Back support poles */}
      <mesh position={[-3.66, 0.6, -1.0]} rotation={[0.55, 0, 0]} frustumCulled={false}>
        <cylinderGeometry args={[0.03, 0.03, 2.6, 8]} />
        {postMat}
      </mesh>
      <mesh position={[3.66, 0.6, -1.0]} rotation={[0.55, 0, 0]} frustumCulled={false}>
        <cylinderGeometry args={[0.03, 0.03, 2.6, 8]} />
        {postMat}
      </mesh>
      {/* Net — back plane behind the posts, see-through so the player reads
          through it when the camera cuts behind the goal */}
      <mesh position={[0, 0.9, -1.5]} rotation={[-0.12, 0, 0]} frustumCulled={false}>
        <planeGeometry args={[7.32, 1.9, 36, 12]} />
        <meshBasicMaterial color="#ffffff" opacity={0.15} transparent wireframe side={2} depthWrite={false} />
      </mesh>
      <mesh position={[0, 2.3, -0.75]} rotation={[Math.PI / 2 - 0.18, 0, 0]} frustumCulled={false}>
        <planeGeometry args={[7.32, 1.55, 36, 8]} />
        <meshBasicMaterial color="#ffffff" opacity={0.14} transparent wireframe side={2} depthWrite={false} />
      </mesh>
      <mesh position={[-3.66, 1.0, -0.75]} rotation={[0, Math.PI / 2, 0]} frustumCulled={false}>
        <planeGeometry args={[1.5, 2.1, 8, 10]} />
        <meshBasicMaterial color="#ffffff" opacity={0.13} transparent wireframe side={2} depthWrite={false} />
      </mesh>
      <mesh position={[3.66, 1.0, -0.75]} rotation={[0, Math.PI / 2, 0]} frustumCulled={false}>
        <planeGeometry args={[1.5, 2.1, 8, 10]} />
        <meshBasicMaterial color="#ffffff" opacity={0.13} transparent wireframe side={2} depthWrite={false} />
      </mesh>
    </group>
  )
})

// White line helper — flat plane slightly above grass
function Line({ position, size }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
      <planeGeometry args={size} />
      <meshStandardMaterial color="#e8f0e8" opacity={0.85} transparent />
    </mesh>
  )
}

// Markings anchored to the goal — these must NOT scroll with the pitch
function GoalAreaMarkings() {
  return (
    <group>
      {/* Goal line */}
      <Line position={[0, -0.985, -8]} size={[29, 0.08]} />
      {/* Penalty box: front + sides (16.5m scaled ≈ 6 deep) */}
      <Line position={[0, -0.985, -2]} size={[13.2, 0.08]} />
      <Line position={[-6.6, -0.985, -5]} size={[0.08, 6]} />
      <Line position={[6.6, -0.985, -5]} size={[0.08, 6]} />
      {/* Six-yard box */}
      <Line position={[0, -0.985, -6]} size={[6.2, 0.08]} />
      <Line position={[-3.1, -0.985, -7]} size={[0.08, 2]} />
      <Line position={[3.1, -0.985, -7]} size={[0.08, 2]} />
      {/* Penalty spot — world [0, -0.99, -2.8] when wrapper is at z=0 (p≥0.72),
          matching the player's locked kick position */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.99, -2.8]}>
        <circleGeometry args={[0.12, 16]} />
        <meshStandardMaterial color="#e8f0e8" opacity={0.9} transparent />
      </mesh>
      {/* Penalty arc — the "D": only the part of the circle centred on the
          penalty spot that falls OUTSIDE the box (box front line is z=-2) */}
      <PenaltyArc />
    </group>
  )
}

function PenaltyArc() {
  const line = useMemo(() => {
    const points = []
    const centerZ = -2.8       // penalty spot — matches player kick position
    const radius = 3.2         // standard 10-yard restriction zone arc
    const boxFrontZ = -2       // front edge of penalty box

    // sin(angle) >= 0 sweeps the half-circle on the player's side;
    // keep only the points in front of the box line
    for (let angle = 0; angle <= Math.PI; angle += 0.02) {
      const x = Math.cos(angle) * radius
      const z = centerZ + Math.sin(angle) * radius
      if (z > boxFrontZ) {
        points.push(new THREE.Vector3(x, -0.98, z))
      }
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: '#e8f0e8',
      transparent: true,
      opacity: 0.7,
    })
    return new THREE.Line(geometry, material)
  }, [])

  return <primitive object={line} />
}

// Distance traveled down the pitch — shared by grass, midfield markings and
// the approaching goal so everything stays planted relative to the grass.
// NOTHING moves before p=0.15 (hero is completely static); 31.2 units total,
// arriving at p=0.72 (when the player locks onto the penalty spot).
export function traveled(p) {
  return (THREE.MathUtils.clamp(p, 0.15, 0.72) - 0.15) * (31.2 / 0.57)
}

// Grass + mowing stripes — scrolls to simulate the run
function Pitch({ scrollProgress }) {
  const stripesRef = useRef()
  const midfieldRef = useRef()

  useFrame(() => {
    const t = traveled(scrollProgress.current)
    // stripes tile with period 10 — endless treadmill
    if (stripesRef.current) stripesRef.current.position.z = t % 10
    // centre circle recedes behind the player once, never wraps
    if (midfieldRef.current) midfieldRef.current.position.z = t
  })

  return (
    <>
      {/* Static base grass — never moves, fills to the stands. Brighter green
          with a touch of emissive for the lit-from-above floodlit look. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.001, -2]} receiveShadow>
        <planeGeometry args={[44, 70]} />
        <meshStandardMaterial color="#2d8a2d" emissive="#0a2d0a" emissiveIntensity={0.15} roughness={0.85} metalness={0} />
      </mesh>

      {/* Touchlines — parallel to the run, safe to keep static */}
      <Line position={[-14.5, -0.985, 6]} size={[0.08, 60]} />
      <Line position={[14.5, -0.985, 6]} size={[0.08, 60]} />

      <group ref={stripesRef}>
        {/* Mowing stripes — alternate tone every 5 units, tile period 10 */}
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh
            key={i}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.995, -45 + i * 10]}
            receiveShadow
          >
            <planeGeometry args={[30, 5]} />
            <meshStandardMaterial color="#327a34" emissive="#0a2d0a" emissiveIntensity={0.12} roughness={0.88} />
          </mesh>
        ))}
      </group>

      <group ref={midfieldRef}>
        {/* Centre circle + halfway line — left behind as the player advances */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.99, 4]}>
          <ringGeometry args={[4.5, 4.58, 64]} />
          <meshStandardMaterial color="#e8f0e8" opacity={0.55} transparent />
        </mesh>
        <Line position={[0, -0.99, 4]} size={[29, 0.08]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.99, 4]}>
          <circleGeometry args={[0.14, 16]} />
          <meshStandardMaterial color="#e8f0e8" opacity={0.8} transparent />
        </mesh>
      </group>
    </>
  )
}

export function Stadium({ scrollProgress }) {
  const wrapperRef = useRef()   // z-motion: goal area travels with the grass
  const markingsRef = useRef()  // box markings: opacity fade-in
  const goalpostRef = useRef()  // goalpost: GSAP rise entrance
  const goalUp = useRef(false)
  const glowMap = useGlowTexture()

  useFrame(() => {
    const p = scrollProgress.current

    // Goal area approaches at the same rate the grass scrolls — planted on
    // the pitch. Starts 31.2 units deep, arrives (goal at z=-8) at p=0.78.
    if (wrapperRef.current) {
      wrapperRef.current.position.z = traveled(p) - 31.2
    }

    // Box markings fade in as the player nears the final third
    const markings = markingsRef.current
    if (markings) {
      const o = THREE.MathUtils.smoothstep(p, 0.45, 0.60)
      markings.visible = o > 0.01
      markings.traverse((obj) => {
        if (obj.material) {
          if (obj.userData.baseOpacity === undefined) {
            obj.userData.baseOpacity = obj.material.opacity
            obj.material.transparent = true
          }
          obj.material.opacity = obj.userData.baseOpacity * o
        }
      })
    }

    // Goalpost entrance: hidden until p >= 0.65, then rises from below the
    // pitch (y -7 → -1) over 0.6s. Reset cleanly when scrolling back up.
    const gp = goalpostRef.current
    if (gp) {
      if (!gp.userData.init) {
        gp.userData.init = true
        gp.visible = false
        gp.position.y = -7
      }
      if (p >= 0.65 && !goalUp.current) {
        goalUp.current = true
        gp.visible = true
        gsap.to(gp.position, { y: -1, duration: 0.6, ease: 'power3.out', overwrite: true })
      } else if (p < 0.65 && goalUp.current) {
        goalUp.current = false
        gsap.killTweensOf(gp.position)
        gp.position.y = -7
        gp.visible = false
      }
    }
  })

  return (
    <>
      {/* Floodlit night-game atmosphere — deep-blue haze */}
      <fog attach="fog" args={['#0a1a2e', 20, 65]} />

      {/* Cool blue ambient + hemisphere fill */}
      <ambientLight intensity={0.35} color="#8ab4d4" />
      <hemisphereLight args={['#9ec8ff', '#1a3a1a', 0.4]} />

      {/* Atmospheric blue wash from above — also the shadow key */}
      <directionalLight
        position={[6, 18, 6]}
        intensity={1.1}
        color="#cfe4ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* 4 corner floodlight banks — the electric-stadium key lights */}
      <pointLight position={[-18, 14, 8]} intensity={2.5} color="#e8f4ff" distance={60} decay={1.5} />
      <pointLight position={[18, 14, 8]} intensity={2.5} color="#e8f4ff" distance={60} decay={1.5} />
      <pointLight position={[-18, 14, -15]} intensity={2.0} color="#ddeeff" distance={60} decay={1.5} />
      <pointLight position={[18, 14, -15]} intensity={2.0} color="#ddeeff" distance={60} decay={1.5} />

      {/* Ground bounce — the pitch glows green from below */}
      <pointLight position={[0, 0.5, -4]} intensity={1.2} color="#2d7a2d" distance={20} decay={2} />

      {/* Character lighting — keeps the player vivid and rims his hair so it
          doesn't blend into the dark sky. Tuned to the corridor he occupies
          (x≈0, z 1 → -2.8): a warm front fill + a cool top/back hair light. */}
      <pointLight position={[3, 3.5, 4]} intensity={1.5} color="#fff3e2" distance={18} decay={2} />
      <pointLight position={[0, 6.5, -1]} intensity={2.0} color="#d6ebff" distance={16} decay={2} />

      {/* Stadium environment */}
      <Stands />
      <Crowd />
      <StarField />
      <FloodlightTower position={[-13, 0, -14]} glowMap={glowMap} phase={0} />
      <FloodlightTower position={[13, 0, -14]} glowMap={glowMap} phase={1.7} />
      <FloodlightTower position={[-13, 0, 10]} glowMap={glowMap} phase={3.1} />
      <FloodlightTower position={[13, 0, 10]} glowMap={glowMap} phase={4.6} />

      <Pitch scrollProgress={scrollProgress} />

      {/* Goal + its markings travel together — anchored to each other.
          Initial z=-31.2 matches traveled(0)=0 so there is no first-frame flash
          before useFrame sets the correct position. */}
      <group ref={wrapperRef} position={[0, 0, -31.2]}>
        <Goalpost ref={goalpostRef} />
        <group ref={markingsRef} visible={false}>
          <GoalAreaMarkings />
        </group>
      </group>
    </>
  )
}
