import React from "react";
import { StyleSheet, View } from "react-native";

import { EHeadlineLevel, Headline } from "components/shared/typography/Headline";

import { spacingStyles } from "styles/spacings";

type TExternalProps = {
  heading: React.ReactNode;
  subHeading?: React.ReactNode;
} & React.ComponentProps<typeof View>;

const Section: React.FunctionComponent<TExternalProps> = ({
  heading,
  subHeading,
  children,
  ...props
}) => (
  <View {...props}>
    <View style={styles.header}>
      <Headline level={EHeadlineLevel.LEVEL4}>{heading}</Headline>
      {subHeading && <Headline level={EHeadlineLevel.LEVEL5}>{subHeading}</Headline>}
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  header: {
    ...spacingStyles.mb2,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export { Section };
