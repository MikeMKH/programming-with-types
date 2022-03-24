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