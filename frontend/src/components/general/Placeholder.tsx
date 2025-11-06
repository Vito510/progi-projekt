import type { ReactNode } from "react";
import './Placeholder.css';

interface Props {
    children: ReactNode,
    wide?: boolean,
    tall?: boolean,
}

export default function Placeholder({children, wide = false, tall = false}: Props) {
    let className = "placeholder"
    if (wide) className += " wide";
    if (tall) className += " tall";

    return (
        <div className={className}>
            {children}
        </div>
    );
}