import { vi, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingModal from "./BookingModal";

describe("BookingModal Component", () => {
  const defaultProps = {
    open: true,
    cabanaId: "A101",
    room: "",
    name: "",
    error: null,
    status: null,
    setRoom: vi.fn(),
    setName: vi.fn(),
    onSubmit: vi.fn(),
    onClose: vi.fn(),
  };

  test("returns null when open is false", () => {
    const { container } = render(
      <BookingModal {...defaultProps} open={false} />,
    );
    expect(container.firstChild).toBeNull();
  });

  test("renders cabana ID and input fields when open", () => {
    render(<BookingModal {...defaultProps} />);

    expect(screen.getByText(/Cabana A101/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/Room number/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/Guest name/i)).toBeDefined();
  });

  test("calls setRoom and setName on input change", async () => {
    const user = userEvent.setup();
    render(<BookingModal {...defaultProps} />);

    const roomInput = screen.getByPlaceholderText(/Room number/i);
    const nameInput = screen.getByPlaceholderText(/Guest name/i);

    await user.type(roomInput, "123");
    expect(defaultProps.setRoom).toHaveBeenCalled();

    await user.type(nameInput, "John Doe");
    expect(defaultProps.setName).toHaveBeenCalled();
  });

  test("calls onSubmit when Book button is clicked", async () => {
    const user = userEvent.setup();
    render(<BookingModal {...defaultProps} />);

    const bookButton = screen.getByRole("button", { name: /Book/i });
    await user.click(bookButton);

    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
  });

  test("renders error message when error prop is provided", () => {
    render(<BookingModal {...defaultProps} error="Invalid Credentials" />);
    expect(screen.getByText(/Invalid Credentials/i)).toBeDefined();
  });

  test("renders success state and hides inputs when status is success", () => {
    render(<BookingModal {...defaultProps} status="success" />);

    expect(screen.getByText(/Booking successful!/i)).toBeDefined();
    expect(screen.queryByPlaceholderText(/Room number/i)).toBeNull();
    expect(screen.getByRole("button", { name: /Back to map/i })).toBeDefined();
  });

  test("calls onClose when overlay is clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(<BookingModal {...defaultProps} />);

    const overlay = container.querySelector(".booking-modal-overlay");
    await user.click(overlay);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
