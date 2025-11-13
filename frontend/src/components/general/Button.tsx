import type { ReactNode } from "react";
import './Button.css';
import { Link } from "react-router-dom";

interface Props {
    onClick?: () => void,
    children: ReactNode,
    round?: boolean,
    square?: boolean,
    type?: 'primary' | 'secondary' | 'tertiary'
    link?: string
}

export default function Button({children, onClick = () => {}, round = false, square = false, type = 'primary', link = ''}: Props) {
    if (link) {
        return (
            <div className="-button">
                <Link to={link}>
                    <button type="button" onClick={onClick} className={(round ? 'round' : '') + ' ' + (square ? 'square' : '') + ' ' + type}>
                        {children}
                    </button>
                </Link>
            </div>
        );
    } else {
        return (
            <div className="-button">
                <button type="button" onClick={onClick} className={(round ? 'round' : '') + ' ' + (square ? 'square' : '') + ' ' + type}>
                    {children}
                </button>
            </div>
        );
    }
};