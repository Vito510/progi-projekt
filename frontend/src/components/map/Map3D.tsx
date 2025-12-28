import './Map3D.css';
import Renderer from '../../renderer/map/renderer.js';
import { useEffect, useRef, useState } from 'react';
import type TerrainParameter from '../../interfaces/TerrainParameter.js';
import Placeholder from '../general/Placeholder.js';
import Popup from '../general/Popup.js';
import Card from '../general/Card.js';
import ButtonHome from '../profile/ButtonHome.js';
import type TrackPoint from '../../interfaces/TrackPoint.js';
import Switch from '../general/Switch.js';

interface Props {
    params: TerrainParameter,
    points: TrackPoint[],
}

export default function Map3D({params, points}: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rendererRef = useRef<Renderer | null>(null);
    const animationRef = useRef<number | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [quality, setQuality] = useState<boolean>(false);

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
                rendererRef.current?.setQuality(false);
                animationRef.current = requestAnimationFrame(animate);
                rendererRef.current.setPoints(points);
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

    function quality_handler() {
        rendererRef.current?.setQuality(!quality);
        setQuality(!quality);
    }

    if (error) {
        return (
            <div className='-map3d'>
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
            <canvas ref={canvasRef}></canvas>
            <aside>
                <Switch offText='Niska kvaliteta' onText='Visoka kvalitete' onInput={quality_handler} defaultValue={quality ? "on" : "off"}></Switch>
            </aside>
        </div>
    );
}

