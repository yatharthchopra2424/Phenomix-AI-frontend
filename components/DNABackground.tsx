import React, { useRef, useLayoutEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 100; // Number of base pairs
const RADIUS = 2;
const HEIGHT = 15;
const TWIST = 10; // Total rotation

export const DNAStrand = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const connectionRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const { mouse, viewport } = useThree();

  // Create dummy object for positioning instances
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const dummyConnection = useMemo(() => new THREE.Object3D(), []);

  // Colors
  const color1 = new THREE.Color('#06b6d4'); // Cyan
  const color2 = new THREE.Color('#ec4899'); // Pink

  useLayoutEffect(() => {
    if (!meshRef.current || !connectionRef.current) return;

    for (let i = 0; i < COUNT; i++) {
      const t = i / COUNT;
      const angle = t * Math.PI * TWIST;
      const y = (t - 0.5) * HEIGHT;

      // Position Strand 1
      dummy.position.set(Math.cos(angle) * RADIUS, y, Math.sin(angle) * RADIUS);
      dummy.scale.setScalar(0.2);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i * 2, dummy.matrix);
      meshRef.current.setColorAt(i * 2, color1);

      // Position Strand 2
      dummy.position.set(Math.cos(angle + Math.PI) * RADIUS, y, Math.sin(angle + Math.PI) * RADIUS);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i * 2 + 1, dummy.matrix);
      meshRef.current.setColorAt(i * 2 + 1, color2);

      // Position Connection (Hydrogen Bond)
      dummyConnection.position.set(0, y, 0);
      dummyConnection.rotation.y = -angle;
      // Scale x to match diameter, y/z for thickness
      dummyConnection.scale.set(RADIUS * 2, 0.05, 0.05); 
      dummyConnection.updateMatrix();
      connectionRef.current.setMatrixAt(i, dummyConnection.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    connectionRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy, dummyConnection, color1, color2]);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Gentle rotation
    groupRef.current.rotation.y += 0.002;

    // Slight parallax based on mouse
    const x = (mouse.x * viewport.width) / 100;
    const y = (mouse.y * viewport.height) / 100;
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, y, 0.05);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -x, 0.05);
  });

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 4]}>
      {/* Nucleotides */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT * 2]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial roughness={0.2} metalness={0.8} />
      </instancedMesh>
      
      {/* Connections */}
      <instancedMesh ref={connectionRef} args={[undefined, undefined, COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </instancedMesh>
    </group>
  );
};

export const Particles = () => {
    const count = 300;
    const mesh = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    
    // Generate random positions
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, []);

    useFrame((state) => {
        if (!mesh.current) return;
        
        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);
            
            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();
            mesh.current!.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color="#4ade80" transparent opacity={0.4} />
        </instancedMesh>
    );
};

export const SceneContent = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#4ade80" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#ec4899" />
            <DNAStrand />
            <Particles />
        </>
    )
}

export default SceneContent;