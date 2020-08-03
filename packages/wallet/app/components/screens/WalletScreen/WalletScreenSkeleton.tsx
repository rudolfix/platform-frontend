import * as React from "react";

import { HeaderScreen } from "components/shared/HeaderScreen";
import { Screen } from "components/shared/Screen";
import { AssetSkeleton } from "components/shared/asset/Asset";

import { styles } from "./WalletScreenLayout";

const WalletScreenLayoutSkeleton: React.FunctionComponent = () => (
  <HeaderScreen heading={""} subHeading={""}>
    {screenProps => (
      <Screen {...screenProps}>
        {/* eslint-disable-next-line @typescript-eslint/no-magic-numbers */}
        {[1, 0.6, 0.3, 0.1].map((opacity, i) => (
          <AssetSkeleton style={[styles.asset, { opacity }]} key={i} />
        ))}
      </Screen>
    )}
  </HeaderScreen>
);

export { WalletScreenLayoutSkeleton };
