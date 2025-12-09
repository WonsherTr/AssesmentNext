import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import { TicketStatus, TicketPriority } from '@/types';

export interface ITicketDocument extends Document {
  title: string;
  description: string;
  createdBy: Types.ObjectId;
  assignedTo?: Types.ObjectId | null;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema = new Schema<ITicketDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'] as TicketStatus[],
      default: 'open',
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'] as TicketPriority[],
      default: 'medium',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
TicketSchema.index({ createdBy: 1 });
TicketSchema.index({ assignedTo: 1 });
TicketSchema.index({ status: 1 });
TicketSchema.index({ priority: 1 });
TicketSchema.index({ createdAt: -1 });

const Ticket: Model<ITicketDocument> =
  mongoose.models.Ticket || mongoose.model<ITicketDocument>('Ticket', TicketSchema);

export default Ticket;
