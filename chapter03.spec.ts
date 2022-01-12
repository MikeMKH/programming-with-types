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
  }),
  describe('either-or types', () => {
    describe('days of the week', () => {
      describe('with constants', () => {
        const SUNDAY = 0;
        const MONDAY = 1;
        const TUESDAY = 2;
        const WEDNESDAY = 3;
        const THURSDAY = 4;
        const FRIDAY = 5;
        const SATURDAY = 6;
        
        describe('isWeekday', () => {
          function isWeekday(day: number): boolean {
            return day >= MONDAY && day <= FRIDAY;
          }
          
          it('should be a weekday', () => {
            expect(isWeekday(MONDAY)).to.equal(true)
          }),
          it('should not be a weekday', () => {
            expect(isWeekday(SUNDAY)).to.equal(false)
          });
        });
      }),
      describe('with enums', () => {
        enum Day {
          SUNDAY,
          MONDAY,
          TUESDAY,
          WEDNESDAY,
          THURSDAY,
          FRIDAY,
          SATURDAY
        }
        
        describe('isWeekday', () => {
          function isWeekday(day: Day): boolean {
            return day >= Day.MONDAY && day <= Day.FRIDAY;
          }
          
          it('should be a weekday', () => {
            expect(isWeekday(Day.MONDAY)).to.equal(true)
          }),
          it('should not be a weekday', () => {
            expect(isWeekday(Day.SUNDAY)).to.equal(false)
          });
        }),
        describe('parseDayOfWeek', () => {
          describe('with optional type', () => {
            function parseDayOfWeek(day: string): Day | undefined {
              switch (day.toUpperCase()) {
                case 'SUNDAY':
                  return Day.SUNDAY;
                case 'MONDAY':
                  return Day.MONDAY;
                case 'TUESDAY':
                  return Day.TUESDAY;
                case 'WEDNESDAY':
                  return Day.WEDNESDAY;
                case 'THURSDAY':
                  return Day.THURSDAY;
                case 'FRIDAY':
                  return Day.FRIDAY;
                case 'SATURDAY':
                  return Day.SATURDAY;
              }
            }
            
            it('should parse correct input', () => {
              expect(parseDayOfWeek('MONDAY')).to.equal(Day.MONDAY)
            }),
            it('should parse correct lowercase input', () => {
              expect(parseDayOfWeek('monday')).to.equal(Day.MONDAY)
            }),
            it('should return undefined for malformed input', () => {
              expect(parseDayOfWeek('Mike')).to.equal(undefined)
            });  
          }),
          describe('with result or error', () => {
            enum InputError {
              OK,
              NO_INPUT,
              INVALID_DAY,
            }
            
            class Result {
              error: InputError;
              value: Day;
              
              constructor(error: InputError, value: Day) {
                this.error = error;
                this.value = value;
              }
            }
            
            function parseDayOfWeek(day: string): Result {
              switch (day.toUpperCase()) {
                case '':
                  return new Result(InputError.NO_INPUT, Day.SUNDAY);
                case 'SUNDAY':
                  return new Result(InputError.OK, Day.SUNDAY);
                case 'MONDAY':
                  return new Result(InputError.OK, Day.MONDAY);
                case 'TUESDAY':
                  return new Result(InputError.OK, Day.TUESDAY);
                case 'WEDNESDAY':
                  return new Result(InputError.OK, Day.WEDNESDAY);
                case 'THURSDAY':
                  return new Result(InputError.OK, Day.THURSDAY);
                case 'FRIDAY':
                  return new Result(InputError.OK, Day.FRIDAY);
                case 'SATURDAY':
                  return new Result(InputError.OK, Day.SATURDAY);
                default:
                  return new Result(InputError.INVALID_DAY, Day.SUNDAY);
              }
            }
            
            it('should parse correct input', () => {
              expect(parseDayOfWeek('MONDAY')).to.deep.equal(new Result(InputError.OK, Day.MONDAY))
            }),
            it('should parse correct lowercase input', () => {
              expect(parseDayOfWeek('monday')).to.deep.equal(new Result(InputError.OK, Day.MONDAY))
            }),
            it('should return undefined for malformed input', () => {
              expect(parseDayOfWeek('Mike')).to.deep.equal(new Result(InputError.INVALID_DAY, Day.SUNDAY))
            }),
            it('should return OK for correct lowercase input', () => {
              expect(parseDayOfWeek('wednesday').error).to.equal(InputError.OK)
            }),
            it('should return INVALID_DAY for malformed input', () => {
              expect(parseDayOfWeek('Mike').error).to.equal(InputError.INVALID_DAY)
            }),
            it('should return NO_INPUT for empty input', () => {
              expect(parseDayOfWeek('').error).to.equal(InputError.NO_INPUT)
            });
          });
        });
      });
    });
  }),
  describe('visitor pattern', () => {
    describe('naive', () => {
      class Renderer {}
      class Reader {}
      
      interface DocumentItem {
        render(renderer: Renderer): void;
        read(reader: Reader): void;
      }
      
      class Paragraph implements DocumentItem {
        render(renderer: Renderer): void {}
        
        read(reader: Reader): void {}
      }
      
      class Picture implements DocumentItem {
        render(renderer: Renderer): void {}
        
        read(reader: Reader): void {}
      }
      
      it('should render items', () => {
        const docs: DocumentItem[] = [new Paragraph(), new Picture()];
        const renderer = new Renderer();
        docs.forEach(doc => doc.render(renderer));
      });
    }),
    describe('oo pattern', () => {
      interface Visitor {
        visitParagraph(): void;
        visitPicture(): void;
      }
      
      class Renderer implements Visitor {
        visitParagraph(): void {}
        visitPicture(): void {}
      }
      
      class Reader implements Visitor {
        visitParagraph(): void {}
        visitPicture(): void {}
      }
      
      interface DocumentItem {
        accept(visitor: Visitor): void;
      }
      
      class Paragraph implements DocumentItem {
        accept(visitor: Visitor): void {
          visitor.visitParagraph();
        }
      }
      
      class Picture implements DocumentItem {
        accept(visitor: Visitor): void {
          visitor.visitPicture();
        }
      }
      
      it('should render items', () => {
        const docs: DocumentItem[] = [new Paragraph(), new Picture()];
        const renderer = new Renderer();
        docs.forEach(doc => doc.accept(renderer));
      });
    }),
    describe('variant pattern', () => {
      class Variant<T1, T2> {
        readonly value: T1 | T2;
        readonly index: number;
        
        constructor(value: T1 | T2, index: number) {
          this.value = value;
          this.index = index;
        }
        
        static make1<T1, T2>(value: T1): Variant<T1, T2> {
          return new Variant<T1, T2>(value, 0);
        }
        
        static make2<T1, T2>(value: T2): Variant<T1, T2> {
          return new Variant<T1, T2>(value, 1);
        }
      }
      
      function visit<T1, T2>(
        variant: Variant<T1, T2>,
        visitor1: (value: T1) => void,
        visitor2: (value: T2) => void,
      ): void {
        switch (variant.index) {
          case 0: visitor1(<T1>variant.value); break;
          case 1: visitor2(<T2>variant.value); break;
          default: throw new Error('Invalid variant');
        }
      }
      
      class Renderer {
        renderParagraph(paragraph: Paragraph): void {}
        renderPicture(picture: Picture): void {}
      }
      
      class Reader {
        readParagraph(paragraph: Paragraph): void {}
        readPicture(picture: Picture): void {}
      }
      
      class Paragraph {}
      class Picture {}
      
      it('should render items', () => {
        const docs: Variant<Paragraph, Picture>[] = [
          Variant.make1(new Paragraph()), Variant.make2(new Picture())];
        const renderer = new Renderer();
        docs.forEach(doc =>
          visit(
            doc,
            doc => renderer.renderParagraph(doc),
            doc => renderer.renderPicture(doc)));
      });
    });
  }),
  describe('algebraic data types', () => {
    describe('product types', () => {
      type A = 1 | 2;
      type B = "a" | "b";
      type AB = [A, B];
      
      it('should be able to make a tuple A x B', () => {
        const ab: AB = [1, "a"];
        
        expect(ab).to.deep.equal([1, "a"]);
        
        expect(typeof ab).to.equal('object');
        expect(typeof ab[0]).to.equal('number');
        expect(typeof ab[1]).to.equal('string'); 
      });
    }),
    describe('sum types', () => {
      type A = 1 | 2;
      type B = "a" | "b";
      type AB = A | B;
      
      it('should be able to make a sum type A + B', () => {
        const a: AB = 1;
        const b: AB = "b";
        
        expect(a).to.equal(1);
        expect(b).to.equal("b");
        
        expect(typeof a).to.equal('number');
        expect(typeof b).to.equal('string');
      });
    });
  });
});