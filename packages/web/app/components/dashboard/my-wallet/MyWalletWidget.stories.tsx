import { convertToUlps } from "@neufund/shared-utils";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { LoadingIndicator } from "../../shared/loading-indicator";
import {
  MyWalletWidgetComponentContainer,
  MyWalletWidgetComponentLayout,
  MyWalletWidgetError,
} from "./MyWalletWidget";

const props = {
  isLoading: false,
  hasError: false,
  data: {
    euroTokenAmount: convertToUlps("100"),
    ethAmount: convertToUlps("100"),
    ethEuroAmount: convertToUlps("100"),
    totalAmount: "100",
    isIcbmWalletConnected: false,
    isLockedWalletConnected: false,
  },
  goToWallet: action("GO_TO_WALLET"),
  goToPortfolio: action("GO_TO_PORTFOLIO"),
};

storiesOf("NDS|Molecules/Dashboard/MyWalletWidget", module)
  .add("loading", () => {
    const testData = {
      ...props,
      isLoading: true,
    };
    return (
      <MyWalletWidgetComponentContainer {...testData}>
        <LoadingIndicator />
      </MyWalletWidgetComponentContainer>
    );
  })
  .add("default", () => <MyWalletWidgetComponentLayout {...props} />)
  .add("error", () => {
    const testData = {
      ...props,
      hasError: true,
    };
    return (
      <MyWalletWidgetComponentContainer {...testData}>
        <MyWalletWidgetError />
      </MyWalletWidgetComponentContainer>
    );
  })
  .add("with icbm wallet", () => {
    const testData = {
      ...props,
      data: {
        ...props.data,
        isIcbmWalletConnected: true,
        isLockedWalletConnected: false,
      },
    };
    return <MyWalletWidgetComponentLayout {...testData} />;
  });
