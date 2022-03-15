import { expect } from 'chai'

describe('generic algorithms', () => {
  describe('pipeline', () => {
    it('should be able to concat non-empty strings', () => {
      const pipeline = (...args: string[]) => args.filter(s => s).join('');
      
      expect(pipeline('a', 'b', 'c')).to.equal('abc');
      expect(pipeline('a', '', 'c')).to.equal('ac');
      expect(pipeline('', '')).to.equal('');
      expect(pipeline('', 'x')).to.equal('x');
      expect(pipeline()).to.equal('');
    }),
    it('should be able to square odd numbers', () => {
      const squareOdds = (...args: number[]) => args.filter(n => n % 2 === 1).map(n => n * n);
      
      expect(squareOdds(1, 2, 3, 4, 5, 6, 7)).to.deep.equal([1, 9, 25, 49]);
      expect(squareOdds()).to.deep.equal([]);
      expect(squareOdds(2)).to.deep.equal([]);
      expect(squareOdds(2, 4, 42)).to.deep.equal([]);
      expect(squareOdds(1, 1)).to.deep.equal([1, 1]);
      expect(squareOdds(11)).to.deep.equal([121]);
    }),
    it('should be able to fizzbuzz 0 to 10', () => {
      function fizzer(n: number) {
        return n % 3 === 0 ? 'Fizz' : '';
      }
      
      function buzzer(n: number) {
        return n % 5 === 0 ? 'Buzz' : '';
      }
      
      function fizzbuzzer(x: number): string {
        const result = [fizzer, buzzer].map(f => f(x)).filter(s => s).join('');
        return result || x.toString();
      }
      
      const pipeline = (...args: number[]) => args.map(fizzbuzzer);
        
      expect(pipeline(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10))
        .to.deep.equal(['FizzBuzz', '1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz']);
    });
  }),
  describe('composition', () => {
    class FluentIterable<T> {
      private iter: Iterable<T>;
      constructor(iter: Iterable<T>) {
        this.iter = iter;
      }
      
      result(): Iterable<T> {
        let result: T[] = [];
        for (const item of this.iter) {
          result.push(item);
        }
        return result;
      }
      
      private *mapImpl<U>(f: (x: T) => U): IterableIterator<U> {
        for (const x of this.iter) {
          yield f(x);
        }
      }
      
      map<U>(f: (x: T) => U): FluentIterable<U> {
        return new FluentIterable(this.mapImpl(f));
      }
      
      private *filterImpl(f: (x: T) => boolean): IterableIterator<T> {
        for (const x of this.iter) {
          if (f(x)) {
            yield x;
          }
        }
      }
      
      filter(f: (x: T) => boolean): FluentIterable<T> {
        return new FluentIterable(this.filterImpl(f));
      }
      
      reduce<U>( initial: U, f: (acc: U, x: T) => U): U {
        let acc = initial;
        for (const x of this.iter) {
          acc = f(acc, x);
        }
        return acc;
      }
      
      private *takeImpl(n: number): IterableIterator<T> {
        let i = 0;
        for (const x of this.iter) {
          if (i++ >= n) {
            break;
          }
          yield x;
        }
      }
      
      take(n: number): FluentIterable<T> {
        return new FluentIterable(this.takeImpl(n));
      }
      
      private *dropImpl(n: number): IterableIterator<T> {
        let i = 0;
        for (const x of this.iter) {
          if (i++ >= n) {
            yield x;
          }
        }
      }
      
      drop(n: number): FluentIterable<T> {
        return new FluentIterable(this.dropImpl(n));
      }
    }
    
    it('should give results', () => {
      const result = (new FluentIterable([1, 2, 3, 4, 5])).result();
      expect(result).to.deep.equal([1, 2, 3, 4, 5]);
    }),
    it('should be able to map', () => {
      const result = (new FluentIterable([1, 2, 3, 4, 5])).map(x => x * x).result();
      expect(result).to.deep.equal([1, 4, 9, 16, 25]);
    }),
    it('should be able to filter', () => {
      const result = (new FluentIterable([1, 2, 3, 4, 5])).filter(x => x % 2 === 0).result();
      expect(result).to.deep.equal([2, 4]);
    }),
    it('should be able to reduce', () => {
      const result = (new FluentIterable([1, 2, 3, 4, 5])).reduce(0, (acc, x) => acc + x);
      expect(result).to.equal(15);
    }),
    it('should be able to compose', () => {
      const result = (new FluentIterable([1, 2, 3, 4, 5]))
        .map(x => x * x)
        .filter(x => x % 2 === 0)
        .reduce(0, (acc, x) => acc + x);
      expect(result).to.equal(20);
    }),
    it('should be able to take', () => {
      const result = (new FluentIterable([1, 2, 3, 4, 5]))
        .take(3)
        .result();
      expect(result).to.deep.equal([1, 2, 3]);
    }),
    it('should be able to drop', () => {
      const result = (new FluentIterable([1, 2, 3, 4, 5]))
        .drop(3)
        .result();
      expect(result).to.deep.equal([4, 5]);
    });
  })
})