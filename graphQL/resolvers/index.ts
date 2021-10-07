import { Schema } from "mongoose"
import { Account, IAccount } from "../../models/account"
import { IProfile, Profile } from "../../models/profile"
import { getAccount, getAccounts, getProfile } from "./helper"

const resolvers = {
  Query: {
    allAccounts: async () => {
      console.log('all account resolver')
      try {
        const accounts = await Account.find().lean()
        return accounts.map(async (account: IAccount) => {
          return {
            ...account,
            profile: getProfile(account.profile as Schema.Types.ObjectId)
          }
        })
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    account: async (parent: any, args: any) => {
      try {
        const { id } = args;
        const account = await Account.findById(id).lean();
        if (account)
          return {
            ...account,
            profile: getProfile(account.profile as Schema.Types.ObjectId)
          }
        else return {};
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    allProfiles: async (parent: any, args: any, context: any, info: any) => {
      try {
        const profiles = await Profile.find().lean();
        return profiles.map(async (profile: IProfile) => {
          return {
            ...profile,
            account: getAccount(profile.account as Schema.Types.ObjectId),
            certificateRecipients: getAccounts(profile.certificateRecipients as Schema.Types.ObjectId[])
          }
        })
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    profile: async (parent: any, args: any, context: any, info: any) => {
      try {
        const { id } = args;
        const profile = await Profile.findById(id).lean();
        if (profile)
          return {
            ...profile,
            account: getAccount(profile.account as Schema.Types.ObjectId),
          }
        else return {}
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
          const recipients = await Profile.find({ _id: { $in: profile.certificateRecipients } }).lean()
          return recipients.map(async (recipient: IProfile) => {
            return {
              ...profile,
              account: getAccount(profile.account as Schema.Types.ObjectId),
            }
          })
        } else return [];

      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    validate: async (parent: any, args: any, context: any, info: any) => {
      const { certificate, publisherIdentity } = args.input;
      // validate certificate here
      return true;
    }
  },
  Mutation: {
    createAccount: async (parent: any, args: any, context: any, info: any) => {
      console.log(args)
      console.log(args.input)
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
        await Account.findByIdAndUpdate(account, { profile: createdProfile.id });
        return {
          ...createdProfile,
          id: createdProfile._id,
          firstname: createdProfile.firstname,
          lastname: createdProfile.lastname,
          account: getAccount(profile.account as Schema.Types.ObjectId),
        }
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    editAccount: async (parent: any, args: any, context: any, info: any) => {
      try {
        const { accountId, email } = args.input;
        const account = await Account.findByIdAndUpdate(accountId, { email }).lean();
        if (account)
          return {
            ...account,
            profile: getProfile(account.profile as Schema.Types.ObjectId)
          }
        else return {};
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    editProfile: async (parent: any, args: any, context: any, info: any) => {
      try {
        const { profileId, firstname, lastname } = args.input;
        const profile = await Profile.findByIdAndUpdate(profileId, { firstname, lastname });
        if (profile)
          return {
            ...profile,
            account: getAccount(profile.account as Schema.Types.ObjectId),
          }
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },

}

module.exports = resolvers;