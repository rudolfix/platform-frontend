import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { LayoutAuthorized } from "./layouts/LayoutAuthorized";
import { AssetPortfolio } from "./shared/AssetPortfolio";
import { Button } from "./shared/buttons";
import { Document } from "./shared/Document";
import { NewTable, NewTableRow } from "./shared/NewTable";
import { SectionHeader } from "./shared/SectionHeader";

import * as arrowIcon from "../assets/img/inline_icons/arrow_right.svg";
import * as neuIcon from "../assets/img/neu_icon.svg";
import * as styles from "./Portfolio.module.scss";

export const Portfolio: React.SFC = () => (
  <LayoutAuthorized>
    <SectionHeader layoutHasDecorator={false} className="mb-4">
      <FormattedMessage id="portfolio.section.asset-portfolio.title" />
    </SectionHeader>
    <Row>
      <Col className="mb-4">
        <AssetPortfolio
          icon={neuIcon}
          currency="neu"
          currencyTotal="eur"
          largeNumber="1000000000000"
          value="10000000000000"
          theme="light"
          size="large"
          moneyValue="100000000"
          moneyChange={-20}
          tokenValue="1000000"
          tokenChange={20}
        />
      </Col>
    </Row>

    <SectionHeader layoutHasDecorator={false} className="mb-4">
      <FormattedMessage id="portfolio.section.dividends-from-neu.title" />
      <img src={neuIcon} alt="neu token" className={cn("ml-2", styles.token)} />
    </SectionHeader>

    <Row>
      <Col className="mb-4">
        <NewTable
          titles={[
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.token" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.balance" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.value-eur" />,
            "",
            "",
          ]}
        >
          <NewTableRow>
            <img src={neuIcon} alt="neu token" className={cn("mr-2", styles.tokenSmall)} />
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.neu-reward" />
            <span>balance</span>
            <span>value</span>
            {""}
            {""}
            <Button layout="simple" svgIcon={arrowIcon} iconPosition="icon-after">
              <FormattedMessage id="portfolio.section.dividends-from-neu.table.claim" />
            </Button>
          </NewTableRow>
          <NewTableRow>
            <>
              <img src={neuIcon} alt="neu token" className={cn("mr-2", styles.tokenSmall)} />
              <FormattedMessage id="portfolio.section.reserved-assets.table.header.neu-reward" />
            </>
            <span>balance</span>
            <span>value</span>
            {""}
            {""}
            <Button layout="simple" svgIcon={arrowIcon} iconPosition="icon-after">
              <FormattedMessage id="portfolio.section.dividends-from-neu.table.claim" />
            </Button>
          </NewTableRow>
        </NewTable>
      </Col>
    </Row>

    <SectionHeader layoutHasDecorator={false} className="mb-4">
      <FormattedMessage id="portfolio.section.reserved-assets.title" />
    </SectionHeader>

    <Row>
      <Col className="mb-4">
        <NewTable
          keepRhythm={true}
          titles={[
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.token" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.balance" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.value-eur" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.price-eur" />,
            <>
              <img src={neuIcon} alt="neu token" className={cn("mr-2", styles.tokenSmall)} />
              <FormattedMessage id="portfolio.section.reserved-assets.table.header.neu-reward" />
            </>,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.eto-status" />,
          ]}
        >
          <NewTableRow>
            <>
              <img src={neuIcon} alt="neu token" className={cn("mr-2", styles.token)} />
              <span>token name</span>
            </>
            <span>balance</span>
            <span>value</span>
            <span>price</span>
            <span>neu reward</span>
            <span>eto status</span>
            <Button layout="simple" svgIcon={arrowIcon} iconPosition="icon-after">
              <FormattedMessage id="portfolio.section.reserved-assets.view-tx-hash-status" />
            </Button>
          </NewTableRow>
          <NewTableRow>
            <>
              <img src={neuIcon} alt="neu token" className={cn("mr-2", styles.token)} />
              <span>token name</span>
            </>
            <span>balance</span>
            <span>value</span>
            <span>price</span>
            <span>neu reward</span>
            <span>eto status</span>
            <Button layout="simple" svgIcon={arrowIcon} iconPosition="icon-after">
              <FormattedMessage id="portfolio.section.reserved-assets.claim-tokens" />
            </Button>
          </NewTableRow>
          <NewTableRow>
            <>
              <img src={neuIcon} alt="neu token" className={cn("mr-2", styles.token)} />
              <span>token name</span>
            </>
            <span>balance</span>
            <span>value</span>
            <span>price</span>
            <span>neu reward</span>
            <span>eto status</span>
            <Button layout="simple" svgIcon={arrowIcon} iconPosition="icon-after">
              <FormattedMessage id="portfolio.section.reserved-assets.refund" />
            </Button>
          </NewTableRow>
          <NewTableRow>
            <>
              <img src={neuIcon} alt="neu token" className={cn("mr-2", styles.token)} />
              <span>token name</span>
            </>
            <span>balance</span>
            <span>value</span>
            <span>price</span>
            <span>neu reward</span>
            <span>eto status</span>
            <Button layout="simple" disabled>
              <FormattedMessage id="portfolio.section.reserved-assets.wait-for-update" />
            </Button>
          </NewTableRow>
        </NewTable>
      </Col>
    </Row>

    <SectionHeader layoutHasDecorator={false} className="mb-4">
      <FormattedMessage id="portfolio.section.your-assets.title" />
    </SectionHeader>

    <Row>
      <Col className="mb-4">
        <NewTable
          keepRhythm={true}
          titles={[
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.token" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.balance" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.value-eur" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.price-eur" />,
            <>
              <img src={neuIcon} alt="neu token" className={cn("mr-2", styles.tokenSmall)} />
              <FormattedMessage id="portfolio.section.reserved-assets.table.header.neu-reward" />
            </>,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.documents" />,
          ]}
        >
          <NewTableRow>
            <>
              <img src={neuIcon} alt="neu token" className={cn("mr-2", styles.token)} />
              <span>token name</span>
            </>
            <span>balance</span>
            <span>value</span>
            <span>price</span>
            <span>neu reward</span>
            <>
              <span className={styles.documentLink}>
                <Document extension="pdf" />
                <a href="#0" download>
                  file name
                </a>
              </span>
              <span className={styles.documentLink}>
                <Document extension="pdf" />
                <a href="#0" download>
                  file name
                </a>
              </span>
              <span className={styles.documentLink}>
                <Document extension="pdf" />
                <a href="#0" download>
                  file name
                </a>
              </span>
              <span className={styles.documentLink}>
                <Document extension="pdf" />
                <a href="#0" download>
                  file name
                </a>
              </span>
            </>
          </NewTableRow>
          <NewTableRow>
            <>
              <img src={neuIcon} alt="neu token" className={cn("mr-2", styles.token)} />
              <span>token name</span>
            </>
            <span>balance</span>
            <span>value</span>
            <span>price</span>
            <span>neu reward</span>
            <>
              <span className={styles.documentLink}>
                <Document extension="pdf" />
                <a href="#0" download>
                  file name
                </a>
              </span>
              <span className={styles.documentLink}>
                <Document extension="pdf" />
                <a href="#0" download>
                  file name
                </a>
              </span>
              <span className={styles.documentLink}>
                <Document extension="pdf" />
                <a href="#0" download>
                  file name
                </a>
              </span>
              <span className={styles.documentLink}>
                <Document extension="pdf" />
                <a href="#0" download>
                  file name
                </a>
              </span>
            </>
          </NewTableRow>
        </NewTable>
      </Col>
    </Row>
  </LayoutAuthorized>
);
