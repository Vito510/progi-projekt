import type RouteListDescriptor from "../../interfaces/RouteListDescriptor";
import RouteCard from "./RouteCard";
import "./RouteList.css";

export default function RouteList({ routes }: RouteListDescriptor) {
  return (
    <ul className="route-list">
      {routes.map((route, index) => (
        <RouteCard
          key={index}
          index={index}
          name={route.name}
          latitude={route.latitude}
          longitude={route.longitude}
          length={route.length}
          stars={route.stars}
          visibility={route.visibility}
        />
      ))}
    </ul>
  );
}
