import { expect } from 'chai'

function hello(): 'hello' {
  return 'hello'
}

describe('hello', function () {
  it('should say hello', function () {
    expect(hello()).to.equal('hello');
  })
})