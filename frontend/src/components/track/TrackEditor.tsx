import './TrackEditor.css';
import type Track from '../../interfaces/Track.js';
import type MapSelection from '../../interfaces/MapSelection.js';
import type TerrainParameter from '../../interfaces/TerrainParameter.js';
import * as Tile from "../../utility/tile";
import List from '../general/List.js';
import Button from '../general/Button.js';
import Card from '../general/Card.js';
import Map3D from '../map/Map3D.js';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import TrackPointEditor from './TrackPointEditor.js';
import type TrackPoint from '../../interfaces/TrackPoint.js';

interface Props {
    track: Track
}

export default function TrackEditor({track}: Props) {
    const selection: MapSelection = {
        max_latitude: track.max_lat,
        min_latitude: track.min_lat,
        max_longitude: track.max_lon,
        min_longitude: track.min_lon,
    };
    let params: TerrainParameter;
    let [element, setElement] = useState<ReactNode>(
        <div className='-track-editor-loading'>
            <Card>
                <header style={{ fontSize: "1.5rem" }}>
                    <i className="fa fa-spinner fa-pulse fa-lg fa-fw"></i>
                    <span>Učitavanje reljefa</span>
                </header>
                <section>
                    <code>{`Dohvaćanje ${Tile.getTileCount(selection)} regija/e`}</code>
                    <br></br>
                    <code>Moglo bi potrajati...</code>
                </section>
            </Card>
        </div>
    );

    function handler(points: TrackPoint[]) {
        console.log(points);
        track.points = points
    } 
    
    function setMap(params: TerrainParameter) {
        setElement(
            <div className='-track-editor'>
                <header>
                    <List type='row' gap='medium' wrap justify='center' align='center'>
                        {/* <h2>{track.name}</h2> */}
                        <input type="text" placeholder="Unesite naziv staze" value={track.name}/>
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
                    <Map3D params={params}></Map3D>
                </section>
                <aside>
                    <TrackPointEditor points={track.points} onInput={handler}></TrackPointEditor>
                </aside>
            </div>
        );
    }

    useEffect(() => {
        if (!track.override) {
            Tile.getData(selection)
                .then((params) => {
                    setMap(params);
                });
            
        } else {
            params = track.override;
            setMap(params); 
        }
    }, [track.points]);

    return (
        <div className='-track-editor-loading'>
            {element}
        </div>
    );
}

