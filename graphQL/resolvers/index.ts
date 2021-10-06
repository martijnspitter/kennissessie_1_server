import { Account, IAccount } from "../../models/account"
import { Profile } from "../../models/profile"

const resolvers = {
  Query: {
    allAccounts: async () => {
      console.log('all account resolver')
      try {
        const accounts = await Account.find().lean()
        console.log(accounts)
        return accounts.map(async (account: IAccount) => {
          return {
            ...account,
            // myChannels: await channel(account.myChannels)
          }
        })
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    account: async (parent: any, args: any, context: any, info: any) => {
      try {
        const { id } = args;
        const account = await Account.findById(id).lean();
        if (account)
          return {
            ...account,
            profile: await Profile.findById(account.profile)
          }
        else return {};
      } catch (err) {
        console.log(err);
        throw err;
      }
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
        console.log(createdProfile)
        return {
          ...createdProfile,
          id: createdProfile._id,
          firstname: createdProfile.firstname,
          lastname: createdProfile.lastname,
          account: await Account.findById(createdProfile.account)
        }
      } catch (err) {
        console.log(err);
        throw err;
      }

    }
  }
}

module.exports = resolvers;