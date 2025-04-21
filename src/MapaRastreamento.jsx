import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
} from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDAOCcoCgJFXWwjWY9g9fzJRe413PqCQH0",
  authDomain: "rastreamento-e-dai.firebaseapp.com",
  projectId: "rastreamento-e-dai",
  storageBucket: "rastreamento-e-dai.firebasestorage.app",
  messagingSenderId: "111470485783",
  appId: "1:111470485783:web:fd70d729ac04edaf465752"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
});

export default function MapaRastreamento() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "dispositivos"), (snapshot) => {
      const dados = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDevices(dados);
    });
    return () => unsub();
  }, []);

  return (
    <div className="h-screen w-full">
      <MapContainer center={[-23.55052, -46.633308]} zoom={13} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {devices.map((device) => (
          <Marker
            key={device.id}
            position={[device.latitude, device.longitude]}
            icon={customIcon}
          >
            <Popup>
              <b>{device.nome}</b>
              <br />
              Lat: {device.latitude.toFixed(5)}
              <br />
              Lon: {device.longitude.toFixed(5)}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
