import './Footer.css';

export default function Footer() {
    return (
        <footer className='footer'>
            <i className="fa fa-chevron-up"></i>
            <div className="row centered">
                <ul className='fa-ul'>
                    <h2>Članovi tima</h2>
                    <li><i className="fa-li fa fa-chevron-right"></i> Vito Čuić</li>
                    <li><i className="fa-li fa fa-chevron-right"></i> Martin Golub</li>
                    <li><i className="fa-li fa fa-chevron-right"></i> Antonio Zulim</li>
                    <li><i className="fa-li fa fa-chevron-right"></i> Matheo Kesar</li>
                    <li><i className="fa-li fa fa-chevron-right"></i> Marko Dorčić</li>
                    <li><i className="fa-li fa fa-chevron-right"></i> Tin Karalić</li>
                    <li><i className="fa-li fa fa-chevron-right"></i> Vinko Grančić</li>
                </ul>
                <a href="https://www.fer.unizg.hr/">
                    <img src="/images/FER.png" alt="fer"/>
                </a>
            </div>
        </footer>
    );
}