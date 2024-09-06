import { toValue } from "@vueuse/core"
import type { MaybeRefOrGetter } from "vue"

export interface OptionsCache {
  cacheKey: MaybeRefOrGetter<string>
  /** @default 600000 */
  cacheTime?: MaybeRefOrGetter<number>
  /** @default 0 */
  staleTime?: MaybeRefOrGetter<number>
}

const cacheStore = new Map<
  string,
  [result: unknown, created: number, cacheTime: number, staleTime: number]
>()
const weakRequestStore = new WeakMap<Function, Promise<unknown>>()
export function useCache<R, A extends any[]>(
  fn: (...args: A) => R | Promise<R>,
  options: OptionsCache
) {
  const refreshCache$ = async (args: A) => {
    const cacheKey = toValue(options.cacheKey)
    const cacheTime = toValue(options.cacheTime) ?? 600000
    const staleTime = toValue(options.staleTime) ?? 0
    const now = Date.now()
    const result = await fn(...args)

    cacheStore.set(cacheKey, [result, now, cacheTime, staleTime])

    return result
  }
  const refreshCache = (args: A) => {
    const cache = weakRequestStore.get(fn)
    if (cache) return cache as Promise<R>
    const response = refreshCache$(args)
    weakRequestStore.set(fn, response)

    return response
  }
  return async (...args: A): Promise<R> => {
    const cacheKey = toValue(options.cacheKey)
    const cache = cacheStore.get(cacheKey)
    const now = Date.now()

    if (cache && cache[1] + cache[2] >= now) {
      if (cache[1] + cache[3] < now) {
        void refreshCache(args)
      }
      return cache[0] as R
    }

    return refreshCache(args)
  }
}

export function clearCache(key?: string) {
  if (typeof key === "string") cacheStore.delete(key)
  else cacheStore.clear()
}
