import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeBackground() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    const width = mount.clientWidth
    const height = mount.clientHeight

    // Scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 80

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Particles
    const particleCount = 220
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const velocities = []

    const palette = [
      [0.31, 0.56, 0.97],   // blue
      [0.61, 0.36, 0.90],   // purple
      [0.00, 0.83, 1.00],   // cyan
      [0.00, 0.96, 0.63],   // green
    ]

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = (Math.random() - 0.5) * 140
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100

      const color = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3]     = color[0]
      colors[i * 3 + 1] = color[1]
      colors[i * 3 + 2] = color[2]

      velocities.push({
        x: (Math.random() - 0.5) * 0.04,
        y: (Math.random() - 0.5) * 0.04,
        z: (Math.random() - 0.5) * 0.02,
      })
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Floating geometric shapes
    const shapes = []
    const shapeGeometries = [
      new THREE.OctahedronGeometry(3, 0),
      new THREE.TetrahedronGeometry(2.5, 0),
      new THREE.IcosahedronGeometry(2, 0),
    ]

    for (let i = 0; i < 6; i++) {
      const geo = shapeGeometries[i % 3]
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(...palette[i % 4]),
        wireframe: true,
        transparent: true,
        opacity: 0.08,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(
        (Math.random() - 0.5) * 160,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 60 - 20
      )
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
      shapes.push({
        mesh,
        rotX: (Math.random() - 0.5) * 0.004,
        rotY: (Math.random() - 0.5) * 0.004,
        floatY: (Math.random() - 0.5) * 0.008,
        baseY: mesh.position.y,
        t: Math.random() * Math.PI * 2,
      })
      scene.add(mesh)
    }

    let animId
    let time = 0

    const animate = () => {
      animId = requestAnimationFrame(animate)
      time += 0.005

      // Animate particles
      const pos = geometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3]     += velocities[i].x
        pos[i * 3 + 1] += velocities[i].y
        pos[i * 3 + 2] += velocities[i].z

        // Boundary wrap
        if (Math.abs(pos[i * 3])     > 100) velocities[i].x *= -1
        if (Math.abs(pos[i * 3 + 1]) > 70)  velocities[i].y *= -1
        if (Math.abs(pos[i * 3 + 2]) > 50)  velocities[i].z *= -1
      }
      geometry.attributes.position.needsUpdate = true

      // Slow global particle rotation
      particles.rotation.y = time * 0.025
      particles.rotation.x = Math.sin(time * 0.015) * 0.08

      // Animate shapes
      shapes.forEach((s) => {
        s.t += 0.008
        s.mesh.rotation.x += s.rotX
        s.mesh.rotation.y += s.rotY
        s.mesh.position.y = s.baseY + Math.sin(s.t) * 5
      })

      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const handleResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      mount.removeChild(renderer.domElement)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}
