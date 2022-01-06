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
  }),
  describe('reference', () => {
    class Dog {
      constructor(public name: string) {}
    }
    
    it('two references should point to the same instance', () => {
      let littleGirl = new Dog('Lily');
      let furryDaughter = littleGirl;
      
      expect(littleGirl.name).to.equal(furryDaughter.name);
      expect(littleGirl).to.equal(furryDaughter);
      
      littleGirl.name = 'Lily Harris';
      expect(furryDaughter.name).to.equal('Lily Harris');
      expect(littleGirl).to.equal(furryDaughter);
    })
  }),
  describe('associative array', () => {
    it('should be able to store key value pairs', () => {
      let array: { [key: string]: string } = {};
      array['key'] = 'value';
      expect(array['key']).to.equal('value');
    }),
    it('should be able to store multiple key value pairs', () => {
      let array: { [key: string]: string } = {};
      array['key1'] = 'value1';
      array['key2'] = 'value2';
      expect(array['key1']).to.equal('value1');
      expect(array['key2']).to.equal('value2');
    }),
    describe('TypeScript array', () => {
      it('should be able to store multiple key value pairs', () => {
        let array: Array<string> = [];
        array.push('value1');
        array.push('value2');
        expect(array[0]).to.equal('value1');
        expect(array[1]).to.equal('value2');
      }),
      it('should be able to store arbitrary key value pairs', () => {
        let array: Array<string> = [];
        array[100] = 'value1';
        array[42] = 'value2';
        
        expect(array[100]).to.equal('value1');
        expect(array[42]).to.equal('value2');
        
        expect(array.length).to.not.equal(2);
        expect(array.length).to.equal(101);
        expect(array[0]).to.equal(undefined);
        expect(array[8]).to.equal(undefined);
      });
    });
  });
});