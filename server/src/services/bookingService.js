const bookedCabanas = new Set();

export const getBookedCabanas = () => {
  return Array.from(bookedCabanas);
};

export const addCabana = (id) => {
  bookedCabanas.add(id);
  return getBookedCabanas();
};

export const resetBookings = () => bookedCabanas.clear();