export default class PromiseListenCatch<T = any> implements PromiseLike<T> {
  private readonly promise: Promise<T>;
  protected prev: PromiseListenCatch<any> | null = null;
  protected next: PromiseListenCatch<any>[] = [];
  private catchHandled: boolean = false;
  private thenHandled: boolean = false;

  constructor(executor: ConstructorParameters<typeof Promise>[0]);
  constructor(promise: Promise<T>);
  constructor(executor: ConstructorParameters<typeof Promise>[0] | Promise<T>) {
    this.promise = typeof executor === 'function' ? new Promise<T>(executor as any) : executor;
  }

  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): PromiseListenCatch<TResult1 | TResult2> {
    const newPromise = this.promise.then<TResult1, TResult2>(onfulfilled, onrejected);
    this.setThenHandled(!!onfulfilled);
    this.setCatchHandled(!!onrejected);

    return this.createNext(newPromise);
  }

  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): PromiseListenCatch<T | TResult> {
    const newPromise = this.promise.catch(onrejected);
    this.setCatchHandled(true);

    return this.createNext(newPromise);
  }

  finally(onfinally?: (() => void) | undefined | null): PromiseListenCatch<T> {
    const newPromise = this.promise.finally(onfinally);

    return this.createNext(newPromise);
  }

  hasThen(): boolean {
    return this.thenHandled;
  }

  hasCatch(): boolean {
    return this.catchHandled;
  }

  /**
   * @param {string | undefined} logLevel Default: non-log
   */
  appendCatchToEnd(logLevel?: 'log' | 'info' | 'warn' | 'error'): void {
    let last: PromiseListenCatch = this;

    while (true) {
      const length = last.next.length;

      if (!length) {
        break;
      } else if (length === 1) {
        last = last.next[0];
      } else {
        last.next.forEach((item) => {
          this.appendCatchToEnd.call(item, logLevel);
        });
        return;
      }
    }

    last.catch((logLevel ? console[logLevel] : Function.prototype) as any);
  }

  protected toString() {
    return '[object PromiseListenCatch]';
  }

  protected createNext<T1>(promise: Promise<T1>) {
    const instance = new PromiseListenCatch<T1>(promise);
    this.next.push(instance);
    instance.prev = this;

    return instance;
  }

  protected setThenHandled(is: boolean) {
    this.thenHandled = is;

    if (is) {
      let prev: PromiseListenCatch | null = this;

      while((prev = prev.prev) !== null) {
        prev.thenHandled = true;
      }
    }
  }

  protected setCatchHandled(is: boolean) {
    this.catchHandled = is;

    if (is) {
      let prev: PromiseListenCatch | null = this;

      while((prev = prev.prev) !== null) {
        prev.catchHandled = true;
      }
    }
  }
}
