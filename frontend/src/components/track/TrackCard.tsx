import { useEffect, useRef } from 'react';
import './TrackCard.css';
import List from '../general/List';
import Button from '../general/Button';

interface Props {
    index?: number,
    name: string,
    length: number,
    stars: number,
    visibility: string,
    id: number,
    owner: string
    date: Date
}

export default function TrackCard({index = 0, id, name, owner, date, length, stars, visibility} : Props) {
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
                        <h3>{name}</h3>
                        <em className='collapsed'>#{id}</em>
                    </List>
                    <List type='column' align='end' justify='center'>
                        <p>{owner}</p>
                        <em className='collapsed'>{date.toDateString()}</em>
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
                        <samp>{stars}</samp>
                    </span>
                    <span>
                        <i className={"fa fa-2x " + (visibility === 'Public' ? 'fa-eye' : 'fa-eye-slash') + " open"}></i>
                        <i className="fa fa-eye collapsed"></i>
                        <p className='collapsed'>Vidljivost</p>
                        <samp className='collapsed'>{visibility === 'Public' ? 'javno' : 'privatno'}</samp>
                    </span>
                </section>
                <section>
                    <Button type='primary'>
                        <i className='fa fa-external-link'></i>
                        Otvori
                    </Button>
                    <Button type='secondary'>
                        <i className='fa fa-star'></i>
                        Ocjeni
                    </Button>
                    <Button type='secondary'>
                        <i className='fa fa-clone'></i>
                        Podijeli
                    </Button>
                </section>
            </footer>
        </li>
    );
};