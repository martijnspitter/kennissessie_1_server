import mongoose from 'mongoose';
import { IProfile } from './profile';

const Schema = mongoose.Schema;

const accountSchema = new Schema<IAccount>(
  {
    email: {
      type: String,
      required: true
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: 'Profile'
    },
    identifier: {
      type: String,
    },
  },
  { timestamps: true }
);

export interface IAccount {
  id: mongoose.ObjectId,
  email: string,
  profile: mongoose.ObjectId,
  identifier: string
}

export const Account = mongoose.model<IAccount>('Account', accountSchema);