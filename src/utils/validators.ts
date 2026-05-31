export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidStudentId = (id: string): boolean => {
  return /^E\d{3}$/.test(id);
};

export const isValidVehiclePlate = (plate: string): boolean => {
  return /^[A-Z]{3}-\d{3}$/.test(plate.toUpperCase());
};