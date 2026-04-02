/** @vitest-environment node */
import { test, expect, describe, vi } from "vitest";
import request from "supertest";
import path from "path";
import app from "./index.js"; 

vi.mock("path", async () => {
  const actual = await vi.importActual("path");
  return {
    ...actual,
    resolve: vi.fn((...args) => actual.resolve(...args)),
  };
});

describe("Express Server API", () => {
  
  test("GET /api should attempt to send the map file", async () => {
    const response = await request(app).get("/api");
    expect([200, 404]).toContain(response.status);
  });

  test("GET /api/bookings/booked starts with an empty list", async () => {
    const response = await request(app).get("/api/bookings/booked");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ bookedCabanas: [] });
  });

  test("POST /api/bookings/:cabanaId should add a cabana to the set", async () => {
    const cabanaId = "A101";
    const response = await request(app)
      .post(`/api/bookings/${cabanaId}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.bookedCabanas).toContain(cabanaId);

    const checkResponse = await request(app).get("/api/bookings/booked");
    expect(checkResponse.body.bookedCabanas).toContain(cabanaId);
  });

  test("POST /api/bookings/ should fail if no ID is provided", async () => {
    const response = await request(app).post("/api/bookings/").send();
    expect(response.status).toBe(404); 
  });
});