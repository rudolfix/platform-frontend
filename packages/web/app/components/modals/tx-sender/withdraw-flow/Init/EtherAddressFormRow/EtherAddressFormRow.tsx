import { YupTS } from "@neufund/shared-modules";
import cn from "classnames";
import { FormikErrors, FormikValues } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ETH_ADDRESS_SIZE } from "../../../../../../modules/tx/utils";
import { isAddressValid } from "../../../../../../modules/web3/utils";
import { DataRow } from "../../../../../shared/DataRow";
import { FormField, FormLabel } from "../../../../../shared/forms/index";
import { EInputTheme } from "../../../../../shared/forms/layouts/InputLayout";
import { EtherscanAddressLink } from "../../../../../shared/links/EtherscanLink";

import txSuccess from "../../../../../../assets/img/icon_txn_status_success.svg";
import * as styles from "../../Transfer.module.scss";

const ethereumAddressFormValidation = YupTS.string().enhance(v =>
  v.test(
    "isEthereumAddress",
    <FormattedMessage id="modals.tx-sender.withdraw-flow.withdraw-component.errors.not-ethereum-address" />,
    (value: string | undefined) => {
      // allow empty values as they should be handled by required yup validation
      if (value === undefined) {
        return true;
      }

      return isAddressValid(value);
    },
  ),
);

const EtherAddressFormRow: React.FunctionComponent<{
  errors: FormikErrors<{ to: string; value: string }>;
  values: FormikValues;
}> = ({ errors, values }) => {
  const shouldDisplaySuccess = !errors.to && values.to;
  return (
    <>
      <DataRow
        className={styles.noSpacing}
        caption={
          <FormLabel for="to" className={styles.label}>
            <FormattedMessage id="modal.sent-eth.to-address" />
          </FormLabel>
        }
        value={
          shouldDisplaySuccess && (
            <EtherscanAddressLink className={cn(styles.etherscanLink)} address={values.to}>
              <FormattedMessage id="modal.sent-eth.view-on-etherscan" />
            </EtherscanAddressLink>
          )
        }
      />

      <FormField
        wrapperClassName="mb-0"
        name="to"
        reverseMetaInfo={true}
        data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.to-address"
        maxLength={ETH_ADDRESS_SIZE}
        charactersLimit={ETH_ADDRESS_SIZE}
        icon={shouldDisplaySuccess && txSuccess}
        theme={EInputTheme.BOX}
      />
    </>
  );
};

export { EtherAddressFormRow, ethereumAddressFormValidation };
