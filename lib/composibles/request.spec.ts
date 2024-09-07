import { sleep } from "lib/sleep"
import { useRequest } from "./request"
import { nextTick, ref } from "vue"

describe("useRequest", () => {
  it("should work with default options", async () => {
    const fn = async () => "data"
    const { data, loading, error } = useRequest(fn)
    expect(data.value).toBeUndefined()
    expect(loading.value).toBe(true)
    expect(error.value).toBeUndefined()
    // await runAsync()
    await sleep(500)
    expect(data.value).toBe("data")
    expect(loading.value).toBe(false)
    expect(error.value).toBeUndefined()
  })

  it("should work with manual option", async () => {
    const fn = async () => "data"
    const { data, loading, error, runAsync } = useRequest(fn, { manual: true })
    expect(data.value).toBeUndefined()
    expect(loading.value).toBe(false)
    expect(error.value).toBeUndefined()
    await runAsync()
    expect(data.value).toBeDefined()
    expect(loading.value).toBe(false)
    expect(error.value).toBeUndefined()
  })

  it("should work with lazy option", async () => {
    const fn = async () => "data"
    const { data, loading, error } = useRequest(fn, { lazy: true })
    expect(loading.value).toBe(false)
    expect(error.value).toBeUndefined()
    expect(data.value).toBeUndefined()
    expect(loading.value).toBe(true)

    await Promise.resolve()

    expect(loading.value).toBe(false)
    expect(data.value).toBe("data")
  })

  it("should work with watch option", async () => {
    const count = ref(0)
    const fn = async () => {
      count.value
      await sleep(500)
      return `data ${count.value}`
    }
    const {
      data,
      loading,
      error,
      runAsync: run
    } = useRequest(fn, { watch: true })
    expect(data.value).toBeUndefined()
    expect(loading.value).toBe(true)
    expect(error.value).toBeUndefined()

    await sleep(700)

    expect(data.value).toBe("data 0")
    expect(loading.value).toBe(false)
    expect(error.value).toBeUndefined()

    count.value++

    await Promise.resolve()

    expect(loading.value).toBe(true)
    await sleep(700)

    expect(data.value).toBe("data 1")
  })

  it("should work with error retry", async () => {
    const fn = vi.fn(async () => {
      return Promise.reject(new Error("error"))
    })
    const {
      data,
      loading,
      error,
      runAsync: run
    } = useRequest(fn, { errorRetryCount: 2 })
    expect(data.value).toBeUndefined()
    expect(loading.value).toBe(true)
    expect(error.value).toBeUndefined()
    await sleep(3_000)
    expect(data.value).toBeUndefined()
    expect(loading.value).toBe(false)
    expect(error.value).toBeInstanceOf(Error)
  })
  
  it("should work with loading keep", async () => {
    const fn = async () => "data"
    const {
      data,
      loading,
      error,
      
    } = useRequest(fn, { loadingKeep: 1000 })
    expect(data.value).toBeUndefined()
    expect(loading.value).toBe(true)
    expect(error.value).toBeUndefined()
    await Promise.resolve()
    expect(data.value).toBe("data")
    expect(loading.value).toBe(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    expect(loading.value).toBe(false)
  })

  it("should work with mutate function", async () => {
    const fn = async () => "data"
    const { data, mutate } = useRequest(fn)
    expect(data.value).toBeUndefined()
    mutate("new data")
    expect(data.value).toBe("new data")
  })

  it("should work with initial data", async () => {
    const fn = async () => "data"
    const { data } = useRequest(fn, { initialData: "initial data" })
    expect(data.value).toBe("initial data")
  })
})
