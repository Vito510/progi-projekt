import { useEffect, useRef } from "react";
import Renderer from '../../renderer/particles.js'
import './Particles.css';

export default function Particles() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Renderer | null>(null);

    useEffect(() => {
        particlesRef.current = new Renderer();
        particlesRef.current.load(canvasRef?.current);
        // return () => {
        //     particlesRef.current?.unload() // NOT WORKING
        // }
    });

    return (
        <canvas ref={canvasRef} className="-particle-canvas"></canvas>
    );
}