import { setupWorker } from 'msw/browser'

import { exampleMemberHandlers } from './example-members/handlers'

const worker = setupWorker(...exampleMemberHandlers)
let startPromise

export function startExampleMocks() {
  startPromise ??= worker
    .start({
      serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
      onUnhandledFrame: 'bypass',
    })
    .catch((error) => {
      startPromise = undefined
      throw error
    })

  return startPromise
}
