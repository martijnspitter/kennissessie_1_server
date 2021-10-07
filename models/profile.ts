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
    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    certificateRecipients: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: false
      }
    ]
  },
  { timestamps: true }
);

export interface IProfile {
  firstname: string,
  lastname: string,
  account: mongoose.ObjectId | IAccount | null,
  certificateRecipients: mongoose.ObjectId[] | IAccount[] | null[];
}

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);