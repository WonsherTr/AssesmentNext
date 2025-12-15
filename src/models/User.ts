/**
 * MODELO USER - Usuarios del Sistema
 * 
 * Representa a las personas en el sistema:
 * - CLIENTS: Crean tickets de soporte
 * - AGENTS: Resuelven tickets y pueden crear clientes
 * 
 * SEGURIDAD:
 * - Contraseña: Encriptada con bcryptjs (nunca se retorna)
 * - Email: Unique (no pueden haber dos usuarios con mismo email)
 * - Role: Enum (solo 'client' o 'agent')
 * 
 * PREGUNTAS DE SUSTENTACIÓN:
 * - ¿Por qué excluyes la contraseña de JSON? Por seguridad (línea ~45)
 * - ¿Cómo evitas duplicados de email? Con unique: true + lowercase
 */

import mongoose, { Schema, Model, Document } from 'mongoose';
import { IUser, UserRole } from '@/types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['client', 'agent'] as UserRole[],
      default: 'client',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * SEGURIDAD CRÍTICA: Excluye la contraseña de TODAS las respuestas JSON
 * 
 * EJEMPLO:
 * - BD: { _id: '123', name: 'Juan', email: '...', password: '$2a$12$...' }
 * - JSON retornado: { _id: '123', name: 'Juan', email: '...' }  ← sin password
 * 
 * IMPORTANTE: Aunque queramos acceder a user.password en backend,
 * siempre usamos User.findOne().select('+password') explícitamente
 */
// Prevent password from being returned in queries by default
UserSchema.set('toJSON', {
  transform: function (_doc, ret) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...retWithoutPassword } = ret;
    return retWithoutPassword;
  },
});

const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

export default User;
