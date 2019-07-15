import { storiesOf } from "@storybook/react";
import * as React from "react";

import { dummyEthereumAddressWithChecksum } from "../../../test/fixtures";
import { EUserType } from "../../lib/api/users/interfaces";
import { IAppState } from "../../store";
import { DeepPartial } from "../../types";
import { withStore } from "../../utils/storeDecorator.unsafe";
import { LayoutComponent } from "./Layout";

const FakeContent = () => (
  <div style={{ height: "20rem", backgroundColor: "gray" }}>dummy content</div>
);

const authStore = {
  auth: {
    jwt: "asdf",
    user: {
      type: EUserType.ISSUER,
      verifiedEmail: "asfasdf@asdf.de",
    },
  },
  kyc: {
    claims: {
      isVerified: true,
    },
  },
  web3: {
    connected: true,
    wallet: {
      address: dummyEthereumAddressWithChecksum,
    },
  },
};

const unauthStore = {
  auth: {
    user: {
      type: EUserType.ISSUER,
      verifiedEmail: "asfasdf@asdf.de",
    },
  },
  kyc: {
    claims: {
      isVerified: true,
    },
  },
  web3: {
    connected: true,
    wallet: {
      address: dummyEthereumAddressWithChecksum,
    },
  },
};

storiesOf("Layouts", module)
  .addDecorator(withStore(authStore as DeepPartial<IAppState>))
  .add("LayoutAuthorized", () => (
    <LayoutComponent userIsAuthorized={true}>
      <FakeContent />
    </LayoutComponent>
  ))
  .addDecorator(withStore(unauthStore as DeepPartial<IAppState>))
  .add("LayoutUnauthorized", () => (
    <LayoutComponent userIsAuthorized={false}>
      <FakeContent />
    </LayoutComponent>
  ));
