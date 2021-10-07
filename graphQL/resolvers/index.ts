import { Account } from "../../models/account"
import { Profile } from "../../models/profile"

const resolvers = {
  Query: {
    allAccounts: async () => {
      try {
        return await Account.find().lean();
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    account: async (parent: any, args: any) => {
      try {
        const { id } = args;
        return await Account.findById(id).lean();
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    allProfiles: async (parent: any, args: any, context: any, info: any) => {
      try {
        return await Profile.find().lean();
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    profile: async (parent: any, args: any, context: any, info: any) => {
      try {
        const { id } = args;
        return await Profile.findById(id).lean();
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
          return await Account.find({ _id: { $in: profile.certificateRecipients } }).lean();
        } else return [];

      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    validate: async (parent: any, args: any, context: any, info: any) => {
      const { certificate, publisherIdentity, publisherAccountId } = args.input;
      // validate certificate here
      return true;
    }
  },
  Mutation: {
    createAccount: async (parent: any, args: any, context: any, info: any) => {
      try {
        const { email } = args.input;
        const account = new Account({ email });
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
        return Account.findByIdAndUpdate(account, { profile: createdProfile.id });
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    editAccount: async (parent: any, args: any, context: any, info: any) => {
      try {
        const { accountId, email } = args.input;
        return await Account.findByIdAndUpdate(accountId, { email }).lean();
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
      const { publisherIdentity, receiverIdentity, publisherAccountId, receiverAccountId } = args.input;
      // create certificate

      // add recipient to profile of publisher
      const publisherAccount = await Account.findById(publisherAccountId).lean();
      if (publisherAccount) {
        const publisherProfile = await Profile.findById(publisherAccount.profile).lean();
        if (publisherProfile) {
          const recipients = [...publisherProfile.certificateRecipients];
          recipients.push(receiverAccountId);
          await Profile.updateOne({ id: publisherProfile.id }, { certificateRecipients: recipients })
        }
      }

      // return certificate
      return 'success';
    }
  },
  Account: {
    profile: async (parent: any, args: any) => {
      return await Profile.findById(parent.profile).lean();
    }
  },
  Profile: {
    account: async (parent: any) => {
      return await Account.findById(parent.account).lean();
    },
    certificateRecipients: async (parent: any) => {
      return await Account.find({ _id: { $in: parent.certificateRecipients } }).lean();
    }
  }
}

module.exports = resolvers;