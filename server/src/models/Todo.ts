import { Schema, model, Document } from 'mongoose';

interface ITodo extends Document {
  title: string;
  description?: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new Schema<ITodo>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    done: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<ITodo>('Todo', todoSchema);