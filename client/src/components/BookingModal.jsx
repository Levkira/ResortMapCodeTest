import React from "react";

export default function BookingModal({
  open,
  cabanaId,
  room,
  name,
  error,
  setRoom,
  setName,
  status,
  onSubmit,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="booking-modal-content"
      >
        <h2>Cabana {cabanaId}</h2>
        {error && <h3 className="booking-modal-error">{error}</h3>}
        {status === "success" ? (
          <>
            <p style={{ color: "green" }}>Booking successful!</p>

            <button
              className="booking-modal-button booking-modal-button-secondary"
              onClick={onClose}
            >
              Back to map
            </button>
          </>
        ) : (
          <>
            <input
              placeholder="Room number"
              value={room}
              onChange={(e) => setRoom(e.target.value.trim())}
              className="booking-modal-input"
            />

            <input
              placeholder="Guest name"
              value={name}
              onChange={(e) => setName(e.target.value.trim())}
              className="booking-modal-input"
            />

            <div className="booking-modal-buttons">
              <button
                onClick={onSubmit}
                className="booking-modal-button booking-modal-button-primary"
              >
                Book
              </button>
              <button
                onClick={onClose}
                className="booking-modal-button booking-modal-button-secondary"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
