// src/models/Friendship.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IFriendship extends Document {
  requester: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

const FriendshipSchema = new Schema<IFriendship>(
  {
    requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IFriendship>('Friendship', FriendshipSchema);
