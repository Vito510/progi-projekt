import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
// import FrontPage from './pages/FrontPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <>
      <Header></Header>
      {/* <FrontPage/> */}
      <ProfilePage></ProfilePage>
      <Footer></Footer>
    </>
  );
};

