import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { usePlayerStore } from '../store/usePlayerStore'

export default function VinylDeck3D() {
  const containerRef = useRef(null)
  const track = usePlayerStore((s) => s.currentTrack())
  const isPlaying = usePlayerStore((s) => s.isPlaying)

  const isPlayingRef = useRef(isPlaying)
  const hueRef = useRef(track?.hue ?? 320)

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  useEffect(() => {
    hueRef.current = track?.hue ?? 320
  }, [track])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 320
    const height = container.clientHeight || 280

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 3.5, 4.2)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2)
    mainLight.position.set(3, 8, 4)
    mainLight.castShadow = true
    scene.add(mainLight)

    const neonLight = new THREE.PointLight(
      new THREE.Color(`hsl(${hueRef.current}, 80%, 60%)`),
      3,
      10
    )
    neonLight.position.set(-2, 2, 2)
    scene.add(neonLight)

    // 3. Turntable Base Plate
    const deckGroup = new THREE.Group()
    scene.add(deckGroup)

    const baseGeo = new THREE.BoxGeometry(4.2, 0.25, 3.4)
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x141419,
      roughness: 0.3,
      metalness: 0.8,
    })
    const baseMesh = new THREE.Mesh(baseGeo, baseMat)
    baseMesh.position.y = -0.125
    baseMesh.receiveShadow = true
    deckGroup.add(baseMesh)

    // Glowing Base Border
    const borderGeo = new THREE.BoxGeometry(4.24, 0.04, 3.44)
    const borderMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(`hsl(${hueRef.current}, 80%, 50%)`),
    })
    const borderMesh = new THREE.Mesh(borderGeo, borderMat)
    borderMesh.position.y = -0.02
    deckGroup.add(borderMesh)

    // Platter
    const platterGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.08, 64)
    const platterMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a32,
      metalness: 0.9,
      roughness: 0.2,
    })
    const platter = new THREE.Mesh(platterGeo, platterMat)
    platter.position.set(-0.5, 0.04, 0)
    platter.castShadow = true
    deckGroup.add(platter)

    // 4. Vinyl Record
    const recordGroup = new THREE.Group()
    recordGroup.position.set(-0.5, 0.09, 0)
    deckGroup.add(recordGroup)

    // Vinyl Disc
    const vinylGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.03, 64)
    const vinylMat = new THREE.MeshStandardMaterial({
      color: 0x08080a,
      roughness: 0.15,
      metalness: 0.4,
    })
    const vinyl = new THREE.Mesh(vinylGeo, vinylMat)
    vinyl.castShadow = true
    recordGroup.add(vinyl)

    // Vinyl Groove Rings (Procedural Lines)
    for (let r = 0.5; r < 1.25; r += 0.08) {
      const ringGeo = new THREE.RingGeometry(r, r + 0.02, 64)
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x1a1a22,
        side: THREE.DoubleSide,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.rotation.x = Math.PI / 2
      ring.position.y = 0.016
      recordGroup.add(ring)
    }

    // Center Label
    const labelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.032, 32)
    const labelMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(`hsl(${hueRef.current}, 75%, 55%)`),
      roughness: 0.4,
    })
    const label = new THREE.Mesh(labelGeo, labelMat)
    recordGroup.add(label)

    // Spindle Center
    const spindleGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 16)
    const spindleMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 1 })
    const spindle = new THREE.Mesh(spindleGeo, spindleMat)
    spindle.position.y = 0.05
    recordGroup.add(spindle)

    // 5. Tone Arm Assembly
    const armGroup = new THREE.Group()
    armGroup.position.set(1.2, 0.1, -1.0)
    deckGroup.add(armGroup)

    // Arm Base Pivot
    const armBaseGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.25, 32)
    const armBaseMat = new THREE.MeshStandardMaterial({ color: 0x33333d, metalness: 0.8 })
    const armBase = new THREE.Mesh(armBaseGeo, armBaseMat)
    armGroup.add(armBase)

    // Arm Pole
    const armPoleGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.7, 16)
    const armPoleMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.95 })
    const armPole = new THREE.Mesh(armPoleGeo, armPoleMat)
    armPole.rotation.z = Math.PI / 2
    armPole.position.set(-0.7, 0.15, 0.4)
    armGroup.add(armPole)

    // Cartridge / Needle
    const headGeo = new THREE.BoxGeometry(0.12, 0.1, 0.2)
    const headMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(`hsl(${hueRef.current}, 80%, 50%)`),
    })
    const head = new THREE.Mesh(headGeo, headMat)
    head.position.set(-1.45, 0.1, 0.75)
    armGroup.add(head)

    // 6. Reactive 3D Particle Ring
    const particleCount = 120
    const particleGeo = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2
      const radius = 1.6 + Math.sin(i * 0.5) * 0.15
      particlePositions[i * 3] = Math.cos(angle) * radius - 0.5
      particlePositions[i * 3 + 1] = Math.sin(i * 0.3) * 0.2 + 0.1
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))

    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(`hsl(${hueRef.current}, 90%, 65%)`),
      size: 0.06,
      transparent: true,
      opacity: 0.8,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    deckGroup.add(particles)

    // Mouse Parallax Interaction
    let mouseX = 0
    let mouseY = 0
    let targetRotationX = 0
    let targetRotationY = 0

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect()
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      mouseX = (clientX - rect.left) / rect.width - 0.5
      mouseY = (clientY - rect.top) / rect.height - 0.5
    }

    container.addEventListener('mousemove', handlePointerMove)
    container.addEventListener('touchmove', handlePointerMove, { passive: true })

    // 7. Animation Loop
    let reqId
    let clock = new THREE.Clock()
    let armAngle = 0

    const animate = () => {
      reqId = requestAnimationFrame(animate)
      const delta = clock.getDelta()
      const time = clock.getElapsedTime()

      // Update neon light and label color dynamically
      const activeColor = new THREE.Color(`hsl(${hueRef.current}, 85%, 60%)`)
      neonLight.color.lerp(activeColor, 0.05)
      labelMat.color.lerp(activeColor, 0.05)
      borderMat.color.lerp(activeColor, 0.05)
      headMat.color.lerp(activeColor, 0.05)
      particleMat.color.lerp(activeColor, 0.05)

      // Rotate Vinyl when playing
      if (isPlayingRef.current) {
        recordGroup.rotation.y += delta * 3.5
        particles.rotation.y -= delta * 0.8

        // Pulse particle heights
        const positions = particleGeo.attributes.position.array
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 1] = Math.sin(time * 4 + i) * 0.15 + 0.12
        }
        particleGeo.attributes.position.needsUpdate = true

        // Move tone arm onto vinyl
        armAngle = THREE.MathUtils.lerp(armAngle, 0.38, 0.05)
      } else {
        // Return tone arm off vinyl
        armAngle = THREE.MathUtils.lerp(armAngle, 0.0, 0.05)
      }
      armGroup.rotation.y = armAngle

      // Smooth mouse parallax tilt
      targetRotationY = mouseX * 0.4
      targetRotationX = mouseY * 0.3

      deckGroup.rotation.y += (targetRotationY - deckGroup.rotation.y) * 0.08
      deckGroup.rotation.x += (targetRotationX - deckGroup.rotation.x) * 0.08

      renderer.render(scene, camera)
    }

    animate()

    // Handle Resize
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(reqId)
      container.removeEventListener('mousemove', handlePointerMove)
      container.removeEventListener('touchmove', handlePointerMove)
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '240px',
        position: 'relative',
        cursor: 'grab',
        userSelect: 'none',
      }}
    />
  )
}
