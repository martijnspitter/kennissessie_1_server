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
  },
}

module.exports = resolvers;