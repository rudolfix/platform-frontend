import { Button, CheckboxBase, EButtonLayout, Eur } from "@neufund/design-system";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { ModalFooter } from "reactstrap";
import * as React from "react";
import { Heading } from "../../shared/Heading";

import * as styles from "./NewVotingResolutionModal.module.scss";

export const NewVotingResolutionSummary = props => (
  <>
    <Heading level={4} decorator={false} className={styles.modalTitle}>
      <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.summary.title" />
    </Heading>

    <div className={styles.summary}>
      <p className={styles.summaryDescription}>
        <FormattedHTMLMessage
          id="eto-dashboard.new-voting-resolution-modal.summary.description"
          tagName="span"
        />
      </p>

      <ul className={styles.summaryList}>
        <li className={styles.summaryItem}>
          <span className={styles.summaryItemTitle}>
            <FormattedMessage id="form.label.title" />
          </span>
          <span className={styles.summaryItemValue}>{props.values.title}</span>
        </li>

        <li className={styles.summaryItem}>
          <span className={styles.summaryItemTitle}>
            <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.form.voting-duration" />
          </span>

          <span className={styles.summaryItemValue}>
            {props.values.votingDuration} <FormattedMessage id="counter.label.days" />
          </span>
        </li>

        <li className={styles.summaryItem}>
          <span className={styles.summaryItemTitle}>
            <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.summary.upload-resolution-document-uploaded" />
          </span>

          <span className={styles.summaryItemValue}>{props.values.votingDuration.document}</span>
        </li>

        <li className={styles.summaryItem}>
          <span className={styles.summaryItemTitle}>
            <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.summary.will-include-external-shareholder-votes" />
          </span>

          <span className={styles.summaryItemValue}>
            {props.values.includeExternalVotes ? (
              <FormattedMessage id="form.select.yes" />
            ) : (
              <FormattedMessage id="form.select.no" />
            )}
          </span>
        </li>

        <li className={styles.summaryItem}>
          <span className={styles.summaryItemTitle}>
            <FormattedMessage
              id="eto-dashboard.new-voting-resolution-modal.summary.total-voting-share-capital"
              values={{ shareCapitalCurrencyCode: props.shareCapitalCurrencyCode }}
            />
          </span>

          <span className={styles.summaryItemValue}>
            <Eur value={props.values.votingShareCapital} noSymbol />
          </span>
        </li>

        {props.values.includeExternalVotes && (
          <li className={styles.summaryItem}>
            <span className={styles.summaryItemTitle}>
              <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.form.submission-deadline" />
            </span>

            <span className={styles.summaryItemValue}>
              {props.values.submissionDeadline}{" "}
              <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.form.submission-deadline.units" />
            </span>
          </li>
        )}
      </ul>

      <CheckboxBase
        name="iUnderstand"
        label={
          <FormattedMessage id="eto-dashboard.new-voting-resolution-modal.summary.condition" />
        }
      />
    </div>

    <ModalFooter className={styles.footer}>
      <Button layout={EButtonLayout.SECONDARY} onClick={props.onEdit} className={styles.editButton}>
        <FormattedMessage id="form.button.edit" />
      </Button>

      <Button layout={EButtonLayout.PRIMARY} onClick={props.onPublish}>
        <FormattedMessage id="form.button.publish" />
      </Button>
    </ModalFooter>
  </>
);
