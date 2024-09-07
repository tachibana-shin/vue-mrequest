### Overview

The useCache function is a utility designed to cache the results of asynchronous operations. It leverages both Map and WeakMap to store cache entries and ongoing requests, respectively. This function is particularly useful for optimizing performance by avoiding redundant computations and network requests.

### Parameters

- `fn: (...args: A) => R | Promise<R>`: The function whose results need to be cached. It can be either synchronous or asynchronous.
- `options: OptionsCache: An object containing cache configuration options.
  OptionsCache Interface
- `cacheKey: MaybeRefOrGetter<string>`: A unique key to identify the cache entry.
- `cacheTime?: MaybeRefOrGetter<number>`: The duration (in milliseconds) for which the cache entry is valid. Defaults to 600000 ms (10 minutes).
- `staleTime?: MaybeRefOrGetter<number>`: The duration (in milliseconds) after which the cache entry is considered stale but still usable. Defaults to 0 ms.

### Returns

- `(...args: A) => Promise<R>`: A function that takes the same arguments as fn and returns a Promise resolving to the cached or freshly computed result.

### Example Usage

```typescript
import { useCache } from "@vue-mrequest"

const fetchData = async (id: number) => {
  const response = await fetch(`/api/data/${id}`)
  return response.json()
}

const cacheOptions = {
  cacheKey: "data-cache-key",
  cacheTime: 300000, // 5 minutes
  staleTime: 60000 // 1 minute
}

const cachedFetchData = useCache(fetchData, cacheOptions)

cachedFetchData(1).then((data) => {
  console.log(data)
})
```

In this example, `fetchData` is a function that fetches data from an API. The `useCache` function is used to cache the results of `fetchData` for 5 minutes, with a stale time of 1 minute. The `cachedFetchData` function can be called with the same arguments as `fetchData`, and it will return cached results if available.
