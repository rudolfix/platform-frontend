import { tid } from "../../../test/testUtils";
import { appRoutes } from "../../components/appRoutes";
import { e2eRoutes } from "../../components/e2eRoutes";
import { insecureWithParams, withParams } from "../../utils/withParams";
import { etoFixtureAddressByName } from "../utils";

Cypress.Commands.add("iframe", { prevSubject: "element" }, $iframe => {
  return new Cypress.Promise((resolve: any) => {
    const observer = new MutationObserver(() => {
      setTimeout(() => {
        if (
          !$iframe
            .contents()
            .find(tid("loading-indicator-pulse"))
            .get(0)
        ) {
          resolve($iframe.contents().find("body"));
        }
      }, 1000);
    });

    $iframe.on("load", ({ currentTarget }: any) => {
      currentTarget.contentWindow.open = cy.stub().as("windowOpen");
      observer.observe(
        $iframe
          .contents()
          .find("body")
          .get(0),
        {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true,
        },
      );
    });
  });
});

describe("Eto widget page", () => {
  it("Any", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInSetupState")!;

    cy.visit(withParams(e2eRoutes.embededWidget, { etoId: ETO_ID }));

    (cy.get("iframe") as any)
      .iframe()
      .find(tid("logged-out-campaigning-register"))
      .click();
    cy.get("@windowOpen").should("be.calledWithMatch", appRoutes.register);
  });

  it("ETOInSetupState", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInSetupState")!;

    cy.visit(withParams(e2eRoutes.embededWidget, { etoId: ETO_ID }));

    (cy.get("iframe") as any)
      .iframe()
      .find(tid("logged-out-campaigning-register"))
      .click();
    cy.get("@windowOpen").should("be.calledWithMatch", appRoutes.register);
  });

  it("ETOInWhitelistState", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInWhitelistState")!;

    cy.visit(withParams(e2eRoutes.embededWidget, { etoId: ETO_ID }));

    (cy.get("iframe") as any).iframe().find(tid("eto-whitelist-count-down"));
  });

  it("ETOInPublicState", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInPublicState")!;

    cy.visit(withParams(e2eRoutes.embededWidget, { etoId: ETO_ID }));

    (cy.get("iframe") as any)
      .iframe()
      .find(tid("eto-widget-invest-now-button"))
      .click();

    cy.get("@windowOpen").should(
      "be.calledWithMatch",
      insecureWithParams(appRoutes.etoPublicView, { previewCode: "" }),
      "_blank",
    );
  });
});
