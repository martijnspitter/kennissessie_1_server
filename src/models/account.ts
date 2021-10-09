import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const accountSchema = new Schema<IAccount>(
  {
    email: {
      type: String,
      required: true
    },
    identifierUrl: {
      type: String,
    },
    credential: [
      {
        title: String,
        id: String
      }
    ],
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

export interface IAccount {
  id: mongoose.ObjectId,
  email: string,
  identifierUrl: string,
  credential: { title: string, id: string }[],
  certificateRecipients: mongoose.ObjectId[],
}

export const Account = mongoose.model<IAccount>('Account', accountSchema);