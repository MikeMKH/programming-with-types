import { expect } from 'chai'

declare const FooType: unique symbol;
declare const BarType: unique symbol;

describe('chapter 7', () => {
  describe('subtyping', () => {
    describe('nominal subtyping', () => {
      class Foo {
        value: number;
        constructor(value: number) {
          this.value = value;
        }
      }
      
      class Bar extends Foo {
        constructor(value: number) {
          super(value);
        }
      }
      
      it('should be possible to assign a Bar to a Foo', () => {
        const foo: Foo = new Bar(1);
        expect(foo.value).to.equal(1);
      }),
      it('should not be possible to assign a Foo to a Bar', () => {
        // const bar: Bar = new Foo(1); // error
      }),
      it('should be possible to use a Bar as a Foo', () => {
        const bar: Bar = new Bar(1);
        function f(foo: Foo): void {
          expect(foo.value).to.equal(1);
        }
        
        f(bar);
      })
    }),
    describe('structural subtyping', () => {
      class Foo {
        value: number;
        constructor(value: number) {
          this.value = value;
        }
      }
      
      class Bar {
        value: number;
        constructor(value: number) {
          this.value = value;
        }
      }
      
      it('should be possible to assign a Bar to a Foo', () => {
        const foo: Foo = new Bar(1);
        expect(foo.value).to.equal(1);
      }),
      it('should not be possible to assign a Foo to a Bar', () => {
        // const bar: Bar = new Foo(1); // error
      }),
      it('should be possible to use a Bar as a Foo', () => {
        const bar: Bar = new Bar(1);
        function f(foo: Foo): void {
          expect(foo.value).to.equal(1);
        }
        
        f(bar);
      });
    }),
    describe('true nominal subtyping in TypeScript', () => {
      // declare const FooType: unique symbol; // at top of file
      class Foo {
        [FooType]: void;
        value: number;
        constructor(value: number) {
          this.value = value;
        }
      }
      
      // declare const BarType: unique symbol; // at top of file
      class Bar {
        [BarType]: void;
        value: number;
        constructor(value: number) {
          this.value = value;
        }
      }
      
      it('should not be possible to assign a Bar to a Foo', () => {
        // const foo: Foo = new Bar(1); // error TS2741: Property '[FooType]' is missing in type 'Bar' but required in type 'Foo'.
        // expect(foo.value).to.equal(1);
      }),
      it('should not be possible to assign a Foo to a Bar', () => {
        // const bar: Bar = new Foo(1); // error TS2741: Property '[BarType]' is missing in type 'Foo' but required in type 'Bar'.
      }),
      it('should not be possible to use a Bar as a Foo', () => {
        const bar: Bar = new Bar(1);
        function f(foo: Foo): void {
          expect(foo.value).to.equal(1);
        }
        
        // f(bar); // error TS2345: Argument of type 'Bar' is not assignable to parameter of type 'Foo'.
                   // Property '[FooType]' is missing in type 'Bar' but required in type 'Foo'.
      });
    })
  })
});