import { z } from 'zod'

export const exampleTeams = ['플랫폼팀', '서비스팀', '운영팀']

export const exampleMemberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, '이름을 두 글자 이상 입력하세요.')
    .max(30, '이름은 30자까지 입력할 수 있습니다.'),
  email: z.string().trim().email('올바른 이메일 주소를 입력하세요.').toLowerCase(),
  team: z.enum(exampleTeams),
})
