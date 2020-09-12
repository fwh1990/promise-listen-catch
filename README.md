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
    if (promise.canReject()) {
      reject('with catch');
    } else {
      resolve();
    }
  });
});

promise.then(() => {
  // ...
});
```
