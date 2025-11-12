import type { ReactNode } from 'react';
import './MapLoading.css';

interface Props {
    children?: ReactNode
}

export default function MapLoading({children}: Props) {
    return (
        <div className="map-loading">
            <header>
                <i className="fa fa-spinner fa-pulse fa-lg fa-fw"></i>
                <span>Učitavanje reljefa</span>
            </header>
            <section>
                {children}
            </section>
        </div>
    );
}