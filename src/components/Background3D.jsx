import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { usePlayerStore } from '../store/usePlayerStore'

export default function Background3D() {
  const canvasRef = useRef(null)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const track = usePlayerStore((s) => s.currentTrack())

  const isPlayingRef = useRef(isPlaying)
  const hueRef = useRef(track?.hue ?? 280)

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  useEffect(() => {
    hueRef.current = track?.hue ?? 280
  }, [track])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

    // Particle Grid
    const count = 400
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const originalY = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80
      const y = (Math.random() - 0.5) * 60
      positions[i * 3 + 1] = y
      originalY[i] = y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      size: 1.2,
      color: new THREE.Color(`hsl(${hueRef.current}, 70%, 60%)`),
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    let reqId
    let clock = new THREE.Clock()

    const animate = () => {
      reqId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()

      // Smooth color transition
      material.color.lerp(new THREE.Color(`hsl(${hueRef.current}, 75%, 60%)`), 0.03)

      const speed = isPlayingRef.current ? 0.8 : 0.2
      points.rotation.y = time * 0.05 * speed
      points.rotation.x = Math.sin(time * 0.03) * 0.1

      const pos = geometry.attributes.position.array
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] = originalY[i] + Math.sin(time * speed * 2 + i) * 1.5
      }
      geometry.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(reqId)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
