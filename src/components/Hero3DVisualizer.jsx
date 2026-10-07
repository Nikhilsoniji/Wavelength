import { useEffect, useRef, memo } from 'react'
import * as THREE from 'three'

/**
 * Hero3DVisualizer
 * High-performance, WebGL-powered 3D spatial wave & particle visualizer for Wavelength.
 * Reacts to playback state, track hue, and cursor motion.
 */
function Hero3DVisualizer({ isPlaying = false, hue = 280 }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.set(0, 8, 22)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    container.appendChild(renderer.domElement)

    // Helper to get Three.js Color from HSL hue
    const getTrackColor = (h, lightness = 0.6) => {
      const color = new THREE.Color()
      color.setHSL((h % 360) / 360, 0.85, lightness)
      return color
    }

    // 1. Dynamic Wave Mesh (Spatial Soundwave Grid)
    const gridCols = 48
    const gridRows = 32
    const planeGeo = new THREE.PlaneGeometry(36, 24, gridCols, gridRows)
    planeGeo.rotateX(-Math.PI / 2.3)

    // Create custom point particle system from plane vertices
    const posAttr = planeGeo.attributes.position
    const count = posAttr.count
    const originalY = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      originalY[i] = posAttr.getY(i)
    }

    // Generate soft circular particle texture dynamically
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)')
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.15)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)
    const particleTex = new THREE.CanvasTexture(canvas)

    const mainColor = getTrackColor(hue, 0.65)
    const pointsMat = new THREE.PointsMaterial({
      size: 0.45,
      map: particleTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: mainColor,
      opacity: 0.85,
    })

    const points = new THREE.Points(planeGeo, pointsMat)
    points.position.set(0, -2.5, 0)
    scene.add(points)

    // Wireframe wave grid lines
    const wireMat = new THREE.MeshBasicMaterial({
      color: getTrackColor(hue, 0.45),
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    })
    const wireMesh = new THREE.Mesh(planeGeo, wireMat)
    wireMesh.position.copy(points.position)
    scene.add(wireMesh)

    // 2. Floating Ambient Orbiting Star Dust
    const starsCount = 140
    const starGeo = new THREE.BufferGeometry()
    const starPos = new Float32Array(starsCount * 3)
    for (let i = 0; i < starsCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 45
      starPos[i + 1] = (Math.random() - 0.5) * 20
      starPos[i + 2] = (Math.random() - 0.5) * 35
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({
      size: 0.28,
      map: particleTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      color: new THREE.Color(0xffffff),
      opacity: 0.5,
    })
    const starField = new THREE.Points(starGeo, starMat)
    scene.add(starField)

    // Mouse Parallax & Interaction
    let mouseX = 0
    let mouseY = 0
    let targetMouseX = 0
    let targetMouseY = 0

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }

    container.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Animation Loop
    let animId
    let clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)

      const time = clock.getElapsedTime()
      const speed = isPlaying ? 2.2 : 0.6
      const amp = isPlaying ? 1.4 : 0.45

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05
      camera.position.x = mouseX * 4
      camera.position.y = 8 + -mouseY * 2.5
      camera.lookAt(0, 0, 0)

      // Oscillate wave vertices
      const pos = planeGeo.attributes.position
      for (let i = 0; i < count; i++) {
        const u = (i % (gridCols + 1)) / gridCols
        const v = Math.floor(i / (gridCols + 1)) / gridRows

        // Complex harmonic wave calculation
        const wave1 = Math.sin(u * 12 + time * speed) * Math.cos(v * 8 + time * speed * 0.7)
        const wave2 = Math.sin(Math.sqrt((u - 0.5) ** 2 + (v - 0.5) ** 2) * 16 - time * speed * 1.5)
        const wave3 = Math.cos(u * 6 - time * speed * 0.5) * 0.5

        const height = (wave1 * 0.6 + wave2 * 0.4 + wave3) * amp
        pos.setY(i, originalY[i] + height)
      }
      pos.needsUpdate = true

      // Slow drift for stars
      starField.rotation.y = time * 0.02

      renderer.render(scene, camera)
    }

    animate()

    // Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width === 0 || height === 0) return
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }
    })
    resizeObserver.observe(container)

    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener('mousemove', handleMouseMove)
      resizeObserver.disconnect()
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      planeGeo.dispose()
      pointsMat.dispose()
      wireMat.dispose()
      starGeo.dispose()
      starMat.dispose()
      particleTex.dispose()
    }
  }, [hue, isPlaying])

  return (
    <div
      ref={mountRef}
      className="hero-3d-canvas-wrap"
      aria-hidden="true"
    />
  )
}

export default memo(Hero3DVisualizer)
