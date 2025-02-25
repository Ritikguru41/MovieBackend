import mongoose from "mongoose";
import Bookings from "../modules/Bookings.js";
import Movie from "../modules/Movie.js";
import User from "../modules/User.js";

export const newBooking = async (req, res, next) => {
  const { movie, date, seats, user, movieTime } = req.body;

  if (!movie || !date || !seats || !user || !movieTime) {
    return res.status(400).json({ message: "All fields, including movieTime, are required" });
  }

  if (!mongoose.Types.ObjectId.isValid(movie) || !mongoose.Types.ObjectId.isValid(user)) {
    return res.status(400).json({ message: "Invalid movie or user ID" });
  }

  try {
    const [existingMovie, existingUser, existingBooking] = await Promise.all([
      Movie.findById(movie),
      User.findById(user),
      Bookings.findOne({ movie, date, seats: { $in: seats } }),
    ]);

    if (!existingMovie) return res.status(404).json({ message: "Movie not found" });
    if (!existingUser) return res.status(404).json({ message: "User not found" });
    if (existingBooking) return res.status(400).json({ message: "Seat already booked" });

    const booking = new Bookings({ 
      movie, 
      movieTitle: existingMovie.title, // Fetch title from Movie model
      date, 
      seats, 
      user, 
      movieTime 
    });

    await booking.save();
    
    existingUser.bookings.push(booking._id);
    existingMovie.bookings.push(booking._id);

    await Promise.all([existingUser.save(), existingMovie.save()]);

    res.status(201).json({
      message: "Booking successful",
      bookingId: booking._id,
      booking
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Bookings.findById(req.params.id).populate("movie user");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    return res.status(200).json({ 
      booking: {
        _id: booking._id,
        movieTitle: booking.movieTitle, // Ensure movie title is included
        date: booking.date,
        seats: booking.seats,
        movieTime: booking.movieTime,
        user: booking.user
      }
    });
  } catch (err) {
    console.error("Error fetching booking:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// Delete booking
export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Bookings.findById(req.params.id).populate("user movie");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      booking.user.bookings.pull(booking._id);
      booking.movie.bookings.pull(booking._id);
      
      await Promise.all([
        booking.user.save({ session }),
        booking.movie.save({ session }),
        booking.deleteOne({ session }),
      ]);

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

    return res.status(200).json({ message: "Booking successfully deleted" });
  } catch (err) {
    console.error("Error deleting booking:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get booking details by ID
export const getSeatById = async (req, res, next) => {
  try {
    const booking = await Bookings.findById(req.params.id).populate("movie user");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    return res.status(200).json({ booking });
  } catch (err) {
    console.error("Error fetching booking details:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
