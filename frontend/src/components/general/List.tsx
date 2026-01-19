import type { ReactNode } from "react";
import "./List.css";

interface Props {
    children?: ReactNode,
    type?: "row" | "column",
    align?: "start" | "end" | "center",
    justify?: "start" | "end" | "center" | "space-between" | "space-around",
    wrap?: boolean,
    gap?: "nogap" | "small" | "medium" | "large",
    expand?: boolean
}

export default function List({children, type = "row", align = "start", justify = "start", wrap = false, gap = "nogap", expand = false}: Props) {
    let className = "-list";
    if (wrap) className += " wrap";
    if (expand) className += " expand";
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