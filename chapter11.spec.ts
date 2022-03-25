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
        })
      })
    })
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
      })
    })
  })
})