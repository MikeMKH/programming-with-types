import { expect } from 'chai'
import { beforeEach } from 'mocha';

declare const LbfsType: unique symbol;
declare const NsType: unique symbol;
declare const PercentageType: unique symbol;

describe('chapter 4', () => {
  describe('primitive obsession', () => {
    describe('trajectoryCorrection', () => {
      let wasDisintegrated = false;
      
      function disintegrate() {
        wasDisintegrated = true;
      }
      beforeEach(() => {
        wasDisintegrated = false;
      })
      it('should call disintegrate even if the types do not match', () => {
        function trajectoryCorrection(momentum: number) {
          if (momentum < 2 /* Ns */) {
            disintegrate();
          }
        }
        
        function provideMomentum() {
          trajectoryCorrection(1.5 /* lbfs */);
        }
        
        provideMomentum();
        expect(wasDisintegrated).to.be.true;
      }),
      it('should not call disintegrate if the types match', () => {
        // declare const NsType: unique symbol; // at top of file
        class Ns {
          readonly value: number;
          [NsType]: void;
          
          constructor(value: number) {
            this.value = value;
          }
        }
        
        // declare const LbfsType: unique symbol; // at top of file
        class Lbfs {
          readonly value: number;
          [LbfsType]: void;
          
          constructor(value: number) {
            this.value = value;
          }
        }
        
        function trajectoryCorrection(momentum: Ns) {
          if (momentum.value < new Ns(2).value) {
            disintegrate();
          }
        }
        
        function provideMomentum() {
          trajectoryCorrection(lbfsToNs(new Lbfs(1.5)));
        }
        
        function lbfsToNs(lbfs: Lbfs): Ns {
          return new Ns(lbfs.value * 4.4482216152605);
        }
        
        provideMomentum();
        expect(wasDisintegrated).to.be.false;
      });
    });
  }),
  describe('enforcing constraints', () => {
    describe('Percentage', () => {
      describe('constructor', () => {
        // declare const PercentageType: unique symbol; // at top of file
        class Percentage {
          readonly value: number;
          [PercentageType]: void;
          
          constructor(value: number) {
            if (value < 0 || value > 100) {
              throw new Error("Percentage must be between 0 and 100");
            }
            
            this.value = value;
          }
        }
        
        it('should throw an Error if value < 0', () => {
          expect(() => new Percentage(-1)).to.throw(Error);
        }),
        it('should throw an Error if value > 100', () => {
          expect(() => new Percentage(101)).to.throw(Error);
        }),
        it('should construct type if value >= 0 and <= 100', () => {
          expect(new Percentage(0)).to.be.ok;
          expect(new Percentage(1)).to.be.ok;
          expect(new Percentage(42)).to.be.ok;
          expect(new Percentage(99)).to.be.ok;
          expect(new Percentage(100)).to.be.ok;
        });
      }),
      describe('factory', () => {
        // declare const PercentageType: unique symbol; // at top of file
        class Percentage {
          readonly value: number;
          [PercentageType]: void;
          
          private constructor(value: number) {
            this.value = value;
          }
          static from(value: number): Percentage {
            if (value < 0 || value > 100) {
              throw new Error("Percentage must be between 0 and 100");
            }
            return new Percentage(value);
          }
        }
        
        it('should throw an Error if value < 0', () => {
          expect(() => Percentage.from(-1)).to.throw(Error);
        }),
        it('should throw an Error if value > 100', () => {
          expect(() => Percentage.from(101)).to.throw(Error);
        }),
        it('should construct type if value >= 0 and <= 100', () => {
          expect(Percentage.from(0)).to.be.ok;
          expect(Percentage.from(1)).to.be.ok;
          expect(Percentage.from(42)).to.be.ok;
          expect(Percentage.from(99)).to.be.ok;
          expect(Percentage.from(100)).to.be.ok;
        });
      });
    });
  }),
  describe('adding type information', () => {
    describe('explicit typing', () => {
      it('should throw a runtime error if it cannot be cast', () => {
        class A {
          foo(): void {
            // ...
          }
        }
        
        class B {}
        
        let b: B = new B();
        let fakeA: A = <A><unknown>b;
        expect(() => fakeA.foo()).to.throw(TypeError);
      });
    }),
    describe('upcast', () => {
      it('should not throw a runtime exception', () => {
        class A {
          foo(): void {
            // ...
          }
        }
        
        class B extends A {}
        
        let b: B = new B();
        let a: A = <A>b;
        expect(() => a.foo()).to.not.throw(TypeError);
      })
    }),
    describe('downcast', () => {
      it('should throw a runtime exception', () => {
        class A {
          foo(): void {
            // ...
          }
        }
        
        class B extends A {
          bar(): void {
            // ...
          }
        }
        
        let a: A = new A();
        let b: B = <B>a;
        expect(() => b.foo()).to.not.throw(TypeError);
        expect(() => b.bar()).to.throw(TypeError);
      });
    }),
    describe('widening cast', () => {
      it('should widening to large type', () => {
        let a: number = 123;
        let b: bigint = <bigint><unknown>a;
        expect(b).to.equal(123);
      });
    }),
    describe('narrowing cast', () => {
      it('should not narrow to smaller type', () => {
        let a: bigint = BigInt(123);
        let b: number = <number><unknown>a;
        expect(b).to.equal(BigInt(123));
      });
    });
  });
});