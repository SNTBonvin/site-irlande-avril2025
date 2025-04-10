// src/components/Map.jsx
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createClient } from "@supabase/supabase-js";

// Supabase client
const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

// Fonction pour charger l’icône personnalisée
function getIcon(activity) {
  return L.icon({
    iconUrl: `/markers/${activity || "autre"}.png`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

export default function Map() {
  const mapRef = useRef(null);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    async function fetchPoints() {
      const { data, error } = await supabase
        .from("points")
        .select("*")
        .order("pubDate", { ascending: false });

      if (error) {
        console.error("❌ Erreur Supabase :", error.message);
      } else {
        setPoints(data);
      }
    }

    fetchPoints();
  }, []);

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map").setView([52.75, -8], 7); // Centré sur l’Irlande
    mapRef.current = map;

    // Fond de carte CartoDB Positron
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || points.length === 0) return;

    points.forEach((point) => {
      const marker = L.marker([point.lat, point.lng], {
        icon: getIcon(point.activity),
      }).addTo(map);

      const popupContent = `
        <strong>${point.title}</strong><br/>
        📍 ${point.place}<br/>
        📅 ${point.pubDate}
      `;

      marker.bindPopup(popupContent);
    });
  }, [points]);

  return <div id="map" style={{ height: "400px" }}></div>;
}
