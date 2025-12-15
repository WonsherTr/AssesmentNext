/**
 * AUTENTICACIÓN Y SEGURIDAD
 * 
 * Este módulo maneja toda la lógica de seguridad:
 * - JWT: Tokens seguros para autenticación sin sesiones en servidor
 * - bcryptjs: Encriptación de contraseñas con salt (irreversible)
 * 
 * PREGUNTAS COMUNES EN SUSTENTACIÓN:
 * 1. ¿Por qué bcryptjs? - Para que nadie pueda obtener contraseña original si roban la BD
 * 2. ¿Cómo funciona JWT? - Contiene info del usuario + firma secreta, expira en 7 días
 * 3. ¿Qué es el salt en bcryptjs? - Random agregado a la contraseña antes de hashear
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IUserResponse } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Genera un JWT con información del usuario
 * @param user - Datos del usuario (sin contraseña)
 * @returns Token firmado que expira en 7 días
 * 
 * CÓMO FUNCIONA:
 * 1. Crea payload con userId, email, role
 * 2. Firma el payload con JWT_SECRET
 * 3. Token es enviado al cliente y guardado en localStorage
 * 4. Cliente envía en header: "Authorization: Bearer <token>"
 */
export function generateToken(user: IUserResponse): string {
  const payload: JWTPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verifica que un JWT sea válido y no haya expirado
 * @param token - Token a validar
 * @returns Payload del token o null si es inválido/expirado
 * 
 * SEGURIDAD:
 * - Si el token fue modificado, la firma NO coincidirá (rechazado)
 * - Si expiró (> 7 días), jwt.verify lanza error (rechazado)
 * - Solo quien conoce JWT_SECRET puede crear tokens válidos
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Encripta una contraseña para guardarla en BD
 * @param password - Contraseña en texto plano
 * @returns Contraseña encriptada (irreversible)
 * 
 * PROCESO:
 * 1. Genera un "salt" aleatorio (complejidad 12 = 2^12 iteraciones)
 * 2. Combina salt + password
 * 3. Retorna hash + salt incrustado
 * 
 * NUNCA se puede recuperar la contraseña del hash
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compara una contraseña en texto plano con su hash guardado
 * @param password - Contraseña ingresada por usuario
 * @param hashedPassword - Hash guardado en BD
 * @returns true si coinciden, false si no
 * 
 * USO EN LOGIN:
 * 1. Usuario ingresa email + password
 * 2. Buscamos usuario en BD
 * 3. Comparamos: comparePassword(passwordIngresado, hashEnBD)
 * 4. Si true → login exitoso
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
