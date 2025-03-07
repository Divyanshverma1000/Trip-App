const mongoose = require("mongoose");

const DayPlanSchema = new mongoose.Schema({
  day: { type: Number, required: true },
  dayNotes: { type: String },
  places: [
    {
      name: { type: String, required: true },
      address: { type: String },
      time: { type: String },
      description: { type: String },
      expense: { type: Number },
    },
  ],
  // Lodging details 
  stay: {
    hotelName: { type: String },
    address: { type: String },
    description: { type: String },
    cost: { type: Number },
    rating: { type: Number },
  },
  // Restaurant details
  restaurant: [
    {
      name: { type: String },
      address: { type: String },
      description: { type: String },
      cost: { type: Number },
      mealType: { type: String }, // breakfast, lunch, dinner
    },
  ],
  // Other activities
  activities: [
    {
      activityName: { type: String },
      description: { type: String },
      cost: { type: Number },
    },
  ],
});

const MemberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: {
    type: String,
    enum: ["host", "editor", "viewer"],
    default: "viewer"
  },
  status: {
    type: String,
    enum: ["accepted", "pending", "rejected"],
    default: "pending"
  },
});

const TripSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    metadata: {
      destination: { type: String },
      cost: { type: Number },
      duration: { type: Number } // e.g., number of days
    },
    itinerary: [DayPlanSchema],
    packingEssentials: [String],
    estimatedBudget: { type: Number },
    actualBudget: { type: Number },
    tags: [String],
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [MemberSchema],
    isPublic: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["planning", "planned", "ongoing", "completed", "posted"],
      default: "planning"
    },
    coverPhoto: { type: String },
    photos: [
      {
        url: { type: String },
        caption: { type: String }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", TripSchema);