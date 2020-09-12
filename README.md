# Promise Listen Catch
A library to listen the promise chain, and decide to reject or not.

# Installation
```bash
yarn add promise-listen-catch
```

# Usage
```typescript
import PromiseListenCatch from 'promise-listen-catch';

const promise = new PromiseListenCatch((resolve, reject) => {
  setTimeout(() => {
    if (promise.canReject()) {
      reject('throw safely');
    } else {
      // User doesn't care about result.
      // You are recommended to resolve instead of reject.
      resolve();
    }
  });
});

promise.then(() => {
  // ...
});
```
