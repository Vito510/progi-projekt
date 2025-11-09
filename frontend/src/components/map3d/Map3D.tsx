import './Map3D.css';
import Renderer from '../../scripts/renderer/renderer.js';
import { useEffect, useRef } from 'react';
import Placeholder from '../general/Placeholder.js';
import type TerrainParameter from '../../interfaces/TerrainParameter.js';

interface Props {
    params: TerrainParameter
}

export default function Map3D({params}: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rendererRef = useRef<Renderer | null>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;

        const animate = () => {
            if (!animationRef.current)
                return;
            rendererRef.current?.update();
            rendererRef.current?.render();
            animationRef.current = requestAnimationFrame(animate);
        }

        Renderer.initialize(canvas, params)
            .then((value: Renderer) => {
                rendererRef.current = value;
                animationRef.current = requestAnimationFrame(animate);
            })

        return () => {
            cancelAnimationFrame(animationRef.current!);
            animationRef.current = null;
            rendererRef.current?.destroy();
        }
    }, []);

    return (
        <div className='map3d card'>
            <canvas ref={canvasRef}></canvas>
            <menu>
                <Placeholder wide>Nedovršeno</Placeholder>
            </menu>
        </div>
    );
}