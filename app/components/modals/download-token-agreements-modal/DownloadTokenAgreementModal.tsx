import { map } from "lodash/fp";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Modal } from "reactstrap";
import { compose } from "recompose";

import { EEtoDocumentType, IEtoDocument } from "../../../lib/api/eto/EtoFileApi.interfaces";
import { ImmutableFileId } from "../../../lib/api/ImmutableStorage.interfaces";
import { actions } from "../../../modules/actions";
import { selectEtoWithCompanyAndContractById } from "../../../modules/public-etos/selectors";
import { TEtoWithCompanyAndContract } from "../../../modules/public-etos/types";
import { appConnect } from "../../../store";
import { getDocumentTitles } from "../../documents/utils";
import {
  selectDownloadAgreementModalEtoId,
  selectDownloadAgreementModalIsRetailEto,
  selectDownloadAgrementModalIsOpen,
} from "../../portfolio/selectors";
import { Button, EButtonLayout } from "../../shared/buttons";
import { InlineIcon } from "../../shared/InlineIcon";
import { SectionHeader } from "../../shared/SectionHeader";
import { ModalComponentBody } from "../ModalComponentBody";

import * as downloadIcon from "../../../assets/img/inline_icons/download.svg";
import { Document } from "../../shared/Document";
import * as styles from "./DownloadTokenAgreementModal.module.scss";

interface IStateProps {
  isOpen: boolean;
  isRetailEto: boolean;
  eto: TEtoWithCompanyAndContract | undefined;
}

interface IDispatchProps {
  onClose?: () => void;
  generateTemplateByEtoId: (immutableFileId: IEtoDocument, etoId: string) => void;
  downloadDocument: (immutableFileId: ImmutableFileId, fileName: string) => void;
}

type IComponentProps = IStateProps & IDispatchProps;

const DownloadTokenAgreementModalComponent: React.FunctionComponent<IComponentProps> = ({
  isOpen,
  onClose,
  generateTemplateByEtoId,
  downloadDocument,
  eto,
  isRetailEto,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={onClose}>
      <ModalComponentBody onClose={onClose}>
        {eto && (
          <section data-test-id="portfolio-agreements-download-modal">
            <SectionHeader className="mb-4">
              <FormattedMessage id="portfolio.section.my-assets.modal.header" />
            </SectionHeader>
            {map((document: IEtoDocument) => {
              return [EEtoDocumentType.SIGNED_INVESTMENT_AND_SHAREHOLDER_AGREEMENT].includes(
                document.documentType,
              ) ? (
                <Button
                  className={styles.documentButton}
                  layout={EButtonLayout.SECONDARY}
                  key={document.documentType}
                  innerClassName={styles.document}
                  onClick={() =>
                    downloadDocument(
                      {
                        ipfsHash: document.ipfsHash,
                        mimeType: document.mimeType,
                        asPdf: true,
                      },

                      eto.etoId,
                    )
                  }
                >
                  <Document extension="pdf" />
                  {getDocumentTitles(isRetailEto)[document.documentType]}
                  <InlineIcon className={styles.downloadIcon} svgIcon={downloadIcon} />
                </Button>
              ) : null;
            }, eto.documents)}
            {map((template: IEtoDocument) => {
              return [
                EEtoDocumentType.COMPANY_TOKEN_HOLDER_AGREEMENT,
                EEtoDocumentType.RESERVATION_AND_ACQUISITION_AGREEMENT,
              ].includes(template.documentType) ? (
                <Button
                  className={styles.documentButton}
                  layout={EButtonLayout.SECONDARY}
                  key={template.documentType}
                  innerClassName={styles.document}
                  onClick={() => generateTemplateByEtoId({ ...template, asPdf: true }, eto.etoId)}
                >
                  <Document extension="pdf" />
                  {getDocumentTitles(isRetailEto)[template.documentType]}
                  <InlineIcon className={styles.downloadIcon} svgIcon={downloadIcon} />
                </Button>
              ) : null;
            }, eto.templates)}
          </section>
        )}
      </ModalComponentBody>
    </Modal>
  );
};

const DownloadTokenAgreementModal = compose<IComponentProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const etoId = selectDownloadAgreementModalEtoId(state);
      const eto = etoId ? selectEtoWithCompanyAndContractById(state, etoId) : undefined;
      return {
        isOpen: etoId ? selectDownloadAgrementModalIsOpen(state) : false,
        isRetailEto: etoId ? selectDownloadAgreementModalIsRetailEto(state)! : false,
        eto: eto,
      };
    },
    dispatchToProps: dispatch => ({
      downloadDocument: (immutableFileId: ImmutableFileId, fileName: string) => {
        dispatch(actions.immutableStorage.downloadImmutableFile(immutableFileId, fileName));
      },
      generateTemplateByEtoId: (immutableFileId: IEtoDocument, etoId: string) => {
        dispatch(actions.etoDocuments.generateTemplateByEtoId(immutableFileId, etoId));
      },
      onClose: () => {
        dispatch(actions.portfolio.hideDownloadAgreementModal());
      },
    }),
  }),
)(DownloadTokenAgreementModalComponent);

export { DownloadTokenAgreementModal };
