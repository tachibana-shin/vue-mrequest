import {
  useDebounceFn,
  type DebounceFilterOptions,
  type MaybeRefOrGetter
} from "@vueuse/core"

export interface OptionsDebounce {
  debounceInterval: MaybeRefOrGetter<number>
  debounceOptions?: DebounceFilterOptions
}
/**
 * Debounces a function with the provided interval and options.
 * 
 * @template Fn - The type of the function to debounce.
 * @param {Fn} fn - The function to debounce.
 * @param {OptionsDebounce} options - The debounce options including interval and additional options.
 * @returns {void}
 */
export function useDebounce<Fn extends (...args: any[]) => any>(
  fn: Fn,
  options: OptionsDebounce
) {
  return useDebounceFn(fn, options.debounceInterval, options.debounceOptions)
}
