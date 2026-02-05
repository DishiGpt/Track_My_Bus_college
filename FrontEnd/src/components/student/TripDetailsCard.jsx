import React, { useMemo } from 'react';

const TripDetailsCard = ({ bus, onClose }) => {
    if (!bus) return null;

    // Get first and last stops
    const waypoints = bus.route?.waypoints || [];
    const firstStop = waypoints.length > 0 ? waypoints[0] : null;
    const lastStop = waypoints.length > 0 ? waypoints[waypoints.length - 1] : null;

    // Parse time strings (e.g., "8:00 AM" -> minutes from midnight)
    const parseTime = (timeStr) => {
        if (!timeStr) return 0;
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        return hours * 60 + minutes;
    };

    // Calculate journey duration in minutes
    const calculateDuration = useMemo(() => {
        if (!firstStop?.scheduledTime || !lastStop?.scheduledTime) return 0;
        
        const startMinutes = parseTime(firstStop.scheduledTime);
        const endMinutes = parseTime(lastStop.scheduledTime);
        
        let duration = endMinutes - startMinutes;
        if (duration < 0) duration += 24 * 60; // Handle overnight trips
        
        return duration;
    }, [firstStop, lastStop]);

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        if (hours === 0) return `${mins} min`;
        if (mins === 0) return `${hours}h`;
        return `${hours}h ${mins}m`;
    };

    return (
        <div className="trip-details-overlay" onClick={onClose}>
            <div className="trip-details-card" onClick={(e) => e.stopPropagation()}>
                {/* Handle Bar */}
                <div className="trip-handle-bar"></div>

                {/* Header with close button */}

                <div className="trip-header">
                    <h2>Trip Details</h2>
                    <span className="trip-info-value">Bus {mapBusNumber(bus.busNumber)}</span>
                    <button className="trip-close-btn" onClick={onClose}>×</button>
                </div>

                {/* Main Trip Card - Red Bus Style */}
                <div className="trip-main-card">
                    {/* Departure Section */}
                    <div className="trip-location-section departure-section">
                        <div className="trip-location-marker">•</div>
                        <div className="trip-location-info">
                            <p className="trip-location-label">Departure</p>
                            <p className="trip-location-name">{firstStop?.name || 'Starting Point'}</p>
                            <p className="trip-location-time">{firstStop?.scheduledTime || 'TBD'}</p>
                        </div>
                    </div>

                    {/* Duration Bar */}
                    <div className="trip-duration-bar">
                        <div className="trip-duration-info">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span>{formatDuration(calculateDuration)}</span>
                        </div>
                    </div>

                    {/* Arrival Section */}
                    <div className="trip-location-section arrival-section">
                        <div className="trip-location-marker">•</div>
                        <div className="trip-location-info">
                            <p className="trip-location-label">Arrival</p>
                            <p className="trip-location-name">{lastStop?.name || 'Destination'}</p>
                            <p className="trip-location-time">{lastStop?.scheduledTime || 'TBD'}</p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="trip-status">
                        {bus.currentLocation ? (
                            <span className="trip-status-badge live">🟢 Live Tracking</span>
                        ) : (
                            <span className="trip-status-badge offline">⚪ Offline</span>
                        )}
                    </div>
                </div>

                {/* Bus Info Section */}
                <div className="trip-bus-info-section">
                    <h3>Bus Details</h3>
                    <div className="trip-bus-info-row">
                        <span className="trip-info-label">Bus Number</span>
                        <span className="trip-info-value">{bus.busNumber}</span>
                    </div>
                    <div className="trip-bus-info-row">
                        <span className="trip-info-label">Driver</span>
                        <span className="trip-info-value">{bus.driver?.name || 'Not Assigned'}</span>
                    </div>
                    <div className="trip-bus-info-row">
                        <span className="trip-info-label">Contact</span>
                        <span className="trip-info-value">
                            <a href={`tel:${bus.driver?.phone}`}>{bus.driver?.phone || 'N/A'}</a>
                        </span>
                    </div>
                    <div className="trip-bus-info-row">
                        <span className="trip-info-label">Capacity</span>
                        <span className="trip-info-value">{bus.capacity} seats</span>
                    </div>
                </div>

                {/* Stops Count */}
                <div className="trip-stops-info">
                    📍 {waypoints.length} stops on this route
                </div>

                {/* Track Now Button */}
                <button className="trip-track-btn" onClick={onClose}>
                    Start Tracking
                </button>
            </div>

            <style jsx>{`
                .trip-details-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 50;
                    display: flex;
                    align-items: flex-end;
                    animation: fadeIn 0.3s ease-out;
                }

                @keyframes fadeIn {
                    from {
                        background: rgba(0, 0, 0, 0);
                    }
                    to {
                        background: rgba(0, 0, 0, 0.5);
                    }
                }

                .trip-details-card {
                    width: 100%;
                    max-width: 600px;
                    background: #ffffff;
                    border-radius: 24px 24px 0 0;
                    padding: 20px 20px 40px;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: slideUp 0.3s ease-out;
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }

                .trip-handle-bar {
                    width: 48px;
                    height: 4px;
                    background: #e5e7eb;
                    border-radius: 2px;
                    margin: 0 auto 16px;
                }

                .trip-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .trip-header h2 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 700;
                    color: #1f2937;
                }

                .trip-close-btn {
                    background: none;
                    border: none;
                    font-size: 28px;
                    color: #9ca3af;
                    cursor: pointer;
                    padding: 0;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .trip-main-card {
                    background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
                    border-radius: 16px;
                    padding: 24px;
                    color: white;
                    margin-bottom: 24px;
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                }

                .trip-location-section {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 20px;
                    position: relative;
                }

                .trip-location-section:last-of-type {
                    margin-bottom: 0;
                }

                .trip-location-marker {
                    font-size: 28px;
                    color: white;
                    font-weight: 300;
                    flex-shrink: 0;
                }

                .trip-location-info {
                    flex: 1;
                }

                .trip-location-label {
                    margin: 0;
                    font-size: 12px;
                    opacity: 0.9;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .trip-location-name {
                    margin: 4px 0 2px;
                    font-size: 16px;
                    font-weight: 600;
                }

                .trip-location-time {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 700;
                }

                .departure-section::after {
                    content: '';
                    position: absolute;
                    left: 13px;
                    top: 40px;
                    bottom: -20px;
                    width: 2px;
                    background: rgba(255, 255, 255, 0.3);
                }

                .trip-duration-bar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    padding: 0 0 0 16px;
                }

                .trip-duration-info {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    opacity: 0.95;
                    font-weight: 500;
                }

                .trip-duration-info svg {
                    opacity: 0.8;
                }

                .trip-status {
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px solid rgba(255, 255, 255, 0.2);
                    display: flex;
                    justify-content: center;
                }

                .trip-status-badge {
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }

                .trip-status-badge.live {
                    background: rgba(255, 255, 255, 0.25);
                    color: white;
                }

                .trip-status-badge.offline {
                    background: rgba(255, 255, 255, 0.15);
                    color: rgba(255, 255, 255, 0.9);
                }

                .trip-bus-info-section {
                    background: #f9fafb;
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 16px;
                }

                .trip-bus-info-section h3 {
                    margin: 0 0 16px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #1f2937;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .trip-bus-info-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid #e5e7eb;
                }

                .trip-bus-info-row:last-child {
                    border-bottom: none;
                }

                .trip-info-label {
                    font-size: 13px;
                    color: #6b7280;
                    font-weight: 500;
                }

                .trip-info-value {
                    font-size: 14px;
                    color: #1f2937;
                    font-weight: 600;
                }

                .trip-info-value a {
                    color: #2563eb;
                    text-decoration: none;
                }

                .trip-info-value a:hover {
                    text-decoration: underline;
                }

                .trip-stops-info {
                    font-size: 13px;
                    color: #6b7280;
                    margin-bottom: 16px;
                    padding: 12px;
                    background: #f3f4f6;
                    border-radius: 8px;
                    text-align: center;
                }

                .trip-track-btn {
                    width: 100%;
                    padding: 16px;
                    background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                }

                .trip-track-btn:active {
                    transform: scale(0.98);
                    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
                }

                @media (max-width: 640px) {
                    .trip-details-card {
                        max-width: 100%;
                        padding: 16px 16px 32px;
                    }

                    .trip-main-card {
                        padding: 20px;
                    }

                    .trip-location-name {
                        font-size: 15px;
                    }

                    .trip-location-time {
                        font-size: 16px;
                    }
                }
            `}</style>
        </div>
    );
};


// Helper to map old bus numbers to new ones
function mapBusNumber(busNumber) {
    if (!busNumber) return busNumber;
    const str = String(busNumber);
    if (str === '10') return '11';
    if (str === '9') return '13';
    if (str === '4') return '10';
    if (str === '6') return '12';
    return str;
}

export default TripDetailsCard;
