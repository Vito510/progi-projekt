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
import * as TouchListener from '../../renderer/map/touch.js';

interface Props {
    params: TerrainParameter,
    points: TrackPoint[],
    onInput: (point: TrackPoint) => void,
}

let renderer: Renderer | null = null;

export default function Map3D({params, points, onInput}: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [quality, setQuality] = useState<boolean>(false);

    useEffect(() => {
        const canvas = canvasRef.current!;

        const animate = () => {
            if (!animationRef.current)
                return;
            renderer?.update();
            renderer?.render();
            animationRef.current = requestAnimationFrame(animate);
        }

        let remove_listener: () => void = () => {};

        Renderer.initialize(canvas, params)
            .then((ref: Renderer) => {
                renderer = ref;
                renderer?.setQuality(quality);
                renderer.setPoints(points);
                animationRef.current = requestAnimationFrame(animate);

                remove_listener = TouchListener.addDoubleTapListener(canvas, (clientX, clientY) => {
                    const rect = canvasRef.current!.getBoundingClientRect();
                    const x = (((clientX - rect.x) / rect.width) - 0.5) * 2.0;
                    const y = (((clientY - rect.y) / rect.height) - 0.5) * 2.0;
                    const coordinates: {x: number, y: number} = {x: x, y: y};
                    const point = renderer!.getPoint(coordinates);
                    if (point) 
                        onInput(point);
                });
            })
            .catch((error) => {
                setError(error);
            });

        return () => {
            cancelAnimationFrame(animationRef.current!);
            remove_listener();
            animationRef.current = null;
            renderer?.destroy();
            renderer = null;
        }
    }, []);

    useEffect(() => {
        if (renderer) {
            renderer.adjustCanvas();
            renderer.setPoints(points);
        }
    });

    function quality_handler() {
        renderer?.setQuality(!quality);
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
                        <small><em>Dupli klik za stvaranje točke</em></small>
                    </aside>
                </>
            }
        </div>
    );
}

