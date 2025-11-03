import './FrontPage.css';
import type RouteDescriptor from '../../interfaces/RouteDescriptor';
import RouteList from '../route/RouteList';
import Footer from '../general/Footer';
import Header from '../general/Header';
import ButtonProfile from '../profile/ButtonProfile';

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
        <>
            <Header>
                <ButtonProfile></ButtonProfile>
            </Header>
            <main className='front-page'>
                <div className="banner"></div>
                <h1>Najbolje rute</h1>
                <RouteList routes={routes}/>
            </main>
            <Footer></Footer>
        </>
    );
};