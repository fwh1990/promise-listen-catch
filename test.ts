import PromiseListenCatch from './index';

process.addListener('unhandledRejection', console.log);

(() => {
  const promise = new PromiseListenCatch((resolve) => {
    resolve();
  });

  promise.then(() => {
    console.log('resolve1');
  });
})();

(() => {
  const promise = new PromiseListenCatch((_, reject) => {
    reject('normal rejection');
  });

  promise.then(() => {
    console.log('resolve1');
  }).catch(console.log);
})();


(() => {
  const promise = new PromiseListenCatch((_, reject) => {
    reject('without catch');
  });

  // Throw
  promise.then(() => {
    console.log(1);
  });

  // Throw
  promise.then(() => {
    console.log(2);
  });
})();

(() => {
  const promise = new PromiseListenCatch((_, reject) => {
    setTimeout(() => {
      promise.appendCatchToEnd();
      reject('with catch');
    });
  });

  // Safe
  promise.then(() => {
    console.log(1);
  });

  // Safe
  promise.then(() => {
    console.log(2);
  });
})();


(() => {
  const promise = new PromiseListenCatch((resolve, reject) => {
    setTimeout(() => {
      if (promise.hasThen()) {
        promise.hasCatch() || promise.appendCatchToEnd();
        reject('with catch');
      } else {
        resolve();
      }
    });
  });

  // Safe
  promise.then(() => {
    console.log(1);
  });
})();

(() => {
  const promise = new PromiseListenCatch((resolve, reject) => {
    setTimeout(() => {
      if (promise.hasThen() && !promise.hasCatch()) {
        promise.appendCatchToEnd();
      }

      if (promise.hasCatch()) {
        reject('with catch');
      } else {
        resolve();
      }
    });
  });

  promise.catch(console.log);
})();

(() => {
  const promise = new PromiseListenCatch((_, reject) => {
    setTimeout(() => {
      reject('empty catch');
    });
  });

  promise.catch();
})();

Promise.all([
  new PromiseListenCatch((resolve) => {
    resolve(1);
  }),
  new PromiseListenCatch((resolve) => {
    setTimeout(() => {
      resolve(2);
    }, 200);
  }),
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(3);
    }, 100);
  }),
]).then(console.log);

Promise.race([
  new PromiseListenCatch((resolve) => {
    resolve('race1');
  }),
  new PromiseListenCatch((resolve) => {
    setTimeout(() => {
      resolve('race2');
    }, 200);
  }),
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('race3');
    }, 100);
  }),
]).then(console.log);
