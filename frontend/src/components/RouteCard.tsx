import { useEffect, useRef } from 'react';
import './RouteCard.css';

interface Props {
    index?: number,
    name: string,
    longitude: number,
    latitude: number,
    length: number,
    stars: number,
    visibility: string,
}

export default function RouteCard({index = 0, name, longitude, latitude, length, stars, visibility} : Props) {
    const ref = useRef<HTMLLIElement>(null);
    useEffect(() => {
        if (ref.current)
            ref.current.style.animationDelay = `${index * 0.1}s`;
    }, [index]);

    return (
        <li className="route-card" ref={ref}>
            <h2>{name}</h2>
            <div className="column">
                <i className="fa fa-map-marker"></i>
                <p>{latitude} {longitude}</p>
            </div>
            <div className="column">
                <i className="fa fa-arrows-h"></i>
                <p>{length}km</p>
            </div>
            <div className="column">
                <i className="fa fa-star"></i>
                <p>{stars}</p>
            </div>
            <div>
                {
                    visibility === 'Public'
                    ?
                    <i className="fa fa-eye fa-2x"></i>
                    :
                    <i className="fa fa-eye-slash fa-2x"></i>
                }
            </div>
        </li>
    );
};