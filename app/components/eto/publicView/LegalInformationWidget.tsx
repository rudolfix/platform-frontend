import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { TCompanyEtoData, TEtoSpecsData } from "../../../lib/api/eto/EtoApi.interfaces";
import { ChartDoughnut } from "../../shared/charts/ChartDoughnut";
import { Panel } from "../../shared/Panel";
import { FUNDING_ROUNDS } from "../registration/pages/LegalInformation";
import { CHART_COLORS } from "../shared/EtoPublicComponent";

import * as styles from "./LegalInformationWidget.module.scss";

interface IProps {
  companyData: TCompanyEtoData;
  etoData: TEtoSpecsData;
}

export const LegalInformationWidget: React.SFC<IProps> = ({ companyData, etoData }) => {
  return (
    <Panel className={styles.legalInformation}>
      <Row>
        <Col>
          <div className={styles.group}>
            {companyData.name && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.legal-company-name" />
                </span>
                <span className={styles.value}>{companyData.name}</span>
              </div>
            )}
            {companyData.name && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.legal-form" />
                </span>
                <span className={styles.value}>{companyData.legalForm}</span>
              </div>
            )}
            {companyData.foundingDate && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.incorporation-date" />
                </span>
                <span className={styles.value}>{companyData.foundingDate}</span>
              </div>
            )}
            {companyData.registrationNumber && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.registration-number" />
                </span>
                <span className={styles.value}>{companyData.registrationNumber}</span>
              </div>
            )}
            {companyData.numberOfFounders && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.number-of-founders" />
                </span>
                <span className={styles.value}>{companyData.numberOfFounders}</span>
              </div>
            )}
            {companyData.numberOfEmployees && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.number-of-employees" />
                </span>
                <span className={styles.value}>{companyData.numberOfEmployees}</span>
              </div>
            )}
            {companyData.lastFundingSizeEur && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.last-founding-amount" />
                </span>
                <span className={styles.value}>{`€ ${companyData.lastFundingSizeEur}`}</span>
              </div>
            )}
            {companyData.companyStage && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.last-founding-round" />
                </span>
                <span className={styles.value}>{FUNDING_ROUNDS[companyData.companyStage]}</span>
              </div>
            )}
            {etoData.preMoneyValuationEur && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.pre-money-valuation" />
                </span>
                <span className={styles.value}>{`€ ${etoData.preMoneyValuationEur}`}</span>
              </div>
            )}
            {etoData.existingCompanyShares && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.existing-shares" />
                </span>
                <span className={styles.value}>{etoData.existingCompanyShares}</span>
              </div>
            )}
            {etoData.minimumNewSharesToIssue && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.minimum-new-shares-to-issue" />
                </span>
                <span className={styles.value}>{etoData.minimumNewSharesToIssue}</span>
              </div>
            )}
            {etoData.shareNominalValueEur && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.share-nominal" />
                </span>
                <span className={styles.value}>{etoData.shareNominalValueEur}</span>
              </div>
            )}
          </div>
        </Col>

        <Col>
          {companyData.shareholders && (
            <ChartDoughnut
              className="mb-3"
              data={{
                datasets: [
                  {
                    data: companyData.shareholders.map(d => d && d.shares),
                    backgroundColor: companyData.shareholders.map(
                      (_, i: number) => CHART_COLORS[i],
                    ),
                  },
                ],
                labels: (companyData.shareholders || []).map(d => d && d.fullName),
              }}
            />
          )}
        </Col>
      </Row>
    </Panel>
  );
};
