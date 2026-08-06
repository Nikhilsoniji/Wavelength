import { useEffect, useRef } from 'react'
import { usePlayerStore } from '../store/usePlayerStore'

// Stitch ANIMATION_12 WebGL Shader — cyan-to-purple sine wave overlay
export default function Background3D() {
  const canvasRef = useRef(null)
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const isPlayingRef = useRef(isPlaying)

  useEffect(() => { isPlayingRef.current = isPlaying }, [isPlaying])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function syncSize() {
      const w = canvas.clientWidth || window.innerWidth
      const h = canvas.clientHeight || window.innerHeight
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
    }
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(syncSize)
      ro.observe(canvas)
    }
    syncSize()

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) return

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`
    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
    vec2 uv = v_texCoord;
    float speed = 2.0;
    float wave = sin(uv.x * 10.0 + u_time * speed) * 0.08;
    float wave2 = sin(uv.x * 6.0 - u_time * speed * 0.7 + 1.5) * 0.05;
    float line = smoothstep(0.018, 0.0, abs(uv.y - 0.5 - wave));
    float line2 = smoothstep(0.012, 0.0, abs(uv.y - 0.5 - wave2)) * 0.5;
    vec3 cyan = vec3(0.0, 0.83, 1.0);
    vec3 purple = vec3(0.48, 0.36, 1.0);
    vec3 color = mix(cyan, purple, uv.x);
    float alpha = (line + line2) * 0.65;
    gl_FragColor = vec4(color * (line + line2), alpha);
}`

    function cs(type, src) {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }

    const prog = gl.createProgram()
    gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs))
    gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)

    const pos = gl.getAttribLocation(prog, 'a_position')
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uRes = gl.getUniformLocation(prog, 'u_resolution')

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)

    let animId
    function render(t) {
      if (typeof ResizeObserver === 'undefined') syncSize()
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clear(gl.COLOR_BUFFER_BIT)
      if (uTime) gl.uniform1f(uTime, t * 0.001)
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      animId = requestAnimationFrame(render)
    }
    render(0)

    return () => {
      cancelAnimationFrame(animId)
      gl.deleteProgram(prog)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.5,
        mixBlendMode: 'screen',
      }}
    />
  )
}
