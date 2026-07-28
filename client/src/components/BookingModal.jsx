import React, { useEffect } from "react";

export default function BookingModal({
  open,
  cabanaId,
  room,
  name,
  error,
  setRoom,
  setName,
  status,
  isSubmitting,
  onSubmit,
  onClose,
}) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting || !room || !name) return;
    onSubmit();
  }

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
          <form onSubmit={handleSubmit}>
            <input
              placeholder="Room number"
              value={room}
              onChange={(e) => setRoom(e.target.value.trim())}
              className="booking-modal-input"
              disabled={isSubmitting}
              autoFocus
            />

            <input
              placeholder="Guest name"
              value={name}
              onChange={(e) => setName(e.target.value.trim())}
              className="booking-modal-input"
              disabled={isSubmitting}
            />

            <div className="booking-modal-buttons">
              <button
                type="submit"
                className="booking-modal-button booking-modal-button-primary"
                disabled={isSubmitting || !room || !name}
              >
                {isSubmitting ? "Booking..." : "Book"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="booking-modal-button booking-modal-button-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}