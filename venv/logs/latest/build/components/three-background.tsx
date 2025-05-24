"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrthographicCamera } from "@react-three/drei"
import * as THREE from "three"

// Grid cell component
function GridCell({ position, size, mousePos, index, totalCells }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Calculate distance from mouse for hover effect
  useFrame(() => {
    if (!meshRef.current) return

    const distX = Math.abs(position[0] - mousePos.x)
    const distY = Math.abs(position[1] - mousePos.y)
    const dist = Math.sqrt(distX * distX + distY * distY)

    // Scale based on mouse proximity
    const maxDist = 5
    const scale = 1 - Math.min(dist / maxDist, 0.4) * 0.5

    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, scale, 0.1)
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, scale, 0.1)

    // Rotate slightly based on mouse position
    const rotationFactor = 0.05
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      (mousePos.x - position[0]) * rotationFactor,
      0.1,
    )
  })

  return (
    <mesh
      ref={meshRef}
      position={[position[0], position[1], 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[size * 0.9, size * 0.9]} />
      <meshStandardMaterial color={hovered ? "#ffffff" : "#f0f0f0"} wireframe={true} transparent={true} opacity={0.3} />
    </mesh>
  )
}

// Light following mouse
function MouseLight({ mousePos }) {
  const light = useRef()

  useFrame(() => {
    if (light.current) {
      light.current.position.x = mousePos.x
      light.current.position.y = mousePos.y
      light.current.position.z = 5
    }
  })

  return <pointLight ref={light} color="#ffffff" intensity={2} distance={10} decay={2} />
}

// Scene setup
function Scene() {
  const { viewport, size } = useThree()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [grid, setGrid] = useState([])

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (event) => {
      // Convert mouse position to Three.js coordinate system
      const x = (event.clientX / size.width) * 2 - 1
      const y = -(event.clientY / size.height) * 2 + 1

      setMousePos({
        x: (x * viewport.width) / 2,
        y: (y * viewport.height) / 2,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [viewport, size])

  // Create grid
  useEffect(() => {
    const newGrid = []
    const cellSize = 2
    const cols = Math.ceil(viewport.width / cellSize) + 2
    const rows = Math.ceil(viewport.height / cellSize) + 2

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = (i - cols / 2) * cellSize
        const y = (j - rows / 2) * cellSize

        newGrid.push({
          position: [x, y, 0],
          size: cellSize,
          id: `${i}-${j}`,
        })
      }
    }

    setGrid(newGrid)
  }, [viewport])

  return (
    <>
      <ambientLight intensity={0.2} />
      <MouseLight mousePos={mousePos} />

      {grid.map((cell, index) => (
        <GridCell
          key={cell.id}
          position={cell.position}
          size={cell.size}
          mousePos={mousePos}
          index={index}
          totalCells={grid.length}
        />
      ))}
    </>
  )
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-background to-background/80">
      <Canvas className="!fixed inset-0" dpr={[1, 2]}>
        <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={50} />
        <Scene />
      </Canvas>
    </div>
  )
}
