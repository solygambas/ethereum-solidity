const assert = require("assert");
let car;

class Car {
  park() {
    return "stopped";
  }
  drive() {
    return "vroom";
  }
}

beforeEach(() => {
  car = new Car();
});

describe("Car", () => {
  it("can park", () => {
    assert.equal(car.park(), "stopped");
  });
  it("can drive", () => {
    assert.equal(car.drive(), "vroom");
  });
});
