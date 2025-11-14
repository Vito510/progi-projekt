import './AppFooter.css';

export default function AppFooter() {
    return (
        <footer className='-app-footer'>
            <i className="fa fa-chevron-up"></i>
            <section>
                <ul className='fa-ul'>
                    <li><h3>Članovi tima</h3></li>
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
            </section>
        </footer>
    );
}