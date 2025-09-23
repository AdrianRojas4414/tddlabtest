import sumar from "./sumador.js";

describe("Sumar", () => {
  it("deberia sumar dos numeros", () => {
    expect(sumar(3, 2)).toEqual(5);
  });

  it("no deberia sumar dos numeros", () => {
    expect(sumar(3, 2)).toEqual(6);
  });

  it("no deberia sumar dos numeros", () => {
    expect(sumar(3, 2)).toEqual(7);
  });

  it("deberia sumar dos numeros", () => {
    expect(sumar(3, 3)).toEqual(6);
  });
});


