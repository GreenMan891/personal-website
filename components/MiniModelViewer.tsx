'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function MiniModel({ modelSrc }: { modelSrc: string }) {
    const { scene } = useGLTF(modelSrc);
    return <primitive object={scene} scale={0.35} position={[0, -0.25, 0]} />;
}

export default function MiniModelViewer({ modelSrc }: { modelSrc?: string }) {
    if (!modelSrc) return null;

    return (
        <Canvas
            gl={{ alpha: true }}
            style={{ background: 'transparent' }}
            camera={{ position: [0, 0, 5], fov: 30 }}
        >
            <Suspense fallback={null}>
                <ambientLight intensity={1.2} />
                <directionalLight position={[-10, 0, 5]} intensity={1} />

                <MiniModel modelSrc={modelSrc} />

                <OrbitControls
                    autoRotate
                    autoRotateSpeed={1.5}
                    enableZoom={false}
                    minPolarAngle={Math.PI / 2}
                    maxPolarAngle={Math.PI / 2}
                    enablePan={false}
                />
            </Suspense>
        </Canvas>
    );
}