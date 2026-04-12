import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IActivity extends Document {
  title: string;
  description: string;
  images: string[]; // Cloudinary URLs
  status: 'PENDING' | 'PUBLISHED';
  author: mongoose.Types.ObjectId;
}

const ActivitySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    status: { type: String, enum: ['PENDING', 'PUBLISHED'], default: 'PENDING' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Activity: Model<IActivity> = mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);

export default Activity;
