# Introduction

With `useTask`, you can combine `task` with react `<Suspense>`

## What is `Task` ?

```ts
type Task = <A>() => Promise<A>;
```

> `Task<A>` represents an asynchronous computation that yields a value of type `A` and never fails.

## What is `<Suspense>` ?

> `<Suspense>` lets you display a fallback until its children have finished loading.

# Getting Started

## useTask

### Create a task

```tsx
const getTitle = () => new Promise<string>((rs) => rs("Hello"));
const Title = () => {
  return <h1>title</h1>;
};
```

### Add useTask hook in the component

```tsx
import { useTask } from "@richard-wang-tw/use-task";
const Title = () => {
  // the first argument is task
  // the second is unique id of the task
  const title = useTask(getTitle, "getTitle");
  return <h1>{title}</h1>;
};
```

### Wrap the component with `<suspense>`

```tsx
const TitleLoader = () => (
  <Suspense fallback={<h1>Loading</h1>}>
    <Title />
  </Suspense>
);
```

## deleteTaskCache

You can use `deleteTaskCache("getTitle")` on timeout or triggered by user interaction.

This feature allow you to reload data on next render.

# Reference

- [task](https://gcanti.github.io/fp-ts/modules/Task.ts.html)
- [suspense](https://react.dev/reference/react/Suspense)
