import type { ReactNode } from "react";
import "./List.css";

interface Props {
    children?: ReactNode,
    type?: "row" | "column",
    align?: "start" | "end" | "center",
    justify?: "start" | "end" | "center",
    wrap?: boolean,
    gap?: "nogap" | "small" | "medium" | "large",
}

export default function List({children, type = "row", align = "start", justify = "start", wrap = false, gap = "nogap"}: Props) {
    let className = "-list";
    if (wrap) className += " wrap";
    className += " " + gap
    className += " align-" + align
    className += " " + type
    className += " justify-" + justify

    return (
        <div className={className}>
            {children}
        </div>
    );
}