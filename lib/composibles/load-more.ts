import { ref, shallowReactive, shallowRef, watch } from "vue"
import { useRequest, type OptionsRequest } from "./request"

export function useLoadMore<
  R extends { list: unknown[]; page?: number; total?: number },
  A extends any[]
>(
  fn: (d: R | undefined, ...args: A) => R | Promise<R>,
  options?: OptionsRequest<A, R> & {
    isNoMore?: (d?: R) => boolean
  }
) {
  const noMore = ref(false)

  const dataList = shallowReactive<R["list"][number][]>([])
  const data = shallowRef<R>()

  const output = useRequest(async (...args: A) => {
    const data$ = await fn(data.value, ...args)

    if (options?.isNoMore?.(data.value)) noMore.value = true

    dataList.push(...data$.list)
    data.value = {
      ...data$,
      list: dataList
    }

    return data$
  }, options)

  const loading = ref(false)
  const watcher = watch(output.loading, (value) => {
    if (value) loading.value = value
    else {
      loading.value = value
      watcher()
    }
  })

  async function loadMore(...args: A) {
    if (noMore.value) return
    return output.runAsync(...args)
  }

  function refresh() {
    dataList.splice(0, dataList.length)
    return output.runAsync(...(options?.defaultParams ?? ([] as unknown as A)))
  }

  return {
    ...output,
    data,
    dataList,
    loadingMore: output.loading,
    loading,
    loadMore,
    refresh
  }

  //  noMore, loadMore, refresh
}
