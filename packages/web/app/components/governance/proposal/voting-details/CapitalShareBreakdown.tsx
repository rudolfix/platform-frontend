import { ButtonInline, EInlineIconFill, Eth, EurToken, InlineIcon } from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { IImmutableFileId } from "../../../../lib/api/immutable-storage/ImmutableStorage.interfaces";
import { IShareCapitalBreakdown } from "../../../../modules/shareholder-resolutions-voting/types";
import { DataRowSeparated, DataRowSeparator, EDataRowSize } from "../../../shared/DataRow";
import { EMimeType } from "../../../shared/forms";
import { Heading } from "../../../shared/Heading";
import { EProposalMessages, getMessageTranslation } from "../../../translatedMessages/messages";
import { EVotingStateLayout, VotingStateWidget } from "./VotingStateWidget";

import iconDownload from "../../../../assets/img/inline_icons/download-file.svg";

type TExternalProps = {
  shareCapitalBreakdown: IShareCapitalBreakdown;
  downloadDocument: (
    immutableFileId: IImmutableFileId,
    fileName: string,
    isProtected: boolean,
  ) => void;
  pendingDownloads: Record<string, boolean | undefined>;
  currency: string;
};

const CapitalShareBreakdown: React.FunctionComponent<TExternalProps> = ({
  shareCapitalBreakdown,
  downloadDocument,
  pendingDownloads,
  currency,
}) => (
  <section>
    <Heading level={6} decorator={false} className="text-uppercase mb-2">
      <FormattedMessage id="governance.proposal.capital.share.breakdown.heading" />
    </Heading>
    {shareCapitalBreakdown.resolutionPassed ? (
      <VotingStateWidget layout={EVotingStateLayout.SUCCESS}>
        <FormattedMessage id="governance.proposal.capital.share.breakdown.resolution.passed" />
      </VotingStateWidget>
    ) : (
      <VotingStateWidget layout={EVotingStateLayout.FAILED}>
        <FormattedMessage id="governance.proposal.capital.share.breakdown.resolution.failed" />
      </VotingStateWidget>
    )}
    <DataRowSeparator />
    <DataRowSeparated
      size={EDataRowSize.SMALL}
      caption={<FormattedMessage id="governance.proposal.capital.share.yes" />}
      value={
        currency === "EUR" ? (
          <EurToken value={shareCapitalBreakdown.shareCapitalInFavor} symbolAsEuro={true} />
        ) : (
          <Eth value={shareCapitalBreakdown.shareCapitalInFavor} />
        )
      }
    />
    <DataRowSeparated
      size={EDataRowSize.SMALL}
      caption={<FormattedMessage id="governance.proposal.capital.share.no" />}
      value={
        currency === "EUR" ? (
          <EurToken value={shareCapitalBreakdown.shareCapitalAgainst} symbolAsEuro={true} />
        ) : (
          <Eth value={shareCapitalBreakdown.shareCapitalAgainst} />
        )
      }
    />
    <DataRowSeparated
      size={EDataRowSize.SMALL}
      caption={<FormattedMessage id="governance.proposal.capital.share.abstained" />}
      value={
        currency === "EUR" ? (
          <EurToken value={shareCapitalBreakdown.shareCapitalAbstain} symbolAsEuro={true} />
        ) : (
          <Eth value={shareCapitalBreakdown.shareCapitalAbstain} />
        )
      }
    />
    <ButtonInline
      data-test-id="governance.proposal.details.download-proposal"
      disabled={pendingDownloads[shareCapitalBreakdown.offChainVoteDocumentUri]}
      onClick={() =>
        downloadDocument(
          {
            ipfsHash: shareCapitalBreakdown.offChainVoteDocumentUri,
            asPdf: true,
            mimeType: EMimeType.PDF,
          },

          getMessageTranslation({
            messageType: EProposalMessages.PROPOSAL_DOCUMENT_NAME,
          }) as string,
          true,
        )
      }
    >
      <InlineIcon
        width="1.4em"
        height="1.4em"
        className="mr-2"
        svgIcon={iconDownload}
        fill={EInlineIconFill.FILL_OUTLINE}
      />
      <FormattedMessage id="governance.proposal.capital.share.download.official.statement" />
    </ButtonInline>
  </section>
);

export { CapitalShareBreakdown };
