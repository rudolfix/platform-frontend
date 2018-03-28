import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../shared/Buttons";
import { Money } from "../../shared/Money";
import { PercentageIndicatorBar } from "../../shared/PercentageIndicatorBar";
import { ITag, Tag } from "../../shared/Tag";
import * as styles from "./InvestmentPreview.module.scss";

interface IPreFoundingStatus {
  money: string;
  investorsNum: number;
  leadInvestors: string[];
}

interface IProps {
  neuInvestorsNum: number;
  company: string;
  endInDays: number;
  tags: ITag[];
  detailsLink: string;
  preFoundingStatus: IPreFoundingStatus;
  hasStarted: boolean;
  startingOn: string;
  moneyGoal: string;
  currentValuation: string;
  tokenPrice: string;
  linkToDetails: string;
  handleEmailSend: () => void;
}

export const InvestmentPreview: React.SFC<IProps> = ({
  company,
  tags,
  preFoundingStatus,
  hasStarted,
  handleEmailSend,
  endInDays,
  startingOn,
  neuInvestorsNum,
  moneyGoal,
  currentValuation,
  tokenPrice,
  linkToDetails,
}) => {
  return (
    <article className={`${styles.investmentPreview} ${hasStarted ? "has-started" : ""}`}>
      <div className={styles.logoWrapper}>
        <img src="" srcSet="" alt="" />
      </div>
      <div className={styles.companyDetails}>
        <h4 className={styles.companyName}>{company}</h4>
        <div>{tags.map((tag, i) => <Tag key={i} {...tag} />)}</div>
      </div>
      <div className={styles.preFundingStatus}>
        <h5 className={styles.label}>Pre funding status</h5>
        <div className={styles.preFundingWrapper}>
          <p>
            Pre money
            <strong className={styles.hilight}> {preFoundingStatus.money}</strong>
          </p>
          <p>
            Investors
            <strong className={styles.hilight}> {preFoundingStatus.investorsNum}</strong>
          </p>
          <p>Lead invsetors</p>
          {preFoundingStatus.leadInvestors.map((investor, i) => (
            <strong key={i} className={styles.lead}>
              {investor}
            </strong>
          ))}
        </div>
      </div>
      <div className={styles.termsAndEto}>
        <div className={styles.labels}>
          <h5 className={styles.label}>{hasStarted && "Neufund terms"}</h5>
          <h5 className={styles.label}>{hasStarted && "Eto status"}</h5>
        </div>
        <div className={styles.background}>
          {hasStarted ? (
            <>
              <div className={styles.terms}>
                <p>
                  Goal
                  <strong className={styles.hilight}> {moneyGoal}</strong>
                </p>
                <p>
                  Current Valuation
                  <strong className={styles.hilight}> {currentValuation}</strong>
                </p>
                <p>
                  Token price
                  <strong className={styles.hilight}> {tokenPrice}</strong>
                </p>
              </div>
              <div className={styles.eto}>
                <div>
                  <span>
                    NEU Investors <strong>{neuInvestorsNum}</strong>
                  </span>
                  <span>Ends in {endInDays} days</span>
                </div>
                <PercentageIndicatorBar percent={25} />
                <strong>
                  <Money currency="eur_token" value="123456000000000000000000" theme="t-green" />
                </strong>
              </div>
            </>
          ) : (
            <>
              <span>Starting on {startingOn}</span>
              <Button layout="secondary" onClick={() => handleEmailSend}>
                Get notification email
              </Button>
            </>
          )}
        </div>
      </div>
      <Link to={linkToDetails}>
        <Button layout="secondary">Details</Button>
      </Link>
    </article>
  );
};
