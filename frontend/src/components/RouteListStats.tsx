import type RouteListDescriptor from "../interfaces/RouteListDescriptor";
import './RouteListStats.css';

export default function RouteListStats({routes}: RouteListDescriptor) {
    const sum_stars = routes.map((el) => el.stars).reduce((acc, curr) => acc + curr);
    const n_rutes = routes.length;
    const n_private = routes.map((el) => Number(el.visibility === 'Private')).reduce((acc, curr) => acc + curr);

    return (
        <ul className="route-list-stats">
            <li>
                <p><i className="fa fa-star fa-fw"></i> Zvjezdice</p> 
                <p className="value">{sum_stars}</p> 
            </li>
            <li>
                <p><i className="fa fa-map fa-fw"></i> Broj ruta</p> 
                <p className="value">{n_rutes}</p> 
            </li>
            <li>
                <p><i className="fa fa-eye-slash fa-fw"></i> Privatne rute</p>
                <p className="value">{n_private}</p> 
            </li>
        </ul>
    );
}