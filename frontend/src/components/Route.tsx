import type RouteDescriptor from '../interfaces/RouteDescriptor';
import './Route.css';

export default function Route({name, longitude, latitude, length, stars, visibility} : RouteDescriptor) {
    return (
        <li className="route">
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