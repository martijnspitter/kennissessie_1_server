import mongoose from 'mongoose';

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
      required: true
    },
    certificateRecipients: [
      {
        type: Schema.Types.ObjectId,
        required: false
      }
    ]
  },
  { timestamps: true }
);

export interface IProfile {
  firstname: string,
  lastname: string,
  account: mongoose.ObjectId,
  certificateRecipients: mongoose.ObjectId[];
}

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);