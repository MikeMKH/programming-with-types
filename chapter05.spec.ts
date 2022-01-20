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
  })
});