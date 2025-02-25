import mongoose from "mongoose";
import Invoice from "../modules/invoice.js";
import Booking from "../modules/Bookings.js";

export const generateInvoice = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { userId, movieName, seats, totalAmount, qrCode } = req.body;

        // 🔹 Validate bookingId format
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({ message: "Invalid booking ID format" });
        }

        // 🔹 Check if booking exists
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // 🔹 Create invoice
        const invoice = new Invoice({
            bookingId,
            userId,
            movieName,
            seats,
            totalAmount,
            qrCode
        });

        await invoice.save();
        res.status(201).json({ message: "Invoice generated successfully", invoice });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const getInvoice = async (req, res) => {
  try {
      const { bookingId } = req.params;
      console.log("🔍 Fetching invoice for Booking ID:", bookingId);

      // 🔹 Validate if bookingId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
          return res.status(400).json({ message: "Invalid booking ID format" });
      }

      // 🔹 Check if the booking exists
      const bookingExists = await Booking.findById(bookingId);
      if (!bookingExists) {
          return res.status(404).json({ message: "Booking not found" });
      }

      // 🔹 Find invoice by bookingId
      const invoice = await Invoice.findOne({ bookingId });

      if (!invoice) {
          return res.status(404).json({ message: "Invoice not found for this booking" });
      }

      console.log("Invoice found:", invoice);
      res.status(200).json({ invoice });
  } catch (error) {
      console.error("❌ Error fetching invoice:", error);
      res.status(500).json({ message: "Internal Server Error", error });
  }
};
