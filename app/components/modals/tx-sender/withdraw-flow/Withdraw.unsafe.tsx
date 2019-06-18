import * as cn from "classnames";
import { Formik, FormikErrors, FormikProps, yupToFormErrors } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, withHandlers } from "recompose";
import { NumberSchema } from "yup";

import { Q18 } from "../../../../config/constants";
import { ITxData } from "../../../../lib/web3/types";
import * as YupTS from "../../../../lib/yup-ts";
import { actions } from "../../../../modules/actions";
import { EValidationState } from "../../../../modules/tx/sender/reducer";
import {
  selectTxAdditionalData,
  selectTxGasCostEthUlps,
  selectTxGasCostEurUlps,
  selectTxTotalEthUlps,
  selectTxTotalEurUlps,
  selectTxValidationState,
} from "../../../../modules/tx/sender/selectors";
import {
  EAdditionalValidationDataWarrning,
  ETxSenderType,
  IAdditionalValidationData,
  IDraftType,
  TAdditionalDataByType,
} from "../../../../modules/tx/types";
import { ETH_ADDRESS_SIZE } from "../../../../modules/tx/utils";
import {
  selectLiquidEtherBalance,
  selectLiquidEtherBalanceEuroAmount,
  selectMaxAvailableEther,
} from "../../../../modules/wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../../modules/web3/selectors";
import { doesUserHaveEnoughEther, validateAddress } from "../../../../modules/web3/utils";
import { appConnect } from "../../../../store";
import { OmitKeys } from "../../../../types";
import { extractNumber } from "../../../../utils/StringUtils";
import { Button } from "../../../shared/buttons";
import { ButtonArrowLeft, EButtonLayout } from "../../../shared/buttons/Button";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode,
} from "../../../shared/formatters/utils";
import { Form } from "../../../shared/forms";
import { FormLabel } from "../../../shared/forms/fields/FormFieldLabel";
import { FormInput } from "../../../shared/forms/fields/FormInput.unsafe";
import { EInputAlign, InputSize } from "../../../shared/forms/fields/FormInputRaw.unsafe";
import { FormMaskedInput } from "../../../shared/forms/fields/FormMaskedInput.unsafe";
import { generateMaskFromCurrency } from "../../../shared/forms/fields/utils.unsafe";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { EtherscanAddressLink } from "../../../shared/links/EtherscanLink";
import { getFormattedMoney } from "../../../shared/Money.unsafe";
import { ETextPosition, MoneySuiteWidget } from "../../../shared/MoneySuiteWidget";

import * as styles from "./Withdraw.module.scss";

type TAdditionalData = IAdditionalValidationData &
  TAdditionalDataByType<typeof ETxSenderType.WITHDRAW>;

interface IStateProps {
  maxEther: string;
  validationState?: EValidationState;
  ethAmount: string;
  ethEuroAmount: string;
  walletAddress: string;
  gasPrice: string;
  gasPriceEur: string;
  total: string;
  totalEur: string;
  additionalData?: TAdditionalData;
}

interface IWithdrawData {
  value: string;
  to: string;
}

interface IHandlersProps {
  onValidateHandler: (values: IWithdrawData) => void | FormikErrors<IWithdrawData>;
}

interface IDispatchProps {
  onValidate: (txDraft: IDraftType) => void;
  onAccept: (tx: Partial<ITxData>) => void;
  onBack: () => void;
  onAcceptWarnings: () => void;
}

type TProps = IStateProps & OmitKeys<IDispatchProps, "onValidate"> & IHandlersProps;

const WaringSelectorComponent: React.FunctionComponent<{
  warning: EAdditionalValidationDataWarrning | undefined;
}> = ({ warning }) => {
  switch (warning) {
    case EAdditionalValidationDataWarrning.IS_SMART_CONTRACT:
      return (
        <div
          className={cn("text-warning", "text-center", "my-3")}
          data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.smart-contract"
        >
          <FormattedMessage id="modal.sent-eth.smart-contract-address" />
        </div>
      );
    case EAdditionalValidationDataWarrning.IS_NEW_ADDRESS:
      return (
        <div
          className={cn("text-warning", "text-center", "my-3")}
          data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.new-address"
        >
          <FormattedMessage id="modal.sent-eth.new-address" />
        </div>
      );
    case EAdditionalValidationDataWarrning.IS_NOT_ACCEPTING_ETHER:
      return (
        <div
          className={cn("text-warning", "text-center", "my-3")}
          data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.not-accepting-ether"
        >
          <FormattedMessage id="modal.sent-eth.not-accepting-ether" />
        </div>
      );
    default:
      return null;
  }
};

const getWithdrawFormSchema = (maxEther: string) =>
  YupTS.object({
    to: YupTS.string().enhance(v =>
      v.test(
        "isEthereumAddress",
        (
          <FormattedMessage id="modals.tx-sender.withdraw-flow.withdraw-component.errors.not-ethereum-address" />
        ) as any,
        (value: string | undefined) => {
          // allow empty values as they should be handled by required yup validation
          if (value === undefined) {
            return true;
          }

          return validateAddress(value);
        },
      ),
    ),
    value: YupTS.number().enhance((v: NumberSchema) =>
      v
        .moreThan(0)
        .test(
          "isEnoughEther",
          (
            <FormattedMessage id="modals.tx-sender.withdraw-flow.withdraw-component.errors.value-higher-than-balance" />
          ) as any,
          (value: string) => doesUserHaveEnoughEther(value, maxEther),
        ),
    ),
  }).toYup();

const WithdrawLayout: React.FunctionComponent<TProps> = ({
  onAccept,
  onValidateHandler,
  ethAmount,
  ethEuroAmount,
  walletAddress,
  gasPrice,
  gasPriceEur,
  total,
  totalEur,
  onBack,
  validationState,
  maxEther,
  additionalData,
  onAcceptWarnings,
}) => (
  <section className={styles.contentWrapper}>
    <Heading size={EHeadingSize.SMALL} level={4} className="mb-4">
      <FormattedMessage id="modal.sent-eth.title" />
    </Heading>

    <Formik<IWithdrawData>
      validate={onValidateHandler}
      // Initial values are used only when user is returning to this screen from Summary
      initialValues={{
        to: (additionalData && additionalData.to) || "",
        value:
          additionalData && additionalData.amount
            ? getFormattedMoney(
                additionalData.amount,
                ECurrency.ETH,
                ENumberInputFormat.ULPS,
                false,
                ERoundingMode.DOWN,
              )
            : "",
      }}
      // Initial valid is only set to true when user is returning to this screen from Summary
      isInitialValid={additionalData && !!additionalData.amount}
      onSubmit={onAccept}
    >
      {({
        isValid,
        isValidating,
        setFieldValue,
        setFieldTouched,
        values,
        errors,
      }: FormikProps<IWithdrawData>) => (
        <Form>
          <section className={styles.section}>
            <span className={styles.fullWidth}>
              <FormattedMessage id="modal.sent-eth.transfer-from" />
            </span>
            <div className={styles.withEtherscan}>
              <span className={styles.walletLabel}>
                <FormattedMessage id="modal.sent-eth.ether-balance" />
              </span>
              <EtherscanAddressLink className={"small"} address={walletAddress}>
                <FormattedMessage id="modal.sent-eth.view-on-etherscan" />
              </EtherscanAddressLink>
            </div>
            <MoneySuiteWidget
              currency={ECurrency.ETH}
              currencyTotal={ECurrency.EUR}
              largeNumber={ethAmount}
              value={ethEuroAmount}
              theme={
                additionalData && additionalData.isAccepted === false
                  ? "black"
                  : isValid
                  ? "orange"
                  : "green"
              }
              textPosition={ETextPosition.RIGHT}
            />
          </section>

          <section className="mb-4">
            <FormLabel for="to" className={styles.label}>
              <FormattedMessage id="modal.sent-eth.to-address" />
            </FormLabel>
            <FormInput
              name="to"
              data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.to-address"
              maxLength={ETH_ADDRESS_SIZE}
              charactersLimit={ETH_ADDRESS_SIZE}
              size={InputSize.SMALL}
            />
            <EtherscanAddressLink
              className={cn("small", { [styles.disable]: errors.to || !values.to })}
              address={values.to}
            >
              <FormattedMessage id="modal.sent-eth.view-on-etherscan" />
            </EtherscanAddressLink>
          </section>

          <section className="mb-4">
            <FormLabel for="value" className={styles.label}>
              <FormattedMessage id="modal.sent-eth.amount" />
            </FormLabel>
            <FormMaskedInput
              data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.value"
              name="value"
              suffix="ETH"
              unmask={extractNumber}
              mask={generateMaskFromCurrency(ECurrency.ETH)}
              align={EInputAlign.RIGHT}
              size={InputSize.SMALL}
            />
            <Button
              data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.whole-balance"
              className="mt-2"
              onClick={() => {
                setFieldValue(
                  "value",
                  getFormattedMoney(
                    maxEther,
                    ECurrency.ETH,
                    ENumberInputFormat.ULPS,
                    false,
                    ERoundingMode.DOWN,
                  ),
                  true,
                );
                setFieldTouched("value", true, true);
              }}
              layout={EButtonLayout.PRIMARY}
            >
              <FormattedMessage id="modal.sent-eth.whole-balance" />
            </Button>
          </section>

          <section className={styles.section}>
            <div className={styles.withEtherscan}>
              <FormattedMessage id="modal.sent-eth.transaction-fee" />
              <small>
                <FormattedMessage id="modal.sent-eth.gas" />
              </small>
            </div>
            <MoneySuiteWidget
              currency={ECurrency.ETH}
              currencyTotal={ECurrency.EUR}
              largeNumber={gasPrice}
              value={gasPriceEur}
              theme={
                additionalData && additionalData.isAccepted === false
                  ? "black"
                  : errors.value
                  ? "orange"
                  : "green"
              }
              outputFormat={ENumberOutputFormat.FULL}
              roundingMode={ERoundingMode.UP}
              textPosition={ETextPosition.RIGHT}
            />
          </section>

          <section className={styles.section}>
            <FormattedMessage id="modal.sent-eth.total" />
            <MoneySuiteWidget
              currency={ECurrency.ETH}
              currencyTotal={ECurrency.EUR}
              largeNumber={total}
              value={totalEur}
              theme={
                additionalData && additionalData.isAccepted === false
                  ? "black"
                  : errors.value
                  ? "orange"
                  : "green"
              }
              textPosition={ETextPosition.RIGHT}
            />
          </section>

          {additionalData && <WaringSelectorComponent warning={additionalData.warning} />}

          <section className={styles.section}>
            <ButtonArrowLeft innerClassName="pl-0" onClick={onBack}>
              <FormattedMessage id="modal.sent-eth.back" />
            </ButtonArrowLeft>

            {additionalData && additionalData.warning && additionalData.isAccepted !== true ? (
              <Button
                type="button"
                disabled={
                  !isValid ||
                  isValidating ||
                  validationState !== EValidationState.VALIDATION_OK ||
                  (additionalData &&
                    additionalData.inputValue !== Q18.mul(values.value || 0).toString())
                }
                // we need to prevent Formik from sending form
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  onAcceptWarnings();
                  e.preventDefault();
                }}
                data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.accept-warnings"
              >
                <FormattedMessage id="modal.sent-eth.ok" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={
                  !isValid || isValidating || validationState !== EValidationState.VALIDATION_OK
                }
                data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"
              >
                <FormattedMessage id="modal.sent-eth.button" />
              </Button>
            )}
          </section>
        </Form>
      )}
    </Formik>
  </section>
);

const Withdraw = compose<TProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      ethAmount: selectLiquidEtherBalance(state),
      ethEuroAmount: selectLiquidEtherBalanceEuroAmount(state),
      walletAddress: selectEthereumAddressWithChecksum(state),
      maxEther: selectMaxAvailableEther(state),
      validationState: selectTxValidationState(state),
      gasPrice: selectTxGasCostEthUlps(state),
      gasPriceEur: selectTxGasCostEurUlps(state),
      total: selectTxTotalEthUlps(state),
      totalEur: selectTxTotalEurUlps(state),
      additionalData: selectTxAdditionalData<typeof ETxSenderType.WITHDRAW>(state),
    }),
    dispatchToProps: d => ({
      onAccept: (tx: Partial<ITxData>) => d(actions.txSender.txSenderAcceptDraft(tx)),
      onBack: () => d(actions.routing.goToWallet()),
      onValidate: (txDraft: IDraftType) => d(actions.txValidator.txSenderValidateDraft(txDraft)),
      onAcceptWarnings: () => d(actions.txValidator.acceptWarnings()),
    }),
  }),
  withHandlers<IStateProps & IDispatchProps, {}>({
    onValidateHandler: ({ onValidate, maxEther }) => (values: IWithdrawData) => {
      const schema = getWithdrawFormSchema(maxEther);

      try {
        schema.validateSync(values, { abortEarly: false });
      } catch (errors) {
        return yupToFormErrors(errors);
      }

      onValidate({
        to: values.to,
        value: values.value,
        type: ETxSenderType.WITHDRAW,
      });

      return undefined;
    },
  }),
)(WithdrawLayout);

export { Withdraw, WithdrawLayout };
