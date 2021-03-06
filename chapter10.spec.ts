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
  }),
  describe('constrained typed parameters', () => {
    it('should be able to constrain types', () => {
      interface HasLength {
        length: number;
      }
      
      function getLength<T extends HasLength>(x: T): number {
        return x.length;
      }
      
      expect(getLength('hello')).to.equal(5);
      expect(getLength([1, 2, 3])).to.equal(3);
      expect(getLength({ length: 5 })).to.equal(5);
      expect(getLength({ length: 5, toString: () => 'hello' })).to.equal(5);
      expect(getLength({ length: 5, toString: () => 'hello', valueOf: () => 'hello' })).to.equal(5);      
    }),
    describe('ComparisonResult', () => {
      enum ComparisonResult {
        LessThan,
        Equal,
        GreaterThan
      }
      
      interface IComparable<T> {
        compareTo(other: T): ComparisonResult;
      }
      
      class ComparableNumber implements IComparable<ComparableNumber> {
        private value: number;
        constructor(value: number) {
          this.value = value;
        }
        compareTo(other: ComparableNumber): ComparisonResult {
          if (this.value < other.value) {
            return ComparisonResult.LessThan;
          }
          if (this.value > other.value) {
            return ComparisonResult.GreaterThan;
          }
          return ComparisonResult.Equal;
        }
      }
      
      function clamp<T extends IComparable<T>>(x: T, min: T, max: T): T {
        if (x.compareTo(min) === ComparisonResult.LessThan) {
          return min;
        }
        if (x.compareTo(max) === ComparisonResult.GreaterThan) {
          return max;
        }
        return x;
      }
      
      it('should be able to clamp values', () => {
        const zero = new ComparableNumber(0);
        const one = new ComparableNumber(1);
        const two = new ComparableNumber(2);
        expect(clamp(one, zero, two)).to.deep.equal(one);
      });
    });
  }),
  describe('reverse order', () => {
    interface IReadable<T> {
      get(): T;
    }
    
    interface IIncrementable<T> {
      increment(): void;
    }
    
    interface IInputIterator<T> extends IReadable<T>, IIncrementable<T> {
      equals(other: IInputIterator<T>): boolean;
    }
    
    interface IWriteable<T> {
      set(value: T): void;
    }
    
    interface IOutputIterator<T> extends IWriteable<T>, IIncrementable<T> {
      equals(other: IOutputIterator<T>): boolean;
    }
    
    class LinkedListNode<T> {
      value: T;
      next: LinkedListNode<T> | null;
      constructor(value: T, next: LinkedListNode<T> | null = null) {
        this.value = value;
        this.next = next;
      }
    }
    
    class LinkedListInputIterator<T> implements IInputIterator<T> {
      private node: LinkedListNode<T> | null;
      constructor(node: LinkedListNode<T> | null) {
        this.node = node;
      }
      
      get(): T {
        if (this.node === null) {
          throw new Error('Iterator is empty');
        }
        
        return this.node.value;
      }
      
      increment(): void {
        if (this.node === null) {
          throw new Error('Iterator is empty');
        }
        
        this.node = this.node.next;
      }
      
      equals(other: IInputIterator<T>): boolean {
        return this.node?.value === (<LinkedListInputIterator<T>>other).node?.value;
      }
    }
    
    class SpyOutputIterator<T> implements IOutputIterator<T> {
      readonly value: T[];
      constructor(value: T[] = []) {
        this.value = value;
      }
      
      set(value: T): void {
        this.value.push(value);
      }
      
      increment(): void {
        // no-op
      }
      
      equals(other: IOutputIterator<T>): boolean {
        return false;
      }
    }
    
    function map<T, U>(
      begin: IInputIterator<T>,
      end: IInputIterator<T>,
      output: IOutputIterator<U>,
      mapper: (value: T) => U
    ): void {
      while (!begin.equals(end)) {
        output.set(mapper(begin.get()));
        begin.increment();
        output.increment();
      }
    }
    
    interface IForwardIterator<T> extends IReadable<T>, IWriteable<T>, IIncrementable<T> {
      equals(other: IForwardIterator<T>): boolean;
      clone(): IForwardIterator<T>;
    }
    
    class LinkedListForwardIterator<T> implements IForwardIterator<T> {
      private node: LinkedListNode<T> | null;
      constructor(node: LinkedListNode<T> | null) {
        this.node = node;
      }
      
      get(): T {
        if (this.node === null) {
          throw new Error('Iterator is empty');
        }
        return this.node.value;
      }
      
      set(value: T): void {
        if (this.node === null) {
          throw new Error('Iterator is empty');
        }
        this.node.value = value;
      }
      
      increment(): void {
        if (this.node === null) return;
        this.node = this.node.next;
      }
      
      equals(other: IForwardIterator<T>): boolean {
        return this.node?.value === (<LinkedListForwardIterator<T>>other).node?.value;
      }
      
      clone(): IForwardIterator<T> {
        return new LinkedListForwardIterator<T>(this.node);
      }
    }
    
    interface IBackwardsIterator<T> extends IReadable<T>, IWriteable<T>, IIncrementable<T> {
      decrement(): void;
      equals(other: IBackwardsIterator<T>): boolean;
      clone(): IBackwardsIterator<T>;
    }
    
    class BackwardsArrayIterator<T> implements IBackwardsIterator<T> {
      private index: number;
      private array: T[];
      constructor(array: T[], index: number = 0) {
        this.array = array;
        this.index = index;
      }
      
      get(): T {
        if (this.index < 0) {
          throw new Error('Iterator is empty');
        }
        return this.array[this.index];
      }
      
      set(value: T): void {
        if (this.index < 0) {
          throw new Error('Iterator is empty');
        }
        this.array[this.index] = value;
      }
      
      decrement(): void {
        if (this.index < 0) {
          throw new Error('Iterator is empty');
        }
        this.index--;
      }
      
      increment(): void {
        if (this.index < 0) {
          throw new Error('Iterator is empty');
        }
        this.index++;
      }
      
      equals(other: IBackwardsIterator<T>): boolean {
        return this.index === (<BackwardsArrayIterator<T>>other).index;
      }
      
      clone(): IBackwardsIterator<T> {
        return new BackwardsArrayIterator(this.array, this.index);
      }
    }
    
    function find<T>(
      begin: IForwardIterator<T>,
      end: IForwardIterator<T>,
      predicate: (value: T) => boolean
    ): IForwardIterator<T> {
      while (!begin.equals(end)) {
        if (predicate(begin.get())) {
          return begin;
        }
        begin.increment();
      }
      return end;
    }
    
    function reverse<T>(
      begin: IBackwardsIterator<T>,
      end: IBackwardsIterator<T>
    ): IBackwardsIterator<T> {
      while (!begin.equals(end)) {
        end.decrement();
        if (begin.equals(end)) {
          return begin;
        }
        
        swap(begin, end);
        begin.increment();
      }
      
      return begin;
      
      function swap<T>(a: IBackwardsIterator<T>, b: IBackwardsIterator<T>): void {
        const temp = begin.get();
        begin.set(end.get());
        end.set(temp);
      }
    }
    
    interface IRandomAccessIterator<T> extends IReadable<T>, IWriteable<T>, IIncrementable<T> {
      decrement(): void;
      equals(other: IRandomAccessIterator<T>): boolean;
      clone(): IRandomAccessIterator<T>;
      move(n: number): void;
      distance(other: IRandomAccessIterator<T>): number;
    }
    
    class RandomArrayIterator<T> implements IRandomAccessIterator<T> {
      private array: T[];
      private index: number;
      constructor(array: T[], index: number = 0) {
        this.array = array;
        this.index = index;
      }
      
      get(): T {
        if (this.index < 0) {
          throw new Error('Iterator is empty');
        }
        return this.array[this.index];
      }
      
      set(value: T): void {
        if (this.index < 0) {
          throw new Error('Iterator is empty');
        }
        this.array[this.index] = value;
      }
      
      decrement(): void {
        if (this.index < 0) {
          throw new Error('Iterator is empty');
        }
        this.index--;
      }
      
      increment(): void {
        if (this.index < 0) {
          throw new Error('Iterator is empty');
        }
        this.index++;
      }
      
      equals(other: IRandomAccessIterator<T>): boolean {
        return this.index === (<RandomArrayIterator<T>>other).index;
      }
      
      move(n: number): void {
        if (this.index < 0) {
          throw new Error('Iterator is empty');
        }
        this.index += n;
      }
      
      distance(other: IRandomAccessIterator<T>): number { 
        return (<RandomArrayIterator<T>>other).index - this.index;
      }
      
      clone(): IRandomAccessIterator<T> {
        return new RandomArrayIterator(this.array, this.index);
      }
    }
    
    function elementAt<T>(
      begin: IRandomAccessIterator<T>,
      end: IRandomAccessIterator<T>,
      index: number
    ): IRandomAccessIterator<T> {
      const distance = begin.distance(end);
      if (index > distance) {
        throw new Error('Index out of bounds');
      }
      begin.move(index);
      return begin;
    }
    
    function nthLastForwardIterator<T>(
      begin: IForwardIterator<T>,
      end: IForwardIterator<T>,
      n: number
    ): IForwardIterator<T> {
      const result: IForwardIterator<T> = begin.clone();
      let size: number = 0;
      
      while(!begin.equals(end)) {
        begin.increment();
        size++;
      }
      
      let index: number = 1;
      while(!result.equals(end) && size - n > index) {
        result.increment();
        index++;
      }
      
      return result;
    }
    
    function nthLastBackwardIterator<T>(
      begin: IBackwardsIterator<T>,
      end: IBackwardsIterator<T>,
      n: number
    ): IBackwardsIterator<T> {
      while(!begin.equals(end) && n >= 0) {
        end.decrement();
        n--;
      }
      return end;
    }
    
    function isBackwardsIterator<T>(iter: IForwardIterator<T>): iter is IBackwardsIterator<T> {
      return "decrement" in iter;
    }
    
    function nthLast<T>(
      begin: IForwardIterator<T>,
      end: IForwardIterator<T>,
      n: number
    ): IForwardIterator<T> {
      if(isBackwardsIterator(begin) && isBackwardsIterator(end)) {
        return nthLastBackwardIterator(begin, end, n);
      }
      return nthLastForwardIterator(begin, end, n);
    }
      
    it('should be able to traverse a linked list', () => {
      const done = new LinkedListNode<number>(Number.MIN_VALUE);
      const list = new LinkedListNode<number>(1, new LinkedListNode<number>(2, new LinkedListNode<number>(3, done)));
      const spy = new SpyOutputIterator<number>();
      map(
        new LinkedListInputIterator<number>(list),
        new LinkedListInputIterator<number>(done),
        spy,
        x => x);
      expect(spy.value).to.deep.equal([1, 2, 3]);
    }),
    it('should be able to find a value in a linked list', () => {
      const done = new LinkedListNode<number>(Number.MIN_VALUE);
      const list = new LinkedListNode<number>(1, new LinkedListNode<number>(2, new LinkedListNode<number>(3, done)));
      const spy = new SpyOutputIterator<number>();
      const found = find(
        new LinkedListForwardIterator<number>(list),
        new LinkedListForwardIterator<number>(done),
        x => x === 2);
      expect(found.get()).to.equal(2);
      
      found.set(4);
      expect(found.get()).to.equal(4);
      
      const findNext = find(
        new LinkedListForwardIterator<number>(list),
        new LinkedListForwardIterator<number>(done),
        x => x === 4);
      expect(findNext.get()).to.equal(4);
    }),
    it('should be able to reverse an array', () => {
      const array = [1, 2, 3];
      reverse(
        new BackwardsArrayIterator<number>(array),
        new BackwardsArrayIterator<number>(array, array.length));
      expect(array).to.deep.equal([3, 2, 1]);
    }),
    it('should be able to get an element in an array', () => {
      const array = [1, 2, 3];
      
      const first = elementAt(
        new RandomArrayIterator<number>(array),
        new RandomArrayIterator<number>(array, array.length),
        1);
      expect(first.get()).to.equal(2);
      
      const last = elementAt(
        new RandomArrayIterator<number>(array),
        new RandomArrayIterator<number>(array, array.length),
        array.length - 1);
      expect(last.get()).to.equal(3);
    }),
    it('should be able to iterate through elements with elementAt', () => {
      const array = ['good', 'bad', 'ugly'];
      const start = new RandomArrayIterator<string>(array);
      const end = new RandomArrayIterator<string>(array, array.length);
      
      let element = elementAt(start, end, 0);
      expect(element.get()).to.equal('good');
      
      element = elementAt(start, end, 1);
      expect(element.get()).to.equal('bad');
      
      element = elementAt(start, end, 1);
      expect(element.get()).to.equal('ugly');  
    }),
    it('should be able to get nth last element with nthLastForwardIterator', () => {
      const done = new LinkedListNode<number>(Number.MIN_VALUE);
      const list = new LinkedListNode<number>(1, new LinkedListNode<number>(2, new LinkedListNode<number>(3, done)));
      const nth = nthLastForwardIterator(
        new LinkedListForwardIterator<number>(list),
        new LinkedListForwardIterator<number>(done),
        1);
      expect(nth.get()).to.equal(2);
    }),
    it('should be able to get nth last element with nthLastBackwardIterator', () => {
      const array = [1, 2, 3];
      const nth = nthLastBackwardIterator(
        new BackwardsArrayIterator<number>(array),
        new BackwardsArrayIterator<number>(array, array.length),
        1);
      expect(nth.get()).to.equal(2);
    }),
    it('should be able to get nth last element with nthLast', () => {
      const array = [1, 2, 3];
      const backwards = nthLast(
        new BackwardsArrayIterator<number>(array),
        new BackwardsArrayIterator<number>(array, array.length),
        1);
      expect(backwards.get()).to.equal(2);
      
      const done = new LinkedListNode<number>(Number.MIN_VALUE);
      const list = new LinkedListNode<number>(1, new LinkedListNode<number>(2, new LinkedListNode<number>(3, done)));
      const forward = nthLast(
        new LinkedListForwardIterator<number>(list),
        new LinkedListForwardIterator<number>(done),
        1);
      expect(forward.get()).to.equal(2);
    })
  })
})