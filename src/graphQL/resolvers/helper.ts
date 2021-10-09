import { Schema } from "mongoose";
import { Account, IAccount } from "../../models/account"
import { IProfile, Profile } from "../../models/profile"

export const getAccount = async (id: Schema.Types.ObjectId): Promise<any> => {
  console.log('getting account')
  const account: IAccount | null = await Account.findById(id).lean();
  if (account)
    return {
      ...account,
      profile: getProfile(account.profile as Schema.Types.ObjectId)
    }
  else return null;
}

export const getProfile = async (id: Schema.Types.ObjectId): Promise<any> => {
  const profile: IProfile | null = await Profile.findById(id).lean();
  if (profile)
    return {
      ...profile,
      account: getAccount(profile.account as Schema.Types.ObjectId)
    }
  else return null;
}

export const getAccounts = async (ids: Schema.Types.ObjectId[]): Promise<any[]> => {
  const accounts = await Account.find({ _id: { $in: ids } }).lean();
  return accounts.map(async (account: IAccount) => {
    return {
      ...account,
      profile: getProfile(account.profile as Schema.Types.ObjectId)
    }
  })
}

export const getProfiles = async (ids: Schema.Types.ObjectId[]): Promise<any[]> => {
  const profiles = await Profile.find({ _id: { $in: ids } }).lean();
  return profiles.map(async (profile: IProfile) => {
    return {
      ...profile,
      account: getAccount(profile.account as Schema.Types.ObjectId),
      certificateRecipients: getAccounts(profile.certificateRecipients as Schema.Types.ObjectId[])
    }
  })
}