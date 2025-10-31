import { Link } from 'react-router-dom';
import './Header.css';
import type { ReactNode } from 'react';

interface Props {
    children?: ReactNode,
}

export default function Header({children}: Props) {
    return (
        <header className='header'>
            <Link to={"/"}>
                <section className="row">
                    <img src="/images/logo.png" alt="logo"/>
                    <h1>Planinarko</h1>
                </section>
            </Link>
            <section className="row wide">
                {children}
            </section>
        </header>
    );
};