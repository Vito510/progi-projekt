import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import FrontPage from './pages/FrontPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<FrontPage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
        </Routes>
    </BrowserRouter>
  );
};

