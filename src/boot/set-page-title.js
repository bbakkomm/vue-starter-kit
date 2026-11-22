export default function setPageTitle(router) {
  router.afterEach((to, _from, failure) => {
    if (failure) return
    document.title = to.meta.title ?? 'Vue 스타터 킷'
  })
}
