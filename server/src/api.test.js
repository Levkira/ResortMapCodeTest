/** @vitest-environment node */
import { test, expect, describe, vi, beforeEach } from "vitest";
import { test, expect, describe, vi } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { resetBookings } from "../src/services/bookingService.js";

beforeEach(() => resetBookings());

describe("Express Server API", () => {
  test("GET /api should return the map file", async () => {
    const response = await request(app).get("/api");
    expect(response.status).toBe(200);
  });

  test("GET /api/bookings/booked starts with an empty list", async () => {
    const response = await request(app).get("/api/bookings/booked");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("bookedCabanas");
  });

  test("POST /api/bookings/:cabanaId adds a cabana", async () => {
    const cabanaId = "A101";
    const response = await request(app)
      .post(`/api/bookings/${cabanaId}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.bookedCabanas).toContain(cabanaId);
  });

  test("POST /api/bookings/ without ID should return 404", async () => {
    const response = await request(app).post("/api/bookings/").send();
    expect(response.status).toBe(404);
  });
});
