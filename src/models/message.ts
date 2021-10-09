import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const messageSchema = new Schema<IMessage>(
  {
    channelId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    createdById: {
      type: Schema.Types.ObjectId,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    }
  }
);

export interface IMessage {
  channelId: mongoose.ObjectId,
  createdById: mongoose.ObjectId,
  title: string,
  body: string,
}

export const Message = mongoose.model<IMessage>('Message', messageSchema);