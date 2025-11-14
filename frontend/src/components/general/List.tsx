import type { ReactNode } from "react";

interface Props {
    children?: ReactNode,
    row?: boolean,
    column?: boolean,
    centered?: boolean
}

export default function List({children, row = false, column = true, centered = false}: Props) {
    let className = "-list";
    if (column) className += " column";
    if (row) className += " row";
    if (centered) className += " centered";

    return (
        <ul className={className}>
            {children}
        </ul>
    );
}