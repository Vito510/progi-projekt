import './Map3D.css';
import { useEffect, useRef, useState } from 'react';
import type TerrainParameter from '../../interfaces/TerrainParameter.js';
import type TrackPoint from '../../interfaces/TrackPoint.js';
import Renderer from '../../renderer/map/renderer.js';
import Placeholder from '../general/Placeholder.js';
import Popup from '../general/Popup.js';
import Card from '../general/Card.js';
import ButtonHome from '../profile/ButtonHome.js';
import Switch from '../general/Switch.js';
import List from '../general/List.js';

interface Props {
    params: TerrainParameter,
    points: TrackPoint[],
    onInit: (ref: Renderer) => void,
    onInput: (point: TrackPoint) => void,
}

export default function Map3D({params, points, onInit, onInput}: Props) {
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
            .then((ref: Renderer) => {
                rendererRef.current = ref;
                onInit(ref);
                rendererRef.current?.setQuality(quality);
                animationRef.current = requestAnimationFrame(animate);
                rendererRef.current.setPoints(points);

                canvasRef.current!.addEventListener("click", (event) => {
                    const rect = canvasRef.current!.getBoundingClientRect();
                    const x = (((event.clientX - rect.x) / rect.width) - 0.5) * 2.0;
                    const y = (((event.clientY - rect.y) / rect.height) - 0.5) * 2.0;
                    const coordinates: {x: number, y: number} = {x: x, y: y};
                    const point = rendererRef.current!.getPoint(coordinates);
                    // console.log("\n");
                    // console.log(point);
                    if (point)
                        onInput(point);
                });
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

    return (
        <div className='-map3d'>
            {error ? 
                <Popup>
                    <Card>
                        <header>
                            <List type='row' gap='small' align='center'>
                                <i className="fa fa-times-circle"></i>
                                <span>Error</span>
                            </List>
                        </header>
                        <List type='column' gap='small'>
                            <p>Pokretanje 3D prikaza nije uspjelo. Pokušajte pokrenuti aplikaciju koristeći "Chromium based" browser.</p>
                            <Placeholder>
                                {"" + error}
                            </Placeholder>
                            <ButtonHome></ButtonHome>
                        </List>
                    </Card>
                </Popup>
                :
                <>
                    <canvas ref={canvasRef}></canvas>
                    <aside>
                        <Switch onInput={quality_handler} defaultValue={quality ? "on" : "off"} offText='Niska kvaliteta' onText='Visoka kvaliteta'></Switch>
                    </aside>
                </>
            }
        </div>
    );
}

