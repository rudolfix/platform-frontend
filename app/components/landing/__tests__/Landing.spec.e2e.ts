describe("Landing", () => {
  it("should work", () => {
    cy.visit("/");

    cy.title().should("eq", "Neufund Platform");
  });
});
