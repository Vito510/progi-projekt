import type { ReactNode } from "react";
import './Popup.css';

interface Props {
    children: ReactNode,
    onClick?: () => void,
}

export default function Popup({children, onClick = () => {}}: Props) {

    function click_handler(event: any) {
        if (event.currentTarget === event.target)
            onClick();
    }

    return (
        <div className="-popup" onClick={click_handler}>
            {children}
        </div>
    );
}