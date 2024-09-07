import { toValue, type MaybeRefOrGetter } from "@vueuse/core"
import { getCurrentInstance, onUnmounted } from "vue"

export function useFetch<R, A extends any[]>(
  input: MaybeRefOrGetter<
    URL | RequestInfo | ((...args: A) => URL | RequestInfo)
  >,
  type: keyof Response = "json",
  init?: MaybeRefOrGetter<RequestInit | ((...args: A) => RequestInit)>
) {
  const instance = getCurrentInstance()
  const controller = instance ? new AbortController() : null
  if (instance) onUnmounted(() => controller!.abort())

  return (...args: A): Promise<R> => {
    const input$ = toValue(input)
    const init$ = toValue(init)

    const init$$ = typeof init$ === "function" ? init$(...args) : init$
    return fetch(
      typeof input$ === "function" ? input$(...args) : input$,
      controller
        ? {
            signal: controller.signal,
            ...init$$,
          }
        : init$$
    )
      .then((res) => (res.ok ? res : Promise.reject(res)))
      .then(async (res) => {
        const data = res[type]
        if (typeof data === "function") return data() as R

        return data as R
      })
  }
}
