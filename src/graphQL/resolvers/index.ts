import { Account } from "../../models/account"
import { Channel } from "../../models/channel";
import { Message } from "../../models/message";
import { Profile } from "../../models/profile"
import { createCredential } from "../../veramo/create-credential";
import { agent } from "../../veramo/setup";

const throwError = () => {
  return new Error('Not allowed to run this operation')
}

export const resolvers = {
  Query: {
    allAccounts: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        return await Account.find();
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    account: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        const { id }: { id: string } = args;
        return await Account.findById(id);
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    allProfiles: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        return await Profile.find();
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    profile: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        const { id } = args;
        return await Profile.findById(id);
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    allMyChannels: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        const { accountId } = args.input;
        return await Channel.find({ participants: accountId })
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    channel: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        const { id } = args;
        return await Channel.findById(id);
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    allMessagesForChannel: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        const { id } = args;
        return await Message.find({ channelId: id });
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    message: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        const { id } = args;
        return await Message.findById(id);
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
  Mutation: {
    createAccount: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        const { email } = args.input;
        const account = new Account({ email });

        const identifier = await agent.didManagerCreate({
          alias: account._id,
          provider: 'did:ethr:rinkeby',
          kms: 'local'
        });
        account.identifierUrl = identifier.did;
        return await account.save();
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    createProfile: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        const { accountId, firstname, lastname } = args.input
        const profile = new Profile({ accountId, firstname, lastname })
        return await profile.save();
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    editAccount: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        const { accountId, email } = args.input;
        return await Account.findByIdAndUpdate(accountId, { email });
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    editProfile: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        const { profileId, firstname, lastname } = args.input;
        return await Profile.findByIdAndUpdate(profileId, { firstname, lastname });
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    publishCertificate: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        const { publisherId, publisherAccountId, receiverId, receiverAccountId } = args.input;
        // create certificate
        const credential = await createCredential(receiverId, publisherId, 'CodingDojo!')
        await Account.findByIdAndUpdate(receiverAccountId, { $push: { credential: { id: credential.credentialSubject.id, title: credential.credentialSubject.name } } });
        // add recipient to profile of publisher
        const publisherAccount = await Account.findById(publisherAccountId);
        if (publisherAccount) {
          const recipients = [...publisherAccount.certificateRecipients];
          recipients.push(receiverAccountId);
          await Account.updateOne({ id: publisherAccount.id }, { certificateRecipients: recipients })
        }

        // return certificate
        return 'success';
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    createChannel: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        const { ownerId, title } = args.input;
        const channel = new Channel({ ownerId, participants: [ownerId], title });
        return await channel.save();
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    createMessage: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        const { channelId, createdById, title, body } = args.input;
        const foundChannel = await Channel.findById(channelId);
        if (foundChannel && foundChannel.participants.includes(createdById)) {
          const message = new Message({ channelId, createdById, title, body });
          const createdMessage = await message.save();
          foundChannel.messages.push(createdMessage._id);
          await foundChannel.save();
          return createdMessage;
        } else throw new Error('You are not a participant of this channel')
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    addParticipant: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        const { participantId, ownerId, channelId } = args.input;
        const foundChannel = await Channel.findById(channelId);
        if (foundChannel && foundChannel.ownerId === ownerId) {
          foundChannel.participants.push(participantId);
          return await foundChannel.save();
        }
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
  Account: {
    profile: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        return await Profile.findById(parent.profileId);
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    channels: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        return await Channel.find({ participants: parent.id })
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    messages: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        return await Message.find({ createdBy: parent.id })
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
  Profile: {
    account: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        return await Account.findById(parent.accountId);
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Channel: {
    owner: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        return await Account.findById(parent.owner);
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    messages: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        return await Message.find({ _id: { $in: parent.messages } });
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    participants: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        return await Account.find({ _id: { $in: parent.participants } })
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
  Message: {
    channel: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        return await Channel.findById(parent.channel);
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    createdBy: async (parent: any, args: any, context: any) => {
      try {
        if (!context.authenticated) throwError();
        return await Account.findById(parent.createdBy);
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  }
}
