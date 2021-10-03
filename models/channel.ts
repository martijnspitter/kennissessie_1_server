import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const channelSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    twilioId: {
      type: String,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'Account'
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Account'
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Channel', channelSchema);