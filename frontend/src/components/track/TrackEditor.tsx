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
import ButtonSaveTrack from './ButtonSaveTrack.js';
import ButtonDeleteTrack from './ButtonDeleteTrack.js';
import ButtonLikeTrack from './ButtonLikeTrack.js';
import ButtonVisibleTrack from './ButtonVisibleTrack.js';
import ButtonWhitelistTrack from './ButtonWhitelistTrack.js';
import ButtonTrackStats from './ButtonTrackStats.js';
import Popup from '../general/Popup.js';

export default function TrackEditor({track}: {track: Track}) {
    let [params, setParams] = useState<TerrainParameter | null>(null);
    const [canEdit, setCanEdit] = useState<boolean>(true); // dodati provjeru može li korisnik editat ovu stazu (isOwner || isAdmin)
    const [canRate, setCanRate] = useState<boolean>(true); // dodati provjeru može li korisnik ocjeniti ovu stazu (!isOwner)
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [pointList, setPointList] = useState<TrackPoint[]>(track.points);
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
                        <List type='row' gap='small' wrap align='center'>
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
                            <ButtonTrackStats track={track}></ButtonTrackStats>
                            <Button onClick={() => {setIsEditing(true)}}>
                                [WIP] Edit points
                            </Button>
                        </List>
                    </header>
                    <main>
                        <Map3D params={params} points={pointList}></Map3D>

                        {isEditing &&
                            <Popup onClick={() => {setIsEditing(false)}}>
                                <Card>
                                    <header>
                                        <List expand align='center' justify='space-between'>
                                            <List type='column' gap='nogap'>
                                                <h2>Uređivanje točaka</h2>
                                                <p><em>Kliknite da biste dodali točku</em></p>
                                            </List>
                                            <Button type='tertiary' onClick={() => {setIsEditing(false)}} shape="noshape">
                                                <i className='fa fa-times-circle fa-2x'></i>
                                            </Button>
                                        </List>
                                    </header>
                                    <section>
                                        <TrackPointEditor points={pointList} onInput={(points) => {setPointList(points); track.points = [...points];}} heightmap={params.heightmap}></TrackPointEditor>
                                    </section>
                                </Card>
                            </Popup>
                        }
                    </main>
                </div>
                :
                <List expand align='center' justify='center'>
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
                </List>
            }
        </>
    );
}

