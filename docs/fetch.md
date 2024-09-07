### Overview

The `useFetch` function is a utility designed to simplify the process of making HTTP requests within a Vue.js application. It leverages the capabilities of VueUse and Vue's reactivity system to provide a flexible and powerful way to handle fetch requests.

### Function Signature

```typescript
export function useFetch<R, A extends any[], Type extends keyof Response>(
  input: MaybeRefOrGetter<
    URL | RequestInfo | ((...args: A) => URL | RequestInfo)
  >,
  init?: MaybeRefOrGetter<RequestInit | ((...args: A) => RequestInit)>
): (...args: A) => Promise<R>
```

### Parameters

- `input`: This parameter can be a reactive reference, a getter function, or a static value that represents the URL or RequestInfo for the fetch request. It supports the following types: - `URL` - `RequestInfo` - A function that returns either `URL` or `RequestInfo` when called with arguments of type `A`.
- `init` (optional): This parameter can be a reactive reference, a getter function, or a static value that represents the initialization options for the fetch request. It supports the following types: - `RequestInit` - A function that returns `RequestInit` when called with arguments of type A.

### Return Value

The function returns another function that, when called with arguments of type A, performs the fetch request and returns a `Promise` that resolves to a response of type R.

### Usage

#### Basic Example

```typescript
import { useFetch } from "@tachibana-shin/vue-request"
import { ref } from "vue"

const fetchData = useFetch<Response, [], "json">("https://api.example.com/data")

fetchData().then((response) => {
  console.log(response)
})
```

#### Dynamic URL Example

```typescript
import { useFetch } from "@tachibana-shin/vue-request"
import { ref } from "vue"

const userId = ref(1)
const fetchUserData = useFetch<Response, [number], "json">(
  (id) => `https://api.example.com/users/${id}`
)

fetchUserData(userId.value).then((response) => {
  console.log(response)
})
```

### Custom Request Initialization Example

```typescript
import { useFetch } from "@tachibana-shin/vue-request"
import { ref } from "vue"

const fetchDataWithInit = useFetch<Response, [], "json">(
  "https://api.example.com/data",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ key: "value" })
  }
)

fetchDataWithInit().then((response) => {
  console.log(response)
})
```

### Notes

- The `useFetch` function is designed to work seamlessly with Vue's reactivity system, making it easy to create dynamic and reactive fetch requests.
- The `MaybeRefOrGetter` type from VueUse allows for flexible input and initialization options, supporting both static values and reactive references or getter functions.

### Dependencies

- `@vueuse/core`: Provides the `toValue` and `MaybeRefOrGetter` utilities.
- `vue`: Provides core Vue.js functionalities such as `getCurrentInstance`, `getCurrentScope`, and `onUnmounted`.

### Import Statements

Ensure you have the following import statements in your file:

```typescript
import { toValue, type MaybeRefOrGetter } from "@vueuse/core"
import { getCurrentInstance, getCurrentScope, onUnmounted } from "vue"
```

By following this documentation, you should be able to effectively utilize the useFetch function in your Vue.js applications, leveraging the power of Vue's reactivity and the flexibility of the VueUse library.
