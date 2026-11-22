<script setup>
import { RouterLink } from 'vue-router'

import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <section class="rounded-lg border bg-card p-6 text-card-foreground sm:p-8">
      <h1 class="text-3xl font-bold tracking-tight">Vue 스타터 킷</h1>
      <p class="mt-2 text-sm text-muted-foreground">
        회사 프로젝트의 공통 개발 환경과 로컬 실행 방법을 확인하세요.
      </p>
      <Button as-child class="mt-5">
        <RouterLink :to="{ name: 'home', hash: '#getting-started' }">시작하기</RouterLink>
      </Button>
    </section>

    <section
      id="getting-started"
      aria-labelledby="getting-started-title"
      class="scroll-mt-6 rounded-lg border bg-card p-6 text-card-foreground sm:p-8"
    >
      <h2 id="getting-started-title" class="text-lg font-semibold">로컬 실행</h2>
      <p class="mt-2 text-sm text-muted-foreground">Node.js 24.15.0에서 아래 명령을 실행하세요.</p>
      <pre class="mt-4 overflow-x-auto rounded-md bg-muted px-4 py-3 text-sm"><code>npm ci
npm run dev</code></pre>
    </section>
  </div>
</template>
