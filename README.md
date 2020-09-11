# Promise Listen Catch
A library to listen the promise chain, and decide to reject or not.

# Installation
```bash
yarn add promise-listen-catch
```

# Usage
```typescript
const promise = new PromiseListenCatch((resolve, reject) => {
  setTimeout(() => {
    if (promise.hasThen() || promise.hasCatch()) {
      // Append receiver to the end of chain
      promise.hasCatch() || promise.appendCatchToEnd();
      // Reject as normal
      reject('with catch');
    } else {
      // Just resolve, because no more chain to receive it.
      resolve();
    }
  });
});

promise.then(() => {
  // ...
});
```
