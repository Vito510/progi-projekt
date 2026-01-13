import type { ReactNode } from "react";
import Particles from "./Particles";
import './AppBody.css';

interface Props {
    children: ReactNode,
    width?: "wide" | "thin",
    animated?: boolean,
    noFooter?: boolean
    centered?: boolean

}

export default function AppBody({width = "wide", animated = false, children, noFooter = false, centered = false}: Props) {
    let className = "-app-body";
    if (width == "thin") className += " thin";
    if (animated) className += " animated";
    if (noFooter) className += " nofooter";
    if (centered) className += " centered";

    return (
        <main className={className}>
            {animated && window.innerWidth > 768 && <Particles></Particles>}
            <div>{children}</div>
        </main>
    );
}