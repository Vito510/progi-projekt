import "./ProfileSearch.css";
import { useState } from "react";
import Button from "../general/Button";
import List from "../general/List";
export default function ProfileSearch() {
    const [searchTerm, setSearchTerm] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    
    return (
        <div className="-profile-search">
            <List type="row" align="center" gap="small">
                <input type="text" value={searchTerm} onChange={handleInputChange} placeholder="Unesite ime profila"/>
                {searchTerm.trim() ?
                    <Button shape="noshape" link={`/profile/${searchTerm}`}>
                        <i className="fa fa-search fa-lg"></i>
                    </Button>
                    :
                    <Button shape="noshape" disabled>
                        <i className="fa fa-search fa-lg"></i>
                    </Button>
                }
            </List>
        </div>
    );
}