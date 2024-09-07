import { sleep } from "lib/sleep"
import {
  cacheStore,
  useCache,
  weakRequestStore,
  type OptionsCache
} from "./cache"
describe("useCache", () => {
  beforeEach(() => {
    cacheStore.clear()
  })

  it("should hit cache with valid cache time", async () => {
    const fn = vi.fn(async () => {
      await sleep(1_000)
      return "result"
    })
    const options: OptionsCache = { cacheKey: "key", cacheTime: 10000 }
    const useCacheResult = useCache(fn, options)
    const result1 = await useCacheResult()
    const result2 = await Promise.race([useCacheResult(), sleep(500)])

    expect(result1).toBe("result")
    expect(result2).toBe("result")
    expect(cacheStore.get("key")).toBeDefined()
    expect(fn.mock.calls.length).toBe(2)
  })

  it("should hit cache with invalid cache time", async () => {
    const fn = vi.fn(async () => {
      await sleep(1_000)
      return "result"
    })
    const options: OptionsCache = { cacheKey: "key", cacheTime: 1000 }
    const useCacheResult = useCache(fn, options)
    const result1 = await useCacheResult()
    const result2 = await Promise.race([useCacheResult(), sleep(500)])

    expect(result1).toBe("result")
    expect(result2).toBe(undefined)
    expect(cacheStore.get("key")).toBeUndefined()
    expect(fn.mock.calls.length).toBe(2)
  })

  it("should miss cache with expired cache time", async () => {
    const fn = vi.fn(async () => "result")
    const options: OptionsCache = { cacheKey: "key", cacheTime: 1000 }
    const useCacheResult = useCache(fn, options)
    const result1 = await useCacheResult()
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const result2 = await useCacheResult()
    expect(result1).toBe("result")
    expect(result2).toBe("result")
    expect(fn.mock.calls.length).toBe(2)
  })

  it("should miss cache with no cache time", async () => {
    const fn = async () => "result"
    const options: OptionsCache = { cacheKey: "key", cacheTime: 0 }
    const useCacheResult = useCache(fn, options)
    const result1 = await useCacheResult()
    const result2 = await useCacheResult()
    expect(result1).toBe("result")
    expect(result2).toBe("result")
    expect(cacheStore.get("key")).toBeUndefined()
  })

  it("should refresh cache with stale time", async () => {
    const fn = async () => "result"
    const options: OptionsCache = {
      cacheKey: "key",
      cacheTime: 1000,
      staleTime: 500
    }
    const useCacheResult = useCache(fn, options)
    const result1 = await useCacheResult()
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const result2 = await useCacheResult()
    expect(result1).toBe("result")
    expect(result2).toBe("result")
    expect(cacheStore.get("key")).toBeDefined()
  })

  it("should refresh cache with no stale time", async () => {
    const fn = vi.fn(async () => {
      await sleep(1_000)
      return "result"
    })
    const options: OptionsCache = { cacheKey: "key", cacheTime: 1000 }
    const useCacheResult = useCache(fn, options)
    const result1 = await useCacheResult()
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const result2 = await Promise.race([useCacheResult(), sleep(500)])
    expect(result1).toBe("result")
    expect(result2).toBe(undefined)
    // expect(cacheStore.get("key")).toBeUndefined()
  })

  it("should store and retrieve cache correctly", async () => {
    const fn = async () => "result"
    const options: OptionsCache = { cacheKey: "key", cacheTime: 1000 }
    const useCacheResult = useCache(fn, options)
    const result1 = useCacheResult()
    expect(weakRequestStore.get(fn)).toBeDefined()
    await result1
    expect(cacheStore.get("key")).toBeDefined()
  })
})
