const mongoose = require('mongoose');
const carSchema = mongoose.Schema({
    DateOfPost: { type: String },
    Views: { type: Number },
    Reserved: { type: String, default: 'No' },
    Title: { type: String },
    Images: [{
        filename:{ type: String },
    }],
    Kilometers: { type: String },
    Price: { type: String },
    // State
    Condition: { type: String },
    PreviousOwners: { type: String },
    NextInspection: { type: String },
    Warranty: { type: String },
    FullService: { type: String },
    NonSmokingVehicle: { type: String },
    // Performance
    GearingType: { type: String },
    EngineVolume: { type: String },
    DriveChain: { type: String },
    Cylinders: { type: String },
    HorsePower: { type: String },
    Torque: { type: String },
    // Environment
    Fuel: { type: String },
    Consumption: { type: String },
    CO2Emission: { type: String },
    EmissionClass: { type: String },
    EmissionLabel: { type: String },
    // Properties
    Brand: { type: String },
    Model: { type: String },
    FirstRegistration: { type: String },
    BodyColor: { type: String },
    PaintType: { type: String },
    BodyColorOriginal: { type: String },
    InteriorFittings: { type: String },
    InteriorColors: { type: String },
    Body: { type: String },
    NrofDoors: { type: String },
    NrofSeats: { type: String },
    ModelCode: { type: String },
    CountryVersion: { type: String },
    // Equipment
    ComfortAndConvenience: [],
    EntertainmentAndMedia: [],
    Extras: [],
    SafetyAndSecurity: [],
    // Description
    Description: { type: String },
});

module.exports = mongoose.model('car', carSchema);