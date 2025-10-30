import './ProfilePage.css';
import type RouteDescriptor from '../interfaces/RouteDescriptor';
import RouteList from '../components/RouteList';

export default function ProfilePage() {
        let route: RouteDescriptor = {
            name: "Naziv rute",
            longitude: 45.79,
            latitude: 15.96,
            length: 13,
            stars: 101,
            visibility: 'Private'
        }
        let routes: [RouteDescriptor] = [route];
        for (let i=0; i<10; i++)
            routes.push(route);

    return (
        <main>
            <aside>
                <ul>
                    <h2>Naziv profila</h2>
                    <p>email.adresa@email.com</p>
                </ul>
                <hr/>
                <ul>
                    <li>
                        <p><i className="fa fa-star fa-fw"></i> Zvjezdice</p> 
                        <p className="value">550</p> 
                    </li>
                    <li>
                        <p><i className="fa fa-map fa-fw"></i> Broj ruta</p> 
                        <p className="value">5</p> 
                    </li>
                    <li>
                        <p><i className="fa fa-eye-slash fa-fw"></i> Privatne rute</p>
                        <p className="value">2</p> 
                    </li>
                </ul>
            </aside>
            <menu>
                <h1>Korisničke rute</h1>
                <RouteList routes={routes}/>
            </menu>
        </main>
    );
};