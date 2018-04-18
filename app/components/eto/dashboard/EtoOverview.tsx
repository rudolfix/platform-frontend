import * as cn from "classnames";
import * as React from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import { Money, TCurrency } from "../../shared/Money";
import { PanelWhite } from "../../shared/PanelWhite";
import { ITag, Tag } from "../../shared/Tag";

import * as styles from "./EtoOverview.module.scss";

interface IProps {
  companyName: string;
  logoImageSrc: string;
  description: string;
  tags: ITag[];
  startDate: string;
  endDate: string;
  tokenImageSrc: string;
  goalValue: string;
  goalSymbol: TCurrency;
  currentValuationValue: string;
  currentValuationSymbol: TCurrency;
  tokenPriceNeu: string;
  tokenPriceEth: string;
  tokenSymbol: string;
  linkToDetailedTokenInfo: string;
}

export const EtoOverview: React.SFC<IProps> = props => {
  return (
    <PanelWhite>
      <Container>
        <Row>
          <Col>
            <div className={styles.etoOverview}>
              <div className={styles.aboutWrapper}>
                <img
                  className={styles.logoImage}
                  src={props.logoImageSrc}
                  alt={`${props.companyName} logo`}
                />
                <div>
                  <h4>{props.companyName}</h4>
                  <p>{props.description}</p>
                  <div>{props.tags.map(({ text }) => <Tag text={text} key={text} />)}</div>
                </div>
              </div>
              <div className={styles.detailsWrapper}>
                <div className={styles.detailBox}>
                  <div>
                    <div className={styles.label}>Start</div>
                    <div className={styles.value}>{props.startDate}</div>
                  </div>
                  <div>
                    <div className={styles.label}>End</div>
                    <div className={styles.value}>{props.endDate}</div>
                  </div>
                </div>
                <div className={styles.detailBox}>
                  <div>
                    <div className={styles.label}>Goal</div>
                    <div className={styles.value}>
                      <Money currency="neu" value={props.goalValue} />
                    </div>
                  </div>
                  <div>
                    <div className={styles.label}>Current valuation</div>
                    <div className={styles.value}>
                      <Money currency="neu" value={props.goalValue} />
                    </div>
                  </div>
                </div>
                <div className={styles.detailBox}>
                  <div className={styles.label}>Token price</div>
                  <div className={cn(styles.value, styles.tokenPrice)}>
                    <Money value={props.tokenPriceNeu} currency="neu" />
                  </div>
                  <div className={styles.label}>
                    <Money value={props.tokenPriceEth} currency="eth" />
                  </div>
                </div>
                <div className={styles.detailBox}>
                  <div className={styles.label}>Company token</div>
                  <div className={styles.token}>
                    <img className={styles.tokenLogo} src={props.tokenImageSrc} />
                    <div className={styles.tokenSymbol}>{props.tokenSymbol}</div>
                  </div>
                  <Link to={props.linkToDetailedTokenInfo}>Detailed token info ></Link>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </PanelWhite>
  );
};
