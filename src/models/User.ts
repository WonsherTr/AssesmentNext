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
