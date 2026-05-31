export type StudentStatus = 'active' | 'suspended' | 'inactive';
export type AccessType = 'entry' | 'exit';
export type AccessMethod = 'pedestrian' | 'vehicle';
export type VehicleType = 'car' | 'motorcycle' | null;

export interface Student {
  id: string;
  name: string;
  career: string;
  photo: string;
  status: StudentStatus;
  vehicle: string | null;
  vehicleType: VehicleType;
}

export interface AccessRecord {
  id: string;
  studentId: string;
  type: AccessType;
  method: AccessMethod;
  vehicle?: string;
  timestamp: string;
  gate: string;
  authorized: boolean;
}

export interface AccessRecordWithStudent extends AccessRecord {
  student: Student;
}

export interface Stats {
  totalEntries: number;
  totalExits: number;
  denied: number;
  vehiclesInside: number;
}

export interface AuthUser {
  id: string;
  name: string;
  role: 'admin' | 'guard';
  email: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: Date;
  read: boolean;
}