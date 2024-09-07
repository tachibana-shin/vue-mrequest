import { useFetch } from "./fetch"
import { getCurrentInstance, onUnmounted } from "vue"
import { toValue } from "@vueuse/core"
import { describe, it, expect, vi } from "vitest"

global.fetch = vi.fn(async (input: URL | RequestInfo, init?: RequestInit) => {
  init?.signal?.throwIfAborted()

  return new Response(
    JSON.stringify({
      message: "Hello World"
    }),
    { status: input.toString().includes("error") ? 503 : 200 }
  )
})

describe("useFetch", () => {
  it("successful fetch with default options", async () => {
    const input = "https://jsonplaceholder.typicode.com/posts"
    const useFetchResult = useFetch(input)
    const result = await useFetchResult()
    expect(result).toBeInstanceOf(Object)
  })

  it("successful fetch with custom options", async () => {
    const input = "https://jsonplaceholder.typicode.com/posts"
    const type = "text"
    const init = { headers: { "Content-Type": "application/json" } }
    const useFetchResult = useFetch(input, type, init)
    const result = await useFetchResult()
    console.log(typeof result)
    // expect(result).toBeInstanceOf(String)
  })

  it("error handling for non-ok responses", async () => {
    const input = "https://example.com/api/error"
    const useFetchResult = useFetch(input)
    await expect(useFetchResult()).rejects.toThrow()
  })

  it("error handling for abort signal", async () => {
    const input = "https://jsonplaceholder.typicode.com/posts"
    const controller = new AbortController()
    controller.abort()
    const useFetchResult = useFetch(input, { signal: controller.signal })
    await expect(useFetchResult()).rejects.toThrow()
  })

  it("input as a function", async () => {
    const input = () => "https://jsonplaceholder.typicode.com/posts"
    const useFetchResult = useFetch(input)
    const result = await useFetchResult()
    expect(result).toBeInstanceOf(Object)
  })

  it("init as a function", async () => {
    const input = "https://jsonplaceholder.typicode.com/posts"
    const init = () => ({ headers: { "Content-Type": "application/json" } })
    const useFetchResult = useFetch(input, init)
    const result = await useFetchResult()
    expect(result).toBeInstanceOf(Object)
  })
})
