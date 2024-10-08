import { useThrottleFn, type MaybeRefOrGetter } from "@vueuse/core"

interface ThrottleFilterOptions {
  trailing?: boolean
  leading?: boolean
  rejectOnCancel?: boolean
}
export interface OptionsThrottle {
  throttleInterval: MaybeRefOrGetter<number>
  throttleOptions?: ThrottleFilterOptions
}
export function useThrottle<Fn extends (...args: any[]) => any>(fn: Fn, options: OptionsThrottle) {
  return useThrottleFn(
    fn,
    options.throttleInterval,
    options.throttleOptions?.trailing,
    options.throttleOptions?.leading,
    options.throttleOptions?.rejectOnCancel
  )
}
