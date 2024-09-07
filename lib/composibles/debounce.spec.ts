import { useDebounce } from "./debounce"
import { useDebounceFn } from "@vueuse/core"
import type { OptionsDebounce } from "./debounce"

describe("useDebounce", () => {
  it("debounces a function with valid interval and options", async () => {
    const fn = vi.fn(() => "result")
    const options: OptionsDebounce = { debounceInterval: 1000 }
    const debouncedFn = useDebounce(fn, options)
    debouncedFn()
    expect(fn).not.toHaveBeenCalled()
    await new Promise((resolve) => setTimeout(resolve, 1000))
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it("debounces multiple calls within the debounce interval", async () => {
    const fn = vi.fn(() => "result")
    const options: OptionsDebounce = { debounceInterval: 1000 }
    const debouncedFn = useDebounce(fn, options)
    debouncedFn()
    debouncedFn()
    debouncedFn()
    expect(fn).not.toHaveBeenCalled()
    await new Promise((resolve) => setTimeout(resolve, 1000))
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
