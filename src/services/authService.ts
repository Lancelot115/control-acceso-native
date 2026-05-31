import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_CREDENTIALS } from '../constants';
import { AuthUser } from '../types';

const AUTH_KEY = 'auth_user';

export const authService = {
  async login(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const match = Object.values(MOCK_CREDENTIALS).find(
      c => c.email === email && c.password === password
    );

    if (!match) return { success: false, message: 'Credenciales incorrectas' };

    const user: AuthUser = {
      id: email,
      name: match.name,
      role: match.role,
      email: match.email,
    };

    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return { success: true, user, message: 'Bienvenido' };
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(AUTH_KEY);
  },

  async getStoredUser(): Promise<AuthUser | null> {
    try {
      const stored = await AsyncStorage.getItem(AUTH_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },
};