import { toValue, type MaybeRefOrGetter } from "@vueuse/core"
import { getCurrentInstance, getCurrentScope, onUnmounted } from "vue"

export function useFetch<R, A extends any[], Type extends keyof Response>(
  input: MaybeRefOrGetter<
    URL | RequestInfo | ((...args: A) => URL | RequestInfo)
  >,
  init?: MaybeRefOrGetter<RequestInit | ((...args: A) => RequestInit)>
): (...args: A) => Promise<R>
export function useFetch<
  R,
  A extends any[],
  Type extends keyof Response = "json"
>(
  input: MaybeRefOrGetter<
    URL | RequestInfo | ((...args: A) => URL | RequestInfo)
  >,
  type: Type,
  init?: MaybeRefOrGetter<RequestInit | ((...args: A) => RequestInit)>
): (
  ...args: A
) => Promise<
  Type extends "json"
    ? R
    : Response[Type] extends () => infer R
      ? R
      : Response[Type]
>
/**
 * A custom hook to perform fetch requests with enhanced capabilities.
 *
 * @template R - The expected response type.
 * @template A - The type of arguments that the fetch function accepts.
 * @template Type - The type of the response property to be accessed.
 *
 * @param {MaybeRefOrGetter<URL | RequestInfo | ((...args: A) => URL | RequestInfo)>} input - The URL or RequestInfo object, or a function returning either, to be used for the fetch request.
 * @param {MaybeRefOrGetter<RequestInit | ((...args: A) => RequestInit)>} [init] - Optional. The RequestInit object or a function returning it, to configure the fetch request.
 *
 * @returns {(...args: A) => Promise<R>} - A function that takes arguments of type A and returns a Promise resolving to the response of type R.
 *
 * @example
 * // Basic usage with a static URL
 * const fetchData = useFetch<ResponseType, [], 'json'>('https://api.example.com/data');
 * fetchData().then(response => {
 *   console.log(response);
 * });
 *
 * @example
 * // Usage with dynamic URL and RequestInit
 * const fetchData = useFetch<ResponseType, [string], 'json'>(
 *   (id) => `https://api.example.com/data/${id}`,
 *   (id) => ({ method: 'GET', headers: { 'Content-Type': 'application/json' } })
 * );
 * fetchData('123').then(response => {
 *   console.log(response);
 * });
 *
 * @example
 * // Usage with MaybeRefOrGetter
 * const urlRef = ref('https://api.example.com/data');
 * const fetchData = useFetch<ResponseType, [], 'json'>(urlRef);
 * fetchData().then(response => {
 *   console.log(response);
 * });
 */
export function useFetch<
  R,
  A extends any[],
  Type extends keyof Response = "json"
>(
  input: MaybeRefOrGetter<
    URL | RequestInfo | ((...args: A) => URL | RequestInfo)
  >,
  type:
    | MaybeRefOrGetter<RequestInit | ((...args: A) => RequestInit)>
    | Type = "json" as Type,
  init?: MaybeRefOrGetter<RequestInit | ((...args: A) => RequestInit)>
): (...args: A) => Promise<R> {
  if (type && typeof type !== "string") {
    init = type
    type = "json" as Type
  }

  const instance = getCurrentInstance()
  const controller = instance ? new AbortController() : null
  if (instance) onUnmounted(() => controller!.abort(), instance)

  return (...args: A): Promise<R> => {
    const input$ = toValue(input)
    const init$ = toValue(init)

    const init$$ = typeof init$ === "function" ? init$(...args) : init$
    return fetch(
      typeof input$ === "function" ? input$(...args) : input$,
      controller
        ? {
            signal: controller.signal,
            ...init$$
          }
        : init$$
    )
      .then((res) => (res.ok ? res : Promise.reject(res)))
      .then((res) => {
        const data = res[type as keyof Response]
        if (typeof data === "function")
          return (res[type as keyof Response] as Function)() as R

        return data as R
      })
  }
}
