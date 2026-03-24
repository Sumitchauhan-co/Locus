import {
    MapContainer,
    TileLayer,
    Marker,
    Tooltip,
    useMap,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../contexts/AuthContext.js';
import { SiReactivex } from 'react-icons/si';
import { BiTargetLock } from 'react-icons/bi';
import { ModalContext } from '../contexts/ModalContext.js';

const DefaultIcon = L.icon({
    iconRetinaUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
});

L.Marker.prototype.options.icon = DefaultIcon;

interface UserLocation {
    id: string;
    name: string;
    lat: number;
    lng: number;
}

function Recenter({ position }: { position: [number, number] }) {
    const map = useMap();

    useEffect(() => {
        map.setView(position);
    }, [position, map]);

    return null;
}

function CenterButton({ position }: { position: [number, number] | null }) {
    const map = useMap();

    if (!position) return null;

    return (
        <div className="leaflet-bottom leaflet-right">
            <div className="leaflet-control">
                <button
                    title="target"
                    type="button"
                    className="bg-white p-3 sm:px-2 py-3 sm:py-2 my-4 cursor-pointer rounded-[50%]"
                    onClick={() => map.flyTo(position, 16)}
                >
                    <BiTargetLock className="h-6 w-6 sm:h-5 sm:w-5 fill-black"></BiTargetLock>
                </button>
            </div>
        </div>
    );
}

export default function Map() {
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    const [position, setPosition] = useState<[number, number] | null>(null);
    const [users, setUsers] = useState<UserLocation[]>([]);

    const { openModal } = useContext(ModalContext);

    useEffect(() => {
        setTimeout(() => {
            openModal('login');
        }, 5000);

        if (!user) return;

        if (!navigator.geolocation) {
            console.log('Geolocation not supported');
            return;
        }

        const process = async () => {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude, longitude } = pos.coords;

                    console.log('Location:', latitude, longitude);

                    try {
                        await api.post('/api/location/update', {
                            lat: latitude,
                            lng: longitude,
                        });

                        setPosition([latitude, longitude]);

                        const res = await api.get('/api/location/nearby', {
                            params: {
                                lat: latitude,
                                lng: longitude,
                            },
                        });

                        console.log('Users:', res.data);

                        setUsers(res.data);
                    } catch (err) {
                        console.error('Error in flow:', err);
                    } finally {
                        setLoading(false);
                    }
                },
                (err) => {
                    console.error('Error getting location:', err);
                },
                {
                    enableHighAccuracy: true,
                },
            );
        };

        process();
    }, [user, openModal]);

    if (loading) {
        return (
            <div className="h-screen flex flex-col justify-center items-center">
                <div className="h-10 w-10 flex justify-center items-center animate-spin">
                    <SiReactivex className="h-8 w-8"></SiReactivex>
                </div>
                <span>Ensure you are already logged in!</span>
            </div>
        );
    }

    return (
        <div className="w-full h-[85vh] sm:h-[80vh] rounded-2xl overflow-hidden shadow-lg">
            <MapContainer
                center={position ?? [23.209871, 77.442187]}
                zoom={13}
                scrollWheelZoom
                className="w-full h-full"
            >
                <TileLayer
                    attribution="© OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {position && <Recenter position={position} />}

                <CenterButton position={position} />

                <MarkerClusterGroup>
                    {users.map((user) => (
                        <Marker
                            key={user.id}
                            position={[user.lat, user.lng]}
                        >
                            <Tooltip
                                permanent
                                direction="top"
                            >
                                {user.name} 📍
                            </Tooltip>
                        </Marker>
                    ))}
                </MarkerClusterGroup>
            </MapContainer>
        </div>
    );
}
