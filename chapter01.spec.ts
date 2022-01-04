import { expect } from 'chai'

describe('chapter 1', () => {
  describe('data as code', () => {
    describe('eval', () => {
      it('should be able to run data as code', () => {
        expect(eval('1 + 1')).to.equal(2);
      })
    });
  }),
  describe('correctness', () => {
    describe('any', () => {
      function scriptAt(s: any) {
        return s.indexOf('Script');
      }
      it('should given runtime TypeError if not able to be applied', () => {
       expect(scriptAt('TypeScript')).to.equal(4);
       expect(scriptAt('JavaScript')).to.equal(4);
       expect(scriptAt('C#')).to.equal(-1);
       expect(() => scriptAt(42)).to.throw(TypeError); // TypeError: s.indexOf is not a function
      });
    }),
    describe('typed', () => {
      function scriptAt(s: string): number {
        return s.indexOf('Script');
      }
      it('should not compile if given wrong type', () => {
        expect(scriptAt('TypeScript')).to.equal(4);
        expect(scriptAt('JavaScript')).to.equal(4);
        // expect(scriptAt(42)).to.equal(-1); // error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.
      });
    });
  }),
  describe('encapsulation', () => {
    describe('public does not protect', () => {
      class SafeDivisor {
        divisor: number;
        constructor(private readonly value: number) {
          if (value <= 0) {
            throw new Error('d must be positive');
          }
          this.divisor = value;
        }
        divide(x: number): number {
          return x / this.divisor;
        }
      }
      it('should not protect the value from being changes', () => {
        const d = new SafeDivisor(2);
        expect(d.divide(10)).to.equal(5);
        
        d.divisor = 0;
        expect(d.divide(10)).to.equal(Infinity);
      });
    }),
    describe('private does protect', () => {
      class SafeDivisor {
        private divisor: number;
        constructor(private readonly value: number) {
          if (value <= 0) {
            throw new Error('d must be positive');
          }
          this.divisor = value;
        }
        divide(x: number): number {
          return x / this.divisor;
        }
      }
      it('should protect the value from being changes', () => {
        const d = new SafeDivisor(2);
        expect(d.divide(10)).to.equal(5);
        
        // d.divisor = 0; // error TS2341: Property 'divisor' is private and only accessible within class 'SafeDivisor'.
      });
    });
  })
})