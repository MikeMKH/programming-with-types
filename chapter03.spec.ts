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
  })
});