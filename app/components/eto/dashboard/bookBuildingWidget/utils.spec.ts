import { expect } from "chai";

import {countPledgeMoney } from "./utils";

describe.only("countPledgeMoney", () => {
  it("iterates over pledge data array and sums all money", () => {
    const pledge1 = {
      amountEur: 55562,
      consentToRevealEmail: true,
      currency: "blablacoin",
      email: "adsflasdf@asdfasdf.ru",
      etoId: "12312345345457567",
      insertedAt: "2018-11-30T10:24:38.394206Z",
      updatedAt: "2018-11-30T10:24:38.394216Z",
      userId: "1123412123",
    };

    const pledge2 = {
      amountEur: 1245567,
      consentToRevealEmail: false,
      currency: "blablacoin",
      etoId: "12312345345457567",
      insertedAt: "2018-11-30T10:24:38.394206Z",
      updatedAt: "2018-11-30T10:24:38.394216Z",
      userId: "12341234123",
    };

    const data = [pledge1,pledge2];
    const expectedOutput = 1301129;

    expect(countPledgeMoney(data)).to.be.equal(expectedOutput);
  });
});
