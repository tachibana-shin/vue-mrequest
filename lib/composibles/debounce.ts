import {
  useDebounceFn,
  type DebounceFilterOptions,
  type MaybeRefOrGetter
} from "@vueuse/core"

export interface OptionsDebounce {
  debounceInterval: MaybeRefOrGetter<number>
  debounceOptions?: DebounceFilterOptions
}
export function useDebounce<Fn extends (...args: any[]) => any>(
  fn: Fn,
  options: OptionsDebounce
) {
  return useDebounceFn(fn, options.debounceInterval, options.debounceOptions)
}
