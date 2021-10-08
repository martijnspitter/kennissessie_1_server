import { agent } from './setup'

export async function createIdentifier() {
  return await agent.didManagerCreate();
}
