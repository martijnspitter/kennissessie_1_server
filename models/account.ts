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
      ref: 'Profile'
    },
    identifier: {
      type: String,
    },
    credential: [
      {
        title: String,
        id: String
      }
    ]
  },
  { timestamps: true }
);

export interface IAccount {
  id: mongoose.ObjectId,
  email: string,
  profile: mongoose.ObjectId,
  identifier: string,
  credential: { title: string, id: string }[],
}

export const Account = mongoose.model<IAccount>('Account', accountSchema);