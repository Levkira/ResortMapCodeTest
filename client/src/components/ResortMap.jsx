import React, { useEffect, useMemo, useState } from "react";
import BookingModal from "./BookingModal";
import { parseGrid, chooseTile, getCabanaMap } from "../utils/asciiRenderer";

const TILE_SIZE = 32;

export default function ResortMap() {
  const [ascii, setAscii] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCabana, setHoveredCabana] = useState(null);
  const [selectedCabana, setSelectedCabana] = useState(null);
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [bookedCabanas, setBookedCabanas] = useState(new Set());
  const [bookingError, setBookingError] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch map");
        return res.text();
      })
      .then((data) => {
        setAscii(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  function refreshBookedCabanas() {
    fetch("/api/bookings/booked")
      .then((res) => res.json())
      .then((data) => {
        setBookedCabanas(new Set(data.bookedCabanas));
      });
  }

  useEffect(() => {
    refreshBookedCabanas();
  }, []);

  const grid = useMemo(() => {
    if (!ascii) return [];
    return parseGrid(ascii);
  }, [ascii]);

  const cols = grid[0]?.length || 0;

  const cabanaMap = useMemo(() => {
    if (!grid.length) return {};
    return getCabanaMap(grid);
  }, [grid]);

  function submitBooking() {
    if (isSubmitting) return;
    setIsSubmitting(true);

    fetch(`/api/bookings/${selectedCabana}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room, name }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setBookingError(data.error || "Booking failed");
          return;
        }
        setBookingStatus("success");
        setBookingError(null);
        refreshBookedCabanas();
      })
      .catch((err) => {
        console.error("Booking failed", err);
        setBookingError("Something went wrong. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function closeModal() {
    setSelectedCabana(null);
    setRoom("");
    setName("");
    setBookingStatus(null);
    setBookingError(null);
    setIsSubmitting(false);
  }
  function getOverlayStyle(state) {
    switch (state) {
      case "available":
        return "rgba(0, 255, 0, 0.09)";
      case "unavailable":
        return "rgba(255,0,0,0.35)";
      default:
        return "rgba(0, 0, 255, 0.35)";
    }
  }

  if (loading) return <div>Loading map...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!grid.length) return <div>No map data</div>;

  return (
    <div className="container">
      <h2>Resort Map</h2>
      <div className="map-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, ${TILE_SIZE}px)`,
            border: "1px solid #ccc",
          }}
        >
          {grid.map((row, y) =>
            row.map((_, x) => {
              const symbol = grid[y][x];
              const src = chooseTile(grid, x, y);
              const key = `${x},${y}`;
              const cabanaId = cabanaMap[key]
                ? `${cabanaMap[key]}${x}${y}`
                : null;
              const isCabana = symbol === "W";
              const state = isCabana
                ? bookedCabanas.has(cabanaId)
                  ? "unavailable"
                  : "available"
                : null;
              const isHovered = cabanaId && hoveredCabana === cabanaId;
              const isUnavailable = state === "unavailable";
              return (
                <div
                  key={key}
                  style={{
                    position: "relative",
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                  }}
                  onClick={
                    isCabana && !isUnavailable
                      ? () => setSelectedCabana(cabanaId)
                      : undefined
                  }
                  onMouseEnter={
                    isCabana && !isUnavailable
                      ? () => setHoveredCabana(cabanaId)
                      : undefined
                  }
                  onMouseLeave={
                    isCabana && !isUnavailable
                      ? () => setHoveredCabana(null)
                      : undefined
                  }
                >
                  <img
                    src={src}
                    alt=""
                    width={TILE_SIZE}
                    height={TILE_SIZE}
                    style={{
                      display: "block",
                      cursor: isCabana ? "pointer" : "default",
                    }}
                  />

                  {isCabana && state && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: getOverlayStyle(state),
                        pointerEvents: "none",
                        outline: isHovered ? "2px solid beige" : "none",
                      }}
                    />
                  )}
                </div>
              );
            }),
          )}
        </div>

        {selectedCabana && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setSelectedCabana(null)}
          >
            <BookingModal
              open={!!selectedCabana}
              cabanaId={selectedCabana}
              room={room}
              name={name}
              setRoom={setRoom}
              setName={setName}
              error={bookingError}
              status={bookingStatus}
              isSubmitting={isSubmitting}
              onSubmit={submitBooking}
              onClose={closeModal}
            />
          </div>
        )}
      </div>
    </div>
  );
}
