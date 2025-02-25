import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user-router.js";
import adminRouter from "./routes/admin-router.js";
import movieRouter from "./routes/movie-router.js";
// import bookingRouter from "./routes/booking-router.js";
import bookingRouter from "./routes/booking-router.js";
import InvoiceRouter from "./routes/invoice-router.js";
import Invoice from "./modules/invoice.js";
import cors from "cors";

const app = express();
// const cors = require("cors");
// middlewears
app.use(cors());
app.use(express.json())
app.use("/user", userRouter);
app.use("/admin",adminRouter);
app.use("/movie",movieRouter);
app.use("/booking",bookingRouter);

app.post('/booking/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Handle booking logic here
        res.status(201).json({ message: "Booking successful" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
app.use("/api/invoices", InvoiceRouter);
app.get('/api/invoices/bookings/:bookingId', async (req, res) => {
    console.log("Received request for bookingId:", req.params.bookingId);
    try {
        const invoice = await Invoice.findOne({ bookingId: req.params.bookingId });
        console.log("Invoice found:", invoice);

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        res.json(invoice);
    } catch (error) {
        console.error("Error fetching invoice:", error);
        res.status(500).json({ message: "Server Error", error });
    }
});



app.post("/api/invoices/generate/:bookingId", async (req, res) => {
    const { bookingId } = req.params;
    console.log("Received bookingId:", bookingId); // Debugging log

    // Check if bookingId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({ message: "Invalid Booking ID format" });
    }

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Continue with invoice generation...
        res.json({ message: "Invoice generated successfully" });
    } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

  app.get("/movie", (req, res) => {
    console.log("Fetching all movies...");
    res.json({ message: "Movies retrieved successfully" });
  });
  
  
mongoose.connect(
    `mongodb+srv://admin:${66818359}@findyourseat.garbw.mongodb.net/?retryWrites=true&w=majority&appName=FindYourSeats`
)
.then(() => {
    app.listen(5000, () => 
        console.log('Connected to Database and server is running')
    );
})
.catch((e) => console.log(e));
