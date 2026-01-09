import { useEffect, useRef } from "react";
import Renderer from '../../renderer/particles/particles.js'
import './Particles.css';

let renderer: Renderer | null = null;

export default function Particles() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        renderer = new Renderer();
        renderer.load(canvasRef.current);
        // return () => {
        //     if (renderer) {
        //         renderer.unload();
        //         renderer = null;
        //     }
        // }
    }, []);

    return (
        <canvas ref={canvasRef} className="-particle-canvas"></canvas>
    );
}