import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  description: string;
  date: Date;
  time: string;
  createdBy: mongoose.Types.ObjectId;
  invitedFriends?: mongoose.Types.ObjectId[];
  image?: string; // Path to the image
}

const EventSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // Added time field for specific event timing
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    invitedFriends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // List of invited friends
    image: { type: String }, // Optional field for image path
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

export default mongoose.model<IEvent>('Event', EventSchema);
