## @vue-mrequest

A Vue.js package based on the idea of [vue-request](https://github.com/attojs/vue-request).

This package separates the functions into composibles so that the tree can be treeshake

Example

```typescript
const { data, loading, error } = useRequest(
  useCache(useFetch("/api/users"), {
    cacheKey: "users"
  })
)
```

### Features

- [`useCache`](./docs/cache.md) - Caching mechanism
- [`useDebounce`](./docs/debounce.md) - Debouncing mechanism
- [`useFetch`](./docs/fetch.md) - Fetching mechanism
- [`useLoadMore`](./docs/load-more.md) - Load more mechanism
- [`usePagination`](./docs/pagination.md) - Pagination mechanism
- [`usePolling`](./docs/polling.md) - Polling mechanism
- [`useRefreshFocus`](./docs/refresh-focus.md) - Refresh focus mechanism
- [`useRequest`](./docs/request.md) - Asynchronous request handler
- [`useThrottle`](./docs/throttle.md) - Throttling mechanism
