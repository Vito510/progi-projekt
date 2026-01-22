import './TrackViewer.css';
import { useEffect, useState } from 'react';
import type Track from '../../interfaces/Track.js';
import type MapSelection from '../../interfaces/MapSelection.js';
import type TerrainParameter from '../../interfaces/TerrainParameter.js';
import type TrackPoint from '../../interfaces/TrackPoint.js';
import TileUtils from "../../utility/tile_utils.js";
import List from '../general/List.js';
import Button from '../general/Button.js';
import Card from '../general/Card.js';
import MapRenderer from '../map/MapRenderer.js';
import TrackEditor from './TrackEditor.js';
import ButtonSaveTrack from './ButtonSaveTrack.js';
import ButtonDeleteTrack from './ButtonDeleteTrack.js';
import ButtonLikeTrack from './ButtonLikeTrack.js';
import ButtonVisibleTrack from './ButtonVisibleTrack.js';
import ButtonWhitelistTrack from './ButtonWhitelistTrack.js';
import ButtonTrackStats from './ButtonTrackStats.js';
import Popup from '../general/Popup.js';
import ButtonCopyTrack from './ButtonCopyTrack.js';

export default function TrackViewer({track}: {track: Track}) {
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
                <div className='-track-viewer'>
                    <header>
                        <List type='column' gap='small'>
                            <List type='row' align='center' gap='small' wrap>
                                {canEdit ?
                                    <input 
                                        id='track_name'
                                        type="text" 
                                        placeholder="Unesite naziv staze" 
                                        defaultValue={track.name} 
                                        onChange={(e) => {track.name = e.target.value}}
                                    />
                                    :
                                    <h2>{track.name}</h2>
                                }
                                <List type='row' align='center' gap='small'>
                                    {canRate &&
                                        <>
                                            {/* Ocjenjivanje staze */}
                                            <ButtonLikeTrack track={track}></ButtonLikeTrack>

                                            {/* Dijeljenje staze */}
                                           <ButtonCopyTrack track={track}></ButtonCopyTrack>
                                        </>
                                    }
                                    <ButtonTrackStats track={track}></ButtonTrackStats>
                                </List>
                            </List>

                            <hr style={{width : "100%", borderColor : "var(--highlight)"}}/>

                            {canEdit &&
                                <List type='row' align='center' gap='small' wrap>
                                    {/* Spremanje staze */}
                                    <ButtonSaveTrack track={track}></ButtonSaveTrack>

                                    {/* Brisanje staze */}
                                    <ButtonDeleteTrack id={track.id} ></ButtonDeleteTrack>

                                    {/* Uređivanje točaka */}
                                    <Button onClick={() => {setIsEditing(true)}}>
                                        <i className='fa fa-cogs'></i>
                                        <p>Staza</p>
                                    </Button>

                                    {/* Vidljivost staze */}
                                    <ButtonVisibleTrack track={track}></ButtonVisibleTrack>
                                    <ButtonWhitelistTrack track={track}></ButtonWhitelistTrack>
                                </List>
                            }
                        </List>
                    </header>
                    <main>
                        <MapRenderer params={params} points={pointList}></MapRenderer>

                        {isEditing &&
                            <Popup onClick={() => {setIsEditing(false)}}>
                                <Card>
                                    <header>
                                        <List type='column' gap='small'>
                                            <List expand align='center' justify='space-between'>
                                                <h2>Uređivanje točaka</h2>
                                                <Button type='tertiary' onClick={() => {setIsEditing(false)}} shape="noshape">
                                                    <i className='fa fa-times-circle fa-2x'></i>
                                                </Button>
                                            </List>
                                            <p><em>Kliknite da biste dodali točku</em></p>
                                        </List>
                                    </header>
                                    <section>
                                        <TrackEditor points={pointList} onInput={(points) => {setPointList(points); track.points = [...points];}} heightmap={params.heightmap}></TrackEditor>
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

