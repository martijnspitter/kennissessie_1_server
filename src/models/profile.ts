import mongoose from 'mongoose';
import { IAccount } from './account';

const Schema = mongoose.Schema;

const profileSchema = new Schema<IProfile>(
  {
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },

  },
  { timestamps: true }
);

export interface IProfile {
  id: mongoose.ObjectId,
  firstname: string,
  lastname: string,
  accountId: mongoose.ObjectId,
}

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);