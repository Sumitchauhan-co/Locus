import { useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { AuthContext } from '../contexts/AuthContext';

const sendLocation = async (lat: number, lng: number) => {
    try {
        await api.post('/api/location/update', {
            lat,
            lng,
        });
    } catch (err) {
        console.error('Failed to send location', err);
    }
};

export default function useLocation() {
    const { user } = useContext(AuthContext);

    const [position, setPosition] = useState<[number, number] | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            console.log('Geolocation not supported');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;

                console.log('Location:', latitude, longitude);
                
                setPosition([latitude, longitude]);

                sendLocation(latitude, longitude);
            },
            (err) => {
                console.error('Error getting location:', err);
            },
            {
                enableHighAccuracy: true,
            },
        );
    }, [user]);
    return position
}
