import { Schema } from "mongoose"
import { Account, IAccount } from "../../models/account"
import { IProfile, Profile } from "../../models/profile"
import { getAccount, getAccounts, getProfile } from "./helper"

const resolvers = {
  Query: {
    allAccounts: async (parent: any, args: any, context: any, info: any) => {
      console.log('parent', parent)
      console.log('args', args)
      console.log('context', context)
      console.log('info', info)
      try {
        return await Account.find().lean()
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
        return await Account.findByIdAndUpdate(accountId, { email }).lean();
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
}

module.exports = resolvers;