import {
  EEtoStateColor,
  EEtoStateUIName,
  etoModuleApi,
  TEtoWithCompanyAndContractReadonly,
} from "@neufund/shared-modules";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { StyleSheet, View } from "react-native";

import { HelperText } from "components/shared/typography/HelperText";
import { st } from "components/utils";

import { baseGreen, greenLighter1, blueLighter1, orangeDarker1, redDarker1 } from "styles/colors";
import { spacingStyles } from "styles/spacings";
import { typographyStyles } from "styles/typography";

type TViewProps = React.ComponentProps<typeof View>;

type TExternalProps = {
  eto: TEtoWithCompanyAndContractReadonly;
} & TViewProps;

export const generalStateToName: Record<EEtoStateUIName, React.ReactElement> = {
  [EEtoStateUIName.CAMPAIGNING]: (
    <FormattedMessage id="shared-components.eto-investor-status.campaigning" />
  ),
  [EEtoStateUIName.DRAFT]: <FormattedMessage id="shared-components.eto-investor-status.draft" />,
  [EEtoStateUIName.PENDING]: (
    <FormattedMessage id="shared-components.eto-investor-status.pending" />
  ),
  [EEtoStateUIName.ON_CHAIN]: (
    <FormattedMessage id="shared-components.eto-investor-status.on-chain" />
  ),
  [EEtoStateUIName.SUSPENDED]: (
    <FormattedMessage id="shared-components.eto-investor-status.suspended" />
  ),
  [EEtoStateUIName.PRESALE]: (
    <FormattedMessage id="shared-components.eto-investor-status.presale" />
  ),
  [EEtoStateUIName.PUBLIC_SALE]: (
    <FormattedMessage id="shared-components.eto-investor-status.public" />
  ),
  [EEtoStateUIName.IN_SIGNING]: (
    <FormattedMessage id="shared-components.eto-investor-status.signing" />
  ),
  [EEtoStateUIName.CLAIM]: <FormattedMessage id="shared-components.eto-investor-status.claim" />,
  [EEtoStateUIName.PAYOUT]: <FormattedMessage id="shared-components.eto-investor-status.payout" />,
  [EEtoStateUIName.REFUND]: <FormattedMessage id="shared-components.eto-investor-status.refund" />,
  [EEtoStateUIName.WHITELISTING]: (
    <FormattedMessage id="shared-components.eto-investor-status.whitelisting" />
  ),
};

const etoColorToColor: Record<EEtoStateColor, string> = {
  [EEtoStateColor.BLUE]: blueLighter1,
  [EEtoStateColor.ORANGE]: orangeDarker1,
  [EEtoStateColor.GREEN]: greenLighter1,
  [EEtoStateColor.RED]: redDarker1,
};

const ComingSoonEtoState: React.FunctionComponent<TViewProps> = ({ style, ...props }) => (
  <View style={st(styles.container, style)} {...props}>
    <View style={styles.indicator} />
    <HelperText style={styles.name}>
      <FormattedMessage id="shared-components.eto-investor-status.coming-soon" />
    </HelperText>
  </View>
);

const ETOInvestorState: React.FunctionComponent<TExternalProps> = ({ eto, style, ...props }) => {
  if (etoModuleApi.utils.isComingSoon(eto.state)) {
    return <ComingSoonEtoState />;
  }

  const stateColor = etoModuleApi.utils.getEtoStateColor(eto);
  const stateUIName = etoModuleApi.utils.getEtoStateUIName(eto);

  return (
    <View style={st(styles.container, style)} {...props}>
      <View style={st(styles.indicator, { backgroundColor: etoColorToColor[stateColor] })} />
      <HelperText style={styles.name}>{generalStateToName[stateUIName]}</HelperText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    ...spacingStyles.ml2,
    ...typographyStyles.menuLabelBold,
    textTransform: "uppercase",
  },
  indicator: {
    width: 8,
    height: 8,
    backgroundColor: baseGreen,
    borderRadius: 4,
  },
});

export { ETOInvestorState };
