import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { TCompanyEtoData } from "../../../lib/api/eto/EtoApi.interfaces";
import { ChartDoughnut } from "../../shared/charts/ChartDoughnut";
import { Panel } from "../../shared/Panel";
import { FUNDING_ROUNDS } from "../registration/pages/LegalInformation";
import { CHART_COLORS } from "../shared/EtoPublicComponent";

import * as styles from "./LegalInformationWidget.module.scss";

interface IProps {
  companyData: TCompanyEtoData;
}

export const LegalInformationWidget: React.SFC<IProps> = ({ companyData }) => {
  let shareholdersCopy = companyData.shareholders;
  if (companyData.shareholders && companyData.companyShares) {
    const assignedShares = companyData.shareholders.reduce((s, v) => s + v.shares, 0);
    if (assignedShares < companyData.companyShares) {
      shareholdersCopy = companyData.shareholders.slice();
      shareholdersCopy.push({
        fullName: "Others",
        shares: companyData.companyShares - assignedShares,
      });
    }
  }
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
            {companyData.companyStage && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.last-founding-round" />
                </span>
                <span className={styles.value}>{FUNDING_ROUNDS[companyData.companyStage]}</span>
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
            {companyData.companyShares && (
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.legal-information.existing-shares" />
                </span>
                <span className={styles.value}>{companyData.companyShares}</span>
              </div>
            )}
          </div>
        </Col>

        <Col>
          {companyData.companyShares &&
            shareholdersCopy && (
              <ChartDoughnut
                className="mb-3"
                data={{
                  datasets: [
                    {
                      data: shareholdersCopy.map(d => d && d.shares),
                      backgroundColor: shareholdersCopy.map((_, i: number) => CHART_COLORS[i]),
                    },
                  ],
                  labels: shareholdersCopy.map(d => d && d.fullName),
                }}
              />
            )}
        </Col>
      </Row>
    </Panel>
  );
};
