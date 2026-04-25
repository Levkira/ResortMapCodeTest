import { Router } from "express";
import * as bookingController from "../controllers/bookingController.js";

const router = Router();

router.get("", bookingController.getMap);
router.get("/bookings", bookingController.getBookingFile);
router.get("/bookings/booked", bookingController.getAllBooked);
router.post("/bookings/:cabanaId", bookingController.createBooking);

export default router;
