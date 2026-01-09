import { useState } from "react";
import { Link } from "react-router-dom";
import './ProfileSearch.css';
export default function ProfileSearch() {
    const [searchTerm, setSearchTerm] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    
    return (
        <div className="profile-search">
        <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search profiles..."
            />
             
                {searchTerm.trim() ? (
                <Link to={`/profile/${searchTerm}`}>
                <button> <i className="fa fa-search fa-lg"></i></button>
                </Link>
            ) : (
                <button disabled> <i className="fa fa-search fa-lg"></i></button>
            )}
        </div>
    );
}