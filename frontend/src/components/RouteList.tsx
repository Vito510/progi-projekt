import type RouteListDescriptor from "../interfaces/RouteListDescriptor";
import Route from "./Route";
import './RouteList.css';

export default function RouteList({routes}: RouteListDescriptor) {
    return (
        <ul className="route-list">
            {routes.map((route, index) => 
                <Route key={index} name={route.name} latitude={route.latitude} longitude={route.longitude} length={route.length} stars={route.stars} visibility={route.visibility}/>
            )}
        </ul>
    );
};