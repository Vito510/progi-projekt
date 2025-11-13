import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import './AppHeader.css';

interface Props {
    children?: ReactNode,
}

export default function AppHeader({children}: Props) {
    return (
        <header className='-app-header'>
            <Link to={"/"}>
                <section>
                    <img src="/images/logo.png" alt="logo"/>
                    <h1>Planinarko</h1>
                </section>
            </Link>
            <section>
                {children}
            </section>
        </header>
    );
};