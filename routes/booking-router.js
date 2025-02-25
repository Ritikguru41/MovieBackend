import express from "express";
import { deleteBooking, getBookingById, newBooking, getSeatById} from "../controllers/booking-controller.js";

const bookingRouter = express.Router();

bookingRouter.get("/:id", getBookingById);
bookingRouter.post("/", newBooking);
bookingRouter.delete("/:id", deleteBooking);
bookingRouter.get("/:id", getSeatById); 
export default bookingRouter;