### Overview

The `useDebounce` function is a utility that helps in debouncing a given function. Debouncing is a programming practice used to ensure that time-consuming tasks do not fire so often, which can help in improving performance and user experience.

### Usage

The `useDebounce` function is designed to debounce a function fn based on the provided options. It leverages the `useDebounceFn` from the `@vueuse/core` library.

### Function Signature

```typescript
export function useDebounce<Fn extends (...args: any[]) => any>(
  fn: Fn,
  options: OptionsDebounce
): ReturnType<typeof useDebounceFn>
```

### Parameters

- `fn`: Fn: The function to be debounced. This function can take any number of arguments and return any type.
- `options: OptionsDebounce`: An object containing debounce configuration options.
- `debounceInterval: MaybeRefOrGetter<number>`: The interval in milliseconds to debounce the function.
- `debounceOptions?: DebounceFilterOptions`: Optional additional options for debouncing.

### Returns

The `useDebounce` function returns a debounced version of the provided function fn.

### Example

```typescript
import { useDebounce } from "vue-mrequest"

const debouncedFunction = useDebounce(
  (value) => {
    console.log(value)
  },
  {
    debounceInterval: 300,
    debounceOptions: { maxWait: 1000 }
  }
)

// Usage
debouncedFunction("test")
```

In this example, `debouncedFunction` will only execute after 300 milliseconds have passed since the last time it was invoked. If it is invoked again within 300 milliseconds, the timer resets. The `maxWait` option ensures that the function will be called at least once every 1000 milliseconds, even if it continues to be invoked frequently.

### Notes

- Ensure that the debounceInterval is set appropriately based on the use case to avoid `performance` issues.
- The `debounceOptions` can be used to fine-tune the behavior of the debounced function, such as setting a maximum wait time.

### Related Functions

`useDebounceFn` from `@vueuse/core`: The underlying function used for debouncing in this utility.
