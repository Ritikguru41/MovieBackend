import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    movieTitle: { // Store the movie title
      type: String,
      required: true,
    },
    date: {
      type: String, // Changed to String for better compatibility with frontend date input
      required: true,
    },
    seats: {
      type: [String], // Changed to an array of strings to store multiple seat numbers
      required: true,
    },
    movieTime: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
