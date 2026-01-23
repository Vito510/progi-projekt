import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import FrontPage from './components/pages/FrontPage';
import ProfilePage from './components/pages/ProfilePage';
import NewMapPage from './components/pages/NewTrackPage';
import LoginPage from './components/pages/LoginPage';
import LoginSuccessPage from './components/pages/LoginSuccessPage';
import RegisterPage from './components/pages/RegisterPage';
import TrackPage from './components/pages/TrackPage';

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<FrontPage/>}/>
            <Route path="/profile/:name" element={<ProfilePage/>}/>
            <Route path="/map" element={<NewMapPage/>}/>
            <Route path="/track/:id" element={<TrackPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/login-success" element={<LoginSuccessPage />}/>
            <Route path="/register" element={<RegisterPage/>}/>
        </Routes>
    </BrowserRouter>
  );
};
