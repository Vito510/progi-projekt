import { useState } from "react";
import './ProfileSearch.css';
import Button from "../general/Button";
export default function ProfileSearch() {
    const [searchTerm, setSearchTerm] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    
    return (
        <div className="-profile-search">
            <input type="text" value={searchTerm} onChange={handleInputChange} placeholder="Pretraži profil..."/>
            {searchTerm.trim() ?
                <Button shape="round" link={`/profile/${searchTerm}`} type="primary">
                    <i className="fa fa-search fa-lg"></i>
                </Button>
                :
                <Button shape="round" disabled>
                    <i className="fa fa-search fa-lg"></i>
                </Button>
            }
        </div>
    );
}