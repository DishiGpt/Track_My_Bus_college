const Bus = require('../models/Bus.model');
const User = require('../models/User.model');

// Get all buses (for coordinators/drivers)
exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find()
      .populate('driver', 'name phone')
      .populate('route', 'name startingPoint routeDetails waypoints')
      .populate('coordinator', 'name phone');

    res.json({
      success: true,
      data: buses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching buses',
      error: error.message,
    });
  }
};

// Get buses for today (for students)
exports.getBusesForToday = async (req, res) => {
  try {
    const buses = await Bus.find({ isAvailableToday: true })
      .populate('driver', 'name phone')
      .populate('route', 'name startingPoint routeDetails waypoints');

    res.json({
      success: true,
      data: buses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching buses',
      error: error.message,
    });
  }
};

// Create bus
exports.createBus = async (req, res) => {
  try {
    const { busNumber, driverId, routeId, departureTime, capacity } = req.body;

    const bus = new Bus({
      busNumber,
      driver: driverId,
      route: routeId,
      departureTime,
      capacity,
      coordinator: req.userId,
    });

    await bus.save();
    await bus.populate('driver', 'name phone');
    await bus.populate('route', 'name startingPoint');

    res.status(201).json({
      success: true,
      message: 'Bus created successfully',
      data: bus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating bus',
      error: error.message,
    });
  }
};

// Update bus
exports.updateBus = async (req, res) => {
  try {
    const { busNumber, driverId, routeId, departureTime, isAvailableToday } =
      req.body;

    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      {
        busNumber,
        driver: driverId,
        route: routeId,
        departureTime,
        isAvailableToday,
      },
      { new: true }
    )
      .populate('driver', 'name phone')
      .populate('route', 'name startingPoint');

    res.json({
      success: true,
      message: 'Bus updated successfully',
      data: bus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating bus',
      error: error.message,
    });
  }
};

// Delete bus
exports.deleteBus = async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Bus deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting bus',
      error: error.message,
    });
  }
};

// Helper to calculate distance
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Update bus location (called by driver app)
exports.updateBusLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    // Find the bus and populate route to check waypoints
    const bus = await Bus.findOne({ driver: req.userId }).populate('route');

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'No bus assigned to this driver',
      });
    }

    // Update current location
    bus.currentLocation = {
      latitude,
      longitude,
      timestamp: new Date(),
    };

    // Check for stop arrivals
    if (bus.route && bus.route.waypoints) {
      const arrivedStops = bus.stopArrivals || [];

      bus.route.waypoints.forEach((wp) => {
        const dist = calculateDistance(
          latitude,
          longitude,
          wp.latitude,
          wp.longitude
        );

        // Within 200m and not already logged for today
        const alreadyLogged = arrivedStops.some(
          (log) =>
            log.stopId?.toString() === wp._id?.toString() &&
            new Date(log.arrivalTime).toDateString() === new Date().toDateString()
        );

        if (dist < 0.2 && !alreadyLogged) {
          arrivedStops.push({
            stopName: wp.name,
            arrivalTime: new Date(),
            stopId: wp._id,
          });
        }
      });

      bus.stopArrivals = arrivedStops;
    }

    await bus.save();

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io) {
      io.to(`bus:${bus._id}`).emit('location-update', {
        busId: bus._id,
        location: bus.currentLocation,
        stopArrivals: bus.stopArrivals, // Send arrival updates too
      });
    }

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: {
        location: bus.currentLocation,
        stopArrivals: bus.stopArrivals,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating location',
      error: error.message,
    });
  }
};

// in bus.controller.js
exports.getBusLocation = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id).select('currentLocation stopArrivals busNumber');
    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }
    res.json({
      success: true,
      data: {
        location: bus.currentLocation,
        stopArrivals: bus.stopArrivals
      }
    });
  } catch (err) {
    next(err);
  }
};
