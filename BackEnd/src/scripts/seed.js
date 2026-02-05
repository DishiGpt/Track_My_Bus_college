// src/scripts/seed.js
// Run: node src/scripts/seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const Route = require('../models/Route.model');
const Bus = require('../models/Bus.model');
const Broadcast = require('../models/Broadcast.model');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Route.deleteMany({});
        await Bus.deleteMany({});
        await Broadcast.deleteMany({});
        console.log('✓ Cleared ALL existing data');

        // ============ USERS ============

        // 1. Admin & Coordinators
        const admin = await User.create({
            name: 'Super Admin',
            phone: '8529657145',
            role: 'admin',
            isVerified: true,
            profileComplete: true,
        });

        const coordinator1 = await User.create({
            name: 'Raj Singh',
            phone: '7665166735',
            role: 'coordinator',
            isVerified: true,
            profileComplete: true,
        });

        console.log('✓ Created Admin and Coordinator');

        // 2. Real Drivers (From PDF)

        const driverBus12 = await User.create({
            name: 'Bheru Lal Ji',
            phone: '8696932793',
            role: 'driver',
            isVerified: true,
            profileComplete: true,
        });

        const driverBus13 = await User.create({
            name: 'Mushtaq Ji',
            phone: '8696932791',
            role: 'driver',
            isVerified: true,
            profileComplete: true,
        });

        const driverBus11 = await User.create({
            name: 'Bhanwar Singh Ji',
            phone: '8285314292',
            role: 'driver',
            isVerified: true,
            profileComplete: true,
        });

        const driverBus10 = await User.create({
            name: 'Narayan Singh',
            phone: '8107799177',
            role: 'driver',
            isVerified: true,
            profileComplete: true,
        });
        console.log('✓ Created 4 Real Drivers from PDF');

        // 3. Students
        const students = await User.insertMany([
            { name: 'Arjun Mehta', phone: '9529657145', role: 'student', isVerified: true, profileComplete: true },
            { name: 'Sneha Gupta', phone: '9784357845', role: 'student', isVerified: true, profileComplete: true },
            { name: 'Devika Sajeev', phone: '9784357844', role: 'student', isVerified: true, profileComplete: true },
        ]);

        // ============ ROUTES WITH REAL SCHEDULE DATA ============

        // Route for Bus 12 (Driver: Bheru Lal Ji)
        const routeBus12 = await Route.create({
            name: 'Bus 12 Route (Tekri)',
            startingPoint: 'Tekri',
            routeDetails: 'Tekri → Udaipole → Paras Circle → Saveena → College',
            waypoints: [
                { name: 'Tekri', scheduledTime: '8:00 AM', latitude: 24.5700, longitude: 73.6800, order: 1 },
                { name: 'Udaipole', scheduledTime: '8:02 AM', latitude: 24.5750, longitude: 73.6820, order: 2 },
                { name: 'Amrit Namkeen', scheduledTime: '8:05 AM', latitude: 24.5760, longitude: 73.6830, order: 3 },
                { name: 'RMV', scheduledTime: '8:10 AM', latitude: 24.5770, longitude: 73.6840, order: 4 },
                { name: 'Kala Ji Gora Ji', scheduledTime: '8:12 AM', latitude: 24.5780, longitude: 73.6850, order: 5 },
                { name: 'Rang Niwas', scheduledTime: '8:14 AM', latitude: 24.5790, longitude: 73.6860, order: 6 },
                { name: 'Kishan Pol', scheduledTime: '8:16 AM', latitude: 24.5800, longitude: 73.6870, order: 7 },
                { name: 'Patel Circle', scheduledTime: '8:18 AM', latitude: 24.5810, longitude: 73.6880, order: 8 },
                { name: 'Paras Circle', scheduledTime: '8:20 AM', latitude: 24.5820, longitude: 73.6890, order: 9 },
                { name: 'Indian Oil Dipo', scheduledTime: '8:22 AM', latitude: 24.5830, longitude: 73.6900, order: 10 },
                { name: 'Allahabad Bank', scheduledTime: '8:24 AM', latitude: 24.5840, longitude: 73.6910, order: 11 },
                { name: 'Goverdhan Villas', scheduledTime: '8:26 AM', latitude: 24.5850, longitude: 73.6920, order: 12 },
                { name: 'Sec 14 Chungi Naka', scheduledTime: '8:28 AM', latitude: 24.5860, longitude: 73.6930, order: 13 },
                { name: 'Rajasthan Hospital', scheduledTime: '8:29 AM', latitude: 24.5870, longitude: 73.6940, order: 14 },
                { name: 'Jain Marble', scheduledTime: '8:30 AM', latitude: 24.5880, longitude: 73.6950, order: 15 },
                { name: 'CA Circle', scheduledTime: '8:31 AM', latitude: 24.5890, longitude: 73.6960, order: 16 },
                { name: 'Rangeela Hanuman', scheduledTime: '8:32 AM', latitude: 24.5900, longitude: 73.6970, order: 17 },
                { name: 'Kheda Circle', scheduledTime: '8:33 AM', latitude: 24.5910, longitude: 73.6980, order: 18 },
                { name: 'Saveena Choraha', scheduledTime: '8:34 AM', latitude: 24.5920, longitude: 73.6990, order: 19 },
                { name: 'Sec 9', scheduledTime: '8:36 AM', latitude: 24.5930, longitude: 73.7000, order: 20 },
                { name: 'Roop Furniture', scheduledTime: '8:37 AM', latitude: 24.5940, longitude: 73.7010, order: 21 },
                { name: 'Saveena Thana', scheduledTime: '8:38 AM', latitude: 24.5950, longitude: 73.7020, order: 22 },
                { name: 'Titradi', scheduledTime: '8:40 AM', latitude: 24.5960, longitude: 73.7030, order: 23 },
                { name: 'Dakan Kotda', scheduledTime: '8:42 AM', latitude: 24.5970, longitude: 73.7040, order: 24 },
                { name: 'College', scheduledTime: '8:50 AM', latitude: 24.6000, longitude: 73.7100, order: 25 }
            ],
            coordinator: coordinator1._id,
            createdBy: admin._id,
        });

        // Route for Bus 13 (Driver: Mushtaq Ji)
        const routeBus13 = await Route.create({
            name: 'Bus 13 Route (Rampura)',
            startingPoint: 'Rampura',
            routeDetails: 'Rampura → Chetak Circle → Delhi Gate → Sevashram → College',
            waypoints: [
                { name: 'Rampura', scheduledTime: '8:00 AM', latitude: 24.6000, longitude: 73.6500, order: 1 },
                { name: 'Mallatalai Choraha', scheduledTime: '8:02 AM', latitude: 24.6010, longitude: 73.6520, order: 2 },
                { name: 'Mahakaleshwer', scheduledTime: '8:03 AM', latitude: 24.6020, longitude: 73.6540, order: 3 },
                { name: 'Rada Ji Choraha', scheduledTime: '8:05 AM', latitude: 24.6030, longitude: 73.6560, order: 4 },
                { name: 'Swaroop Sagar', scheduledTime: '8:06 AM', latitude: 24.6040, longitude: 73.6580, order: 5 },
                { name: 'Shiksha Bhawan', scheduledTime: '8:07 AM', latitude: 24.6050, longitude: 73.6600, order: 6 },
                { name: 'Chetak Circle', scheduledTime: '8:10 AM', latitude: 24.6060, longitude: 73.6620, order: 7 },
                { name: 'Hathipole', scheduledTime: '8:12 AM', latitude: 24.6070, longitude: 73.6640, order: 8 },
                { name: 'Delhigate', scheduledTime: '8:15 AM', latitude: 24.6080, longitude: 73.6660, order: 9 },
                { name: 'Court Choraha', scheduledTime: '8:17 AM', latitude: 24.6090, longitude: 73.6680, order: 10 },
                { name: 'Shastri Circle', scheduledTime: '8:18 AM', latitude: 24.6100, longitude: 73.6700, order: 11 },
                { name: 'Sabhapati Awas', scheduledTime: '8:19 AM', latitude: 24.6110, longitude: 73.6720, order: 12 },
                { name: 'Maya Misthan', scheduledTime: '8:20 AM', latitude: 24.6120, longitude: 73.6740, order: 13 },
                { name: 'Durga Nursery', scheduledTime: '8:21 AM', latitude: 24.6130, longitude: 73.6760, order: 14 },
                { name: 'Kumharo Ka Bhatta', scheduledTime: '8:22 AM', latitude: 24.6140, longitude: 73.6780, order: 15 },
                { name: 'B. N. College', scheduledTime: '8:24 AM', latitude: 24.6150, longitude: 73.6800, order: 16 },
                { name: 'Sevashram', scheduledTime: '8:25 AM', latitude: 24.6160, longitude: 73.6820, order: 17 },
                { name: 'BSNL', scheduledTime: '8:27 AM', latitude: 24.6170, longitude: 73.6840, order: 18 },
                { name: 'Ranawat Poultry', scheduledTime: '8:30 AM', latitude: 24.6180, longitude: 73.6860, order: 19 },
                { name: 'Vaishali Apartment', scheduledTime: '8:31 AM', latitude: 24.6190, longitude: 73.6880, order: 20 },
                { name: 'National Misthan', scheduledTime: '8:32 AM', latitude: 24.6200, longitude: 73.6900, order: 21 },
                { name: 'College', scheduledTime: '8:55 AM', latitude: 24.6000, longitude: 73.7100, order: 22 }
            ],
            coordinator: coordinator1._id,
            createdBy: admin._id,
        });

        // Route for Bus 11 (Driver: Bhanwar Singh Ji)
        const routeBus11 = await Route.create({
            name: 'Bus 11 Route (Lal Board)',
            startingPoint: 'Lal Board Choraha',
            routeDetails: 'Lal Board → Fatehpura → Sukhadiya Circle → Aayad → College',
            waypoints: [
                { name: 'Lal Board Choraha', scheduledTime: '7:45 AM', latitude: 24.6300, longitude: 73.6800, order: 1 },
                { name: 'Prajapat Palace', scheduledTime: '7:47 AM', latitude: 24.6310, longitude: 73.6810, order: 2 },
                { name: 'Badgaon', scheduledTime: '7:50 AM', latitude: 24.6320, longitude: 73.6820, order: 3 },
                { name: 'Saifan Choraha', scheduledTime: '7:55 AM', latitude: 24.6330, longitude: 73.6830, order: 4 },
                { name: 'Fatehpura', scheduledTime: '8:00 AM', latitude: 24.6340, longitude: 73.6840, order: 5 },
                { name: 'Dewali', scheduledTime: '8:02 AM', latitude: 24.6350, longitude: 73.6850, order: 6 },
                { name: 'Saheli Nagar', scheduledTime: '8:05 AM', latitude: 24.6360, longitude: 73.6860, order: 7 },
                { name: 'Sukhadiya Circle', scheduledTime: '8:07 AM', latitude: 24.6370, longitude: 73.6870, order: 8 },
                { name: 'Banshi Pan', scheduledTime: '8:10 AM', latitude: 24.6380, longitude: 73.6880, order: 9 },
                { name: 'New Bhopalpura', scheduledTime: '8:13 AM', latitude: 24.6390, longitude: 73.6890, order: 10 },
                { name: 'Jodhpur Dairy', scheduledTime: '8:17 AM', latitude: 24.6400, longitude: 73.6900, order: 11 },
                { name: 'CPS School', scheduledTime: '8:20 AM', latitude: 24.6410, longitude: 73.6910, order: 12 },
                { name: 'Kharaa Kuwa', scheduledTime: '8:22 AM', latitude: 24.6420, longitude: 73.6920, order: 13 },
                { name: '100 Ft Road', scheduledTime: '8:25 AM', latitude: 24.6430, longitude: 73.6930, order: 14 },
                { name: 'Anand Plaza', scheduledTime: '8:27 AM', latitude: 24.6440, longitude: 73.6940, order: 15 },
                { name: 'Aayad', scheduledTime: '8:28 AM', latitude: 24.6450, longitude: 73.6950, order: 16 },
                { name: 'Hansa Palace', scheduledTime: '8:32 AM', latitude: 24.6460, longitude: 73.6960, order: 17 },
                { name: 'Jhadav Nursery', scheduledTime: '8:35 AM', latitude: 24.6470, longitude: 73.6970, order: 18 },
                { name: 'Manva Kheda', scheduledTime: '8:37 AM', latitude: 24.6480, longitude: 73.6980, order: 19 },
                { name: 'College', scheduledTime: '8:55 AM', latitude: 24.6000, longitude: 73.7100, order: 20 }
            ],
            coordinator: coordinator1._id,
            createdBy: admin._id,
        });

        // Route for Bus 10 (Driver: Narayan Singh)
        const routeBus10 = await Route.create({
            name: 'Bus 10 Route (Chitrakoot)',
            startingPoint: 'Chitrakoot Nagar',
            routeDetails: 'Chitrakoot → Bhuwana → Pratap Nagar → Sector 3 → College',
            waypoints: [
                { name: 'Chitrakoot Nagar', scheduledTime: '8:00 AM', latitude: 24.6100, longitude: 73.7200, order: 1 },
                { name: 'Bhuwana By Pass', scheduledTime: '8:03 AM', latitude: 24.6110, longitude: 73.7210, order: 2 },
                { name: 'Bhuwana', scheduledTime: '8:05 AM', latitude: 24.6120, longitude: 73.7220, order: 3 },
                { name: 'RK Circle', scheduledTime: '8:07 AM', latitude: 24.6130, longitude: 73.7230, order: 4 },
                { name: 'Mewar Circle', scheduledTime: '8:10 AM', latitude: 24.6140, longitude: 73.7240, order: 5 },
                { name: 'New RTO', scheduledTime: '8:13 AM', latitude: 24.6150, longitude: 73.7250, order: 6 },
                { name: 'Kalka Mata Road', scheduledTime: '8:15 AM', latitude: 24.6160, longitude: 73.7260, order: 7 },
                { name: 'Bekani Puliya', scheduledTime: '8:20 AM', latitude: 24.6170, longitude: 73.7270, order: 8 },
                { name: 'University Gate', scheduledTime: '8:22 AM', latitude: 24.6180, longitude: 73.7280, order: 9 },
                { name: 'Bohra Ganesh Ji', scheduledTime: '8:25 AM', latitude: 24.6190, longitude: 73.7290, order: 10 },
                { name: 'Pratap Nagar Choraha', scheduledTime: '8:30 AM', latitude: 24.6200, longitude: 73.7300, order: 11 },
                { name: 'Transport Nagar', scheduledTime: '8:34 AM', latitude: 24.6210, longitude: 73.7310, order: 12 },
                { name: 'Sunderwas', scheduledTime: '8:40 AM', latitude: 24.6220, longitude: 73.7320, order: 13 },
                { name: 'Thokar Choraha', scheduledTime: '8:42 AM', latitude: 24.6230, longitude: 73.7330, order: 14 },
                { name: 'Sewashram Puliya', scheduledTime: '8:43 AM', latitude: 24.6240, longitude: 73.7340, order: 15 },
                { name: 'Sector 3 (Nehru Hostel)', scheduledTime: '8:44 AM', latitude: 24.6250, longitude: 73.7350, order: 16 },
                { name: 'Menaria Guest House', scheduledTime: '8:46 AM', latitude: 24.6260, longitude: 73.7360, order: 17 },
                { name: 'Sec 6 Police Station', scheduledTime: '8:47 AM', latitude: 24.6270, longitude: 73.7370, order: 18 },
                { name: 'Sai Baba', scheduledTime: '8:48 AM', latitude: 24.6280, longitude: 73.7380, order: 19 },
                { name: 'Eklingpura', scheduledTime: '8:50 AM', latitude: 24.6290, longitude: 73.7390, order: 20 },
                { name: 'College', scheduledTime: '9:00 AM', latitude: 24.6000, longitude: 73.7100, order: 21 }
            ],
            coordinator: coordinator1._id,
            createdBy: admin._id,
        });
        console.log('✓ Created 4 Routes with Real Schedule Data (88 total stops)');

        // ============ BUSES ============

        const buses = await Bus.insertMany([
            {
                busNumber: 'Bus 12',
                driver: driverBus12._id,
                route: routeBus12._id,
                departureTime: '08:00',
                capacity: 45,
                isAvailableToday: true,
                coordinator: coordinator1._id,
                status: 'active',
                currentLocation: { latitude: 24.5700, longitude: 73.6800, timestamp: new Date() },
            },
            {
                busNumber: 'Bus 13',
                driver: driverBus13._id,
                route: routeBus13._id,
                departureTime: '08:00',
                capacity: 50,
                isAvailableToday: true,
                coordinator: coordinator1._id,
                status: 'active',
                currentLocation: { latitude: 24.6000, longitude: 73.6500, timestamp: new Date() },
            },
            {
                busNumber: 'Bus 11',
                driver: driverBus11._id,
                route: routeBus11._id,
                departureTime: '07:45',
                capacity: 40,
                isAvailableToday: true,
                coordinator: coordinator1._id,
                status: 'active',
                currentLocation: { latitude: 24.6300, longitude: 73.6800, timestamp: new Date() },
            },
            {
                busNumber: 'Bus 10',
                driver: driverBus10._id,
                route: routeBus10._id,
                departureTime: '08:00',
                capacity: 55,
                isAvailableToday: true,
                coordinator: coordinator1._id,
                status: 'active',
                currentLocation: { latitude: 24.6100, longitude: 73.7200, timestamp: new Date() },
            },
        ]);
        console.log('✓ Created 4 Buses linked to Drivers and Routes');

        // ============ BROADCASTS ============

        await Broadcast.insertMany([
            {
                title: 'Welcome',
                message: 'Welcome to the updated bus tracking system with real schedule data.',
                targetRole: 'all',
                channels: { email: false, push: false, inApp: true },
                sentBy: admin._id,
            },
            {
                title: 'Route Update',
                message: 'Routes for Bus 10, 12, 13, and 11 have been updated with accurate schedule times from the official PDF.',
                targetRole: 'student',
                channels: { email: true, push: false, inApp: true },
                sentBy: admin._id,
            },
        ]);
        console.log('✓ Created Broadcasts');

        // ============ SUMMARY ============
        console.log('\n========== SEED DATA SUMMARY ==========');
        console.log('Users:');
        console.log('  - Admin: 1 (Phone: 8529657145)');
        console.log('  - Coordinator: 1 (Phone: 7665166735)');
        console.log('  - Drivers: 4 (Real data from PDF)');
        console.log('  - Students: 3');
        console.log('Routes: 4 (Bus 10, 12, 13, 11) with 88 total stops');
        console.log('Buses: 4');
        console.log('\n========== DRIVER CREDENTIALS ==========');
        console.log('Bus 12 (Bheru Lal Ji):     Phone: 8696932793');
        console.log('Bus 13 (Mushtaq Ji):       Phone: 8696932791');
        console.log('Bus 11 (Bhanwar Singh Ji): Phone: 8285314292');
        console.log('Bus 10 (Narayan Singh):    Phone: 8107799177');
        console.log('=========================================\n');

        await mongoose.disconnect();
        console.log('✓ Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('✗ Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
