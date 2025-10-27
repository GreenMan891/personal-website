'use client';

import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

const INITIAL_ROTATION_SPEED = 100;
const NORMAL_ROTATION_SPEED = 1;
const DAMPING_FACTOR = 0.98;

function Model({ modelSrc }: { modelSrc: string }) {
    const { scene } = useGLTF(modelSrc);
    return <primitive object={scene} scale={1.2} position={[0, -3, 0]} />;
}

function ModelExperience({ modelSrc }: { modelSrc: string }) {
    const controlsRef = useRef<OrbitControlsImpl>(null!);
    useEffect(() => {
        if (controlsRef.current) {
            controlsRef.current.autoRotateSpeed = INITIAL_ROTATION_SPEED;
        }
    }, [modelSrc]);
    useFrame(() => {
        if (controlsRef.current) {
            if (controlsRef.current.autoRotateSpeed > NORMAL_ROTATION_SPEED) {
                controlsRef.current.autoRotateSpeed *= DAMPING_FACTOR;
            } else {
                controlsRef.current.autoRotateSpeed = NORMAL_ROTATION_SPEED;
            }
        }
    });

    return (
        <>
            <Environment preset="city" />
            <Model modelSrc={modelSrc} />
            <OrbitControls
                ref={controlsRef}
                makeDefault
                autoRotate
                autoRotateSpeed={NORMAL_ROTATION_SPEED}
                minDistance={8}
                maxDistance={20}
                minPolarAngle={Math.PI / 2}
                maxPolarAngle={Math.PI / 2}
                enableZoom={false}
            />
        </>
    );
}

export default function ModelViewer({ modelSrc }: { modelSrc?: string }) {
    return (
        <Canvas
            gl={{ alpha: true }}
            style={{ background: 'transparent' }}
            camera={{ position: [0, 0, 52], fov: 50 }}
        >
            <Suspense fallback={null}>
                {modelSrc && <ModelExperience modelSrc={modelSrc} />}
            </Suspense>
        </Canvas>
    );
}