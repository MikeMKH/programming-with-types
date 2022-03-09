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
    });
  }),
  describe('Stack', () => {
    class Stack<T> {
      private readonly values: T[];
      
      constructor() {
        this.values = [];
      }
      
      push(value: T): void {
        this.values.push(value);
      }
      
      pop(): T {
        if (this.values.length === 0) {
          throw new Error('Stack is empty');
        }
        return this.values.pop()!;
      }
      
      peek(): T {
        if (this.values.length === 0) {
          throw new Error('Stack is empty');
        }
        return this.values[this.values.length - 1];
      }
    }
    it('should add item with push', () => {
      const stack = new Stack<number>();
      stack.push(10);
      expect(stack.peek()).to.equal(10);
    }),
    it('should remove item with pop', () => {
      const stack = new Stack<number>();
      stack.push(10);
      expect(stack.pop()).to.equal(10);
    }),
    it('should throw error when popping empty stack', () => {
      const stack = new Stack<number>();
      expect(() => stack.pop()).to.throw(Error);
    }),
    it('should throw error when peeking empty stack', () => {
      const stack = new Stack<number>();
      expect(() => stack.peek()).to.throw(Error);
    }),
    it('should be able to peek at the top of the stack', () => {
      const stack = new Stack<string>();
      stack.push('hello');
      expect(stack.peek()).to.equal('hello');
    }),
    it('should be LIFO', () => {
      const stack = new Stack<string>();
      stack.push('hello');
      stack.push('world');
      expect(stack.pop()).to.equal('world');
      expect(stack.pop()).to.equal('hello');
    });
  }),
  describe('Queue', () => {
    class Queue<T> {
      private readonly values: T[];
      
      constructor() {
        this.values = [];
      }
      
      enqueue(value: T): void {
        this.values.push(value);
      }
      
      dequeue(): T {
        if (this.values.length === 0) {
          throw new Error('Queue is empty');
        }
        return this.values.shift()!;
      }
      
      peek(): T {
        if (this.values.length === 0) {
          throw new Error('Queue is empty');
        }
        return this.values[0];
      }
    }
    
    it('should add item with enqueue', () => {
      const queue = new Queue<number>();
      queue.enqueue(10);
      expect(queue.peek()).to.equal(10);
    }),
    it('should remove item with dequeue', () => {
      const queue = new Queue<number>();
      queue.enqueue(10);
      expect(queue.dequeue()).to.equal(10);
    }),
    it('should throw error when dequeuing empty queue', () => {
      const queue = new Queue<number>();
      expect(() => queue.dequeue()).to.throw(Error);
    }),
    it('should throw error when peeking empty queue', () => {
      const queue = new Queue<number>();
      expect(() => queue.peek()).to.throw(Error);
    }),
    it('should be able to peek at the top of the queue', () => {
      const queue = new Queue<string>();
      queue.enqueue('hello');
      expect(queue.peek()).to.equal('hello');
    }),
    it('should be FIFO', () => {
      const queue = new Queue<string>();
      queue.enqueue('hello');
      queue.enqueue('world');
      expect(queue.dequeue()).to.equal('hello');
      expect(queue.dequeue()).to.equal('world');
    })
  }),
  describe('Pair', () => {
    class Pair<T, U> {
      private readonly first: T;
      private readonly second: U;
      
      constructor(first: T, second: U) {
        this.first = first;
        this.second = second;
      }
      
      getFirst(): T {
        return this.first;
      }
      
      getSecond(): U {
        return this.second;
      }
    }
    
    it('should be able to get first and second', () => {
      const pair = new Pair<number, string>(10, 'hello');
      expect(pair.getFirst()).to.equal(10);
      expect(pair.getSecond()).to.equal('hello');
    });
  })
});