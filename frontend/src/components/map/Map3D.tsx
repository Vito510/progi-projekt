import './Map3D.css';
import Renderer from '../../scripts/renderer/renderer.js';
import { useEffect, useRef, useState } from 'react';
import type TerrainParameter from '../../interfaces/TerrainParameter.js';
import Placeholder from '../general/Placeholder.js';
import Popup from '../general/Popup.js';
import { Link } from 'react-router-dom';
import Button from '../general/Button.js';

interface Props {
    params: TerrainParameter
}

export default function Map3D({params}: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rendererRef = useRef<Renderer | null>(null);
    const animationRef = useRef<number | null>(null);
    const [error, setError] = useState<Error | null>(null);

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
            .catch((error) => {
                setError(error);
            });

        return () => {
            cancelAnimationFrame(animationRef.current!);
            animationRef.current = null;
            rendererRef.current?.destroy();
        }
    }, []);

    if (error) {
        return (
            <Popup>
                Pokretanje 3D prikaza nije uspjelo. Pokušajte pokrenuti aplikaciju koristeći Chromium based browser.
                <Link to={"/"}>
                    <Button>
                    <p>Glavna stranica</p>
                    <i className="fa fa-home fa-lg"></i>
                    </Button>
                </Link>
            </Popup>
        );
    }

    return (
        <div className='map3d'>
            <canvas ref={canvasRef}></canvas>
            <menu>
                <Placeholder>
                    [DEMO]
                </Placeholder>
                <Placeholder>
                    Kontrole: LMB + Drag, LMB + Scroll
                </Placeholder>
            </menu>
        </div>
    );
}

