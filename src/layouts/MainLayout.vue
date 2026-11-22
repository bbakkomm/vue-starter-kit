<script setup>
import { FlaskConical, House, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/app'

const app = useAppStore()
const route = useRoute()
const sidebarToggleLabel = computed(() =>
  app.sidebarCollapsed ? '사이드바 열기' : '사이드바 접기',
)
const navigation = [{ name: 'home', label: '홈', icon: House }]

if (import.meta.env.DEV) {
  navigation.push({ name: 'examples', label: '패키지 예제', icon: FlaskConical })
}
</script>

<template>
  <div
    class="min-h-screen bg-muted/40 md:grid md:grid-cols-[auto_minmax(0,1fr)] md:grid-rows-[auto_1fr]"
  >
    <header class="flex h-16 items-center gap-3 border-b bg-background px-4 sm:px-6 md:col-start-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="md:hidden"
        :aria-label="app.mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'"
        :aria-expanded="app.mobileMenuOpen"
        aria-controls="main-sidebar"
        @click="app.toggleMobileMenu()"
      >
        <Menu class="size-5" aria-hidden="true" />
      </Button>
      <span class="text-sm font-semibold">{{ route.meta.label }}</span>
    </header>

    <aside
      id="main-sidebar"
      class="border-b bg-background md:col-start-1 md:row-span-2 md:row-start-1 md:block md:border-b-0 md:border-r"
      :class="[
        app.mobileMenuOpen ? 'block' : 'hidden',
        app.sidebarCollapsed ? 'md:w-16' : 'md:w-56',
      ]"
    >
      <div
        class="flex h-16 items-center justify-between gap-2 border-b px-6"
        :class="app.sidebarCollapsed ? 'md:justify-center md:px-0' : 'md:pr-3'"
      >
        <span
          class="truncate text-sm font-semibold"
          :class="{ 'md:sr-only': app.sidebarCollapsed }"
        >
          스타터 킷
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          class="hidden shrink-0 md:inline-flex"
          :aria-label="sidebarToggleLabel"
          :aria-expanded="!app.sidebarCollapsed"
          :title="sidebarToggleLabel"
          aria-controls="main-sidebar"
          @click="app.toggleSidebar()"
        >
          <component
            :is="app.sidebarCollapsed ? PanelLeftOpen : PanelLeftClose"
            class="size-5"
            aria-hidden="true"
          />
        </Button>
      </div>
      <nav aria-label="주 메뉴" class="space-y-1 p-3" :class="{ 'md:px-2': app.sidebarCollapsed }">
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="{ name: item.name }"
          class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground aria-[current=page]:text-black"
          :class="{ 'md:justify-center md:px-0': app.sidebarCollapsed }"
          :title="app.sidebarCollapsed ? item.label : undefined"
          exact-active-class="bg-accent font-semibold"
          @click="app.closeMobileMenu()"
        >
          <component :is="item.icon" class="size-4 shrink-0" aria-hidden="true" />
          <span :class="{ 'md:sr-only': app.sidebarCollapsed }">{{ item.label }}</span>
        </RouterLink>
      </nav>
    </aside>

    <main class="min-w-0 px-5 py-8 sm:px-8 md:col-start-2">
      <RouterView />
    </main>
  </div>
</template>
