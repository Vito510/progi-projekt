import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import FrontPage from './components/pages/FrontPage';
import ProfilePage from './components/pages/ProfilePage';
import MapPage from './components/pages/MapPage';
import LoginPage from './components/pages/LoginPage';
import LoginSuccessPage from './components/pages/LoginSuccessPage';
import RegisterPage from './components/pages/RegisterPage';

import ProfilePageTEMP from './components/pages/ProfilePageTEMP';

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<FrontPage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/map" element={<MapPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/login-success" element={<LoginSuccessPage />} />
            <Route path="/register" element={<RegisterPage/>}/>

            <Route path="/profile/name" element={<ProfilePageTEMP/>}/>
        </Routes>
    </BrowserRouter>
  );
};
