import { useEffect, useRef, useState } from "react";

interface MapSelectionDescriptor {
  latitude: number;
  longitude: number;
}

interface Props {
  onInput: (selection: MapSelectionDescriptor) => void;
  initialLat?: number;
  initialLng?: number;
  initialZoom?: number;
}

export default function Map2D({ onInput, initialLat = 45.97663277713765, initialLng = 15.581762194633486, initialZoom = 10 }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cssLoaded, setCssLoaded] = useState(false);

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    link.onload = () => setCssLoaded(true);
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !cssLoaded || !mapRef.current || mapInstanceRef.current) return;

    // Small delay to ensure CSS is fully applied
    const timer = setTimeout(() => {
      const L = (window as any).L;

      // Initialize map
      const map = L.map(mapRef.current).setView([initialLat, initialLng], initialZoom);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      // Add initial marker
      const marker = L.marker([initialLat, initialLng], {
        draggable: true,
      }).addTo(map);

      // Handle marker drag
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onInput({
          latitude: pos.lat,
          longitude: pos.lng,
        });
      });

      // Handle map click to move marker
      map.on("click", (e: any) => {
        marker.setLatLng(e.latlng);
        onInput({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        });
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Force map to recalculate size
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoaded, cssLoaded, initialLat, initialLng, initialZoom, onInput]);

  return (
    <div className="map-container" style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          zIndex: 1,
        }}
      />
      {(!isLoaded || !cssLoaded) && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#64748b",
            zIndex: 2,
          }}
        >
          Loading map...
        </div>
      )}
    </div>
  );
}
