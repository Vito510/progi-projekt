import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import FrontPage from './components/pages/FrontPage';
import ProfilePage from './components/pages/ProfilePage';
import ViewPage from './components/pages/ViewPage';
import LoginPage from './components/pages/LoginPage';
export default function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<FrontPage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/view" element={<ViewPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
        </Routes>
    </BrowserRouter>
  );
};

