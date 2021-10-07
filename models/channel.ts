import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const channelSchema = new Schema<IChannel>(
  {
    owner: {
      type: Schema.Types.ObjectId,
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
  owner: mongoose.ObjectId,
  participants: mongoose.ObjectId[],
  messages: mongoose.ObjectId[]
}

export const Channel = mongoose.model<IChannel>('Channel', channelSchema);