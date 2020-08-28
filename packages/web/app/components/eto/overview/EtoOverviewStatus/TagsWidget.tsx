import {
  EEtoDocumentType,
  IEtoDocument,
  TEtoWithCompanyAndContractReadonly,
} from "@neufund/shared-modules";
import keyBy from "lodash/keyBy";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, withProps } from "recompose";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { etherscanAddressLink, etoPublicViewLink } from "../../../appRouteUtils";
import { TagWithFallback } from "../../../shared/Tag";
import { getDocumentTagProps } from "./utils";

import * as styles from "./EtoOverviewStatus.module.scss";

interface IExternalProps {
  eto: TEtoWithCompanyAndContractReadonly;
  isEmbedded: boolean;
  innerClass?: string;
}

interface IWithProps {
  termSheet: IEtoDocument;
  investorOfferingDocumentApproved?: IEtoDocument;
  smartContractOnChain: boolean;
}

interface IDispatchProps {
  downloadDocument: (document: IEtoDocument) => void;
}

const hasDocument = (document: IEtoDocument | undefined): boolean =>
  Boolean(document && document.name && document.name.length);

const TagsWidgetLayout: React.FunctionComponent<IWithProps & IExternalProps & IDispatchProps> = ({
  eto,
  termSheet,
  investorOfferingDocumentApproved,
  smartContractOnChain,
  downloadDocument,
  innerClass,
  isEmbedded,
}) => {
  const termsSheetTagCommonProps = {
    innerClass,
    condition: hasDocument(termSheet),
    textElement: <FormattedMessage id="shared-component.eto-overview.term-sheet" />,
    "data-test-id": "eto-overview-term-sheet-button",
  };

  const approvedDocumentTagCondition = hasDocument(investorOfferingDocumentApproved);
  const approvedDocumentTagCommonProps = {
    innerClass,
    condition: approvedDocumentTagCondition,
    ...getDocumentTagProps(eto.product.offeringDocumentType, approvedDocumentTagCondition),
  };

  return (
    <div className={styles.tagsWrapper}>
      <TagWithFallback
        condition={!!eto.company.companyPitchdeckUrl}
        to={eto.company.companyPitchdeckUrl ? eto.company.companyPitchdeckUrl.url : ""}
        textElement={<FormattedMessage id="shared-component.eto-overview.pitch-deck" />}
        innerClass={innerClass}
        data-test-id="eto-overview-pitch-deck-button"
      />

      {isEmbedded ? (
        <TagWithFallback
          {...termsSheetTagCommonProps}
          to={etoPublicViewLink(eto.previewCode, eto.product.jurisdiction)}
        />
      ) : (
        <TagWithFallback
          {...termsSheetTagCommonProps}
          onClick={() => downloadDocument(termSheet)}
        />
      )}

      {isEmbedded ? (
        <TagWithFallback
          {...approvedDocumentTagCommonProps}
          to={etoPublicViewLink(eto.previewCode, eto.product.jurisdiction)}
        />
      ) : (
        <TagWithFallback
          {...approvedDocumentTagCommonProps}
          onClick={() =>
            investorOfferingDocumentApproved && downloadDocument(investorOfferingDocumentApproved)
          }
        />
      )}

      <TagWithFallback
        condition={smartContractOnChain}
        to={etherscanAddressLink(eto.etoId)}
        textElement={
          <FormattedMessage id="shared-component.eto-overview.smart-contract-on-chain" />
        }
        data-test-id="eto-overview-smart-contract-on-chain-button"
        innerClass={innerClass}
      />
    </div>
  );
};

const TagsWidget = compose<IDispatchProps & IWithProps & IExternalProps, IExternalProps>(
  appConnect<{}, IDispatchProps, IExternalProps>({
    dispatchToProps: (dispatch, { eto }) => ({
      downloadDocument: (document: IEtoDocument) =>
        dispatch(actions.eto.downloadEtoDocument(document, eto)),
    }),
  }),
  withProps<IWithProps, IExternalProps & IDispatchProps>(props => {
    const documentsByType = keyBy(props.eto.documents, document => document.documentType);

    return {
      smartContractOnChain: Boolean(props.eto.contract),
      termSheet: documentsByType[EEtoDocumentType.SIGNED_TERMSHEET],
      investorOfferingDocumentApproved:
        documentsByType[EEtoDocumentType.APPROVED_INVESTOR_OFFERING_DOCUMENT],
    };
  }),
)(TagsWidgetLayout);

export { TagsWidget, TagsWidgetLayout };
