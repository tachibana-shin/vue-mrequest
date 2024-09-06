import {
  useDocumentVisibility,
  useIntervalFn,
  useOnline,
  type MaybeRefOrGetter
} from "@vueuse/core"
import { ref, watch } from "vue"

export interface OptionsPolling {
  pollingInterval: MaybeRefOrGetter<number>
  /** @default false **/
  pollingWhenHidden?: MaybeRefOrGetter<boolean>
  /** @default false **/
  pollingWhenOffline?: MaybeRefOrGetter<boolean>
}
export function usePolling(fn: () => unknown, options: OptionsPolling) {
  const { pause, resume, isActive } = useIntervalFn(
    fn,
    options.pollingInterval,
    { immediate: true }
  )
  watch(
    [
      options.pollingWhenHidden ? ref("visible") : useDocumentVisibility(),
      options.pollingWhenOffline ? ref(true) : useOnline()
    ],
    ([visible, online]) => {
      if (visible === "visible" && online) resume()
      else pause()
    },
    { immediate: true }
  )

  return { pause, resume, isActive }
}
