import { expect } from 'chai'
import * as exp from 'constants';

describe('object oriented programming', () => {
  describe('contracts', () => {
    it('abstract class', () => {
      abstract class AEcho {
        abstract echo(s: string): string;
      }
      
      class Echo extends AEcho {
        echo(s: string): string {
          return s;
        }
      }
      
      class BackwardsEcho extends AEcho {
        echo(s: string): string {
          return s.split('').reverse().join('');
        }
      }
      
      let echo: AEcho = new Echo();
      expect(echo.echo('hello')).to.equal('hello');
      
      let becho: AEcho = new BackwardsEcho();
      expect(becho.echo('hello')).to.equal('olleh');
      
      let echos: AEcho[] = [echo, echo];
      for (let e of echos) {
        expect(e.echo('hello')).to.equal('hello');
      }
    }),
    it('interface', () => {
      interface IEcho {
        echo(s: string): string;
      }
      
      class Echo implements IEcho {
        echo(s: string): string {
          return s;
        }
      }
      
      class BackwardsEcho implements IEcho {
        echo(s: string): string {
          return s.split('').reverse().join('');
        }
      }
      
      let echo: IEcho = new Echo();
      expect(echo.echo('hello')).to.equal('hello');
      
      let becho: IEcho = new BackwardsEcho();
      expect(becho.echo('hello')).to.equal('olleh');
      
      let echos: IEcho[] = [echo, echo];
      for (let e of echos) {
        expect(e.echo('hello')).to.equal('hello');
      }
    }),
    it('multiple interfaces', () => {
      interface IA {
        a(): string;
      }
      
      interface IB {
        b(): number;
      }
      
      class X implements IA, IB {
        a(): string {
          return 'x';
        }
        
        b(): number {
          return 'x'.charCodeAt(0);
        }
      }
      
      let x: IA & IB = new X();
      expect(x.a()).to.equal('x');
      expect(x.b()).to.equal('x'.charCodeAt(0));
      
      let a: IA = new X();
      expect(a.a()).to.equal('x');
      
      let b: IB = new X();
      expect(b.b()).to.equal('x'.charCodeAt(0));
    });
  }),
  describe('inheritance', () => {
    interface IExpression {
      evaluate(): number;
    }
    
    abstract class BinaryExpression implements IExpression {
      constructor(protected left: IExpression, protected right: IExpression) {
      }
      
      abstract evaluate(): number;
    }
    
    class Constant implements IExpression {
      constructor(protected value: number) {
      }
      
      evaluate(): number {
        return this.value;
      }
    }
    
    class Addition extends BinaryExpression {
      evaluate(): number {
        return this.left.evaluate() + this.right.evaluate();
      }
    }
    
    class Multiple extends BinaryExpression {
      evaluate(): number {
        return this.left.evaluate() * this.right.evaluate();
      }
    }
    
    abstract class UnaryExpression implements IExpression {
      constructor(protected expression: IExpression) {
      }
      
      abstract evaluate(): number;
    }
    
    class Negate extends UnaryExpression {
      evaluate(): number {
        return -this.expression.evaluate();
      }
    }
    
    class Subtraction implements IExpression {
      private operation: Addition;
      
      constructor(left: IExpression, right: IExpression) {
        this.operation = new Addition(left, new Negate(right));
      }
      
      evaluate(): number {
        return this.operation.evaluate();
      }
    }
    
    it('2 + 3 = 5', () => {
      let two: IExpression = new Constant(2);
      let three: IExpression = new Constant(3);
      let result: IExpression = new Addition(two, three);
      
      expect(result.evaluate()).to.equal(5);
    }),
    it('2 * 3 = 6', () => {
      let two: IExpression = new Constant(2);
      let three: IExpression = new Constant(3);
      let result: IExpression = new Multiple(two, three);
      
      expect(result.evaluate()).to.equal(6);
    }),
    it('2 + 3 * 4 = 14', () => {
      let two: IExpression = new Constant(2);
      let three: IExpression = new Constant(3);
      let four: IExpression = new Constant(4);
      let result: IExpression = new Addition(two, new Multiple(three, four));
      
      expect(result.evaluate()).to.equal(14);
    }),
    it('-2 + 3 * 4 = 13', () => {
      let two: IExpression = new Constant(2);
      let three: IExpression = new Constant(3);
      let four: IExpression = new Constant(4);
      let result: IExpression = new Addition(new Negate(two), new Multiple(three, four));
      
      expect(result.evaluate()).to.equal(10);
    }),
    it('3 - 2 = 1', () => {
      let three: IExpression = new Constant(3);
      let two: IExpression = new Constant(2);
      let result: IExpression = new Subtraction(three, two);
      
      expect(result.evaluate()).to.equal(1);
    })
  })
})