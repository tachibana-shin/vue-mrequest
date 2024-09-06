import { ref, watchEffect } from "vue"
import get from "lodash.get"
import { useRequest, type OptionsRequest } from "./request"

export interface OptionsPagination<
  CurrentKey,
  PageSizeKey,
  TotalKey,
  TotalPageKey
> {
  /** @default 'current' */
  currentKey?: CurrentKey
  /** @default 'pageSize' */
  pageSizeKey?: PageSizeKey
  /** @default 'total */
  totalKey?: TotalKey
  /** @default 'totalPage */
  totalPageKey?: TotalPageKey
}
export function usePagination<
  R,
  A extends any[],
  CurrentKey extends string = "current",
  PageSizeKey extends string = "pageSize",
  TotalKey extends string = "total",
  TotalPageKey extends string = "totalPage"
>(
  fn: (
    paginate: {
      [key in CurrentKey | PageSizeKey | TotalKey | TotalPageKey]: number
    },
    ...args: A
  ) => R | Promise<R>,
  options: Omit<OptionsRequest<A, R>, "defaultParams"> & {
    defaultParams?: [
      {
        [key in CurrentKey | PageSizeKey | TotalKey | TotalPageKey]?: number
      },
      A
    ]
  } & OptionsPagination<CurrentKey, PageSizeKey, TotalKey, TotalPageKey> = {}
) {
  const {
    currentKey = "current",
    pageSizeKey = "pageSize",
    totalKey = "total",
    totalPageKey = "totalPage",
    defaultParams
  } = options

  const current = ref(
    (defaultParams ? (get(defaultParams[0], currentKey) as number) : null) || 1
  )
  const pageSize = ref(
    (defaultParams ? (get(defaultParams[0], pageSizeKey) as number) : null) ||
      10
  )
  const total = ref(
    (defaultParams ? (get(defaultParams[0], totalKey) as number) : null) || 0
  )
  const totalPage = ref(
    (defaultParams ? (get(defaultParams[0], totalPageKey) as number) : null) ||
      0
  )

  const changeCurrent = ($current: number) => {
    current.value = $current
  }
  const changePageSize = ($pageSize: number) => {
    pageSize.value = $pageSize
  }
  const changePagination = ($current: number, $pageSize: number) => {
    current.value = $current
    pageSize.value = $pageSize
  }

  const paginate = new Proxy(
    {},
    {
      get(key) {
        switch (key) {
          case "current":
            return current.value
          case "pageSize":
            return pageSize.value
          case "total":
            return total.value
          case "totalPage":
            return totalPage.value
        }
      }
    }
  ) as unknown as any

  const output = useRequest(
    (...args: A) => {
      return fn(paginate, ...args)
    },
    {
      ...options,
      defaultParams: defaultParams?.[1]
    }
  )

  watchEffect(() => {
    if (!output.data.value) return

    const $current = get(output.data.value, currentKey)
    const $pageSize = get(output.data.value, pageSizeKey)
    const $total = get(output.data.value, totalKey)
    const $totalPage = get(output.data.value, totalPageKey)

    if (typeof $current === "number") current.value = $current
    if (typeof $pageSize === "number") pageSize.value = $pageSize
    if (typeof $total === "number") {
      total.value = $total
      if (typeof $totalPage !== "number")
        totalPage.value = Math.ceil(total.value / pageSize.value)
    }
    if (typeof $totalPage === "number") {
      totalPage.value = $totalPage
      if (typeof $total !== "number")
        total.value = pageSize.value * totalPage.value
    }
  })

  return {
    ...output,
    current,
    pageSize,
    total,
    totalPage,
    changeCurrent,
    changePageSize,
    changePagination
  }
}
