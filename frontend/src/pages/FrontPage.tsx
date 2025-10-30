import './FrontPage.css'
import RouteList from '../components/RouteList';
import type RouteDescriptor from '../interfaces/RouteDescriptor';

export default function FrontPage() {
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
            <div className="banner"></div>
            <h1>Najbolje rute</h1>
            <RouteList routes={routes}/>
        </main>
    );
};