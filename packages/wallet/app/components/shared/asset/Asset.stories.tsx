import {
  createToken,
  ECurrency,
  ENumberInputFormat,
  toEquityTokenSymbol,
} from "@neufund/shared-utils";
import { storiesOf } from "@storybook/react-native";
import * as React from "react";

import { EIconType } from "components/shared/Icon";

import { Asset, EAssetType } from "./Asset";

storiesOf("Molecules|Asset", module)
  .add("normal", () => (
    <Asset
      icon={EIconType.N_EUR}
      name="NEur"
      token={createToken(toEquityTokenSymbol("NEUR"), "15 000", ENumberInputFormat.DECIMAL)}
      analogToken={createToken(ECurrency.EUR, "15 000", ENumberInputFormat.DECIMAL)}
      type={EAssetType.NORMAL}
    />
  ))
  .add("reserved", () => (
    <Asset
      icon={EIconType.ETH}
      name="ETH"
      token={createToken(toEquityTokenSymbol("ETH"), "1000", ENumberInputFormat.DECIMAL)}
      analogToken={createToken(ECurrency.EUR, "15 000", ENumberInputFormat.DECIMAL)}
      type={EAssetType.RESERVED}
    />
  ));
