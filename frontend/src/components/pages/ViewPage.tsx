// import { useEffect } from "react";
import Footer from "../general/Footer";
import Header from "../general/Header";
import ButtonSignOut from "../profile/ButtonProfile";
import "./ViewPage.css"

export default function ViewPage() {
    // useEffect(() => {
    //     const script = document.createElement("script");
    //     script.src = "/public/scripts/mapper/engine.js";
    //     script.defer = true;
    //     script.type = "module";
    //     document.body.appendChild(script);
    // }, [])

    return (
        <>
            <Header>
                <ButtonSignOut></ButtonSignOut>
            </Header>
            <main className="view-page">
                <canvas id="canvas"></canvas>
                <menu></menu>
            </main>
            <Footer/>
        </>
    );
}