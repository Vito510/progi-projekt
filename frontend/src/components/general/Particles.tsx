import { useEffect, useRef } from "react";
import Particles from '../../utility/particles.js'
import './Particles.css';

export default function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particles | null>(null);

    useEffect(() => {
        particlesRef.current = new Particles();
        particlesRef.current.load(canvasRef?.current);
        return () => {
            particlesRef.current?.unload()
        }
    });

    return (
        <canvas ref={canvasRef} className="-particle-canvas"></canvas>
    );
}