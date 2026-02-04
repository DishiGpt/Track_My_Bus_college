import React, { useState, useEffect, useRef } from 'react';
import BusTrackingView from './BusTrackingView';
import { io } from 'socket.io-client';

const BusTracker = ({ buses }) => {
    const [selectedBus, setSelectedBus] = useState(null);
    const [busLocation, setBusLocation] = useState(null);
    const [studentLocation, setStudentLocation] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [stopArrivals, setStopArrivals] = useState([]);
    const socketRef = useRef(null);
    const selectedBusRef = useRef(null);

    // Keep ref in sync for socket event handlers
    useEffect(() => {
        selectedBusRef.current = selectedBus;
    }, [selectedBus]);

    useEffect(() => {
        // Initialize socket once on mount
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const socketUrl = apiUrl.split('/api')[0];

        console.log('🔌 Connecting to socket server at:', socketUrl);

        const socket = io(socketUrl, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 2000,
            withCredentials: false
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('✅ Socket connected:', socket.id);
            if (selectedBusRef.current) {
                console.log('🔄 Re-joining bus room:', selectedBusRef.current._id);
                socket.emit('join-bus', selectedBusRef.current._id.toString());
            }
        });

        socket.on('location-update', (data) => {
            console.log('📍 Location update received for bus:', data.busId);
            const currentBusId = selectedBusRef.current?._id?.toString();
            const incomingBusId = data.busId?.toString();

            if (currentBusId && incomingBusId === currentBusId) {
                console.log('✅ Match! Updating location for:', currentBusId);
                if (data.location?.latitude) {
                    setBusLocation({
                        lat: parseFloat(data.location.latitude),
                        lng: parseFloat(data.location.longitude),
                    });
                }
                if (data.stopArrivals) {
                    setStopArrivals(data.stopArrivals);
                }
                setLastUpdated(new Date());
            } else {
                console.log('⏭️ Ignoring update for mismatch:', { current: currentBusId, incoming: incomingBusId });
            }
        });

        socket.on('connect_error', (err) => {
            console.error('❌ Socket Connection Error:', err.message);
        });

        socket.on('disconnect', (reason) => {
            console.log('🔌 Socket disconnected:', reason);
        });

        return () => {
            console.log('🧹 Cleaning up socket connection');
            socket.disconnect();
        };
    }, []); // Only on mount

    useEffect(() => {
        if (!navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setStudentLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => console.error('Error tracking student location:', error),
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    useEffect(() => {
        if (!selectedBus) {
            setBusLocation(null);
            setStopArrivals([]);
            return;
        }

        // Emit join event whenever bus selection changes
        if (socketRef.current && socketRef.current.connected) {
            console.log('📢 Joining room for bus:', selectedBus.busNumber, selectedBus._id);
            socketRef.current.emit('join-bus', selectedBus._id.toString());
        }

        const fetchLocation = async () => {
            try {
                const token = localStorage.getItem('token');
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

                const response = await fetch(`${apiUrl}/bus/${selectedBus._id}/location`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.data) {
                        console.log('📂 Fetched initial state:', data.data);
                        if (data.data.location?.latitude) {
                            setBusLocation({
                                lat: parseFloat(data.data.location.latitude),
                                lng: parseFloat(data.data.location.longitude),
                            });
                        }
                        if (data.data.stopArrivals) {
                            setStopArrivals(data.data.stopArrivals);
                        }
                        setLastUpdated(new Date());
                    }
                }
            } catch (error) {
                console.error('Error fetching initial bus location:', error);
            }
        };

        setIsLoading(true);
        fetchLocation().finally(() => setIsLoading(false));
    }, [selectedBus]);

    if (buses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-5xl mb-4">🗺️</span>
                <p className="text-gray-600 font-medium">No buses to track</p>
                <p className="text-gray-400 text-sm mt-1">Buses will appear here when available</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {!selectedBus && (
                <div className="p-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Select a Bus to Track</h2>
                    <div className="space-y-3">
                        {buses.map((bus) => (
                            <div
                                key={bus._id}
                                onClick={() => setSelectedBus(bus)}
                                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:bg-gray-50 transition-all touch-manipulation cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <span className="text-2xl">🚌</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{bus.busNumber}</h3>
                                            <p className="text-sm text-gray-500">{bus.route?.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {bus.currentLocation ? (
                                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                Live
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-medium">
                                                Offline
                                            </span>
                                        )}
                                        <span className="text-gray-400">→</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedBus && (
                <BusTrackingView
                    bus={selectedBus}
                    busLocation={busLocation}
                    studentLocation={studentLocation}
                    stopArrivals={stopArrivals}
                    lastUpdated={lastUpdated}
                    isLoading={isLoading}
                    onBack={() => setSelectedBus(null)}
                />
            )}
        </div>
    );
};

export default BusTracker;
