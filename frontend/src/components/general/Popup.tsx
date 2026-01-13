import type { ReactNode } from "react";
import './Popup.css';

interface Props {
    children: ReactNode
}

export default function Popup(props: Props) {
    return (
        <div className="-popup">
            {props.children}
        </div>
    );
}