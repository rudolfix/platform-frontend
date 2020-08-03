import { EEtoFormTypes, TPartialCompanyEtoData } from "@neufund/shared-modules";
import { FormikValues } from "formik";
import { compose, setDisplayName, withProps } from "recompose";

import { actions } from "../../../../../modules/actions";
import {
  selectIssuerCompany,
  selectIssuerEtoLoading,
  selectIssuerEtoSaving,
} from "../../../../../modules/eto-flow/selectors";
import { appConnect } from "../../../../../store";
import { convert } from "../../../utils";
import { fromFormState, toFormState } from "./etoRegistrationPitchFormStateConverters";
import { etoPitchValidationFn } from "./validateEtoRegistrationPitch";

type TDispatchProps = {
  saveData: (values: TPartialCompanyEtoData) => void;
};

type TWithProps = {
  initialValues: TPartialCompanyEtoData;
  validationFn: (values: FormikValues) => void;
};

export type TComponentProps = {
  loadingData: boolean;
  savingData: boolean;
  setSaving: (saving: boolean) => void;
} & TWithProps;

type TStateProps = {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialCompanyEtoData;
};

const connectEtoRegistrationPitch = (
  WrappedComponent: React.FunctionComponent<TComponentProps & TDispatchProps>,
) =>
  compose<TComponentProps & TDispatchProps, {}>(
    setDisplayName(EEtoFormTypes.ProductVision),
    appConnect<TStateProps, TDispatchProps>({
      stateToProps: s => {
        const stateValues = selectIssuerCompany(s);
        if (stateValues !== undefined) {
          return {
            loadingData: selectIssuerEtoLoading(s),
            savingData: selectIssuerEtoSaving(s),
            stateValues,
          };
        } else {
          throw new Error("issuer company cannot be undefined at this point!");
        }
      },
      dispatchToProps: dispatch => ({
        saveData: (company: TPartialCompanyEtoData) => {
          const convertedCompany = convert(fromFormState)(company);
          dispatch(actions.etoFlow.saveCompanyStart(convertedCompany));
        },
        setSaving: (saving: boolean) => {
          dispatch(actions.etoFlow.setSaving(saving));
        },
      }),
    }),
    withProps<TWithProps, TStateProps & TDispatchProps>(({ stateValues }) => ({
      initialValues: convert(toFormState)(stateValues),
      validationFn: (values: FormikValues) => etoPitchValidationFn(values),
    })),
  )(WrappedComponent);

export { connectEtoRegistrationPitch };
