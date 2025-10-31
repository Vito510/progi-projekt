import './ProfilePage.css';
import type RouteDescriptor from '../interfaces/RouteDescriptor';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RouteList from '../components/RouteList';
import ButtonSignOut from '../components/ButtonSignOut';
import RouteListStats from '../components/RouteListStats';
import ProfileInfo from '../components/ProfileInfo';

export default function ProfilePage() {
        let route: RouteDescriptor = {
            name: "Naziv rute",
            longitude: 45.79,
            latitude: 15.96,
            length: 13,
            stars: 101,
            visibility: 'Private'
        }
        let routes: RouteDescriptor[] = [];
        for (let i=0; i<10; i++)
            routes.push(route);

    return (
        <>
            <Header>
                <ButtonSignOut></ButtonSignOut>
            </Header>
            <main className='profile-page'>
                <aside>
                    <ProfileInfo></ProfileInfo>
                    <hr/>
                    <RouteListStats routes={routes}></RouteListStats>
                </aside>
                <menu>
                    <h1>Korisničke rute</h1>
                    <RouteList routes={routes}/>
                </menu>
            </main>
            <Footer/>
        </>
    );
}