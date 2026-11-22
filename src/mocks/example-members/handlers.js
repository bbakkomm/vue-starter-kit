import { Faker, en, ko } from '@faker-js/faker'
import { delay } from 'msw'
import { HttpResponse, http } from 'msw/http'

import { exampleMembersPath } from '@/api/example-members/paths'
import { exampleMemberSchema, exampleTeams } from '@/api/example-members/schema'

const faker = new Faker({ locale: [ko, en] })
faker.seed(24)

const members = Array.from({ length: 6 }, (_, index) => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: `member${index + 1}@example.test`,
  team: faker.helpers.arrayElement(exampleTeams),
}))

export const exampleMemberHandlers = [
  http.get(exampleMembersPath, async ({ request }) => {
    await delay(400)

    if (new URL(request.url).searchParams.get('fail') === '1') {
      return HttpResponse.json({ message: '모의 API 오류' }, { status: 503 })
    }

    return HttpResponse.json(members)
  }),

  http.post(exampleMembersPath, async ({ request }) => {
    await delay(300)

    const payload = await request.json().catch(() => null)
    const result = exampleMemberSchema.safeParse(payload)
    if (!result.success) return HttpResponse.json({ message: '입력값 오류' }, { status: 422 })
    if (members.some((member) => member.email === result.data.email)) {
      return HttpResponse.json({ message: '이미 등록된 이메일입니다.' }, { status: 409 })
    }

    const member = { id: faker.string.uuid(), ...result.data }
    members.unshift(member)
    return HttpResponse.json(member, { status: 201 })
  }),
]
