import { expect } from 'chai'

describe('chapter 2', () => {
  describe('empty type', () => {
    describe('raise', () => {
      function raise(message: string): never {
        throw new Error(message)
      }
      it('should only throw an Exception, it should not return', () => {
        expect(() => raise('test')).to.throw('test'); 
      });
    });
  }),
  describe('unit type', () => {
    describe('spy', () => {
      let seen: any;
      function spy(value: any): void {
        seen = value;
      }
      
      it('should set the value passed, it should only have a side effect', () => {
        spy(1);
        expect(seen).to.equal(1);
        
        spy('hello Lily');
        expect(seen).to.equal('hello Lily');
      });
    });
  }),
  describe('boolean short circuit', () => {
    describe('and', () => {
      it('should only evaluate the first condition if it is false', () => {
        let fWasCalled = false;
        function f(): boolean {
          fWasCalled = true;
          return false;
        }
        
        let gWasCalled = false;
        function g(): boolean {
          gWasCalled = true;
          return true;
        }
        
        expect(f() && g()).to.equal(false);
        expect(fWasCalled).to.equal(true);
        expect(gWasCalled).to.equal(false);
      });
    });
  }),
  describe('numerical types', () => {
    describe('float point', () => {
      it('should be able to do math', () => {
        let x = 0.1;
        let y = 0.2;
        expect(x + y).to.not.equal(0.3);
        
        function eplisonEquals(a: number, b: number): boolean {
          return Math.abs(a - b) < Number.EPSILON;
        }
        expect(eplisonEquals(x + y, 0.3)).to.equal(true);
      });
    });
  })
})