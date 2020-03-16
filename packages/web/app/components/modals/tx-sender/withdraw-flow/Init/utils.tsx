import { yupToFormErrors } from "formik";
import { memoize } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { NumberSchema } from "yup";

import * as YupTS from "../../../../../lib/yup-ts.unsafe";
import { EAdditionalValidationDataNotifications } from "../../../../../modules/tx/validator/reducer";
import { ethereumAddressFormValidation } from "./EtherAddressFormRow/EtherAddressFormRow";
import { ITransferData } from "./TransferLayout/TransferLayout";

export const hasNotification = (
  notification: EAdditionalValidationDataNotifications,
  notificationList: ReadonlyArray<EAdditionalValidationDataNotifications>,
): boolean => notificationList.includes(notification);

const getWithdrawFormSchema = () =>
  YupTS.object({
    to: ethereumAddressFormValidation,
    value: YupTS.number()
      .typeError(<FormattedMessage id="modal.transfer.validation-error" />)
      .enhance((v: NumberSchema) => v.moreThan(0)),
  }).toYup();

export const onTransferValidateHandler = memoize(
  (onValidate: (data: { to: string; value: string }) => void) => (values: ITransferData) => {
    const schema = getWithdrawFormSchema();

    onValidate({
      to: values.to,
      value: values.value,
    });

    try {
      schema.validateSync(values, { abortEarly: false });
    } catch (errors) {
      return yupToFormErrors(errors);
    }

    return undefined;
  },
);
