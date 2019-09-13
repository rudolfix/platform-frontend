import * as React from "react";
import { compose, setDisplayName } from "recompose";
import * as Yup from "yup";

import {
  ADVISORY_BOARD_TEXT_MIN_LENGTH,
  MAX_RESTRICTED_ACT_VOTING_DURATION,
  MAX_VOTING_DURATION,
  MAX_VOTING_FINALIZATION_DURATION,
  MAX_VOTING_MAJORITY_FRACTION,
  MIN_RESTRICTED_ACT_VOTING_DURATION,
  MIN_VOTING_DURATION,
  MIN_VOTING_FINALIZATION_DURATION,
  MIN_VOTING_MAJORITY_FRACTION,
} from "../../../../../config/constants";
import { TPartialEtoSpecData } from "../../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { etoFormIsReadonly } from "../../../../../lib/api/eto/EtoApiUtils";
import { actions } from "../../../../../modules/actions";
import {
  selectEtoNominee,
  selectEtoNomineeDisplayName,
  selectIssuerEto,
  selectIssuerEtoState,
} from "../../../../../modules/eto-flow/selectors";
import { EEtoFormTypes } from "../../../../../modules/eto-flow/types";
import { appConnect } from "../../../../../store";
import {
  convert,
  convertFractionToPercentage,
  convertNumberToString,
  convertPercentageToFraction,
  parseStringToFloat,
  parseStringToInteger,
  removeEmptyField,
  removeField,
} from "../../../utils";
import { TDispatchProps, TExternalProps, TStateProps } from "./EtoVotingRights";

export const EtoVotingRightsValidator = Yup.object().shape({
  liquidationPreferenceMultiplier: Yup.number().required(),
  generalVotingRule: Yup.string().required(),
  hasGeneralInformationRights: Yup.boolean().required(),
  hasDividendRights: Yup.boolean().required(),
  tagAlongVotingRule: Yup.string().required(),
  generalVotingDurationDays: Yup.number()
    .required()
    .min(MIN_VOTING_DURATION)
    .max(MAX_VOTING_DURATION),
  restrictedActVotingDurationDays: Yup.number()
    .required()
    .min(MIN_RESTRICTED_ACT_VOTING_DURATION)
    .max(MAX_RESTRICTED_ACT_VOTING_DURATION),
  votingFinalizationDurationDays: Yup.number()
    .required()
    .min(MIN_VOTING_FINALIZATION_DURATION)
    .max(MAX_VOTING_FINALIZATION_DURATION),
  votingMajorityFraction: Yup.number()
    .required()
    .min(MIN_VOTING_MAJORITY_FRACTION * 100)
    .max(MAX_VOTING_MAJORITY_FRACTION * 100),
  advisoryBoardSelector: Yup.boolean().required(),
  advisoryBoard: Yup.string().when("advisoryBoardSelector", (v: boolean) =>
    v
      ? Yup.string()
          .required()
          .min(ADVISORY_BOARD_TEXT_MIN_LENGTH)
      : Yup.string().notRequired(),
  ),
  hasDragAlongRights: Yup.boolean().required(),
  hasTagAlongRights: Yup.boolean().required(),
  hasFoundersVesting: Yup.boolean().required(),
});

export const connectEtoVotingRightsForm = (
  WrappedComponent: React.ComponentType<TExternalProps & TStateProps & TDispatchProps>,
) =>
  compose<TExternalProps & TStateProps & TDispatchProps, TExternalProps>(
    setDisplayName(EEtoFormTypes.EtoVotingRights),
    appConnect<TStateProps, TDispatchProps>({
      stateToProps: s => ({
        loadingData: s.etoIssuer.loading,
        savingData: s.etoIssuer.saving,
        stateValues: selectIssuerEto(s) as TPartialEtoSpecData,
        readonly: etoFormIsReadonly(EEtoFormTypes.EtoVotingRights, selectIssuerEtoState(s)),
        currentNomineeId: selectEtoNominee(s),
        currentNomineeName: selectEtoNomineeDisplayName(s),
      }),
      dispatchToProps: dispatch => ({
        saveData: (data: TPartialEtoSpecData) => {
          const convertedData = convert(data, fromFormState);
          dispatch(
            actions.etoFlow.saveDataStart({
              companyData: {},
              etoData: convertedData,
            }),
          );
        },
      }),
    }),
  )(WrappedComponent);

const fromFormState = {
  liquidationPreferenceMultiplier: parseStringToFloat(),
  votingFinalizationDurationDays: parseStringToInteger(),
  votingMajorityFraction: [parseStringToFloat(), convertPercentageToFraction()],
  advisoryBoard: removeEmptyField(),
  advisoryBoardSelector: removeField(),
  generalVotingDurationDays: parseStringToInteger(),
  restrictedActVotingDurationDays: parseStringToInteger(),
};

export const toFormState = {
  votingFinalizationDurationDays: convertNumberToString(),
  votingMajorityFraction: [convertFractionToPercentage(), convertNumberToString()],
  generalVotingDurationDays: convertNumberToString(),
  restrictedActVotingDurationDays: convertNumberToString(),
};
