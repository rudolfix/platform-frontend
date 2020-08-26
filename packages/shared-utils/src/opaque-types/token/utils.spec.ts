import { expect } from "chai";

import { ECurrency, ENumberInputFormat } from "../../utils/formatters";
import { AssertEqual, assertType } from "../../utils/test/testUtils";
import { createToken } from "./utils";

describe("createToken", () => {
  it("should provide a type safety for token type and precision", () => {
    const balanceEurUlps = createToken(ECurrency.EUR, "100000000", ENumberInputFormat.ULPS);
    const balanceEurUlps2 = createToken(ECurrency.EUR, "100000000", ENumberInputFormat.ULPS);

    const balanceEur = createToken(ECurrency.EUR, "100000000", ENumberInputFormat.DECIMAL);

    const balanceEthUlps = createToken(ECurrency.ETH, "100000000", ENumberInputFormat.ULPS);

    // assert same type and precision are assignable to each other
    assertType<AssertEqual<typeof balanceEurUlps, typeof balanceEurUlps2>>(true);

    // assert same type and different precision are not assignable to each other
    assertType<AssertEqual<typeof balanceEurUlps, typeof balanceEur>>(false);

    // assert different type and same precision are not assignable to each other
    assertType<AssertEqual<typeof balanceEurUlps, typeof balanceEthUlps>>(false);

    // assert different type and different precision are not assignable to each other
    assertType<AssertEqual<typeof balanceEur, typeof balanceEthUlps>>(false);

    expect(balanceEurUlps).to.exist;
    expect(balanceEurUlps2).to.exist;
    expect(balanceEur).to.exist;
    expect(balanceEthUlps).to.exist;
  });

  it("should provide a type safety for token value", () => {
    const balanceEurUlps = createToken(ECurrency.EUR, "100000000", ENumberInputFormat.ULPS);
    const balanceEurUlps2 = createToken(ECurrency.EUR, "100000000", ENumberInputFormat.ULPS);

    const balanceEur = createToken(ECurrency.EUR, "100000000", ENumberInputFormat.DECIMAL);

    const balanceEthUlps = createToken(ECurrency.ETH, "100000000", ENumberInputFormat.ULPS);

    // assert value for same type and precision are assignable to each other
    assertType<AssertEqual<typeof balanceEurUlps.value, typeof balanceEurUlps2.value>>(true);

    // assert value for same type and different precision are not assignable to each other
    assertType<AssertEqual<typeof balanceEurUlps.value, typeof balanceEur.value>>(false);

    // assert value for different type and same precision are not assignable to each other
    assertType<AssertEqual<typeof balanceEurUlps.value, typeof balanceEthUlps.value>>(false);

    // assert value for different type and different precision are not assignable to each other
    assertType<AssertEqual<typeof balanceEur.value, typeof balanceEthUlps.value>>(false);

    expect(balanceEurUlps).to.exist;
    expect(balanceEurUlps2).to.exist;
    expect(balanceEur).to.exist;
    expect(balanceEthUlps).to.exist;
  });
});
