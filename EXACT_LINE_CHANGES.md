# 📍 Exact Code Changes - Line-by-Line Reference

## StudentPage.jsx

### ✅ Change 1: Add isTracking State
**Location**: After line 12  
**Type**: Add state variable

```javascript
// LINE 12: AFTER THIS LINE
const [showBusModal, setShowBusModal] = useState(false);

// ADD THIS LINE:
const [isTracking, setIsTracking] = useState(false);
```

---

### ✅ Change 2: Add handleStartTracking Function
**Location**: After line 42 (after handleBusSelect function)  
**Type**: Add new function

```javascript
// ADD AFTER handleBusSelect:
const handleStartTracking = (bus) => {
    setSelectedBus(bus);
    setShowBusModal(false);
    setIsTracking(true);
};
```

---

### ✅ Change 3: Update BusTracker Props
**Location**: Around line 170 (in Track tab content)  
**Type**: Modify props passed

```javascript
// BEFORE:
{activeTab === 'track' && (
    <div className="h-full">
        <BusTracker buses={buses} />
    </div>
)}

// AFTER:
{activeTab === 'track' && (
    <div className="h-full">
        <BusTracker 
          buses={buses} 
          isTracking={isTracking} 
          initialBus={selectedBus} 
          onBackToList={() => setIsTracking(false)} 
        />
    </div>
)}
```

---

### ✅ Change 4: Update Track Button
**Location**: Around line 250 (in modal)  
**Type**: Modify button text and onClick

```javascript
// BEFORE:
<button
    onClick={() => {
        setShowBusModal(false);
        setActiveTab('track');
    }}
    className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg active:bg-blue-700 transition-all touch-manipulation"
>
    Track Bus
</button>

// AFTER:
<button
    onClick={() => handleStartTracking(selectedBus)}
    className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg active:bg-blue-700 transition-all touch-manipulation"
>
    Track My Bus
</button>
```

---

## BusTracker.jsx

### ✅ Change 1: Update Component Props
**Location**: Line 4  
**Type**: Modify function parameters

```javascript
// BEFORE:
const BusTracker = ({ buses }) => {
    const [selectedBus, setSelectedBus] = useState(null);

// AFTER:
const BusTracker = ({ buses, isTracking = false, initialBus = null, onBackToList = null }) => {
    const [selectedBus, setSelectedBus] = useState(initialBus);
```

---

### ✅ Change 2: Update onBack Callback
**Location**: Around line 215 (in return statement)  
**Type**: Modify onBack prop

```javascript
// BEFORE:
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

// AFTER:
{selectedBus && (
    <BusTrackingView
        bus={selectedBus}
        busLocation={busLocation}
        studentLocation={studentLocation}
        stopArrivals={stopArrivals}
        lastUpdated={lastUpdated}
        isLoading={isLoading}
        onBack={() => {
            setSelectedBus(null);
            if (onBackToList) onBackToList();
        }}
    />
)}
```

---

## BusTrackingView.jsx

### ✅ Change 1: Fix Stop Status Logic (CRITICAL)
**Location**: Lines 92-150  
**Type**: Restructure conditional logic

```javascript
// BEFORE:
const arrivalLog = stopArrivals.find(log =>
    log.stopId === (stop.id || stop._id) || log.stopName === stop.name
);

if (busLocation && nearestStopIndex !== -1) {
    if (index < nearestStopIndex) {
        status = 'passed';
    } else if (index === nearestStopIndex) {
        if (minDistance < 0.2) {
            status = 'current';
        } else {
            status = 'upcoming';
        }
    } else {
        for (let i = nearestStopIndex; i < index; i++) {
            const from = baseStops[i];
            const to = baseStops[i + 1];
            if (from.lat && from.lng && to.lat && to.lng) {
                cumulativeDistance += calculateDistance(from.lat, from.lng, to.lat, to.lng);
            }
        }
        etaMinutes = calculateETA(cumulativeDistance);
    }
}

// Determine what time to show
let displayTime = '';
let actualArrivalTime = '';

if (arrivalLog) {
    // Bus has arrived at this stop - show actual arrival time
    const arrivalDate = new Date(arrivalLog.arrivalTime);
    actualArrivalTime = arrivalDate.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: true
    });
    displayTime = actualArrivalTime;
} else if (!busLocation) {
    // Bus is OFFLINE - show scheduled time from PDF
    displayTime = stop.scheduledTime || 'TBD';
} else if (status === 'current') {
    displayTime = 'Now';
} else if (status === 'passed') {
    displayTime = 'Reached';
} else {
    // Bus is live but hasn't reached this stop - show ETA
    if (etaMinutes > 0) {
        displayTime = `~${etaMinutes} min`;
    } else {
        displayTime = stop.scheduledTime || 'Soon';
    }
}

// AFTER:
const arrivalLog = stopArrivals.find(log =>
    log.stopId === (stop.id || stop._id) || log.stopName === stop.name
);

// Determine status based on actual GPS location
if (busLocation && nearestStopIndex !== -1) {
    if (index < nearestStopIndex) {
        status = 'passed';
    } else if (index === nearestStopIndex) {
        if (minDistance < 0.2) {
            status = 'current';
        } else {
            status = 'upcoming';
        }
    } else {
        for (let i = nearestStopIndex; i < index; i++) {
            const from = baseStops[i];
            const to = baseStops[i + 1];
            if (from.lat && from.lng && to.lat && to.lng) {
                cumulativeDistance += calculateDistance(from.lat, from.lng, to.lat, to.lng);
            }
        }
        etaMinutes = calculateETA(cumulativeDistance);
    }
}

// Determine what time to show
let displayTime = '';
let actualArrivalTime = '';

// Only show as "reached" if it's in the stopArrivals log
if (arrivalLog && arrivalLog.arrivalTime) {
    // Bus has ACTUALLY arrived at this stop - show actual arrival time
    const arrivalDate = new Date(arrivalLog.arrivalTime);
    actualArrivalTime = arrivalDate.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: true
    });
    displayTime = actualArrivalTime;
    status = 'reached'; // Only set to reached if in stopArrivals
} else if (!busLocation) {
    // Bus is OFFLINE - show scheduled time from database
    displayTime = stop.scheduledTime || 'TBD';
} else if (status === 'current') {
    displayTime = 'Now';
} else if (status === 'passed') {
    // Bus has passed this stop based on GPS but no arrival log
    displayTime = 'Passed';
} else {
    // Bus is live but hasn't reached this stop - show ETA or scheduled time
    if (etaMinutes > 0) {
        displayTime = `~${etaMinutes} min`;
    } else {
        displayTime = stop.scheduledTime || 'Soon';
    }
}
```

**Key Differences**:
1. Line 140: Added `if (arrivalLog && arrivalLog.arrivalTime)` check
2. Line 142: Now sets `status = 'reached'` only inside this block
3. Line 149: Shows "Passed" instead of "Reached" for GPS-based proximity
4. Line 151-157: Restructured else-if chain for clarity

---

### ✅ Change 2: Update Timeline Header Counter
**Location**: Line 417  
**Type**: Modify filter parameter

```javascript
// BEFORE:
<div className="timeline-header">
    Route Progress • {stops.filter(s => s.status === 'passed').length}/{stops.length} completed
</div>

// AFTER:
<div className="timeline-header">
    Route Progress • {stops.filter(s => s.status === 'reached').length}/{stops.length} completed
</div>
```

---

### ✅ Change 3: Add Reached Badge to Timeline
**Location**: Around line 430 (in stop-badges-row)  
**Type**: Add new badge

```javascript
// BEFORE:
<div className="stop-badges-row">
    {stop.isStart && <span className="stop-badge starting">Start</span>}
    {stop.status === 'current' && <span className="stop-badge boarding">Current Location</span>}
    {stop.isEnd && <span className="stop-badge destination">End</span>}
    {stop.etaMinutes > 0 && stop.status === 'upcoming' && (
        <span className="stop-eta-mins">~{stop.etaMinutes} min</span>
    )}
</div>

// AFTER:
<div className="stop-badges-row">
    {stop.isStart && <span className="stop-badge starting">Start</span>}
    {stop.status === 'current' && <span className="stop-badge boarding">Current Location</span>}
    {stop.isEnd && <span className="stop-badge destination">End</span>}
    {stop.status === 'reached' && <span className="stop-badge reached">Reached</span>}
    {stop.etaMinutes > 0 && stop.status === 'upcoming' && (
        <span className="stop-eta-mins">~{stop.etaMinutes} min</span>
    )}
</div>
```

---

### ✅ Change 4: Add Tooltip to Back Button (Loading State)
**Location**: Line 243  
**Type**: Add attribute

```javascript
// BEFORE:
<button className="back-button" onClick={onBack}>←</button>

// AFTER:
<button className="back-button" onClick={onBack} title="Go back and track another bus">←</button>
```

---

### ✅ Change 5: Add Tooltip to Back Button (Main View)
**Location**: Line 257  
**Type**: Add attribute

```javascript
// BEFORE:
<button className="back-button" onClick={onBack}>←</button>

// AFTER:
<button className="back-button" onClick={onBack} title="Go back and track another bus">←</button>
```

---

## Summary of All Changes

| File | Type | Count | Impact |
|------|------|-------|--------|
| **StudentPage.jsx** | Add state | 1 | Flow control |
| **StudentPage.jsx** | Add function | 1 | Bus tracking trigger |
| **StudentPage.jsx** | Modify props | 1 | Component integration |
| **StudentPage.jsx** | Modify button | 1 | User action change |
| **BusTracker.jsx** | Modify signature | 1 | Component props |
| **BusTracker.jsx** | Modify callback | 1 | State management |
| **BusTrackingView.jsx** | Refactor logic | 1 | Core feature fix |
| **BusTrackingView.jsx** | Modify counter | 1 | Progress accuracy |
| **BusTrackingView.jsx** | Add badge | 1 | UI clarity |
| **BusTrackingView.jsx** | Add tooltip | 2 | UX clarity |

**Total Changes**: 11 modifications across 3 files

---

## How to Apply These Changes

### Option 1: Manual Editing
1. Open each file in VS Code
2. Navigate to the specified line numbers
3. Make the changes as shown
4. Save files

### Option 2: Using Search & Replace
Most changes were already applied using the `replace_string_in_file` tool with exact context matching.

---

## Testing Each Change

### After StudentPage.jsx changes:
```javascript
// Verify: isTracking state exists
console.log(isTracking); // Should be false initially

// Verify: handleStartTracking function exists and works
handleStartTracking(selectedBus); 
// Should: setSelectedBus, setShowBusModal(false), setIsTracking(true)

// Verify: Button text changed
// Should show: "Track My Bus" not "Track Bus"
```

### After BusTracker.jsx changes:
```javascript
// Verify: Component accepts new props
<BusTracker 
  buses={buses} 
  isTracking={true}
  initialBus={someBus}
  onBackToList={callback}
/>

// Verify: selectedBus initialized from prop
// If initialBus provided, should use it; otherwise null
```

### After BusTrackingView.jsx changes:
```javascript
// Verify: Stop status logic works
// A stop in stopArrivals[] should have status = 'reached'
// A stop NOT in stopArrivals[] should have status = 'passed'

// Verify: Timeline counter uses 'reached'
// Should show: "X/Y completed" where X = reached count

// Verify: Tooltip appears
// Hover over back button should show: "Go back and track another bus"
```

---

## ✅ Verification Commands

After making changes, verify with:

```bash
# Check for syntax errors
npm run lint

# Build the project
npm run build

# Run tests if available
npm run test
```

---

**All changes documented with line numbers and context**  
**Ready for implementation and testing**
