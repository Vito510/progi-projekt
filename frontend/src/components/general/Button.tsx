import type { ReactNode } from "react";
import './Button.css';
import { Link } from "react-router-dom";

interface Props {
    onClick?: () => void,
    children: ReactNode,
    type?: 'primary' | 'secondary'
    shape?: 'rectangular' |'square' | 'round'
    link?: string
}

export default function Button({children, onClick = () => {}, shape = 'rectangular', type = 'secondary', link = ''}: Props) {
    let className = type + ' ' + shape;

    if (link) {
        return (
            <div className="-button">
                <Link to={link}>
                    <button type="button" onClick={onClick} className={className}>
                        {children}
                    </button>
                </Link>
            </div>
        );
    } else {
        return (
            <div className="-button">
                <button type="button" onClick={onClick} className={className}>
                    {children}
                </button>
            </div>
        );
    }
};