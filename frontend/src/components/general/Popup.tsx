import type { ReactNode } from "react";
import './Popup.css';

interface Props {
    children: ReactNode
}

export default function Popup(props: Props) {
    return (
        <div className="-popup">
            {props.children}
            {/* <div className="popup-card">
                <header>
                    <i className="fa fa-times-circle"></i>
                    <span>Error</span>
                </header>
                <section>
                    {props.children}
                </section>
            </div> */}
        </div>
    );
}