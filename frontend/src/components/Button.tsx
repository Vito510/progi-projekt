import type { ReactNode } from "react";
import './Button.css';

interface Props {
    link?: string,
    onClick?: () => void,
    children: ReactNode,
    round?: boolean,
    square?: boolean,
}

export default function Button({children, link = '', onClick = () => {}, round = false, square = false}: Props) {
    return (
        <button type="button" onClick={onClick} className={(round ? 'round' : '') + (square ? 'square' : '')}>
            {children}
            {link && <a href={link}></a>}
        </button>
    );
};