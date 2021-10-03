import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    myChannels: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Channel'
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Account', accountSchema);