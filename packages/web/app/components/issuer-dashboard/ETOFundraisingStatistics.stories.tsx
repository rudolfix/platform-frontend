import { storiesOf } from "@storybook/react";
import React from "react";

import { testEto } from "../../../test/fixtures";
import { ITokenPriceState } from "../../modules/shared/tokenPrice/reducer";
import { withStore } from "../../utils/storeDecorator.unsafe";
import { ETOFundraisingStatistics } from "./ETOFundraisingStatistics";

storiesOf("ETOFundraisingStatistics", module)
  .addDecorator(
    withStore({
      tokenPrice: {
        tokenPriceData: {
          etherPriceEur: "168.71",
        },
      } as ITokenPriceState,
    }),
  )
  .add("default", () => <ETOFundraisingStatistics eto={testEto} />);
