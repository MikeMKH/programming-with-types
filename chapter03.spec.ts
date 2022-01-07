import { expect } from 'chai'

describe('chapter 3', () => {
  describe('compound types', () => {
    describe('tuples', () => {
      describe('as array', () => {
        it('should be able to create a tuple', () => {
          const tuple = ['hello', 10]
          expect(tuple[0]).to.equal('hello')
          expect(tuple[1]).to.equal(10)
        }),
        it('should be able to create a tuple with a different number of elements', () => {
          const tuple = ['hello', 10, true, 'world']
          expect(tuple[0]).to.equal('hello')
          expect(tuple[1]).to.equal(10)
          expect(tuple[2]).to.equal(true)
          expect(tuple[3]).to.equal('world')
        }),
        describe('distance', () => {
          function distance(x1: number, y1: number, x2: number, y2: number): number {
            return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
          }
          
          it('should be able to calculate the distance between two points', () => {
            expect(distance(0, 0, 3, 4)).to.equal(5)
          });
        });
      }),
      describe('with type', () => {
        describe('Point', () => {
          type Point = [number, number];
          type Distance = number;
          
          describe('distance', () => {
            function distance(p1: Point, p2: Point): Distance {
              return Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
            }
            
            it('should be able to calculate the distance between two points', () => {
              expect(distance([0, 0], [3, 4])).to.equal(5)
            });
          });
        });
      });
    }),
    describe('record type', () => {
      describe('Point', () => {
        interface Point {
          x: number;
          y: number;
        }
        
        describe('distance', () => {
          function distance(p1: Point, p2: Point): number {
            return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
          }
          
          it('should be able to calculate the distance between two points', () => {
            expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).to.equal(5)
          });
        });
      })
    })
  })
});