import { useEffect, useRef } from 'react';
import './TrackCard.css';
import List from '../general/List';
import Button from '../general/Button';
import ButtonLikeTrack from './ButtonLikeTrack.js';
import type Track from '../../interfaces/Track.js';
import ButtonCopyTrack from './ButtonCopyTrack.js';

interface Props {
    index?: number,
    track: Track,
}

export default function TrackCard({index = 0, track} : Props) {
    const ref = useRef<HTMLLIElement>(null);
    useEffect(() => {
        if (ref.current)
            ref.current.style.animationDelay = `${index * 0.1}s`;
    }, [index]);

    return (
        <li className="-track-card" ref={ref}>
            <header>
                <section>
                    <List type='column' align='start' justify='center'>
                        <h3>{track.name}</h3>
                        <em className='collapsed'>#{track.id}</em>
                    </List>
                    <List type='column' align='end' justify='center'>
                        <p>{track.owner}</p>
                        <em className='collapsed'>{track.date_created ? new Date(track.date_created).toDateString() : 'N/A'}</em>
                    </List>
                </section>
            </header>
            <footer>
                <section>
                    <span>
                        <i className="fa fa-arrows-h"></i>
                        <p className='collapsed'>Duljina</p>
                        <samp>{length}km</samp>
                    </span>
                    <span>
                        <i className="fa fa-star"></i>
                        <p className='collapsed'>Broj zvjezdica</p>
                        <samp>{track.stars}</samp>
                    </span>
                    <span>
                        <i className={"fa fa-2x " + (track.visibility === 'Public' ? 'fa-eye' : 'fa-eye-slash') + " open"}></i>
                        <i className="fa fa-eye collapsed"></i>
                        <p className='collapsed'>Vidljivost</p>
                        <samp className='collapsed'>{track.visibility === 'Public' ? 'javno' : 'privatno'}</samp>
                    </span>
                </section>
                <section>
                    <Button type='primary' link={`/track/${track.id}`}>
                        <i className='fa fa-external-link'></i>
                        Otvori
                    </Button>
                    <ButtonLikeTrack track={track}></ButtonLikeTrack>
                   <ButtonCopyTrack track={track}></ButtonCopyTrack>
                </section>
            </footer>
        </li>
    );
};