import type TrackListDescriptor from '../../interfaces/TrackList';
import './TrackListStats.css';

export default function TrackListStats({tracks}: TrackListDescriptor) {
    const sum_stars = tracks.map((el) => el.stars).reduce((acc, curr) => acc + curr);
    const n_rutes = tracks.length;
    const n_private = tracks.map((el) => Number(el.visibility === 'Private')).reduce((acc, curr) => acc + curr);

    return (
        <ul className="-track-list-stats">
            <li>
                <p><i className="fa fa-map fa-fw"></i> Broj ruta</p> 
                <p className="value">{n_rutes}</p> 
            </li>
            <li>
                <p><i className="fa fa-eye-slash fa-fw"></i> Privatne rute</p>
                <p className="value">{n_private}</p> 
            </li>
            <li>
                <p><i className="fa fa-star fa-fw"></i> Zvjezdice</p> 
                <p className="value">{sum_stars}</p> 
            </li>
        </ul>
    );
}