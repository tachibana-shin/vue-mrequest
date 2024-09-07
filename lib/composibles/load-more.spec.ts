import { useLoadMore } from "./load-more"

describe("useLoadMore", () => {
  it("should initialize with default values", () => {
    const fn = async () => {
      return {
        list: [1, 2]
      }
    }
    const { data, dataList, loading, loadingMore, loadMore, refresh } =
      useLoadMore(fn)

    expect(data.value).toBeUndefined()
    expect(dataList).toEqual([])
    expect(loading.value).toBe(false)
    expect(loadingMore.value).toBe(true)
    expect(typeof loadMore).toBe("function")
    expect(typeof refresh).toBe("function")
  })

  it("should call the provided function with the correct arguments", async () => {
    const fn = vi.fn(() => Promise.resolve({ list: [], page: 1, total: 0 }))
    const { loadMore } = useLoadMore(fn)

    await loadMore()

    expect(fn).toHaveBeenCalledWith(undefined)
  })
})
