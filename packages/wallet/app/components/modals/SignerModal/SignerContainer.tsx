import * as React from "react";
import { StyleSheet, View } from "react-native";

import { EIconType, Icon } from "components/shared/Icon";
import { Button, EButtonLayout } from "components/shared/buttons/Button";
import { EHeadlineLevel, Headline } from "components/shared/typography/Headline";

import { baseGray } from "styles/colors";
import { spacingStyles } from "styles/spacings";

type TExternalProps = {
  headline: React.ReactNode;
  icon: EIconType;
  approve: () => void;
  reject: () => void;
};

const SignerContainer: React.FunctionComponent<TExternalProps> = ({
  headline,
  icon,
  approve,
  reject,
  children,
}) => (
  <>
    <View style={styles.container}>
      <Icon type={icon} style={styles.icon} />

      <Headline style={styles.headline} level={EHeadlineLevel.LEVEL3}>
        {headline}
      </Headline>

      {children}
    </View>

    <Button layout={EButtonLayout.PRIMARY} style={styles.acceptButton} onPress={approve}>
      Confirm
    </Button>
    <Button layout={EButtonLayout.TEXT} onPress={reject}>
      Reject
    </Button>
  </>
);

const styles = StyleSheet.create({
  container: { ...spacingStyles.mv4, alignItems: "center" },
  icon: {
    ...spacingStyles.mb3,

    color: baseGray,
    width: 48,
    height: 48,
  },
  headline: {
    ...spacingStyles.mb3,

    color: baseGray,
    textAlign: "center",
  },
  acceptButton: {
    ...spacingStyles.mb1,
  },
});

export { SignerContainer };
