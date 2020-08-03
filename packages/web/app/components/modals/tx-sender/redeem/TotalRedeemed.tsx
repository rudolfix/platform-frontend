import { Eur } from "@neufund/design-system";
import {
  convertFromUlps,
  isEmptyValue,
  isValidNumber,
  multiplyBigNumbers,
  Q18,
  subtractBigNumbers,
} from "@neufund/shared-utils";
import * as React from "react";

const TotalRedeemed: React.FunctionComponent<{ amount: string; bankFee: string }> = ({
  amount,
  bankFee,
}) => {
  const providedAmount = isValidNumber(amount) || (isEmptyValue(amount) && 0) ? amount : "0";
  const calculatedFee = multiplyBigNumbers([providedAmount, bankFee]);
  const totalRedeemed = subtractBigNumbers([
    convertFromUlps(Q18.mul(providedAmount)).toString(),
    calculatedFee,
  ]);

  return <Eur value={totalRedeemed} />;
};

export { TotalRedeemed };
