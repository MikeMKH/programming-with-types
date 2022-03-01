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
  })
})