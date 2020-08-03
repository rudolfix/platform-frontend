import { EEtoFormTypes, etoFormIsReadonly, TPartialEtoSpecData } from "@neufund/shared-modules";
import {
  ADVISORY_BOARD_TEXT_MIN_LENGTH,
  MAX_RESTRICTED_ACT_VOTING_DURATION,
  MAX_VOTING_DURATION,
  MAX_VOTING_FINALIZATION_DURATION,
  MAX_VOTING_MAJORITY_FRACTION,
  MAX_VOTING_QUORUM,
  MIN_RESTRICTED_ACT_VOTING_DURATION,
  MIN_VOTING_DURATION,
  MIN_VOTING_FINALIZATION_DURATION,
  MIN_VOTING_MAJORITY_FRACTION,
  MIN_VOTING_QUORUM,
} from "@neufund/shared-utils";
import * as React from "react";
import { compose, setDisplayName } from "recompose";
import * as Yup from "yup";

import { actions } from "../../../../../modules/actions";
import {
  selectEtoNominee,
  selectEtoNomineeDisplayName,
  selectIssuerEto,
  selectIssuerEtoLoading,
  selectIssuerEtoSaving,
  selectIssuerEtoState,
} from "../../../../../modules/eto-flow/selectors";
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
  shareholdersVotingQuorum: Yup.number()
    .required()
    .min(MIN_VOTING_QUORUM * 100)
    .max(MAX_VOTING_QUORUM * 100),
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
  advisoryBoardSelector: Yup.boolean(),
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
        loadingData: selectIssuerEtoLoading(s),
        savingData: selectIssuerEtoSaving(s),
        stateValues: selectIssuerEto(s) as TPartialEtoSpecData,
        readonly: etoFormIsReadonly(EEtoFormTypes.EtoVotingRights, selectIssuerEtoState(s)),
        currentNomineeId: selectEtoNominee(s),
        currentNomineeName: selectEtoNomineeDisplayName(s),
      }),
      dispatchToProps: dispatch => ({
        saveData: (eto: TPartialEtoSpecData) => {
          const convertedEto = convert(fromFormState)(eto);
          dispatch(actions.etoFlow.saveEtoStart(convertedEto, { patch: false }));
        },
        setSaving: (saving: boolean) => {
          dispatch(actions.etoFlow.setSaving(saving));
        },
      }),
    }),
  )(WrappedComponent);

const fromFormState = {
  liquidationPreferenceMultiplier: parseStringToFloat(),
  votingFinalizationDurationDays: parseStringToInteger(),
  votingMajorityFraction: [parseStringToFloat(), convertPercentageToFraction()],
  shareholdersVotingQuorum: [parseStringToFloat(), convertPercentageToFraction()],
  advisoryBoard: removeEmptyField(),
  advisoryBoardSelector: removeField(),
  generalVotingDurationDays: parseStringToInteger(),
  restrictedActVotingDurationDays: parseStringToInteger(),
};

export const toFormState = {
  votingFinalizationDurationDays: convertNumberToString(),
  votingMajorityFraction: [convertFractionToPercentage(), convertNumberToString()],
  shareholdersVotingQuorum: [convertFractionToPercentage(), convertNumberToString()],
  generalVotingDurationDays: convertNumberToString(),
  restrictedActVotingDurationDays: convertNumberToString(),
};
