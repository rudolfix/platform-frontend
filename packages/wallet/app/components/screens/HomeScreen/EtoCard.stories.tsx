import { EEtoState, TEtoWithCompanyAndContract } from "@neufund/shared-modules";
import { toDeepPartialMock } from "@neufund/shared-utils/tests";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import * as React from "react";
import { View, Image } from "react-native";

import neufundBanner from "assets/images/neufund.png";

import { EtoCard } from "./EtoCard";

const eto = toDeepPartialMock<TEtoWithCompanyAndContract>({
  state: EEtoState.PREVIEW,
  company: {
    brandName: "Neufund",
    companyPreviewCardBanner: Image.resolveAssetSource(neufundBanner).uri,
    categories: ["Impact", "Blockchain"],
  },
});

const etoWithoutCompanies = toDeepPartialMock<TEtoWithCompanyAndContract>({
  state: EEtoState.PREVIEW,
  company: {
    brandName: "Neufund",
    companyPreviewCardBanner: Image.resolveAssetSource(neufundBanner).uri,
    categories: undefined,
  },
});

storiesOf("Organisms|EtoCard", module)
  .addDecorator((story: () => React.ReactNode) => <View style={{ padding: 20 }}>{story()}</View>)
  .add("with companies", () => <EtoCard eto={eto} onPress={action("onPress")} />)
  .add("without companies", () => (
    <EtoCard eto={etoWithoutCompanies} onPress={action("onPress")} />
  ));
