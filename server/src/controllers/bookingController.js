import { fileURLToPath } from "url";
import path from "path";
import * as bookingService from "../services/bookingService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getMap = (req, res) => {
  const filePath = path.join(__dirname, "..", "..", "data", "map.ascii");
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("File transfer error:", err);
      res.status(404).send("Map file not found.");
    }
  });
};

export const getBookingFile = (req, res) => {
  const filePath = path.resolve("data/bookings.json");
  res.sendFile(filePath);
};

export const getAllBooked = (req, res) => {
  const booked = bookingService.getBookedCabanas();
  res.json({ bookedCabanas: booked });
};

export const createBooking = (req, res) => {
  const { cabanaId } = req.params;
  const { room, name } = req.body;

  if (!cabanaId) {
    return res.status(400).json({ error: "cabanaId is required" });
  }
  if (!room || !name) {
    return res.status(400).json({ error: "room and name are required" });
  }

  const result = bookingService.bookCabana(cabanaId, room, name);

  if (!result.ok) {
    return res.status(result.status).json({ error: result.error });
  }

  res.json({ success: true, bookedCabanas: result.bookedCabanas });
};
