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
  }),
  describe('traversing', () => {
    describe('BinaryTree', () => {
      class BinaryTreeNode<T> {
        value: T;
        left: BinaryTreeNode<T> | null;
        right: BinaryTreeNode<T> | null;
        
        constructor(value: T, left: BinaryTreeNode<T> | null, right: BinaryTreeNode<T> | null) {
          this.value = value;
          this.left = left;
          this.right = right;
        }
      }
      
      class BinaryTreeIterator<T> implements Iterable<T> {
        private readonly root: BinaryTreeNode<T>;
        
        constructor(root: BinaryTreeNode<T>) {
          this.root = root;
        }
        
        *[Symbol.iterator](): Iterator<T> {
          yield this.root.value;
          
          if (this.root.left) {
            yield* new BinaryTreeIterator(this.root.left);
          }
          
          if (this.root.right) {
            yield* new BinaryTreeIterator(this.root.right);
          }
        }
      }
      it('should be able to iterate', () => {
        const root = new BinaryTreeNode<number>(10, null, null);
        const left = new BinaryTreeNode<number>(5, null, null);
        const right = new BinaryTreeNode<number>(15, null, null);
        root.left = left;
        root.right = right;
        
        const iterator = new BinaryTreeIterator(root);
        expect([...iterator]).to.deep.equal([10, 5, 15]); 
      }),
      it('should be able to iterate in reverse', () => {
        const root = new BinaryTreeNode<number>(10, null, null);
        const left = new BinaryTreeNode<number>(5, null, null);
        const right = new BinaryTreeNode<number>(15, null, null);
        root.left = left;
        root.right = right;
        
        const iterator = new BinaryTreeIterator(root);
        expect([...iterator].reverse()).to.deep.equal([15, 5, 10]); 
      }),
      it('should be able to iterate in the correct order', () => {
        const root = new BinaryTreeNode<number>(10, null, null);
        
        const left1 = new BinaryTreeNode<number>(5, null, null);
        const right1 = new BinaryTreeNode<number>(15, null, null);
        root.left = left1;
        root.right = right1;
        
        const left2 = new BinaryTreeNode<number>(2, null, null);
        const right2 = new BinaryTreeNode<number>(7, null, null);
        left1.left = left2;
        left1.right = right2;
        
        const left3 = new BinaryTreeNode<number>(1, null, null);
        right2.right = left3;
        
        const left4 = new BinaryTreeNode<number>(6, null, null);
        left3.left = left4;
        
        const iterator = new BinaryTreeIterator(root);
        expect([...iterator]).to.deep.equal([10, 5, 2, 7, 1, 6, 15]); 
      });
    }),
    describe('ArrayBackwardsIterator', () => {
      function* arrayBackwardsIterator<T>(array: T[]): IterableIterator<T> {
        for (let i = array.length - 1; i >= 0; i--) {
          yield array[i];
        }
      }
      
      it('should be able to iterate backwards', () => {
        const array = [1, 2, 3];
        expect([...arrayBackwardsIterator(array)]).to.deep.equal([3, 2, 1]);
      }),
      it('should be able to iterate backwards in reverse', () => {
        const array = ['Goodbye', 'World'];
        expect([...arrayBackwardsIterator(array)].reverse()).to.deep.equal([...array]);
      });
    });
  }),
  describe('streaming data', () => {
    function* count(): IterableIterator<number> {
      let i = 1;
      while (true) {
        yield i++;
      }
    }
    
    function* take<T>(count: number, iterable: Iterable<T>): IterableIterator<T> {
      let i = 0;
      for (const item of iterable) {
        if (i >= count) {
          break;
        }
        yield item;
        i++;
      }
    }
    
    function* drop<T>(count: number, iterable: Iterable<T>): IterableIterator<T> {
      let i = 0;
      for (const item of iterable) {
        if (i >= count) {
          yield item;
        }
        i++;
      }
    }
    
    function* I<T>(value: T): IterableIterator<T> {
      while(true) {
        yield value;
      }
    }
    
    it('count should give values in order', () => {
      let counter = count();
      expect(counter.next().value).to.equal(1);
      expect(counter.next().value).to.equal(2);
      expect(counter.next().value).to.equal(3);
      expect(counter.next().done).to.equal(false);
    }),
    it('take should get n values', () => {
      let counter = take(3, count());
      expect([...counter]).to.deep.equal([1, 2, 3]);
      expect(counter.next().done).to.equal(true);
    }),
    it('drop should skip n values', () => {
      let counter = drop(2, count());
      expect(counter.next().value).to.equal(3);
      expect(counter.next().value).to.equal(4);
      expect(counter.next().done).to.equal(false);
    }),
    it('take and drop should get range of n values', () => {
      let counter = take(5, drop(5, count()));
      expect([...counter]).to.deep.equal([6, 7, 8, 9, 10]);
      expect(counter.next().done).to.equal(true);
    }),
    it('I should always return value given', () => {
      const hello = I('Hello');
      expect(hello.next().value).to.equal('Hello');
      expect(hello.next().value).to.equal('Hello');
      expect(hello.next().value).to.equal('Hello');
      expect(hello.next().done).to.equal(false);
    }),
    it('I and take should give n values', () => {
      const hello = take(3, I('Lily'));
      expect([...hello]).to.deep.equal(['Lily', 'Lily', 'Lily']);
      expect(hello.next().done).to.equal(true);
    })
  })
});