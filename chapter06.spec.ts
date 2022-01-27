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
  })
})