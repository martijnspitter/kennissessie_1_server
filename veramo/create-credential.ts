import { agent } from './setup';

export const createCredential = async (receiverId: string, publisherId: string, value: string) => {
  const credential = {
    issuer: { id: publisherId },
    credentialSubject: { id: receiverId, name: value }
  }
  const savedCredential = await agent.createVerifiableCredential({ credential, proofFormat: 'jwt' })
  await agent.dataStoreSaveVerifiableCredential({ verifiableCredential: savedCredential })
  return savedCredential;
};