import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  description: string;
  date: Date;
  createdBy: mongoose.Types.ObjectId;
  image?: string; // Optional image field
}

const EventSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    image: { type: String }, // Add image field
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);


export default mongoose.model<IEvent>('Event', EventSchema);
