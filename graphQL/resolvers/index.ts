import { Account } from "../../models/account"
import { Channel } from "../../models/channel";
import { Message } from "../../models/message";
import { Profile } from "../../models/profile"
import { createCredential } from "../../veramo/create-credential";
import { agent } from "../../veramo/setup";

const resolvers = {
  Query: {
    allAccounts: async () => {
      try {
        return await Account.find();
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    account: async (parent: any, args: any) => {
      try {
        const { id } = args;
        return await Account.findById(id);
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    allProfiles: async (parent: any, args: any, context: any, info: any) => {
      try {
        return await Profile.find();
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    profile: async (parent: any, args: any, context: any, info: any) => {
      try {
        const { id } = args;
        return await Profile.findById(id);
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    certificateRecipients: async (parent: any, args: any, context: any, info: any) => {
      try {
        const { id } = args;
        const profile = await Profile.findById(id);
        if (profile) {
          return await Account.find({ _id: { $in: profile.certificateRecipients } });
        } else return [];

      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    allMyChannels: async (parent: any, args: any, context: any, info: any) => {
      const { accountId } = args.input;
      return await Channel.find({ participants: accountId })
    },
    channel: async (parent: any, args: any, context: any, info: any) => {
      const { id } = args;
      return await Channel.findById(id);
    },
    allMessagesForChannel: async (parent: any, args: any, context: any, info: any) => {
      const { id } = args;
      return await Message.find({ channel: id });
    },
    message: async (parent: any, args: any, context: any, info: any) => {
      const { id } = args;
      return await Message.findById(id);
    }
  },
  Mutation: {
    createAccount: async (parent: any, args: any, context: any, info: any) => {
      try {
        const { email } = args.input;
        const account = new Account({ email });

        const identifier = await agent.didManagerCreate({
          alias: account._id,
          provider: 'did:ethr:rinkeby',
          kms: 'local'
        });
        account.identifier = identifier.did;
        return await account.save();
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    createProfile: async (parent: any, args: any, context: any, info: any) => {
      try {
        const { account, firstname, lastname } = args.input
        const profile = new Profile({ account, firstname, lastname })
        const createdProfile = await profile.save();
        await Account.findByIdAndUpdate(account, { profile: createdProfile._id });
        return createdProfile;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    editAccount: async (parent: any, args: any, context: any, info: any) => {
      try {
        const { accountId, email } = args.input;
        return await Account.findByIdAndUpdate(accountId, { email });
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    editProfile: async (parent: any, args: any, context: any, info: any) => {
      try {
        const { profileId, firstname, lastname } = args.input;
        return await Profile.findByIdAndUpdate(profileId, { firstname, lastname });
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    publishCertificate: async (parent: any, args: any, context: any, info: any) => {
      const { publisherId, publisherAccountId, receiverId, receiverAccountId } = args.input;
      // create certificate
      const credential = await createCredential(receiverId, publisherId, 'CodingDojo!')
      console.log(credential);
      await Account.findByIdAndUpdate(receiverAccountId, { $push: { credential: { id: credential.credentialSubject.id, title: credential.credentialSubject.name } } });
      // add recipient to profile of publisher
      const publisherAccount = await Account.findById(publisherAccountId);
      if (publisherAccount) {
        const publisherProfile = await Profile.findById(publisherAccount.profile);
        if (publisherProfile) {
          const recipients = [...publisherProfile.certificateRecipients];
          recipients.push(receiverAccountId);
          await Profile.updateOne({ id: publisherProfile.id }, { certificateRecipients: recipients })
        }
      }

      // return certificate
      return 'success';
    },
    createChannel: async (parent: any, args: any, context: any, info: any) => {
      const { owner, title } = args.input;
      const channel = new Channel({ owner, participants: [owner], title });
      return await channel.save();
    },
    createMessage: async (parent: any, args: any, context: any, info: any) => {
      const { channel, createdBy, title, body } = args.input;
      const foundChannel = await Channel.findById(channel);
      if (foundChannel && foundChannel.participants.includes(createdBy)) {
        const message = new Message({ channel, createdBy, title, body });
        const createdMessage = await message.save();
        foundChannel.messages.push(createdMessage._id);
        await foundChannel.save();
        return createdMessage;
      }

    },
    addParticipant: async (parent: any, args: any, context: any, info: any) => {
      const { participant, owner, channel } = args.input;
      const foundChannel = await Channel.findById(channel);
      if (foundChannel && foundChannel.owner === owner) {
        foundChannel.participants.push(participant);
        return await foundChannel.save();
      }
    }
  },
  Account: {
    profile: async (parent: any, args: any) => {
      return await Profile.findById(parent.profile);
    },
    channels: async (parent: any) => {
      return await Channel.find({ participants: parent.id })
    },
    messages: async (parent: any) => {
      return await Message.find({ createdBy: parent.id })
    }
  },
  Profile: {
    account: async (parent: any) => {
      return await Account.findById(parent.account);
    },
    certificateRecipients: async (parent: any) => {
      return await Account.find({ _id: { $in: parent.certificateRecipients } });
    }
  },
  Channel: {
    owner: async (parent: any) => {
      return await Account.findById(parent.owner);
    },
    messages: async (parent: any) => {
      return await Message.find({ _id: { $in: parent.messages } });
    },
    participants: async (parent: any) => {
      return await Account.find({ _id: { $in: parent.participants } })
    }
  },
  Message: {
    channel: async (parent: any) => {
      return await Channel.findById(parent.channel);
    },
    createdBy: async (parent: any) => {
      return await Account.findById(parent.createdBy);
    }
  }
}

module.exports = resolvers;