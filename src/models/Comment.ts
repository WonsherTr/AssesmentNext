import mongoose, { Schema, Model, Document, Types } from 'mongoose';

export interface ICommentDocument extends Document {
  ticketId: Types.ObjectId;
  author: Types.ObjectId;
  message: string;
  createdAt: Date;
}

const CommentSchema = new Schema<ICommentDocument>(
  {
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
      required: [true, 'Ticket ID is required'],
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [1, 'Message cannot be empty'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Index for efficient querying of comments by ticket
CommentSchema.index({ ticketId: 1, createdAt: 1 });

const Comment: Model<ICommentDocument> =
  mongoose.models.Comment || mongoose.model<ICommentDocument>('Comment', CommentSchema);

export default Comment;
