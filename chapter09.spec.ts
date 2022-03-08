import { expect } from 'chai'

describe('generic data structures', () => {
  describe('Box', () => {
    class Box<T> {
      private readonly value: T;
      
      constructor(value: T) {
        this.value = value;
      }
      
      get(): T {
        return this.value;
      }
      
      map<U>(f: (value: T) => U): Box<U> {
        return new Box<U>(f(this.value));
      }
    }
    
    it('should be able to hold any type', () => {
      let num: Box<number> = new Box<number>(10);
      expect(num.get()).to.equal(10);
      
      let str: Box<string> = new Box<string>('hello');
      expect(str.get()).to.equal('hello');
      
      let bool: Box<boolean> = new Box<boolean>(true);
      expect(bool.get()).to.equal(true);
      
      let obj: Box<object> = new Box<object>({});
      expect(obj.get()).to.deep.equal({});
      
      let arr: Box<Array<number>> = new Box<Array<number>>([1, 2, 3]);
      expect(arr.get()).to.deep.equal([1, 2, 3]);
    }),
    it('should be able to apply a transformation', () => {
      let num: Box<number> = new Box<number>(10);
      let str: Box<string> = num.map(x => x / 2).map(x => x.toString());
      expect(str.get()).to.equal('5');
    }),
    it('unbox should be able to get a value out of a Box', () => {
      function unbox<T>(box: Box<T>): T {
        return box.get();
      }
      
      let num: Box<number> = new Box<number>(10);
      expect(unbox(num)).to.equal(10);
    })
  })
});