import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const accountSchema = new Schema<IAccount>(
  {
    email: {
      type: String,
      required: true
    },
    profile: {
      type: Schema.Types.ObjectId,
    },
    identifier: {
      type: String,
    },
  },
  { timestamps: true }
);

export interface IAccount {
  id: string,
  email: string,
  profile: mongoose.ObjectId,
  identifier: string
}

export const Account = mongoose.model<IAccount>('Account', accountSchema);