import Button from "../general/Button";

export default function ButtonNewTrack() {
    return (
        <Button type="primary" link="/map">
            <i className="fa fa-plus fa-lg"></i>
            <p>Nova staza</p>
        </Button>
    );
}