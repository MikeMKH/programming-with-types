import { expect } from 'chai'
import { beforeEach } from 'mocha';

describe('chapter 6', () => {
  describe('decorator pattern', () => {
    describe('object oriented', () => {
      let timesCalled: number = 0;
      class Foo {
        constructor() {
          timesCalled++;
        }
      }
      
      interface IFooFactory {
        makeFoo(): Foo;
      }
      
      class FooFactory implements IFooFactory {
        makeFoo(): Foo {
          return new Foo();
        }
      }
      
      class SingletonFooFactory implements IFooFactory {
        private factory: IFooFactory;
        private instance: Foo | undefined = undefined;
        
        constructor(factory: IFooFactory) {
          this.factory = factory;
        }
        
        makeFoo(): Foo {
          if (this.instance === undefined) {
            this.instance = this.factory.makeFoo();
          }
          return this.instance;
        }
      }
      
      beforeEach(() => {
        timesCalled = 0;
      });
      
      it('should call the constructor', () => {
        const fooFactory = new SingletonFooFactory(new FooFactory());
        fooFactory.makeFoo();
        expect(timesCalled).to.equal(1);
      }),
      it('should not call the constructor once', () => {
        const fooFactory = new SingletonFooFactory(new FooFactory());
        fooFactory.makeFoo();
        fooFactory.makeFoo();
        expect(timesCalled).to.equal(1);
      })
    }),
    describe('functional', () => {
      let timesCalled: number = 0;
      class Foo {
        constructor() {
          timesCalled++;
        }
      }
      
      type FooFactory = () => Foo;
      
      function makeFoo(): Foo {
        return new Foo();
      }
      
      function singletonMakeFoo(factory: FooFactory): FooFactory {
        let instance: Foo | undefined = undefined;
        
        return (): Foo => {
          if (instance === undefined) {
            instance = factory();
          }
          return instance;
        }
      }
      
      function recorderMakeFoo(record: string[], factory: FooFactory): FooFactory {
        return (): Foo => {
          const foo = factory();
          record.push(`${foo.constructor.name}`);
          return foo;
        }
      }
      
      beforeEach(() => {
        timesCalled = 0;
      });
      
      it('should call the constructor', () => {
        const fooFactory = singletonMakeFoo(makeFoo);
        fooFactory();
        expect(timesCalled).to.equal(1);
      }),
      it('should not call the constructor once', () => {
        const fooFactory = singletonMakeFoo(makeFoo);
        fooFactory();
        fooFactory();
        expect(timesCalled).to.equal(1);
      }),
      it('should record the calls', () => {
        const record: string[] = [];
        const fooFactory = recorderMakeFoo(record, makeFoo);
        fooFactory();
        fooFactory();
        expect(record).to.deep.equal(['Foo', 'Foo']);
      }),
      it('should only record calls but only make one', () => {
        const record: string[] = [];
        const fooFactory = recorderMakeFoo(record, singletonMakeFoo(makeFoo));
        fooFactory();
        fooFactory();
        expect(timesCalled).to.equal(1);
        expect(record).to.deep.equal(['Foo', 'Foo']);
      });
    });
  }),
  describe('fibonacci sequence', () => {
    describe('global', () => {
      let previous: number = 0;
      let current: number = 1;
      
      function next(): number {
        const nextValue = previous + current;
        previous = current;
        current = nextValue;
        return previous;
      }
      
      it('should return the expected values', () => {
        expect(next()).to.equal(1);
        expect(next()).to.equal(1);
        expect(next()).to.equal(2);
        expect(next()).to.equal(3);
        expect(next()).to.equal(5);
        expect(next()).to.equal(8);
      });
    }),
    describe('object oriented', () => {
      class Fibonacci {
        private previous: number = 0;
        private current: number = 1;
        
        next(): number {
          const nextValue = this.previous + this.current;
          this.previous = this.current;
          this.current = nextValue;
          return this.previous;
        }
      }
      
      it('should return the expected values', () => {
        const fibonacci = new Fibonacci();
        expect(fibonacci.next()).to.equal(1);
        expect(fibonacci.next()).to.equal(1);
        expect(fibonacci.next()).to.equal(2);
        expect(fibonacci.next()).to.equal(3);
        expect(fibonacci.next()).to.equal(5);
        expect(fibonacci.next()).to.equal(8);
      });
    }),
    describe('functional', () => {
      type Fibonacci = () => number;
      
      function makeFibonacci(): Fibonacci {
        let previous: number = 0;
        let current: number = 1;
        
        return (): number => {
          const nextValue = previous + current;
          previous = current;
          current = nextValue;
          return previous;
        }
      }
      
      it('should return the expected values', () => {
        const fibonacci = makeFibonacci();
        expect(fibonacci()).to.equal(1);
        expect(fibonacci()).to.equal(1);
        expect(fibonacci()).to.equal(2);
        expect(fibonacci()).to.equal(3);
        expect(fibonacci()).to.equal(5);
        expect(fibonacci()).to.equal(8);
      });
    }),
    describe('generator', () => {
      type Fibonacci = IterableIterator<number>;
      
      function* makeFibonacci(): Fibonacci {
        let previous: number = 0;
        let current: number = 1;
        
        while (true) {
          yield current;
          const nextValue = previous + current;
          previous = current;
          current = nextValue;
        }
      }
      
      it('should return the expected values', () => {
        const fibonacci = makeFibonacci();
        expect(fibonacci.next().value).to.equal(1);
        expect(fibonacci.next().value).to.equal(1);
        expect(fibonacci.next().value).to.equal(2);
        expect(fibonacci.next().value).to.equal(3);
        expect(fibonacci.next().value).to.equal(5);
        expect(fibonacci.next().value).to.equal(8);
      });
    });
  }),
  describe('asynchronous operations', () => {
    describe('event driven model', () => {
      type AsyncFunction = () => void;
      let queue: AsyncFunction[] = [];
      
      function countDown(id: string, results: string[], from: number): void {
        results.push(`[${id}] ${from}`);
        if (from > 0) {
          queue.push(() => countDown(id, results, from - 1));
        }
      }
      
      it('should execute in order', () => {
        const results: string[] = [];
        
        queue.push(() => countDown('1', results, 2));
        queue.push(() => countDown('2', results, 2));
        while (queue.length > 0) {
          queue.shift()!();
        }
        
        queue.forEach(f => f());
        expect(results).to.deep.equal(['[1] 2', '[2] 2', '[1] 1', '[2] 1', '[1] 0', '[2] 0']);
      });
    })
  })
})