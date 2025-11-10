import { Link } from "react-router-dom";
import Button from "../general/Button";

export default function ButtonNewTrack() {
    return (
        <Link to={"/map"}>
            <Button>
                <i className="fa fa-plus fa-lg"></i>
                <p>Nova staza</p>
            </Button>
        </Link>
    );
}