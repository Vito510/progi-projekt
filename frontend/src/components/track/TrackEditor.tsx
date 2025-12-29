import './TrackEditor.css';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type Track from '../../interfaces/Track.js';
import type MapSelection from '../../interfaces/MapSelection.js';
import type TerrainParameter from '../../interfaces/TerrainParameter.js';
import type TrackPoint from '../../interfaces/TrackPoint.js';
import type Renderer from '../../renderer/map/renderer.js';
import TileUtils from "../../utility/tile_utils.js";
import List from '../general/List.js';
import Button from '../general/Button.js';
import Card from '../general/Card.js';
import Map3D from '../map/Map3D.js';
import TrackPointEditor from './TrackPointEditor.js';

export default function TrackEditor({track}: {track: Track}) {
    const rendererRef = useRef<Renderer | null>(null);
    const selection: MapSelection = {
        max_latitude: track.max_lat,
        min_latitude: track.min_lat,
        max_longitude: track.max_lon,
        min_longitude: track.min_lon,
    };
    let [params, setParams] = useState<TerrainParameter | null>(null);

    function point_edit_handler(points: TrackPoint[]) {
        track.points = [...points];
        if (rendererRef.current)
            rendererRef.current.setPoints(track.points);
    } 

    function renderer_init_handler(ref: Renderer) {
        rendererRef.current = ref;
    }

    useEffect(() => {
        if (!track.override) {
            TileUtils.getData(selection)
                .then((params) => {
                    setParams(params);
                });
            
        } else {
            params = track.override;
            setParams(params);
        }
    }, []);

    return (
        <>
            {params ?
                <div className='-track-editor'>
                    <header>
                        <List type='row' gap='medium' wrap justify='center' align='center'>
                            {/* <h2>{track.name}</h2> */}
                            <input type="text" placeholder="Unesite naziv staze" defaultValue={track.name}/>
                            {/* zamiijeniti sa gumbom za spremanje */}
                            <Button type='primary'>
                                <i className='fa fa-save'></i>
                                <p>Spremi</p>
                            </Button>
                            {/* zamiijeniti sa gumbom za ocjenjivanje */}
                            <Button type='secondary'>
                                <i className='fa fa-star'></i>
                                <p>Ocjeni</p>
                            </Button>
                            {/* zamiijeniti sa gumbom za dijeljenje */}
                            <Button type='secondary'>
                                <i className='fa fa-clone'></i>
                                <p>Podijeli</p>
                            </Button>
                            {/* zamiijeniti sa gumbom za brisanje */}
                            <Button type='tertiary'>
                                <i className='fa fa-trash'></i>
                                <p>Izbriši</p>
                            </Button>
                        </List>
                    </header>
                    <section>
                        <Map3D params={params} points={track.points} onInit={renderer_init_handler}></Map3D>
                    </section>
                    <aside>
                        <TrackPointEditor points={track.points} onInput={point_edit_handler}></TrackPointEditor>
                    </aside>
                </div>
                :
                <div className='-track-editor-loading'>
                    <Card>
                        <header style={{ fontSize: "1.5rem" }}>
                            <i className="fa fa-spinner fa-pulse fa-lg fa-fw"></i>
                            <span>Učitavanje reljefa</span>
                        </header>
                        <section>
                            <code>{`Dohvaćanje ${TileUtils.getTileCount(selection)} regija/e`}</code>
                            <br></br>
                            <code>Moglo bi potrajati...</code>
                        </section>
                    </Card>
                </div>
            }
        </>
    );
}

