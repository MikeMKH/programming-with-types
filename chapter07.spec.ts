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
    }),
    describe('deserializing', () => {
      class User {
        name: string;
        constructor(name: string) {
          this.name = name;
        }
      }
      
      function greet(user: User): string {
        return `Hello, ${user.name}`;
      }
      
      describe('any', () => {
        function deserializing(input: string): any {
          return JSON.parse(input);
        }
        
        it('should be possible to deserialize a User', () => {
          const user = deserializing(`{ "name": "John" }`);
          expect(user.name).to.equal('John');
          
          const greeting = greet(user);
          expect(greeting).to.equal('Hello, John');
        }),
        it('should fail on any empty structure', () => {
          const user = deserializing(`{}`);
          expect(user.name).to.equal(undefined);
          
          const greeting = greet(user);
          expect(greeting).to.equal('Hello, undefined');
        });
      }),
      describe('unknown', () => {
        function deserializing(input: string): unknown {
          return JSON.parse(input);
        }
        
        function isUser(user: any): user is User {
          if (user === null || user.name === undefined) {
            return false;
          }
          
          return typeof user.name === 'string';
        }
        
        it('should be possible to deserialize a User', () => {
          const user = deserializing(`{ "name": "John" }`);
          expect(isUser(user)).to.equal(true);
          
          if (isUser(user)) {
            expect(user.name).to.equal('John');
            const greeting = greet(user);
            expect(greeting).to.equal('Hello, John');
          }
        }),
        it('should fail on any empty structure', () => {
          const user = deserializing(`{}`);
          expect(isUser(user)).to.equal(false);
          
          // if (isUser(user)) {
          //   expect(user.name).to.equal(undefined);
            
          //   const greeting = greet(user);
          //   expect(greeting).to.equal('Hello, undefined');
          // }
        });
      });
    }),
    describe('never', () => {
      describe('fail', () => {
        function fail(message: string): never {
          throw new Error(message);
        }
        
        it('should fail', () => {
          expect(() => fail('fail')).to.throw('fail');
        }),
        it('should be consumable', () => {
          function greaterThan2Returns42(value: number): number {
            if (value > 2) {
              return 42;
            }
            
            fail('fail');
          }
          
          expect(greaterThan2Returns42(3)).to.equal(42);
          
          expect(() => greaterThan2Returns42(3)).to.not.throw('fail');
          expect(() => greaterThan2Returns42(1)).to.throw('fail');
        });
      });
    })
  })
});