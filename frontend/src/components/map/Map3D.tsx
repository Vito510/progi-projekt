import './Map3D.css';
import Renderer from '../../renderer/renderer.js';
import { useEffect, useRef, useState } from 'react';
import type TerrainParameter from '../../interfaces/TerrainParameter.js';
import Placeholder from '../general/Placeholder.js';
import Popup from '../general/Popup.js';
import Card from '../general/Card.js';
import ButtonHome from '../profile/ButtonHome.js';

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
            <div className='-map3d-popup'>
                <Popup>
                    <Card>
                        <header>
                            <i className="fa fa-times-circle"></i>
                            <span>Error</span>
                        </header>
                        <section>
                            <span>
                                Pokretanje 3D prikaza nije uspjelo. Pokušajte pokrenuti aplikaciju koristeći "Chromium based" browser.
                            </span>
                            <Placeholder>
                                {"" + error}
                            </Placeholder>
                            <ButtonHome></ButtonHome>
                        </section>
                    </Card>
                </Popup>
            </div>
        );
    }

    return (
        <div className='-map3d'>
            <Card>
                <canvas ref={canvasRef}></canvas>
                <hr />
                <footer>
                    <Placeholder>
                        [DEMO]
                    </Placeholder>
                    <Placeholder>
                        Kontrole: Lijevi gumb miša + Drag, Lijevi gumb miša + Scroll
                    </Placeholder>
                </footer>
            </Card>
        </div>
    );
}

