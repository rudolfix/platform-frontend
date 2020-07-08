import { Eur } from "@neufund/design-system";
import { multiplyBigNumbers } from "@neufund/shared-utils";
import * as React from "react";

const CalculatedFee: React.FunctionComponent<{ amount: string; bankFee: string }> = ({
  amount,
  bankFee,
}) => {
  const providedAmount = !isNaN(Number(amount)) && Number(amount) > 0 ? amount : "0";
  const calculatedFee = multiplyBigNumbers([providedAmount, bankFee]);

  return <Eur data-test-id="bank-transfer.redeem.init.fee" value={calculatedFee} />;
};

export { CalculatedFee };
