import {
    MapContainer,
    TileLayer,
    Marker,
    Tooltip,
    useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../contexts/AuthContext.js';
import Loading from '../components/Loading.js';
import axios from 'axios';
import { ModalContext } from '../contexts/ModalContext.js';
import { LoadingDots } from '../utils/LoadingDots.js';
import { Icons } from '../utils/icons.js';

const DefaultIcon = L.icon({
    iconRetinaUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
});

L.Marker.prototype.options.icon = DefaultIcon;

interface UserLocation {
    id: string;
    username: string;
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
                    title="current location"
                    type="button"
                    className="bg-white p-3 sm:px-2 py-3 sm:py-2 my-4 cursor-pointer rounded-[50%]"
                    onClick={() => map.flyTo(position, 16)}
                >
                    <Icons.target className="h-6 w-6 sm:h-5 sm:w-5 fill-black"></Icons.target>
                </button>
            </div>
        </div>
    );
}

export default function Map() {
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [limitReached, setLimitReached] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const { openModal } = useContext(ModalContext);

    const [position, setPosition] = useState<[number, number] | null>(null);
    const [users, setUsers] = useState<UserLocation[]>([]);

    useEffect(() => {
        if (!user) {
            openModal('login');
            return;
        }

        if (!navigator.geolocation) {
            console.log('Geolocation not supported');
            return;
        }

        const process = async () => {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude, longitude } = pos.coords;

                    // console.log('Location:', latitude, longitude);

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

                        setUsers(res.data);
                    } catch (err) {
                        if (axios.isAxiosError(err)) {
                            if (err.response?.status === 429) {
                                setLimitReached(true);
                                setErrorMsg(err.response.data.errorMessage);
                            } else {
                                console.error('Error in flow:', err);
                            }
                        }
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
    }, [user]);

    if (limitReached) {
        return (
            <div className="h-screen w-full flex flex-col justify-center items-center">
                <span className="text-red-500 text-center font-semibold text-lg">
                    {errorMsg}
                </span>
            </div>
        );
    }

    if (!loading) {
        return (
            <>
                <Loading>
                    {!user && (
                        <span className="sm:text-lg text-sm text-neutral-400/75 italic">
                            Ensure you are already logged in!
                        </span>
                    )}
                    {user && (
                        <span className="text-pink-500/75 flex gap-1 items-center">
                            <Icons.heart className="animate-wiggle" />
                            <p>Rendering the world for you</p>
                            <LoadingDots />
                        </span>
                    )}
                </Loading>
            </>
        );
    }

    return (
        <div className="flex flex-col">
            <div className="w-full grid content-center sm:p-10 p-5">
                <div className="text-3xl sm:text-4xl flex sm:flex-row flex-col gap-3 justify-center items-center text-center text-(--text-color)">
                    <h1>
                        Find{' '}
                        <span className="border-b-2 border-(--dark-pink-color)">
                            people
                        </span>{' '}
                        nearby{' '}
                    </h1>
                    <div className="flex flex-col justify-center items-center">
                        <Icons.location className="h-10 w-10 fill-(--dark-pink-color)" />
                        <span className="text-sm">5km</span>
                    </div>
                </div>
            </div>
            <div className="w-full h-[85vh] sm:h-[80vh] rounded-2xl overflow-hidden shadow-lg">
                <MapContainer
                    center={position ?? [23.209871, 77.442187]}
                    zoom={13}
                    scrollWheelZoom
                    className="w-full h-full brightness-90"
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
                                    {user.username}
                                </Tooltip>
                            </Marker>
                        ))}
                    </MarkerClusterGroup>
                </MapContainer>
            </div>
        </div>
    );
}
