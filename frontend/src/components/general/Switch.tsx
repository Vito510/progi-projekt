import "./Switch.css";
import { useState } from "react";

interface Props {
    onText?: string,
    offText?: string,
    defaultValue?: "on" | "off",
    onInput: (value: boolean) => void,
}

export default function Switch({onText = "on", offText = "off", defaultValue = "off", onInput}: Props) {
    const [state, setState] = useState<boolean>((defaultValue == "on") ? true : false);

    const handler = () => {
        setState(!state);
        onInput(!state);
    }

    return (
        <div className="-switch">
            <p>{offText}</p>
            <div className={state ? "on" : ""} onClick={handler}>
                <div></div>
            </div>
            <p>{onText}</p>
        </div>
    );
}