import {
  computed,
  shallowRef,
  watchEffect,
  ref,
  watch,
  type MaybeRefOrGetter,
  type Ref
} from "vue"
import { globalOptions } from "../options"
import { retryAsync } from "ts-retry"
import { toValue } from "@vueuse/core"

export interface OptionsRequest<A, R> {
  manual?: boolean
  ready?: Ref<boolean> | (() => boolean)
  defaultParams?: A

  initialData?: R
  onSuccess?: (data: R) => void
  onError?: (error: unknown) => void

  errorRetryCount?: MaybeRefOrGetter<number>
  errorRetryInterval?: MaybeRefOrGetter<number>

  loadingKeep?: MaybeRefOrGetter<number>

  /** @description Enable watch depends in function request */
  watch?: boolean
  /**
   * @default false
   * @description Only trigger request after track get data
   */
  lazy?: boolean
}
export function useRequest<R, A extends any[]>(
  fn: (...args: A) => R | Promise<R>,
  options?: OptionsRequest<A, R>
) {
  const {
    manual,
    ready: ready$,
    defaultParams = [] as unknown as A,
    initialData,
    onSuccess,
    onError,

    errorRetryCount,
    errorRetryInterval,

    loadingKeep,

    watch: enabledWatch,
    lazy
  } = Object.assign({}, globalOptions, options) as OptionsRequest<A, R>
  const ready = typeof ready$ === "function" ? computed(ready$) : ready$

  const data = shallowRef<R | undefined>(initialData)
  const loading = ref(false)
  const error = ref<unknown>()

  async function runAsync$(...args: A): Promise<R> {
    if (manual && ready && !ready.value)
      throw new Error("useRequest not ready.")

    error.value = undefined
    loading.value = true
    try {
      data.value = await fn(...args)
      onSuccess?.(data.value)
      return data.value as R
    } catch (err) {
      error.value = err
      onError?.(err)
      throw err
    } finally {
      loading.value = false
    }
  }
  const runAsync$$ = errorRetryCount
    ? (...args: A) =>
        retryAsync<R>(() => runAsync$(...args), {
          maxTry: toValue(errorRetryCount),
          delay: toValue(errorRetryInterval)
        })
    : runAsync$
  const runAsync = loadingKeep
    ? (...args: A) => {
        const promise = runAsync$$(...args)
        Promise.race([
          promise,
          new Promise((resolve) => setTimeout(resolve, toValue(loadingKeep)))
        ]).then(() => (loading.value = false))

        return promise
      }
    : runAsync$$

  const run = (...args: A) => void runAsync(...args)

  if (!lazy) {
    if (!manual) {
      if (enabledWatch) watchEffect(() => run(...defaultParams))
      else run(...defaultParams)
    }
    if (ready && !manual)
      watch(ready, (ready, _, onCleanup) => {
        if (ready) {
          if (enabledWatch) onCleanup(watchEffect(() => run(...defaultParams)))
          else run(...defaultParams)
        }
      })
  }

  const mutate = (value: R) => (data.value = value)

  let inited = false
  return {
    data: lazy
      ? computed(() => {
          if (!inited) {
            inited = true
            if (enabledWatch) watchEffect(() => run(...defaultParams))
            else run(...defaultParams)
          }
          return data.value
        })
      : data,
    loading,
    error,
    run,
    runAsync,
    mutate
  }
}
