### Overview
This document provides an overview of the caching mechanism implemented in the useRequest function. The useRequest function is designed to handle asynchronous requests with various options for customization, including caching, retry logic, and reactive state management.

### Imports
The following modules and types are imported to support the functionality of `useRequest`:
```typescript
import {
  computed,
  shallowRef,
  watchEffect,
  ref,
  watch,
  type MaybeRefOrGetter,
  type Ref
} from "vue"
import { globalOptions } from "../options"
import { retryAsync } from "ts-retry"
import { toValue } from "@vueuse/core"
```

### OptionsRequest Interface
The `OptionsRequest` interface defines the options that can be passed to the `useRequest` function:
```typescript
export interface OptionsRequest<A, R> {
  manual?: boolean
  ready?: Ref<boolean> | (() => boolean)
  defaultParams?: A

  initialData?: R
  onSuccess?: (data: R) => void
  onError?: (error: unknown) => void

  errorRetryCount?: MaybeRefOrGetter<number>
  errorRetryInterval?: MaybeRefOrGetter<number>

  loadingKeep?: MaybeRefOrGetter<number>

  /** @description Enable watch depends in function request */
  watch?: boolean
  /**
   * @default false
   * @description Only trigger request after track get data
   */
  lazy?: boolean
}
```

### Option Fields
- `manual`: If true, the request will not be triggered automatically.
- `ready`: A reactive reference or function that determines if the request is ready to be made.
- `defaultParams`: Default parameters for the request.
- `initialData`: Initial data to be set before the request is made.
- `onSuccess`: Callback function to be executed on successful request.
- `onError`: Callback function to be executed on request error.
- `errorRetryCount`: Number of retry attempts in case of an error.
- `errorRetryInterval`: Interval between retry attempts.
- `loadingKeep`: Duration to keep the loading state after the request is - `completed.
- `watch`: If `true`, enables watching dependencies for the request.
- `lazy`: If `true`, the request will only be triggered after data is accessed.

### useRequest Function
The `useRequest` function handles asynchronous requests with various options for customization

### Functionality
- *Reactive State*: The function uses `shallowRef` and `computed` to manage reactive state for `data`, `loading`, and `error`.
- *Retry Logic*: The function supports retrying the request using `retryAsync` with configurable retry count and interval.
- *Automatic Request Trigger*: The function can automatically trigger the request based on the `manual`, `ready`, and `lazy` options.
- *Mutate Function*: The `mutate` function allows manual updating of the `data` state.

### Conclusion
The `useRequest` function provides a flexible and customizable way to handle asynchronous requests with support for caching, retry logic, and reactive state management. By leveraging Vue's reactivity system and integrating with global options, it offers a robust solution for managing data fetching in Vue applications.