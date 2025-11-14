import type { ReactNode } from 'react';
import './MapLoading.css';
import Card from '../general/Card';

interface Props {
    children?: ReactNode
}

export default function MapLoading({children}: Props) {
    return (
        <div className="-map-loading">
            <Card>
                <header>
                    <i className="fa fa-spinner fa-pulse fa-lg fa-fw"></i>
                    <span>Učitavanje reljefa</span>
                </header>
                <code>
                    {children}
                </code>
            </Card>
        </div>
    );
}