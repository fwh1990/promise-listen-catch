export class CustomPromise<T = any> implements PromiseLike<T> {
  private readonly promise: Promise<T>;
  private readonly previous: CustomPromise<any>[];
  private catchHandled: boolean = false;

  constructor(executor: ConstructorParameters<typeof Promise>[0]);
  constructor(promise: Promise<T>, previous?: CustomPromise<any>[]);

  constructor(executor: ConstructorParameters<typeof Promise>[0] | Promise<T>, previous?: CustomPromise<any>[]) {
    this.promise = typeof executor === 'function' ? new Promise<T>(executor as any) : executor;
    this.previous = previous || [];
  }

  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): CustomPromise<TResult1 | TResult2> {
    const newPromise = this.promise.then<TResult1, TResult2>(onfulfilled, onrejected);
    this.setCatchHandled(!!onrejected);

    return new CustomPromise<TResult1 | TResult2>(newPromise, this.previous.concat(this));
  }

  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): CustomPromise<T | TResult> {
    const newPromise = this.promise.catch(onrejected);
    this.setCatchHandled(true);

    return new CustomPromise<T | TResult>(newPromise, this.previous.concat(this));
  }

  isCatched(): boolean {
    return this.catchHandled;
  }

  protected setCatchHandled(is: boolean) {
    this.catchHandled = is;

    if (is) {
      this.previous.forEach((item) => {
        item.catchHandled = true;
      });
    }
  }
}
