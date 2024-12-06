describe("My First Test", () => {
  it("Does not do much!", () => {
    expect(true).to.equal(true);
  });

  it("Visit app's Homepage", () => {
    cy.visit("exp://192.168.15.147:8081");
  });
});
