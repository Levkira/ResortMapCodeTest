import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bookingsPath = path.join(__dirname, "..", "..", "data", "bookings.json");

const guestList = JSON.parse(fs.readFileSync(bookingsPath, "utf-8"));
const bookedCabanas = new Set();

export const getBookedCabanas = () => {
  return Array.from(bookedCabanas);
};

export const findGuest = (room, name) => {
  return guestList.find((g) => g.room === room && g.guestName === name);
};

export const isBooked = (cabanaId) => bookedCabanas.has(cabanaId);

export const bookCabana = (cabanaId, room, name) => {
  const guest = findGuest(room, name);
  if (!guest) {
    return { ok: false, status: 400, error: "Invalid room or guest name" };
  }

  if (bookedCabanas.has(cabanaId)) {
    return { ok: false, status: 409, error: "Cabana is already booked" };
  }

  bookedCabanas.add(cabanaId);
  return { ok: true, bookedCabanas: getBookedCabanas() };
};

export const resetBookings = () => bookedCabanas.clear();