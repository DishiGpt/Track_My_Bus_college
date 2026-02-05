# Track My Bus - System Architecture & Flow

## 📱 User Role Architecture

```
                          TRACK MY BUS SYSTEM
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                 ADMIN      COORDINATOR        DRIVER         STUDENT
                    │             │             │                │
        ┌──────────────────┐      │             │        ┌──────────────┐
        │ • Analytics      │      │             │        │ • View Buses │
        │ • All Data       │   [Raj Singh]   [GPS ON]    │ • Track Bus  │
        │ • Manage All     │   English/Hindi  │ │        │ • See ETA    │
        │ • Full Control   │   • Add/Remove   │ └────────→ • Call Driver│
        └──────────────────┘   • Set Routes    │        └──────────────┘
                                └─────────────┘
```

---

## 🎯 Student Feature Flow (NEW IMPLEMENTATION)

### Previous Flow (❌ Not Desired):
```
┌─────────────────────────────────────────────────────┐
│ Step 1: Bus List Page                              │
│ - See available buses                              │
│ - Click "View Details"                             │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│ Step 2: Modal Opens with Bus Details               │
│ - Driver info                                      │
│ - Route info                                       │
│ - Click "Track Bus"                                │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│ Step 3: Switches to "Track" Tab                    │
│ - Shows bus selection list again                   │
│ - Need to click bus again                          │
│ - ❌ Extra steps, confusing UX                     │
└──────────────────────────────────────────────────────┘
```

### New Flow (✅ Implemented):
```
┌──────────────────────────────────────┐
│ Step 1: Bus List Page                │
│ - See available buses                │
│ - Click on Bus Card                  │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│ Step 2: Modal Popup (Bottom Sheet)    │
│ - Bus #  Route  Driver                │
│ - Contact  Capacity  Status           │
│ - [Track My Bus] [Close]              │
└──────────────┬───────────────────────┘
               │
        (Click "Track My Bus")
               │
┌──────────────▼───────────────────────┐
│ Step 3: MAP OPENS DIRECTLY ✅         │
│ - Live GPS position                  │
│ - Route with stops                   │
│ - Timeline below                     │
│ - [← Back] to switch buses           │
└──────────────────────────────────────┘
```

---

## 🗺️ Bus Tracking View - Components

```
┌─────────────────────────────────────────────────────────┐
│                    TRACKING HEADER                      │
│ [←] Bus #  Route Name          [🟢 LIVE] / [⚪ OFFLINE] │
└─────────────────────────────────────────────────────────┘
│
│ ┌──────────────────────────────────────────────────────┐
│ │                   GOOGLE MAPS                        │
│ │                                                      │
│ │    🚌 (Bus)          Route Polyline                  │
│ │                  ┌────────────────┐                  │
│ │                 ◉ (Stop)                             │
│ │             📍 (Student)          ● (Reached Stop)   │
│ │                                                      │
│ │ [Distance Badge]: "2.3 km away from you"             │
│ └──────────────────────────────────────────────────────┘
│
│ ┌──────────────────────────────────────────────────────┐
│ │          NEXT STOP / ETA CARD                        │
│ │  Next: Paras Circle    |  [📱 Call Driver]          │
│ │  Passed: Kishan Pol    |                            │
│ │                        |  [On Time] Badge           │
│ └──────────────────────────────────────────────────────┘
│
│ ┌──────────────────────────────────────────────────────┐
│ │        BUS INFO CARD (Driver Details)                │
│ │  Bus 6 | Bheru Lal Ji                               │
│ │        | 8696932793                   [☎️ CALL]      │
│ └──────────────────────────────────────────────────────┘
│
│ ┌──────────────────────────────────────────────────────┐
│ │      TIMELINE STOPS - Route Progress 8/25           │
│ │                                                      │
│ │  • Tekri                     ✓ 8:00 AM [Start]      │
│ │  • Udaipole                  ✓ 8:02 AM [Reached]    │
│ │  • Amrit Namkeen             ✓ 8:05 AM [Reached]    │
│ │  ○ RMV                         ~6 min              │
│ │  ○ Kala Ji Gora Ji             ~8 min              │
│ │  ○ Paras Circle                ~11 min             │
│ │  ...                                               │
│ │  ○ College                      ~28 min [End]       │
│ └──────────────────────────────────────────────────────┘
```

---

## ⏰ Stop Time Logic (Core Feature)

```
                    BUS STATE DETECTION
                            │
                ┌───────────┼───────────┐
                │           │           │
          BUS IS LIVE   BUS IS OFF    STOP REACHED
          (GPS Active)   (GPS Off)    (In stopArrivals)
                │           │           │
        ┌───────┴────┐      │           │
        │            │      │           │
    Coming Next  At Stop   │           │
        │            │      │           │
   ┌────┴─────┐  │      │           │
   │          │  │      │           │
FUTURE STOP CURRENT   └───┴─────────┴─┐
                                      │
    TIME DISPLAY LOGIC:         ┌─────▼─────┐
                                │           │
    ┌─────────────────────┐   SHOW ACTUAL  │
    │ SHOW ETA            │   ARRIVAL TIME │
    │ e.g., "~8 min"      │   e.g., "8:15"│
    │                     │   Status:      │
    │ (Distance based)    │   ✓ REACHED    │
    └─────────────────────┘   └─────────────┘

    IF BUS OFFLINE:
    SHOW SCHEDULED TIME (from database)
    e.g., "8:15 AM"
```

---

## 📊 Stop Status State Machine

```
                    START
                      │
        ┌─────────────┴─────────────┐
        │                           │
    Bus ONLINE                  Bus OFFLINE
    (GPS Active)                (No GPS)
        │                           │
        │                    Show Scheduled Time
        │                    Status: UPCOMING
        │
        └──────────────┬────────────────┐
                       │                │
              Stop in stopArrivals[]?   NO
                       │ YES            │
                       │                │
              Status: REACHED      Check GPS
              Show Actual Time      Proximity
                       │                │
                       │        ┌───────┴───────┐
                       │        │               │
                       │     < 0.2km        > 0.2km
                       │        │               │
                       │    Status:         Calculate
                       │    CURRENT         Distance
                       │    Show "Now"          │
                       │        │        Calculate ETA
                       │        │        Show "~N min"
                       │        │               │
                       └────────┴───────┬───────┘
                                       │
                            Show Time Based on Status
```

---

## 🔄 Real-Time Data Flow

```
┌──────────────────┐
│    DRIVER APP    │
│                  │
│ [GPS ON] Button  │
└────────┬─────────┘
         │
    [Emit location update]
         │
         ├─ Bus GPS: {lat, lng}
         ├─ Current time
         └─ Stop arrivals: [
              { stopName, arrivalTime }
            ]
         │
         ▼
┌──────────────────────┐        ┌──────────────────┐
│   WEBSOCKET SERVER   │◄────►│   MONGODB         │
│   Socket.io          │        │                  │
│                      │        │ Stores:          │
│ Broadcasts to room:  │        │ - Bus location   │
│ 'location-update'    │        │ - stopArrivals   │
└────────┬─────────────┘        └──────────────────┘
         │
    [Sends to students]
         │
         ▼
┌──────────────────────────┐
│   STUDENT APP            │
│                          │
│ Receives location-update │
│ Updates Map in Real-time │
│ Recalculates:            │
│ • ETA to next stop       │
│ • Distance to bus        │
│ • Stop status (reached?) │
│ • Time display           │
└──────────────────────────┘
```

---

## 📈 Stop Times in Database

```
Route Collection (MongoDB)
│
├─ name: "Bus 6 Route (Tekri)"
├─ startingPoint: "Tekri"
├─ coordinator: ObjectId
│
└─ waypoints: [
    {
      name: "Tekri",
      scheduledTime: "8:00 AM",    ◄─── USED FOR DISPLAY
      latitude: 24.5700,
      longitude: 73.6800,
      order: 1
    },
    {
      name: "Udaipole",
      scheduledTime: "8:02 AM",    ◄─── SHOWN WHEN OFFLINE
      latitude: 24.5750,
      longitude: 73.6820,
      order: 2
    },
    ...25 stops total...
    {
      name: "College",
      scheduledTime: "8:50 AM",
      latitude: 24.6000,
      longitude: 73.7100,
      order: 25
    }
  ]
```

---

## 🎨 UI State Examples

### Example 1: Bus Offline (No GPS)
```
┌─────────────────────────────────────┐
│ Bus 6 Route (Tekri)      ⚪ OFFLINE  │
└─────────────────────────────────────┘

STOPS TIMELINE:
• Tekri                    8:00 AM [Start]
• Udaipole                 8:02 AM
• Amrit Namkeen           8:05 AM
○ RMV                     8:10 AM
○ Kala Ji Gora Ji         8:12 AM
  (Showing scheduled times, no ETA)
```

### Example 2: Bus Live (GPS Active)
```
┌─────────────────────────────────────┐
│ Bus 6 Route (Tekri)      🟢 LIVE     │
└─────────────────────────────────────┘

STOPS TIMELINE:
✓ Tekri                    8:00 AM [Start] [Reached]
✓ Udaipole                 8:02 AM        [Reached]
✓ Amrit Namkeen           8:04 AM        [Reached]
● RMV                     Now            [Current Location]
○ Kala Ji Gora Ji         ~2 min
○ Rang Niwas              ~4 min
○ Kishan Pol              ~6 min
  (Showing actual times + ETA based on GPS)
```

---

## 🔗 Component Dependencies

```
StudentPage.jsx
├── Manages: buses, selectedBus, activeTab, isTracking
├── Actions: fetchBuses, handleBusSelect, handleStartTracking
│
├─ BusTracker.jsx (isTracking prop)
│  ├── Manages: selectedBus (from initialBus prop)
│  ├── WebSocket: Listens to location-update events
│  ├── Student Location: Geolocation tracking
│  │
│  └─ BusTrackingView.jsx
│     ├── Props: bus, busLocation, studentLocation, stopArrivals
│     ├── Logic: Stop status determination
│     ├── Logic: Time display calculation
│     │
│     ├─ Google Map Component
│     │  ├── Markers: Bus, Student, Stops
│     │  └── Polylines: Routes
│     │
│     └─ Timeline Section
│        └── Displays stops with statuses
```

---

## 📋 Key Data Structures

### Bus Object
```javascript
{
  _id: ObjectId,
  busNumber: "6",
  capacity: 45,
  departureTime: "7:45 AM",
  route: {
    _id: ObjectId,
    name: "Bus 6 Route (Tekri)",
    waypoints: [/* 25 stops */],
    startingPoint: "Tekri"
  },
  driver: {
    _id: ObjectId,
    name: "Bheru Lal Ji",
    phone: "8696932793"
  },
  currentLocation: {
    latitude: 24.5750,
    longitude: 73.6820
  }
}
```

### Location Update Event
```javascript
{
  busId: ObjectId,
  location: {
    latitude: 24.5750,
    longitude: 73.6820
  },
  stopArrivals: [
    {
      stopId: ObjectId,
      stopName: "Tekri",
      arrivalTime: "2024-02-05T08:00:00Z"
    },
    {
      stopId: ObjectId,
      stopName: "Udaipole",
      arrivalTime: "2024-02-05T08:02:00Z"
    }
  ],
  timestamp: "2024-02-05T08:04:30Z"
}
```

---

## ✅ Implementation Checklist

- [x] Modal shows bus details correctly
- [x] "Track My Bus" button opens map directly
- [x] Stop times from database display correctly
- [x] Show scheduled time when offline
- [x] Show ETA when live
- [x] Show actual time when reached
- [x] Only "reached" stops marked if in stopArrivals
- [x] Back button returns to bus list
- [x] Can switch buses seamlessly
- [x] Real-time updates via WebSocket
- [x] Distance indicator works
- [x] Driver contact available

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite |
| **Maps** | Google Maps API |
| **Real-time** | Socket.io |
| **Backend** | Node.js + Express |
| **Database** | MongoDB |
| **Styling** | Tailwind CSS + Custom CSS |
| **Geolocation** | Browser Geolocation API |

---

## 🚀 Performance Considerations

1. **WebSocket Optimization**
   - Only students of a specific bus join that bus's room
   - Prevents unnecessary broadcasts

2. **Distance Calculation**
   - Haversine formula (accurate for 6,371 km Earth radius)
   - Calculated only when needed

3. **ETA Calculation**
   - Average city speed: 25 km/h
   - Recalculated on each location update

4. **Map Updates**
   - Auto-fit bounds based on bus + student + stops
   - Max zoom: 17 (prevents too-close zoom)

---

## 📞 Support

For questions about:
- **Student tracking**: See StudentPage.jsx
- **Stop times logic**: See BusTrackingView.jsx lines 92-150
- **Real-time updates**: See BusTracker.jsx WebSocket section
- **Database schema**: See seed.js
