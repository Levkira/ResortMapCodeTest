import express from "express";

const app = express();

const PORT = process.env.PORT || 5000;

import path from "path";

const bookedCabanas = new Set();

app.use(express.json());

app.get("/api", (req, res) => {
  const filePath = path.resolve("./map.ascii");
  res.sendFile(filePath);
});

app.get("/api/bookings", (req, res) => {
  const filePath = path.resolve("./bookings.json");
  res.sendFile(filePath);
});

app.get("/api/bookings/booked", (req, res) => {
  res.json({ bookedCabanas: Array.from(bookedCabanas) });
});

app.post("/api/bookings/:cabanaId", (req, res) => {
  const { cabanaId } = req.params;

  if (!cabanaId) {
    return res.status(400).json({ error: "cabanaId is required" });
  }

  bookedCabanas.add(cabanaId);
  res.json({ success: true, bookedCabanas: Array.from(bookedCabanas) });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

export default app; 

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
}