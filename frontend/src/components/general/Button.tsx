import type { ReactNode } from "react";
import './Button.css';

interface Props {
    onClick?: () => void,
    children: ReactNode,
    round?: boolean,
    square?: boolean,
}

export default function Button({children, onClick = () => {}, round = false, square = false}: Props) {
    return (
        <button type="button" onClick={onClick} className={(round ? 'round' : '') + (square ? 'square' : '')}>
            {children}
        </button>
    );
};