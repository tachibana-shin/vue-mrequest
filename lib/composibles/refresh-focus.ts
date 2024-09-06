import {
  useDebounceFn,
  useWindowFocus,
  type MaybeRefOrGetter
} from "@vueuse/core"
import { watch } from "vue"

export interface OptionsRefreshFocus {
  /** @deprecated Default is true */
  refreshOnWindowFocus?: boolean
  refocusTimespan?: MaybeRefOrGetter<number>
}
export function useRefreshFocus(
  fn: () => unknown,
  options: OptionsRefreshFocus
) {
  const fn$ = options.refocusTimespan
    ? useDebounceFn(fn, options.refocusTimespan)
    : fn

  const focused = useWindowFocus()
  watch(focused, (focused) => {
    if (focused) fn$()
  })
}
