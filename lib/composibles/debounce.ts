import {
  useDebounceFn,
  type DebounceFilterOptions,
  type MaybeRefOrGetter
} from "@vueuse/core"

export interface OptionsDebounce {
  debounceInterval: MaybeRefOrGetter<number>
  debounceOptions?: DebounceFilterOptions
}
export function useDebounce(fn: () => unknown, options: OptionsDebounce) {
  return useDebounceFn(fn, options.debounceInterval, options.debounceOptions)
}
