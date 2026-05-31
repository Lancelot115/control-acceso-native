import AsyncStorage from '@react-native-async-storage/async-storage';
import mockData from '../data/mock_access_data.json';
import { AccessRecord, AccessRecordWithStudent, Stats, Student } from '../types';
import { generateId } from '../utils/idGenerator';

const STORAGE_KEY = 'access_records';

// Simula latencia de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const accessService = {
  async getStudents(): Promise<Student[]> {
    await delay(400);
    return mockData.students as Student[];
  },

  async getStudentById(id: string): Promise<Student | null> {
    await delay(300);
    const student = mockData.students.find(s => s.id === id);
    return student ? (student as Student) : null;
  },

  async getRecords(): Promise<AccessRecordWithStudent[]> {
    await delay(500);
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const extra: AccessRecord[] = stored ? JSON.parse(stored) : [];
      const all = [...mockData.access_records, ...extra] as AccessRecord[];

      return all
        .map(record => {
          const student = mockData.students.find(s => s.id === record.studentId);
          return student ? { ...record, student: student as Student } : null;
        })
        .filter(Boolean)
        .sort((a, b) => new Date(b!.timestamp).getTime() - new Date(a!.timestamp).getTime()) as AccessRecordWithStudent[];
    } catch {
      return mockData.access_records.map(record => {
        const student = mockData.students.find(s => s.id === record.studentId);
        return { ...record, student: student as Student };
      }) as AccessRecordWithStudent[];
    }
  },

  async registerAccess(
    studentId: string,
    type: 'entry' | 'exit',
    method: 'pedestrian' | 'vehicle',
    gate: string,
    vehicle?: string
  ): Promise<{ success: boolean; record?: AccessRecordWithStudent; message: string }> {
    await delay(600);

    const student = mockData.students.find(s => s.id === studentId) as Student | undefined;
    if (!student) return { success: false, message: 'Estudiante no encontrado' };
    if (student.status === 'suspended') return { success: false, message: 'Acceso denegado: estudiante suspendido' };
    if (student.status === 'inactive') return { success: false, message: 'Acceso denegado: cuenta inactiva' };

    const newRecord: AccessRecord = {
      id: generateId('R'),
      studentId,
      type,
      method,
      gate,
      vehicle,
      timestamp: new Date().toISOString(),
      authorized: true,
    };

    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const existing: AccessRecord[] = stored ? JSON.parse(stored) : [];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, newRecord]));
    } catch {}

    return {
      success: true,
      record: { ...newRecord, student },
      message: `${type === 'entry' ? 'Ingreso' : 'Salida'} registrado correctamente`,
    };
  },

  async getStats(): Promise<Stats> {
    await delay(300);
    const records = await this.getRecords();
    const today = new Date().toDateString();
    const todayRecords = records.filter(r => new Date(r.timestamp).toDateString() === today);

    return {
      totalEntries: todayRecords.filter(r => r.type === 'entry' && r.authorized).length,
      totalExits: todayRecords.filter(r => r.type === 'exit' && r.authorized).length,
      denied: records.filter(r => !r.authorized).length,
      vehiclesInside: todayRecords.filter(r => r.method === 'vehicle' && r.type === 'entry' && r.authorized).length,
    };
  },
};