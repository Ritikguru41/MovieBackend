import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieName: {
      type: String,
      required: true,
    },
    seats: {
      type: [String],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    qrCode: {
      type: String, // QR code URL or Base64
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);    