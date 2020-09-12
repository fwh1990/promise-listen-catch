export default class PromiseListenCatch<T = any> implements PromiseLike<T> {
  private readonly promise: Promise<T>;
  protected prev: PromiseListenCatch<any> | null = null;
  protected next: PromiseListenCatch<any>[] = [];
  private _catch: boolean = false;
  private _then: boolean = false;

  constructor(executor: ConstructorParameters<typeof Promise>[0]);
  constructor(promise: Promise<T>);
  constructor(executor: ConstructorParameters<typeof Promise>[0] | Promise<T>) {
    this.promise = typeof executor === 'function' ? new Promise<T>(executor as any) : executor;
  }

  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): PromiseListenCatch<TResult1 | TResult2> {
    const promise = this.promise.then<TResult1, TResult2>(onfulfilled, onrejected);
    this.setThen(!!onfulfilled);
    this.setCatch(!!onrejected);

    return this.make(promise);
  }

  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): PromiseListenCatch<T | TResult> {
    const promise = this.promise.catch(onrejected);
    this.setCatch(!!onrejected);

    return this.make(promise);
  }

  finally(onfinally?: (() => void) | undefined | null): PromiseListenCatch<T> {
    const promise = this.promise.finally(onfinally);

    return this.make(promise);
  }

  /**
   * Determine reject or resolve.
   * If `true`, you can reject safely.
   * If `false`, user doesn't care the result, you can resolve safely.
   * @returns {boolean}
   */
  canReject(): boolean {
    // It means user have added catch handler, we can safely reject.
    if (this._catch) {
      return true;
    }

    // No catch handler and no then handler.
    // It means user doesn't care the result, we can safely resolve.
    if (!this._then) {
      return false;
    }

    this.append();
    return true;
  }

  protected append(): void {
    let last: PromiseListenCatch = this;

    while (true) {
      const length = last.next.length;

      if (!length) {
        break;
      } else if (length === 1) {
        last = last.next[0];
      } else {
        last.next.forEach((item) => {
          this.append.call(item);
        });
        return;
      }
    }

    last.catch((Function.prototype) as any);
  }

  protected toString() {
    return '[object PromiseListenCatch]';
  }

  protected make<T1>(promise: Promise<T1>) {
    const instance = new PromiseListenCatch<T1>(promise);
    this.next.push(instance);
    instance.prev = this;

    return instance;
  }

  protected setThen(is: boolean) {
    this._then = is;

    if (is) {
      let prev: PromiseListenCatch | null = this;

      while((prev = prev.prev) !== null) {
        prev._then = true;
      }
    }
  }

  protected setCatch(is: boolean) {
    this._catch = is;

    if (is) {
      let prev: PromiseListenCatch | null = this;

      while((prev = prev.prev) !== null) {
        prev._catch = true;
      }
    }
  }
}
