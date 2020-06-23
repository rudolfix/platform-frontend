import { ButtonInline } from "@neufund/design-system";
import * as cn from "classnames";
import * as React from "react";
import { FormattedDate } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import { externalRoutes } from "../../../config/externalRoutes";
import { TCompanyEtoData } from "../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { IImmutableFileId } from "../../../lib/api/immutable-storage/ImmutableStorage.interfaces";
import { TEtoWithCompanyAndContract } from "../../../modules/eto/types";
import { TProposal } from "../../../modules/shareholder-resolutions-voting/types";
import { etherscanAddressReadContractLink } from "../../appRouteUtils";
import { EMimeType, mapMimeTypeToExtension } from "../../shared/forms";
import { Heading } from "../../shared/Heading";
import { EInlineIconFill, InlineIcon } from "../../shared/icons";
import { ExternalLink } from "../../shared/links";

import iconDownload from "../../../assets/img/inline_icons/download-file.svg";
import * as styles from "./ProposalDetails.module.scss";

type TExternalProps = {
  proposal: TProposal;
  eto: Pick<TEtoWithCompanyAndContract, "equityTokenName" | "nomineeDisplayName">;
  company: Pick<TCompanyEtoData, "name">;
  downloadDocument: (
    immutableFileId: IImmutableFileId,
    fileName: string,
    isProtected: boolean,
  ) => void;
  pendingDownloads: Record<string, boolean | undefined>;
};

const ProposalDetails: React.FunctionComponent<TExternalProps> = ({
  proposal,
  downloadDocument,
  pendingDownloads,
  eto,
  company,
}) => (
  <>
    <Heading level={2} decorator={false} className={cn(styles.heading)}>
      {proposal.title}
    </Heading>

    <section className={cn(styles.section)}>
      <Heading level={6} decorator={false} className={cn(styles.sectionHeading)}>
        <FormattedMessage id="governance.proposal.details.description.heading" />
      </Heading>

      <p>
        <FormattedMessage
          id="governance.proposal.details.description.paragraph1"
          values={{ companyName: company.name, equityTokenName: eto.equityTokenName }}
        />
      </p>
      <p>
        <FormattedMessage id="governance.proposal.details.description.paragraph2" />
      </p>
    </section>

    <section className={cn(styles.section)}>
      <Heading level={6} decorator={false} className={cn(styles.sectionHeading)}>
        <FormattedMessage id="governance.proposal.details.shareholder-resolution.heading" />
      </Heading>

      <p>
        <FormattedMessage id="governance.proposal.details.shareholder-resolution.paragraph" />
      </p>

      <ButtonInline
        data-test-id="governance.proposal.details.download-proposal"
        disabled={pendingDownloads[proposal.ipfsHash]}
        onClick={() =>
          downloadDocument(
            {
              ipfsHash: proposal.ipfsHash,
              asPdf: true,
              mimeType: EMimeType.PDF,
            },
            proposal.title,
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
        {proposal.title}.{mapMimeTypeToExtension(EMimeType.PDF)}
      </ButtonInline>
    </section>

    <section className={cn(styles.section)}>
      <Heading level={6} decorator={false} className={cn(styles.sectionHeading)}>
        <FormattedMessage id="governance.proposal.details.voting-procedure.heading" />
      </Heading>

      <p>
        <FormattedMessage
          id="governance.proposal.details.voting-procedure.paragraph1"
          values={{
            nomineeDisplayName: eto.nomineeDisplayName,
            endsAt: (
              <FormattedDate
                value={proposal.endsAt}
                timeZone="UTC"
                timeZoneName="short"
                year="numeric"
                month="short"
                day="numeric"
                hour="numeric"
                minute="numeric"
              />
            ),
          }}
        />
      </p>

      <p>
        <strong>
          <FormattedMessage id="governance.proposal.details.voting-procedure.paragraph2" />
        </strong>
      </p>

      <p>
        <FormattedMessage
          id="governance.proposal.details.voting-procedure.paragraph3"
          values={{
            link: (
              <>
                <br />
                <ExternalLink
                  className="text-break"
                  href={etherscanAddressReadContractLink(proposal.votingContractAddress)}
                />
              </>
            ),
          }}
        />
      </p>
    </section>

    <section className={cn(styles.section, "mb-0")}>
      <Heading level={6} decorator={false} className={cn(styles.sectionHeading)}>
        <FormattedMessage id="governance.proposal.details.have-questions.heading" />
      </Heading>

      <p className="mb-0">
        <FormattedMessage
          id="governance.proposal.details.have-questions.paragraph"
          values={{
            link: (
              <ExternalLink href={externalRoutes.neufundSupportVotingGuide}>
                <FormattedMessage id="governance.proposal.details.have-questions.paragraph.guide-title" />
              </ExternalLink>
            ),
          }}
        />
      </p>
    </section>
  </>
);

export { ProposalDetails };
