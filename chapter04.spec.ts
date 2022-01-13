import { expect } from 'chai'
import { beforeEach } from 'mocha';

declare const LbfsType: unique symbol;
declare const NsType: unique symbol;

describe('chapter 4', () => {
  describe('primitive obsession', () => {
    describe('trajectoryCorrection', () => {
      let wasDisintegrated = false;
      
      function disintegrate() {
        wasDisintegrated = true;
      }
      beforeEach(() => {
        wasDisintegrated = false;
      })
      it('should call disintegrate even if the types do not match', () => {
        function trajectoryCorrection(momentum: number) {
          if (momentum < 2 /* Ns */) {
            disintegrate();
          }
        }
        
        function provideMomentum() {
          trajectoryCorrection(1.5 /* lbfs */);
        }
        
        provideMomentum();
        expect(wasDisintegrated).to.be.true;
      }),
      it('should not call disintegrate if the types match', () => {
        // declare const NsType: unique symbol; // at top of file
        class Ns {
          readonly value: number;
          [NsType]: void;
          
          constructor(value: number) {
            this.value = value;
          }
        }
        
        // declare const LbfsType: unique symbol; // at top of file
        class Lbfs {
          readonly value: number;
          [LbfsType]: void;
          
          constructor(value: number) {
            this.value = value;
          }
        }
        
        function trajectoryCorrection(momentum: Ns) {
          if (momentum.value < new Ns(2).value) {
            disintegrate();
          }
        }
        
        function provideMomentum() {
          trajectoryCorrection(lbfsToNs(new Lbfs(1.5)));
        }
        
        function lbfsToNs(lbfs: Lbfs): Ns {
          return new Ns(lbfs.value * 4.4482216152605);
        }
        
        provideMomentum();
        expect(wasDisintegrated).to.be.false;
      });
    });
  })
});