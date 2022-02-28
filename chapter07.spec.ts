import { expect } from 'chai'
import * as exp from 'constants';

declare const FooType: unique symbol;
declare const BarType: unique symbol;

declare const TriangleType: unique symbol;
declare const SquareType: unique symbol;
declare const CircleType: unique symbol;
declare const HeartType: unique symbol;

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
      });
    }),
    describe('substitutions', () => {
    class Triangle {
      [TriangleType]: void;
      name: string = 'Triangle';
    }
    
    class Square {
      [SquareType]: void;
      name: string = 'Square';
    }
    class Circle {
      [CircleType]: void; 
      name: string = 'Circle';
    }
    
    class Shape {
      name: string = 'Shape';
    }
    
    class Heart extends Shape {
      [HeartType]: void;
      name: string = 'Heart';
      beat: string = 'beating';
    }
    
    class LinkedList<T> {
      value: T;
      next: LinkedList<T> | undefined = undefined;
      
      constructor(value: T) {
        this.value = value;
      }
      
      append(value: T): LinkedList<T> {
        this.next = new LinkedList<T>(value);
        return this.next;
      }
    }
    
    
    
    describe('subtyping and sum types', () => {
      let spyDraw_tsc: boolean = false;    
      function draw_tsc(shape: Triangle | Square | Circle): void {
        spyDraw_tsc = true;
      }
      
      function makeShape_ts(): Triangle | Square {
        const shape: Triangle | Square = Math.random() < 0.5 ? new Triangle() : new Square();
        return shape;
      }
      
      function makeShape_tsc(): Triangle | Square | Circle {
        const shape: Triangle | Square | Circle = Math.random() < 0.5 ? new Triangle() : Math.random() < 0.5 ? new Square() : new Circle();
        return shape;
      }
      
      let spyDraw_ts: boolean = false;
      function draw_ts(shape: Triangle | Square): void {
        spyDraw_ts = true;
      }
      
      it('Triangle | Square | Circle can accept Triangle | Square', () => {
        expect(spyDraw_tsc).to.equal(false);
        draw_tsc(makeShape_ts())
        expect(spyDraw_tsc).to.equal(true);
      }),
      it('Triangle | Square cannot accept Triangle | Square | Circle', () => {
        /*
        error TS2345: Argument of type 'Triangle | Square | Circle' is not assignable to parameter of type 'Triangle | Square'.
        Type 'Circle' is not assignable to type 'Triangle | Square'.
        Property '[SquareType]' is missing in type 'Circle' but required in type 'Square'.
        */
      //  draw_ts(makeShape_tsc());
      })
    }),
    describe('subtyping and collections', () => {
      function makeHearts(): Heart[] {
        const hearts: Heart[] = [];
        const heart = new Heart();
        hearts.push(heart);
        return hearts;
      }
      
      let spyDrawShape: boolean = false;
      function drawShapes(shapes: Shape[]): void {
        spyDrawShape = true;
      }
      
      function makeLinkedListHearts(): LinkedList<Heart> {
        const heart = new LinkedList<Heart>(new Heart());
        heart.append(new Heart());
        return heart;
      }
      
      let spyDrawLinkedListShape: boolean = false;
      function drawLinkedListShapes(shapes: LinkedList<Shape>): void {
        spyDrawLinkedListShape = true;
      }
      
      it ('array in TypeScript are covariant', () => {
        expect(spyDrawShape).to.equal(false);
        drawShapes(makeHearts());
        expect(spyDrawShape).to.equal(true);
      }),
      it('generic collection in TypeScript are covariant', () => {
        expect(spyDrawLinkedListShape).to.equal(false);
        drawLinkedListShapes(makeLinkedListHearts());
        expect(spyDrawLinkedListShape).to.equal(true);
      });
    }),
    describe('subtyping and function return types', () => {
      function makeHeart(): Heart { return new Heart(); }
      function makeShape(): Shape { return new Shape(); }
      
      function useFactory(factory: () => Shape): Shape {
        return factory();
      }
      
      it('should be possible to use a factory function', () => {
        const shape1 = useFactory(makeHeart);
        expect(shape1).to.be.instanceOf(Heart);
        
        const shape2 = useFactory(makeShape);
        expect(shape2).to.be.instanceOf(Shape);
        expect(shape2).to.not.be.instanceOf(Heart);
      });
    }),
    describe('subtyping and function parameters', () => {
      function useHeart(heart: Heart): string {
        expect(heart).to.be.instanceOf(Heart);
        return 'heart';
      }
      
      function useShape(shape: Shape): string {
        expect(shape).to.be.instanceOf(Shape);
        return 'shape';
      }
      
      function render(heart: Heart, useFunc: (argument: Heart) => string): string {
        return useFunc(heart);
      }
      it('Heart => string and Shape => string should be contravariant', () => {
        expect(render(new Heart(), useHeart)).to.equal('heart');
        // expect(render(new Shape(), useShape)).to.equal('shape'); // error TS2345: Argument of type 'Shape' is not assignable to parameter of type 'Heart'. Property '[HeartType]' is missing in type 'Shape' but required in type 'Heart'
        expect(render(new Heart(), useShape)).to.equal('shape');
      });
    });
  });
});