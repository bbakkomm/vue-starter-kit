import { api } from '../client'
import { exampleMembersPath } from './paths'

async function getExampleMembersUrl() {
  const { startExampleMocks } = await import('@/mocks/browser')
  await startExampleMocks()
  return new URL(exampleMembersPath, window.location.origin).href
}

export async function fetchExampleMembers({ signal, simulateError }) {
  const url = await getExampleMembersUrl()
  const { data } = await api.get(url, { signal, params: { fail: simulateError ? '1' : undefined } })
  return data
}

export async function createExampleMember(member) {
  const url = await getExampleMembersUrl()
  const { data } = await api.post(url, member)
  return data
}
