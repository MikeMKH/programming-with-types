import { expect } from 'chai'

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
    })
  })
});