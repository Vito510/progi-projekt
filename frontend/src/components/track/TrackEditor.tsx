import './TrackEditor.css';
import { useEffect, useState } from 'react';
import type Track from '../../interfaces/Track.js';
import type MapSelection from '../../interfaces/MapSelection.js';
import type TerrainParameter from '../../interfaces/TerrainParameter.js';
import type TrackPoint from '../../interfaces/TrackPoint.js';
import TileUtils from "../../utility/tile_utils.js";
import List from '../general/List.js';
import Button from '../general/Button.js';
import Card from '../general/Card.js';
import Map3D from '../map/Map3D.js';
import TrackPointEditor from './TrackPointEditor.js';
// import Popup from '../general/Popup.js';
// import Placeholder from '../general/Placeholder.js';
import ButtonSaveTrack from './ButtonSaveTrack.js';
import ButtonDeleteTrack from './ButtonDeleteTrack.js';
import ButtonLikeTrack from './ButtonLikeTrack.js';
import ButtonVisibleTrack from './ButtonVisibleTrack.js';
import ButtonWhitelistTrack from './ButtonWhitelistTrack.js';
import ButtonStatistika from './ButtonStatistika.js';

export default function TrackEditor({track}: {track: Track}) {
    let [params, setParams] = useState<TerrainParameter | null>(null);
    const [canEdit, setCanEdit] = useState<boolean>(true); // dodati provjeru može li korisnik editat ovu stazu
    const [canRate, setCanRate] = useState<boolean>(true); // dodati provjeru može li korisnik ocjeniti ovu stazu
    const [pointList, setPointList] = useState<TrackPoint[]>(track.points);
    const [previewPoint, setPreviewPoint] = useState<TrackPoint | null>(null);
    const selection: MapSelection = {
        max_latitude: track.max_lat,
        min_latitude: track.min_lat,
        max_longitude: track.max_lon,
        min_longitude: track.min_lon,
    };

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
                        <List type='row' gap='small' wrap justify='space-between' align='center'>
                            {canEdit ?
                                <input 
                                    type="text" 
                                    placeholder="Unesite naziv staze" 
                                    defaultValue={track.name} 
                                    onChange={(e) => {track.name = e.target.value}}
                                />
                                :
                                <h2>{track.name}</h2>
                            }

                            {canEdit &&
                                <>
                                    {/* Spremanje staze */}
                                    <ButtonSaveTrack track={track}></ButtonSaveTrack>

                                    {/* Brisanje staze */}
                                    <ButtonDeleteTrack id={track.id} ></ButtonDeleteTrack>

                                    {/* Vidljivost staze */}
                                    <ButtonVisibleTrack track={track}></ButtonVisibleTrack>
                                    <ButtonWhitelistTrack track={track}></ButtonWhitelistTrack>
                                </>
                            }
                            
                            {canRate &&
                                <>
                                    {/* Ocjenjivanje staze */}
                                    <ButtonLikeTrack track={track}></ButtonLikeTrack>

                                    {/* Dijeljenje staze */}
                                    <Button type='secondary'>
                                        <i className='fa fa-clone'></i>
                                        <p>Podijeli</p>
                                    </Button>
                                </>
                            }
                            <ButtonStatistika track={track}></ButtonStatistika>
                        </List>
                    </header>
                    <section>
                        <Map3D params={params} points={pointList} previewPoint={previewPoint}></Map3D>
                    </section>
                    <aside>
                        {canEdit &&
                            <TrackPointEditor points={pointList} onInput={(points) => {setPointList(points); track.points = [...points];}} onPreview={(point) => {setPreviewPoint(point)}} heightmap={params.heightmap}></TrackPointEditor>
                        }
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

