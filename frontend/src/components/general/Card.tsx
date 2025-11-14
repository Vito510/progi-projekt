import type { ReactNode } from "react";
import './Card.css';

interface Props {
    children: ReactNode
}

export default function Card({children}: Props) {
    return (
        <div className="-card">
            {children}
        </div>
    );
}