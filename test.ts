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
      if (promise.hasThen() || promise.hasCatch()) {
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
      if (promise.hasThen() || promise.hasCatch()) {
        promise.hasCatch() || promise.appendCatchToEnd();
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
    resolve('promise.all ok1');
  }),
  new PromiseListenCatch((resolve) => {
    setTimeout(() => {
      resolve('promise.all ok2');
    }, 200);
  }),
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('promise.all ok3');
    }, 100);
  }),
]).then(console.log);

Promise.race([
  new PromiseListenCatch((resolve) => {
    resolve('promise.all race1');
  }),
  new PromiseListenCatch((resolve) => {
    setTimeout(() => {
      resolve('promise.all race2');
    }, 200);
  }),
  new Promise((resolve) => {
    setTimeout(() => {
      resolve('promise.all race3');
    }, 100);
  }),
]).then(console.log);

(() => {
  const promise = new PromiseListenCatch((resolve, reject) => {
    setTimeout(() => {
      if (promise.hasThen() || promise.hasCatch()) {
        if (promise.hasThen()) {
          console.log('promise.all has then handler');
        }

        if (promise.hasCatch()) {
          console.log('promise.all has catch handler');
        } else {
          promise.appendCatchToEnd();
        }

        reject('promise.all rejection');
      } else {
        console.log('-----never run here');
        resolve();
      }
    }, 200);
  });

  Promise.all([
    new PromiseListenCatch((resolve) => {
      resolve(1);
    }),
    promise,
  ]);
})();

Promise.all([
  new PromiseListenCatch((resolve) => {
    resolve(1);
  }),
  new PromiseListenCatch((_, reject) => {
    setTimeout(() => {
      reject('promise.all normal rejection');
    }, 200);
  }),
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(3);
    }, 100);
  }),
]).catch(console.log);
