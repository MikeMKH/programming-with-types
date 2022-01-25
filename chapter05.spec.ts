import { expect } from 'chai'
import { beforeEach } from 'mocha';

describe('chapter 5', () => {
  describe('strategy pattern', () => {
    describe('object oriented', () => {
      class Foo {}
      
      interface IStrategy {
        execute(foo: Foo): string;
      }
      
      class LilyStrategy implements IStrategy {
        execute(foo: Foo): string {
          return 'lily';
        }
      }
      
      class KelseyStrategy implements IStrategy {
        execute(foo: Foo): string {
          return 'kelsey';
        }
      }
      
      class Bar {
        service(foo: Foo, strategy: IStrategy): string {
          return strategy.execute(foo);
        }
      }
      
      it('should return strategy result based on type', () => {
        const bar = new Bar();
        const foo = new Foo();
        const lily = new LilyStrategy;
        const kelsey = new KelseyStrategy();
        
        expect(bar.service(foo, lily)).to.equal('lily');
        expect(bar.service(foo, kelsey)).to.equal('kelsey');
      });
    }),
    describe('functional', () => {
      class Foo {}
      
      type NameStrategy = (foo: Foo) => string;
      
      const lily: NameStrategy = foo => 'lily';
      const kelsey: NameStrategy = foo => 'kelsey';
      
      class Bar {
        service(foo: Foo, strategy: NameStrategy): string {
          return strategy(foo);
        }
      }
      
      it('should return strategy result based on type', () => {
        const bar = new Bar();
        const foo = new Foo();
        
        expect(bar.service(foo, lily)).to.equal('lily');
        expect(bar.service(foo, kelsey)).to.equal('kelsey');
      });
    });
  }),
  describe('state machine', () => {
    describe('switch statement', () => {
      enum State {
        Open,
        Close,
      }
      
      class Connection {
        private state: State = State.Close;
        private doProcess: () => string = this.processClosedConnection;
        
        public process(): string {
          switch (this.state) {
            case State.Open:
              this.state = State.Close;
              this.doProcess = this.processOpenConnection;
              break;
            case State.Close:
              this.state = State.Open;
              this.doProcess = this.processClosedConnection;
              break;
          }
          return this.doProcess();
        }
        
        private processOpenConnection(): string {
          return 'open';
        }
        
        private processClosedConnection(): string {
          return 'closed';
        }
      }
      
      it('should return the correct state', () => {
        const connection = new Connection();
        expect(connection.process()).to.equal('closed');
        expect(connection.process()).to.equal('open');
        expect(connection.process()).to.equal('closed');
      });
    }),
    describe('functional', () => {
      class Connection {
        private result: string = "";
        private doProcess = this.processClosedConnection;
        
        public process(): string {
          this.doProcess = this.doProcess();
          return this.result;
        }
        
        private processOpenConnection() {
          this.result = 'open';
          return this.processClosedConnection;
        }
        
        private processClosedConnection() {
          this.result = 'closed';
          return this.processOpenConnection;
        }
      }
      
      it('should return the correct state', () => {
        const connection = new Connection();
        expect(connection.process()).to.equal('closed');
        expect(connection.process()).to.equal('open');
        expect(connection.process()).to.equal('closed');
      });
    }),
    describe('sum type', () => {
      class Connection {
        private processor: OpenConnection | CloseConnection = new CloseConnection();
        
        public process(): string {
          const result = this.processor.result;
          this.processor = this.processor.process();
          return result;
        }
      }
      
      class OpenConnection {
        public result: string = 'open';
        public process(): OpenConnection | CloseConnection {
          return new CloseConnection();
        }
      }
      
      class CloseConnection {
        public result: string = 'closed';
        public process(): OpenConnection | CloseConnection {
          return new OpenConnection();
        }
      }
      
      it('should return the correct state', () => {
        const connection = new Connection();
        expect(connection.process()).to.equal('closed');
        expect(connection.process()).to.equal('open');
        expect(connection.process()).to.equal('closed');
      });
    });
  }),
  describe('evaluation', () => {
    let wasConstructed = false;
    class Spy {
      constructor() {
        wasConstructed = true;
      }
    }
    
    class Foo {}
    
    beforeEach(() => {
      wasConstructed = false;
    });
    describe('eager', () => {
      function bar(pickFirst: boolean, foo: Foo, spy: Spy): Foo | Spy {
        if (pickFirst) {
          return foo;
        } else {
          return spy;
        }
      }
      
      it('should call both constructors', () => {  
        expect(wasConstructed).to.equal(false);
        bar(true, new Foo(), new Spy());
        expect(wasConstructed).to.equal(true);
      });
    }),
    describe('lazy', () => {
      function bar(pickFirst: boolean, f: () => Foo, g: () => Spy): Foo | Spy {
        if (pickFirst) {
          return f();
        } else {
          return g();
        }
      }
      
      it('should call only the first constructor until asked for', () => {
        expect(wasConstructed).to.equal(false);
        
        bar(true, () => new Foo(), () => new Spy());
        expect(wasConstructed).to.equal(false);
        
        bar(true, () => new Foo(), () => new Spy());
        expect(wasConstructed).to.equal(false);
        
        bar(false, () => new Foo(), () => new Spy());
        expect(wasConstructed).to.equal(true);
      });
    });
  }),
  describe('higher-order functions', () => {
    describe('first', () => {
      function first<T>(values: T[], predicate: (value: T) => boolean): T | undefined {
        for (const value of values) {
          if (predicate(value)) {
            return value;
          }
        }
        return undefined;
      }
      
      it('given true combinator it should return the first value', () => {
        expect(first([1, 2, 3], () => true)).to.equal(1);
      }),
      it('given false combinator it should return undefined', () => {
        expect(first([1, 2, 3], () => false)).to.equal(undefined);
      }),
      it('given a predicate it should return the first value', () => {
        expect(first([1, 2, 3], (value) => value >= 1)).to.equal(1);
        expect(first([1, 2, 3], (value) => value === 2)).to.equal(2);
        expect(first([1, 2, 3], (value) => value >= 3)).to.equal(3);
      });
    }),
    describe('all', () => {
      function all<T>(values: T[], predicate: (value: T) => boolean): boolean {
        for (const value of values) {
          if (!predicate(value)) {
            return false;
          }
        }
        return true;
      }
      
      it('given true combinator it should return true', () => {
        expect(all([1, 2, 3], () => true)).to.equal(true);
      }),
      it('given false combinator it should return false', () => {
        expect(all([1, 2, 3], () => false)).to.equal(false);
      }),
      it('given a predicate it should return true', () => {
        expect(all([1, 2, 3], (value) => value >= 1)).to.equal(true);
        expect(all([1, 2, 3], (value) => value >= 2)).to.equal(false);
        expect(all([1, 2, 3], (value) => value >= 3)).to.equal(false);
      });
    }),
    describe('any', () => {
      function any<T>(values: T[], predicate: (value: T) => boolean): boolean {
        for (const value of values) {
          if (predicate(value)) {
            return true;
          }
        }
        return false;
      }
      
      it('given true combinator it should return true', () => {
        expect(any([1, 2, 3], () => true)).to.equal(true);
      }),
      it('given false combinator it should return false', () => {
        expect(any([1, 2, 3], () => false)).to.equal(false);
      }),
      it('given a predicate it should return true', () => {
        expect(any([1, 2, 3], (value) => value >= 1)).to.equal(true);
        expect(any([1, 2, 3], (value) => value >= 2)).to.equal(true);
        expect(any([1, 2, 3], (value) => value >= 3)).to.equal(true);
      });
    }),
    describe('using fold', () => {
      describe('all', () => {
        function all<T>(values: T[], predicate: (value: T) => boolean): boolean {
          return values.reduce((acc: boolean, value: T) => acc && predicate(value), true);
        }
        
        it('given true combinator it should return true', () => {
          expect(all([1, 2, 3], () => true)).to.equal(true);
        }),
        it('given false combinator it should return false', () => {
          expect(all([1, 2, 3], () => false)).to.equal(false);
        }),
        it('given a predicate it should return true', () => {
          expect(all([1, 2, 3], (value) => value >= 1)).to.equal(true);
          expect(all([1, 2, 3], (value) => value >= 2)).to.equal(false);
          expect(all([1, 2, 3], (value) => value >= 3)).to.equal(false);
        });
      }),
      describe('any', () => {
        function any<T>(values: T[], predicate: (value: T) => boolean): boolean {
          return values.reduce((acc: boolean, value: T) => acc || predicate(value), false);
        }
        
        it('given true combinator it should return true', () => {
          expect(any([1, 2, 3], () => true)).to.equal(true);
        }),
        it('given false combinator it should return false', () => {
          expect(any([1, 2, 3], () => false)).to.equal(false);
        }),
        it('given a predicate it should return true', () => {
          expect(any([1, 2, 3], (value) => value >= 1)).to.equal(true);
          expect(any([1, 2, 3], (value) => value >= 2)).to.equal(true);
          expect(any([1, 2, 3], (value) => value >= 3)).to.equal(true);
        });
      })
    });
  });
});