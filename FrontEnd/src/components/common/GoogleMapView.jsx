import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '300px'
};

const defaultCenter = {
    lat: 24.5854,
    lng: 73.7125
};

const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    styles: [
        {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
        }
    ]
};

// Custom icon URLs
const busIconUrl = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="48" height="48">
  <circle cx="32" cy="32" r="30" fill="#22c55e" stroke="#16a34a" stroke-width="2"/>
  <text x="32" y="42" font-size="28" text-anchor="middle" fill="white">🚌</text>
</svg>
`);

const studentIconUrl = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="40" height="40">
  <circle cx="32" cy="32" r="28" fill="#3b82f6" stroke="#2563eb" stroke-width="2"/>
  <text x="32" y="42" font-size="24" text-anchor="middle" fill="white">📍</text>
</svg>
`);

const stopIconUrl = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <circle cx="12" cy="12" r="10" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
  <circle cx="12" cy="12" r="4" fill="white"/>
</svg>
`);

const GoogleMapView = ({
    busLocation,
    studentLocation,
    stops = [],
    tripStatus = 'not_started',
    busNumber = ''
}) => {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
    });

    const [map, setMap] = useState(null);
    const [animatedBusPosition, setAnimatedBusPosition] = useState(null);
    const [showBusInfo, setShowBusInfo] = useState(false);
    const animationRef = useRef(null);
    const previousBusLocation = useRef(null);

    // Smooth animation for bus movement
    useEffect(() => {
        if (!busLocation) {
            setAnimatedBusPosition(null);
            return;
        }

        const newPosition = { lat: busLocation.lat, lng: busLocation.lng };

        if (!previousBusLocation.current) {
            setAnimatedBusPosition(newPosition);
            previousBusLocation.current = newPosition;
            return;
        }

        const startPos = previousBusLocation.current;
        const endPos = newPosition;
        const duration = 1000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const interpolatedPos = {
                lat: startPos.lat + (endPos.lat - startPos.lat) * easeProgress,
                lng: startPos.lng + (endPos.lng - startPos.lng) * easeProgress
            };

            setAnimatedBusPosition(interpolatedPos);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                previousBusLocation.current = endPos;
            }
        };

        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [busLocation]);

    const onLoad = useCallback((map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    // Center map on bus or student location
    const center = useMemo(() => {
        if (animatedBusPosition) return animatedBusPosition;
        if (studentLocation) return { lat: studentLocation.lat, lng: studentLocation.lng };
        if (stops.length > 0 && stops[0].latitude) {
            return { lat: stops[0].latitude, lng: stops[0].longitude };
        }
        return defaultCenter;
    }, [animatedBusPosition, studentLocation, stops]);

    // Create polyline path from stops
    const routePath = useMemo(() => {
        return stops
            .filter(stop => stop.latitude && stop.longitude)
            .map(stop => ({ lat: stop.latitude, lng: stop.longitude }));
    }, [stops]);

    if (loadError) {
        return (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', borderRadius: '16px' }}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                    <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>⚠️</span>
                    <p style={{ color: '#dc2626', fontWeight: '500' }}>Error loading Google Maps</p>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>{loadError.message}</p>
                </div>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', borderRadius: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', border: '4px solid #3b82f6', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 12px' }}></div>
                    <p style={{ color: '#4b5563' }}>Loading map...</p>
                </div>
            </div>
        );
    }

    // Create icon objects only after Google Maps is loaded
    const createIcon = (url, size, anchor) => ({
        url,
        scaledSize: new window.google.maps.Size(size, size),
        anchor: new window.google.maps.Point(anchor, anchor)
    });

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={mapOptions}
        >
            {/* Route Polyline */}
            {routePath.length > 1 && (
                <Polyline
                    path={routePath}
                    options={{
                        strokeColor: '#3b82f6',
                        strokeOpacity: 0.8,
                        strokeWeight: 4
                    }}
                />
            )}

            {/* Stop Markers */}
            {stops.map((stop, index) => (
                stop.latitude && stop.longitude && (
                    <Marker
                        key={index}
                        position={{ lat: stop.latitude, lng: stop.longitude }}
                        icon={createIcon(stopIconUrl, 20, 10)}
                        title={stop.name}
                    />
                )
            ))}

            {/* Bus Marker (only when trip is live) */}
            {tripStatus === 'live' && animatedBusPosition && (
                <Marker
                    position={animatedBusPosition}
                    icon={createIcon(busIconUrl, 48, 24)}
                    onClick={() => setShowBusInfo(true)}
                    zIndex={1000}
                >
                    {showBusInfo && (
                        <InfoWindow onCloseClick={() => setShowBusInfo(false)}>
                            <div style={{ padding: '8px' }}>
                                <p style={{ fontWeight: 'bold', color: '#111827' }}>{busNumber || 'Bus'}</p>
                                <p style={{ fontSize: '14px', color: '#16a34a' }}>🟢 Live Tracking</p>
                            </div>
                        </InfoWindow>
                    )}
                </Marker>
            )}

            {/* Student Location Marker */}
            {studentLocation && (
                <Marker
                    position={{ lat: studentLocation.lat, lng: studentLocation.lng }}
                    icon={createIcon(studentIconUrl, 36, 18)}
                    title="Your Location"
                    zIndex={999}
                />
            )}
        </GoogleMap>
    );
};

export default GoogleMapView;
