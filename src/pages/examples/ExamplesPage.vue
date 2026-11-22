<script setup>
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toTypedSchema } from '@vee-validate/zod'
import { refDebounced, usePreferredReducedMotion } from '@vueuse/core'
import { gsap } from 'gsap'
import { CircleAlert, Play, Plus, RefreshCw, Search } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import { createExampleMember, fetchExampleMembers } from '@/api/example-members/requests'
import { exampleMemberSchema, exampleTeams } from '@/api/example-members/schema'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/app'

const app = useAppStore()
const queryClient = useQueryClient()
const search = ref('')
const debouncedSearch = refDebounced(search, 250)
const simulateError = ref(false)

const memberQueryKey = ['starter-example-members']
const {
  data: members,
  isPending,
  isError,
  isFetching,
  refetch,
} = useQuery({
  queryKey: [...memberQueryKey, simulateError],
  queryFn: ({ signal, queryKey }) => fetchExampleMembers({ signal, simulateError: queryKey[1] }),
  retry: false,
})

const filteredMembers = computed(() => {
  const term = debouncedSearch.value.trim().toLowerCase()
  return (members.value ?? []).filter(({ name, email, team }) =>
    [name, email, team].some((value) => value.toLowerCase().includes(term)),
  )
})

const reduceMotion = usePreferredReducedMotion()
const memberTable = ref(null)
let rowAnimation

function playRows() {
  rowAnimation?.revert()
  if (!memberTable.value || reduceMotion.value === 'reduce') return

  rowAnimation = gsap.context(() => {
    gsap.from('[data-member-row]', {
      autoAlpha: 0,
      y: 7,
      duration: 0.28,
      stagger: 0.035,
      clearProps: 'opacity,visibility,transform',
    })
  }, memberTable.value)
}

watch(members, playRows, { flush: 'post' })
onBeforeUnmount(() => rowAnimation?.revert())

const { defineField, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(exampleMemberSchema),
  initialValues: { name: '', email: '', team: exampleTeams[0] },
})
const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [team, teamAttrs] = defineField('team')
const feedback = ref(null)

const { mutateAsync } = useMutation({
  mutationFn: createExampleMember,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: memberQueryKey }),
})

const submitMember = handleSubmit(
  async (member, { resetForm, setFieldError }) => {
    feedback.value = null
    try {
      await mutateAsync(member)
      resetForm()
      feedback.value = { error: false, message: '팀원이 등록되었습니다.' }
    } catch (error) {
      if (error.response?.status === 409) {
        setFieldError('email', '이미 등록된 이메일입니다.')
      } else {
        feedback.value = { error: true, message: '팀원을 등록하지 못했습니다. 다시 시도하세요.' }
      }
    }
  },
  () => {
    feedback.value = null
  },
)
</script>

<template>
  <div class="mx-auto max-w-7xl space-y-6">
    <header>
      <h1 class="text-3xl font-bold tracking-tight">팀원 관리</h1>
      <p class="mt-2 break-keep text-sm text-muted-foreground">
        개발용 모의 API로 팀원을 조회하고 등록할 수 있습니다.
      </p>
    </header>

    <div class="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <section
        class="min-w-0 overflow-hidden rounded-lg border bg-card"
        aria-labelledby="member-list-title"
      >
        <div class="space-y-4 border-b p-5">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="member-list-title" class="text-lg font-semibold">팀원 목록</h2>
              <p v-if="members" class="mt-1 text-sm text-muted-foreground" aria-live="polite">
                전체 {{ members.length }}명 중 {{ filteredMembers.length }}명 표시
              </p>
            </div>
            <Button variant="outline" size="sm" :disabled="isFetching" @click="refetch()">
              <RefreshCw class="mr-2 size-4" aria-hidden="true" />
              다시 조회
            </Button>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <label class="relative min-w-36 flex-1">
              <span class="sr-only">팀원 검색</span>
              <Search
                class="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="member-search"
                v-model="search"
                type="search"
                placeholder="이름, 이메일, 팀 검색"
                class="example-field example-search"
              />
            </label>
            <Button
              :variant="simulateError ? 'secondary' : 'outline'"
              size="sm"
              :aria-pressed="simulateError"
              @click="simulateError = !simulateError"
            >
              오류 응답
            </Button>
            <Button
              variant="outline"
              size="sm"
              :disabled="!filteredMembers.length || reduceMotion === 'reduce'"
              @click="playRows"
            >
              <Play class="mr-2 size-4" aria-hidden="true" />
              모션 재생
            </Button>
          </div>
        </div>

        <p v-if="isPending" class="p-6 text-sm text-muted-foreground" role="status">
          목록을 불러오는 중입니다.
        </p>
        <div v-else-if="isError" class="flex gap-3 p-6 text-sm text-destructive" role="alert">
          <CircleAlert class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div>
            <p class="font-semibold">팀원 목록을 불러오지 못했습니다.</p>
            <p class="mt-1 text-muted-foreground">
              {{
                simulateError
                  ? '오류 응답을 끄면 정상 목록을 조회합니다.'
                  : '다시 조회를 선택하세요.'
              }}
            </p>
          </div>
        </div>
        <p
          v-else-if="!filteredMembers.length"
          class="p-6 text-sm text-muted-foreground"
          role="status"
        >
          표시할 팀원이 없습니다.
        </p>
        <div v-else class="overflow-x-auto overflow-y-hidden">
          <table ref="memberTable" class="w-full min-w-[26rem] text-left text-sm">
            <caption class="sr-only">
              등록된 팀원
            </caption>
            <thead class="bg-muted/40 text-muted-foreground">
              <tr>
                <th scope="col" class="px-5 py-3 font-medium">이름</th>
                <th scope="col" class="px-5 py-3 font-medium">이메일</th>
                <th scope="col" class="px-5 py-3 font-medium">팀</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="member in filteredMembers" :key="member.id" data-member-row>
                <td class="whitespace-nowrap px-5 py-4 font-medium">{{ member.name }}</td>
                <td class="whitespace-nowrap px-5 py-4 text-muted-foreground">
                  {{ member.email }}
                </td>
                <td class="whitespace-nowrap px-5 py-4">{{ member.team }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div class="min-w-0 space-y-5">
        <section class="rounded-lg border bg-card p-5" aria-labelledby="member-form-title">
          <h2 id="member-form-title" class="text-lg font-semibold">팀원 등록</h2>
          <form class="mt-5 space-y-4" novalidate @submit="submitMember">
            <div class="space-y-1.5">
              <label for="member-name" class="text-sm font-medium">이름</label>
              <input
                id="member-name"
                v-model="name"
                v-bind="nameAttrs"
                class="example-field"
                placeholder="예시 이름"
                :aria-invalid="Boolean(errors.name)"
                :aria-describedby="errors.name ? 'member-name-error' : undefined"
              />
              <p v-if="errors.name" id="member-name-error" class="text-sm text-destructive">
                {{ errors.name }}
              </p>
            </div>

            <div class="space-y-1.5">
              <label for="member-email" class="text-sm font-medium">이메일</label>
              <input
                id="member-email"
                v-model="email"
                v-bind="emailAttrs"
                type="email"
                class="example-field"
                placeholder="member@example.test"
                :aria-invalid="Boolean(errors.email)"
                :aria-describedby="errors.email ? 'member-email-error' : undefined"
              />
              <p v-if="errors.email" id="member-email-error" class="text-sm text-destructive">
                {{ errors.email }}
              </p>
            </div>

            <div class="space-y-1.5">
              <label for="member-team" class="text-sm font-medium">소속 팀</label>
              <select id="member-team" v-model="team" v-bind="teamAttrs" class="example-field">
                <option v-for="item in exampleTeams" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>

            <Button type="submit" class="w-full" :disabled="isSubmitting">
              <Plus class="mr-2 size-4" aria-hidden="true" />
              {{ isSubmitting ? '등록 중' : '팀원 추가' }}
            </Button>

            <p
              v-if="feedback"
              :role="feedback.error ? 'alert' : 'status'"
              class="text-sm"
              :class="
                feedback.error ? 'text-destructive' : 'text-emerald-700 dark:text-emerald-400'
              "
            >
              {{ feedback.message }}
            </p>
          </form>
        </section>

        <aside class="rounded-lg border bg-card p-5">
          <div class="flex items-center justify-between gap-3 text-sm">
            <h2 class="font-semibold">사이드바 설정</h2>
            <span class="text-muted-foreground">{{ app.sidebarCollapsed ? '접힘' : '펼침' }}</span>
          </div>
          <p class="mt-2 break-keep text-sm text-muted-foreground">
            PC에서 사이드바를 접고 새로고침해 보세요. 접힘 상태가 유지됩니다.
          </p>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.example-field {
  @apply w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring;
}

.example-search {
  @apply h-9 pl-9;
}

.example-field[aria-invalid='true'] {
  @apply border-destructive;
}
</style>
