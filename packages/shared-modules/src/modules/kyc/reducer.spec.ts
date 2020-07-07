import { expect } from "chai";

import { updateArrayItem } from "./utils";

describe("KYC reducer", () => {
  describe("updateArrayItem", () => {
    it("should update item on given position", () => {
      const input = [
        { person: { id: "1" } },
        { business: { id: "2" } },
        { person: { id: "3" } },
        { business: { id: "4" } },
        { person: { id: "5" } },
      ];
      const actualArray = updateArrayItem(input, "3", { person: { id: "NEW" } });

      expect(actualArray).to.be.deep.eq([
        { person: { id: "1" } },
        { business: { id: "2" } },
        { person: { id: "NEW" } },
        { business: { id: "4" } },
        { person: { id: "5" } },
      ]);
    });

    it("should append item when searched item doesnt exist", () => {
      const input = [
        { person: { id: "1" } },
        { business: { id: "2" } },
        { person: { id: "3" } },
        { business: { id: "4" } },
        { person: { id: "5" } },
      ];

      const actualArray = updateArrayItem(input, "NEW", { person: { id: "NEW" } });

      expect(actualArray).to.be.deep.eq([
        { person: { id: "1" } },
        { business: { id: "2" } },
        { person: { id: "3" } },
        { business: { id: "4" } },
        { person: { id: "5" } },
        { person: { id: "NEW" } },
      ]);
    });
  });
});
