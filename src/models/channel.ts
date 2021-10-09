import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const channelSchema = new Schema<IChannel>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
      }
    ],
    messages: [
      {
        type: Schema.Types.ObjectId
      }
    ]
  },
  { timestamps: true }
);

export interface IChannel {
  ownerId: mongoose.ObjectId,
  title: string,
  participants: mongoose.ObjectId[],
  messages: mongoose.ObjectId[]
}

export const Channel = mongoose.model<IChannel>('Channel', channelSchema);