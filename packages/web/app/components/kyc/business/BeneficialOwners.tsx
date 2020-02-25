import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import {
  IKycBeneficialOwner,
  IKYCBeneficialOwnerBusiness,
  IKYCBeneficialOwnerPerson,
  IKycFileInfo,
  IKycManagingDirector,
} from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { selectBeneficialOwner } from "../../../modules/kyc/selectors";
import { EBeneficialOwnerType } from "../../../modules/kyc/types";
import { getBeneficialOwnerType, validateBeneficiaryOwner } from "../../../modules/kyc/utils";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import { AddPersonButton } from "../shared/AddPersonButton";
import { FooterButtons } from "../shared/FooterButtons";
import { KycStep } from "../shared/KycStep";
import { Person } from "../shared/Person";
import { BeneficialOwnerDetails } from "./BeneficialOwnerDetails";

export interface IStateProps {
  beneficialOwners: ReadonlyArray<IKycBeneficialOwner>;
  loading: boolean;
  editingOwner: IKycBeneficialOwner | undefined;
  files: ReadonlyArray<IKycFileInfo>;
  filesLoading: boolean;
  filesUploading: boolean;
  showModal: boolean;
  loadingAll: boolean;
  loadingOne: boolean;
  editingOwnerId: string | undefined;
}

interface IDispatchProps {
  goBack: () => void;
  onContinue: () => void;
  saveAndClose: () => void;
  toggleModal: (show: boolean, beneficialOwnerId?: string) => void;
  onSaveModal: (values: IKycBeneficialOwner, beneficialOwnerId: string) => void;
  onDropFile: (values: IKycManagingDirector, file: File) => void;
  onDelete: (beneficialOwnerId: string) => void;
}

type TProps = IStateProps & IDispatchProps;

export const KYCBeneficialOwnersComponent: React.FunctionComponent<TProps> = ({
  beneficialOwners,
  filesUploading,
  filesLoading,
  files,
  onDropFile,
  onContinue,
  goBack,
  onSaveModal,
  showModal,
  toggleModal,
  editingOwner,
  onDelete,
  loadingAll,
  loadingOne,
  editingOwnerId,
  saveAndClose,
}) => {
  const [type, setType] = React.useState(EBeneficialOwnerType.PERSON);

  const continueDisabled =
    !beneficialOwners ||
    loadingAll ||
    !beneficialOwners.every(owner =>
      validateBeneficiaryOwner(getBeneficialOwnerType(owner), owner),
    );

  return (
    <>
      <KycStep
        step={4}
        allSteps={5}
        title={<FormattedMessage id="kyc.business.beneficial-owner.beneficial-owners" />}
        description={
          <FormattedMessage id="kyc.business.beneficial-owner.beneficial-owners-disclaimer" />
        }
        buttonAction={saveAndClose}
        data-test-id="kyc.panel.business-verification"
      />

      <div data-test-id="kyc-beneficial-owners">
        {beneficialOwners.map((owner: IKycBeneficialOwner) => {
          const id = (owner.person
            ? (owner.person as IKYCBeneficialOwnerPerson)
            : (owner.business as IKYCBeneficialOwnerBusiness)
          ).id;
          const name = owner.person
            ? `${owner.person.firstName} ${owner.person.lastName}`
            : (owner.business as IKYCBeneficialOwnerBusiness).name;

          return <Person key={id} onClick={() => toggleModal(true, id)} name={name || ""} />;
        })}

        <AddPersonButton
          onClick={() => toggleModal(true)}
          dataTestId="kyc.business.beneficial-owner.add-new-beneficial-owner"
        >
          <FormattedMessage id="kyc.business.beneficial-owner.add-new-beneficial-owner" />
        </AddPersonButton>

        <FooterButtons
          onBack={goBack}
          onContinue={onContinue}
          continueButtonId="kyc-business-beneficial-owners-continue"
          skip={beneficialOwners.length === 0}
          continueDisabled={continueDisabled}
        />

        <BeneficialOwnerDetails
          type={editingOwner ? getBeneficialOwnerType(editingOwner) : type}
          setType={setType}
          show={showModal}
          onClose={() => toggleModal(false)}
          onSave={(values: IKycBeneficialOwner) => onSaveModal(values, editingOwnerId as string)}
          onDropFile={onDropFile}
          files={files}
          filesUploading={filesUploading}
          currentValues={editingOwner}
          onDelete={() => onDelete(editingOwnerId as string)}
          filesLoading={filesLoading}
          loading={loadingOne}
        />
      </div>
    </>
  );
};

export const KYCBeneficialOwners = compose<IStateProps & IDispatchProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => selectBeneficialOwner(state),
    dispatchToProps: dispatch => ({
      goBack: () => dispatch(actions.routing.goToKYCManagingDirectors()),
      onContinue: () => dispatch(actions.routing.goToKYCLegalRepresentative()),
      toggleModal: (show, beneficialOwnerId?: string) =>
        dispatch(actions.kyc.kycToggleBeneficialOwnerModal(show, beneficialOwnerId)),
      onDropFile: (values: IKycBeneficialOwner, file: File) =>
        dispatch(actions.kyc.kycUploadBeneficialOwnerDocument(file, values)),
      onSaveModal: (values: IKycBeneficialOwner, id: string) =>
        dispatch(actions.kyc.kycSubmitBeneficialOwner(values, id)),
      onDelete: (beneficialOwnerId: string) =>
        dispatch(actions.kyc.kycDeleteBeneficialOwner(beneficialOwnerId)),
      saveAndClose: () => dispatch(actions.routing.goToDashboard()),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycLoadBeneficialOwners()),
  }),
)(KYCBeneficialOwnersComponent);
