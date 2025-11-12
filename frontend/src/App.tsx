import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import FrontPage from './components/pages/FrontPage';
import ProfilePage from './components/pages/ProfilePage';
import MapPage from './components/pages/MapPage';
import LoginPage from './components/pages/LoginPage';
import LoginSuccessPage from './components/pages/LoginSuccessPage';

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<FrontPage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/map" element={<MapPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/login-success" element={<LoginSuccessPage />} />
        </Routes>
    </BrowserRouter>
  );
};
