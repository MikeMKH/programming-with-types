import { expect } from 'chai'

describe('higher kinded types', () => {
  describe('Sum Type', () => {
    describe('map', () => {
      function map<T, U>(value: T | undefined, f: (x: T) => U): U | undefined {
        if (value === undefined) {
          return undefined
        }
        return f(value)
      }
      
      const howManyLetters = (s: string | undefined) => map(s, s => s.length);
      
      it('should map against a type', () => {
        const lily = 'lily';
        expect(howManyLetters(lily)).to.equal(4);
      }),
      it('should map against an undefined', () => {
        const who = undefined;
        expect(howManyLetters(who)).to.equal(undefined);
      }),
      describe('processing', () => {
        function square(x: number): number {
          return x**2;
        }
        
        function stringify(x: number): string {
          return x.toString();
        }
        it('should be able to combine functions', () => {
          function readNumber_undefined(): undefined {
            return undefined;
          }
          
          function readNumber_3(): number {
            return 3;
          }
          
          function process(func: () => number | undefined) : string | undefined {
            return map(map(func(), square), stringify);
          }
          
          expect(process(readNumber_undefined)).to.equal(undefined);
          expect(process(readNumber_3)).to.equal('9');
        });
      });
    });
  }),
  describe('Box', () => {
    class Box<T> {
      constructor(private value: T) {}
      getValue(): T {
        return this.value;
      }
    }
    describe('map', () => {
      function map<T, U>(value: Box<T>, f: (x: T) => U): Box<U> {
        return new Box(f(value.getValue()));
      }
      
      it('should map against a type', () => {
        const lily = new Box('lily');
        const howManyLetters = (s: { length: number }) => s.length;
        
        expect(map(lily, howManyLetters).getValue()).to.equal(4);
        expect(map(lily, howManyLetters)).to.be.instanceof(Box);
        expect(map(lily, howManyLetters)).to.deep.equal(new Box(4));
        
        const abc = new Box(['a', 'b', 'c']);
        expect(map(abc, howManyLetters).getValue()).to.equal(3);
        expect(map(abc, howManyLetters)).to.be.instanceof(Box);
        expect(map(abc, howManyLetters)).to.deep.equal(new Box(3));
      });
    });
  }),
  describe('Functor', () => {
    interface Functor<T> {
      map<U>(f: (x: T) => U): Functor<U>;
    }
    describe('Box', () => {
      class Box<T> implements Functor<T> {
        constructor(private value: T) {}
        getValue(): T {
          return this.value;
        }
        map<U>(f: (x: T) => U): Box<U> {
          return new Box(f(this.value));
        }
      }
        
      it('mapping identity should give given value back', () => {
        function identity<T>(x: T) { return x; }
        const lily = new Box('lily');
        const seven = new Box(7);
        
        expect(lily.map(identity).getValue()).to.equal('lily');
        expect(lily.map(identity)).to.be.instanceof(Box);
        expect(seven.map(identity).getValue()).to.equal(7);
        expect(seven.map(identity)).to.be.instanceof(Box);
      }),
      it('mapping should give expected value back', () => {
        function square(x: number) { return x**2; }
        const two = new Box(2);
        const three = new Box(3);
        
        expect(two.map(square).getValue()).to.equal(4);
        expect(two.map(square)).to.be.instanceof(Box);
        expect(three.map(square).getValue()).to.equal(9);
        expect(three.map(square)).to.be.instanceof(Box);
      }),
      it('should be able to implement a Writer', () => {
        class Writer<T> implements Functor<T> {
          constructor(private value: T, private log: string = '') {}
          getValue(): T {
            return this.value;
          }
          getLog(): string {
            return this.log;
          }
          map<U>(f: (x: T) => U): Writer<U> {
            const result: U = f(this.value);
            return new Writer(result, this.log + '\n' + `${this.value} => ${result}`);
          }
        }
        
        const lily = new Writer('lily');
        expect(lily.map(s => s.length).map(s => s**2).getLog()).to.equal('\nlily => 4\n4 => 16');
      });
    }),
    describe('functions', () => {      
      describe('map', () => {
        function map<T, U>(f: (arg1: T, arg2: T) => T, func: (value: T) => U): (arg1: T, arg2: T) => U {
          return (arg1, arg2) => func(f(arg1, arg2));
        }
        
        it('should be able to combine functions', () => {
          const add = (x: number, y: number): number => x + y;
          const stringify = (x: number): string => x.toString();
          
          expect(map(add, stringify)(1, 2)).to.equal('3');
        });
      });
    }),
    describe('Reader', () => {
      interface IReader<T> {
        read(): T;
      }
      
      class IdentityReader<T> implements IReader<T> {
        constructor(private value: T) {}
        read(): T {
          return this.value;
        }
      }
      
      class SquareReader implements IReader<number> {
        constructor(private value: number) {}
        read(): number {
          return this.value**2;
        }
      }
      
      describe('map', () => {
        function map<T, U>(reader: IReader<T>, f: (x: T) => U): IReader<U> {
          return new IdentityReader(f(reader.read()));
        }
        
        it('should be able to map', () => {
          const lily = new IdentityReader('lily');
          const howManyLetters = (s: { length: number }) => s.length;
          expect(map(lily, howManyLetters).read()).to.equal(4);
        }),
        it('should be able to combine readers', () => {
          const nine = new SquareReader(3);
          const increment = (x: number) => x + 1;
          expect(map(nine, increment).read()).to.equal(10);
        });
      });
    });
  }),
  describe('Monad', () => {
    interface IMonad<T> {
      map<U>(f: (x: T) => U): IMonad<U>;
      bind<U>(f: (x: T) => IMonad<U>): IMonad<U>;
      unit<T>(value: T): IMonad<T>;
    }
    
    describe('Box', () => {
      class Box<T> implements IMonad<T> {
        constructor(private value: T) {}
        getValue(): T {
          return this.value;
        }
        map<U>(f: (x: T) => U): Box<U> {
          return new Box(f(this.value));
        }
        bind<U>(f: (x: T) => Box<U>): Box<U> {
          return f(this.value);
        }
        unit<T>(value: T): Box<T> {
          return new Box(value);
        }
        static unit<T>(value: T): Box<T> {
          return new Box(value);
        }
      }
      
      it('should be able map and bind functions', () => {
        const lily = Box.unit<string>('lily');
        const howManyLetters: (s: { length: number }) => number =
          (s: { length: number }) => s.length;
        const squareBox: (x: number) => Box<number> = 
          (x: number) => Box.unit<number>(x**2);
        
        expect(lily.map(howManyLetters).bind(squareBox).getValue()).to.equal(16);
      }),
      it('should be able to chain functions', () => {
        const incrementBox: (x: number) => Box<number> =
          (x: number) => Box.unit<number>(x + 1);
        const squareBox: (x: number) => Box<number> =
          (x: number) => Box.unit<number>(x**2);
        const add2: (x: number) => number =
          (x: number) => x + 2;
        
        let one = Box.unit<number>(1);
        
        expect(
          one
            .map(add2)
            .bind(incrementBox)
            .bind(squareBox)
            .getValue()
        ).to.equal(16);
      }),
      it('Box should act like an Array for chaining', () => {
        const add8 = (x: number) => x + 8;
        const squareBox: (x: number) => Box<number> =
          (x: number) => Box.unit<number>(x**2);
        const squareArray: (x: number) => number[] =
          (x: number) => [x**2];
        
        let box = Box.unit<number>(1);
        let array = [1];
        
        expect(
          box
            .map(add8)
            .bind(squareBox)
            .getValue()
        ).to.equal(
          array
            .map(add8)
            .flatMap(squareArray)
            .reduce((m, x) => x, 0)
        );
      });
    }),
    describe('Lazy', () => {
      type Lazy<T> = () => T;
      
      function map<T, U>(f: (x: T) => U, lazy: Lazy<T>): Lazy<U> {
        return () => f(lazy());
      }
      
      function unit<T>(value: T): Lazy<T> {
        return () => value;
      }
      
      function bind<T, U>(f: (x: T) => Lazy<U>, lazy: Lazy<T>): Lazy<U> {
        return f(lazy());
      }
      
      describe('map', () => {
        it('should be able to map', () => {
          const three = unit(3);
          const increment = (x: number) => x + 1;
          expect(map(increment, three)()).to.equal(4);
        }),
        it('should be able to transform', () => {
          const lily = unit('lily');
          const howManyLetters = (s: { length: number }) => s.length;
          expect(map(howManyLetters, lily)()).to.equal(4);
        });
      }),
      describe('bind', () => {
        it('should be able to chain functions', () => {
          const incrementLazy: (x: number) => Lazy<number> =
            (x: number) => unit<number>(x + 1);
          const squareLazy: (x: number) => Lazy<number> =
            (x: number) => unit<number>(x**2);
          const add2: (x: number) => number =
            (x: number) => x + 2;
          
          const one = unit<number>(1);
          const process = 
            bind(squareLazy,
              bind(incrementLazy,
                map(add2, one)));
          
          expect(process()).to.equal(16);
        }),
        describe('unit', () => {
          it('should be able to create a Lazy', () => {
            const three = unit(3);
            expect(three()).to.equal(3);
            
            const lily = unit('Lily');
            expect(lily()).to.equal('Lily');
            
            const dog = unit({ name: 'Lily', age: 3, breed: 'Rat Terrier' });
            expect(dog().breed).to.equal('Rat Terrier');
          })
        })
      })
    })
  })
})