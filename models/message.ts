import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const messageSchema = new Schema<IMessage>(
  {
    channel: {
      type: Schema.Types.ObjectId,
      required: true
    },
    createdBy: {
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
  channel: mongoose.ObjectId,
  createdBy: mongoose.ObjectId,
  title: string,
  body: string,
}

export const Message = mongoose.model<IMessage>('Message', messageSchema);