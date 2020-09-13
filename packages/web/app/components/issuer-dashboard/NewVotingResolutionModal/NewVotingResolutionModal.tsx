import { etoModuleApi } from "@neufund/shared-modules";
import {
  TEtoContractData,
  TPartialCompanyEtoData,
  TResolutionDocument,
} from "@neufund/shared-modules";
import * as React from "react";
import { compose } from "recompose";
import { actions } from "../../../modules/actions";
import {
  selectEtoNomineeDisplayName,
  selectIssuerCompany,
  selectIssuerEtoPreviewCode,
} from "../../../modules/eto-flow/selectors";
import {
  DEFAULT_SUBMISSION_DEADLINE_DAYS,
  DEFAULT_VOTING_DURATION_DAYS,
  shareholderResolutionsVotingSetupModuleApi,
  TVotingResolutionSetupData,
} from "../../../modules/shareholder-resolutions-voting-setup/module";
import { appConnect } from "../../../store";
import { Modal } from "../../modals/Modal";
import { EnhancedNewVotingResolutionForm } from "./NewVotingResolutionForm";

import * as styles from "./NewVotingResolutionModal.module.scss";
import { NewVotingResolutionSummary } from "./NewVotingResolutionSummary";

type TExternalProps = {
  show: boolean;
  onClose: () => void;
};

type TStateProps = {
  nomineeDisplayName: string;
  company: TPartialCompanyEtoData;
  contract: TEtoContractData;
  isDocumentUploading: boolean;
  uploadedDocument: TResolutionDocument;
  shareCapital: string;
  shareCapitalCurrencyCode: string;
};

type TDispatchProps = {
  onUploadDocument: (file: File) => void;
  onPublish: (votingResolution: TVotingResolutionSetupData) => void;
  getShareCapital: () => void;
  onRemoveDocument: () => void;
};

const NewVotingResolutionModalLayout: React.FunctionComponent<TExternalProps &
  TStateProps &
  TDispatchProps> = ({ show, onClose, ...props }) => {
  const initialFormValues = {
    title: undefined,
    votingDuration: DEFAULT_VOTING_DURATION_DAYS,
    includeExternalVotes: false,
    votingShareCapital: props.contract.totalInvestment.totalTokensInt,
    submissionDeadline: DEFAULT_SUBMISSION_DEADLINE_DAYS,
  };

  const [showForm, setShowForm] = React.useState(true);
  const [formValues, setFormValues] = React.useState<TVotingResolutionSetupData>(initialFormValues);

  const onNext = (values: TVotingResolutionSetupData) => {
    console.log("onNext", values);
    setFormValues(values);
    setShowForm(false);
  };

  const onEdit = () => {
    setShowForm(true);
  };

  React.useEffect(() => {
    console.log("count changed");
    props.getShareCapital();
    setFormValues(initialFormValues);
    props.onRemoveDocument();
  }, [show]);

  return (
    <Modal isOpen={show} onClose={onClose} bodyClass={styles.modalBody}>
      {showForm ? (
        <EnhancedNewVotingResolutionForm
          {...props}
          shareCapitalCurrencyCode={props.company.shareCapitalCurrencyCode}
          shareCapital={props.shareCapital}
          initialFormValues={formValues}
          nomineeDisplayName={props.nomineeDisplayName}
          uploadedDocument={props.uploadedDocument}
          onRemoveDocument={props.onRemoveDocument}
          onNext={onNext}
        />
      ) : (
        <NewVotingResolutionSummary
          onEdit={onEdit}
          values={formValues}
          shareCapitalCurrencyCode={props.company.shareCapitalCurrencyCode}
          onPublish={() => props.onPublish(formValues)}
        />
      )}
    </Modal>
  );
};

export const NewVotingResolutionModal = compose<TExternalProps & TStateProps & TDispatchProps>(
  appConnect({
    stateToProps: state => ({
      nomineeDisplayName: selectEtoNomineeDisplayName(state),
      company: selectIssuerCompany(state),
      contract: etoModuleApi.selectors.selectEtoContract(state, selectIssuerEtoPreviewCode(state)),
      isDocumentUploading: shareholderResolutionsVotingSetupModuleApi.selectors.isDocumentUploading(
        state,
      ),
      uploadedDocument: shareholderResolutionsVotingSetupModuleApi.selectors.selectUploadedDocument(
        state,
      ),
      shareCapital: shareholderResolutionsVotingSetupModuleApi.selectors.selectShareCapital(state),
    }),
    dispatchToProps: dispatch => ({
      onUploadDocument: (file: File) =>
        dispatch(shareholderResolutionsVotingSetupModuleApi.actions.uploadResolutionDocument(file)),
      onRemoveDocument: () =>
        dispatch(shareholderResolutionsVotingSetupModuleApi.actions.removeUploadedDocument()),
      onPublish: (votingResolution: TVotingResolutionSetupData) =>
        dispatch(actions.txTransactions.startShareholderVotingResolutionSetup(votingResolution)),
      getShareCapital: () =>
        dispatch(shareholderResolutionsVotingSetupModuleApi.actions.getShareCapital()),
    }),
  }),
)(NewVotingResolutionModalLayout);
