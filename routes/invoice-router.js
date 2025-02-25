import express from "express";
import { generateInvoice, getInvoice } from "../controllers/invoice-controllers.js";
import Booking from "../modules/Bookings.js";  // Ensure Booking model is imported
import Invoice from "../modules/invoice.js";
const InvoiceRouter = express.Router();

// Generate an invoice for a specific booking
InvoiceRouter.post("/generate/:bookingId", generateInvoice);

InvoiceRouter.get("/:bookingId", getInvoice);
    

export default InvoiceRouter;
