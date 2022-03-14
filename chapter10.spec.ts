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
    })
  })
})