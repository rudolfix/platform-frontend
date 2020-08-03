import React from "react";
import { View } from "react-native";

import { AssetSkeleton } from "components/shared/asset/Asset";

import { styles } from "./HomeScreenLayout";
import { HomeScreenLayoutContainer } from "./HomeScreenLayoutContainer";

const HomeScreenLayoutSkeleton: React.FunctionComponent = () => (
  <HomeScreenLayoutContainer>
    <View style={styles.section}>
      {/* eslint-disable-next-line @typescript-eslint/no-magic-numbers */}
      {[1, 0.6, 0.3, 0.1].map((opacity, i) => (
        <AssetSkeleton style={[styles.asset, { opacity }]} key={i} />
      ))}
    </View>
  </HomeScreenLayoutContainer>
);
export { HomeScreenLayoutSkeleton };
