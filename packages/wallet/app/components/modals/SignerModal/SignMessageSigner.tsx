import { EJwtPermissions } from "@neufund/shared-modules";
import { isInEnum } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { StyleSheet } from "react-native";

import { EIconType } from "components/shared/Icon";
import { Text } from "components/shared/typography/Text";

import { ESignerType, TSignerRequestData } from "modules/signer-ui/types";

import { grayLighter2 } from "styles/colors";
import { spacingStyles } from "styles/spacings";

import { SignerContainer } from "./SignerContainer";

type TExternalProps = {
  data: TSignerRequestData[ESignerType.SIGN_MESSAGE];
  approve: () => void;
  reject: () => void;
};

const titles: Record<EJwtPermissions, React.ReactNode> = {
  [EJwtPermissions.CHANGE_EMAIL_PERMISSION]: (
    <FormattedMessage id="wallet.message-signer.title.change-email" />
  ),
  [EJwtPermissions.SUBMIT_KYC_PERMISSION]: (
    <FormattedMessage id="wallet.message-signer.title.submit-kyc" />
  ),
  [EJwtPermissions.SUBMIT_ETO_PERMISSION]: (
    <FormattedMessage id="wallet.message-signer.title.submit-eto" />
  ),
  [EJwtPermissions.UPLOAD_ISSUER_IMMUTABLE_DOCUMENT]: (
    <FormattedMessage id="wallet.message-signer.title.upload-immutable-document" />
  ),
  [EJwtPermissions.DO_BOOK_BUILDING]: (
    <FormattedMessage id="wallet.message-signer.title.do-book-building" />
  ),
  [EJwtPermissions.ISSUER_UPDATE_NOMINEE_REQUEST]: (
    <FormattedMessage id="wallet.message-signer.issuer-update-nominee-request" />
  ),
  [EJwtPermissions.ISSUER_REMOVE_NOMINEE]: (
    <FormattedMessage id="wallet.message-signer.issuer-remove-nominee" />
  ),
  [EJwtPermissions.SIGN_TOS]: null,
};

const SignMessageSigner: React.FunctionComponent<TExternalProps> = ({ data, ...rest }) => (
  <SignerContainer icon={EIconType.BACKUP} headline="Sign message request" {...rest}>
    <Text style={styles.body}>
      {data.permission &&
      data.permission !== EJwtPermissions.SIGN_TOS &&
      isInEnum(EJwtPermissions, data.permission) ? (
        titles[data.permission]
      ) : (
        <FormattedMessage id="wallet.message-signer.no-permission" />
      )}
    </Text>
  </SignerContainer>
);

const styles = StyleSheet.create({
  body: {
    ...spacingStyles.ph3,

    textAlign: "center",
    color: grayLighter2,
  },
});

export { SignMessageSigner };
