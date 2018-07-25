import { some } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";

import { FUNDING_ROUNDS } from "../registration/pages/LegalInformation";

import { TCompanyEtoData, TEtoSpecsData } from "../../../lib/api/EtoApi.interfaces";
import { Accordion, AccordionElement } from "../../shared/Accordion";
import { DocumentsWidget } from "../../shared/DocumentsWidget";
import { ILink, MediaLinksWidget } from "../../shared/MediaLinksWidget";
import { Panel } from "../../shared/Panel";
import { IPerson, PeopleSwiperWidget } from "../../shared/PeopleSwiperWidget";
import { SectionHeader } from "../../shared/SectionHeader";
import { SocialProfilesList } from "../../shared/SocialProfilesList";
import { TabContent, Tabs } from "../../shared/Tabs";
import { Video } from "../../shared/Video";
import { EtoOverviewStatus } from "../overview/EtoOverviewStatus";
import { EtoTimeline } from "../overview/EtoTimeline";
import { Cover } from "../publicView/Cover";

import { TwitterTimelineEmbed } from "../../shared/TwitterTimeline";
import * as styles from "./EtoPublicComponent.module.scss";

const DEFAULT_PLACEHOLDER = "N/A";

const swiperSingleRowSettings = {
  slidesPerView: 5,
  observer: true,
  spaceBetween: 100,
  breakpoints: {
    640: {
      slidesPerView: 1,
    },
    1200: {
      slidesPerView: 3,
      spaceBetween: 0,
    },
  },
};

const swiperMultiRowSettings = {
  slidesPerView: 5,
  observer: true,
  spaceBetween: 80,
  breakpoints: {
    640: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    1200: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
  },
};

const documentsData = [
  {
    name: "section name",
    documents: [
      {
        name: "test file",
        url: "test.doc",
      },
      {
        name: "test file",
        url: "test.pdf",
      },
      {
        name: "test file",
        url: "test.doc",
      },
      {
        name: "test file",
        url: "test.pdf",
      },
    ],
  },
  {
    name: "section name",
    documents: [
      {
        name: "test file",
        url: "test.pdf",
      },
      {
        name: "test file",
        url: "test.doc",
      },
      {
        name: "test file",
        url: "test.doc",
      },
      {
        name: "test file",
        url: "test.pdf",
      },
    ],
  },
];

const day = 86400000;
const etoStartDate = Date.now() - 20 * day;
const bookBuildingEndDate = etoStartDate + 16 * day;
const whitelistedEndDate = bookBuildingEndDate + 7 * day;
const publicEndDate = whitelistedEndDate + 7 * day;
const inSigningEndDate = publicEndDate + 14 * day;
const etoEndDate = inSigningEndDate + 7 * day;

interface IProps {
  companyData: TCompanyEtoData;
  etoData: TEtoSpecsData;
}

interface ICurrencies {
  [key: string]: string;
}

export const CURRENCIES: ICurrencies = {
  eth: "ETH",
  eur_t: "nEUR",
};

export const EtoPublicComponent: React.SFC<IProps> = ({ companyData, etoData }) => {
  const fullyDilutedPreMoneyValuationEur = etoData.fullyDilutedPreMoneyValuationEur || 1;
  const existingCompanyShares = etoData.existingCompanyShares || 1;
  const newSharesToIssue = etoData.newSharesToIssue || 1;
  const equityTokensPerShare = etoData.equityTokensPerShare || 1;
  const minimumNewSharesToIssue = etoData.minimumNewSharesToIssue || 1;

  const computedNewSharePrice = fullyDilutedPreMoneyValuationEur / existingCompanyShares;
  const computedMinNumberOfTokens = newSharesToIssue * equityTokensPerShare;
  const computedMaxNumberOfTokens = minimumNewSharesToIssue * equityTokensPerShare;
  const computedMinCapEur = computedNewSharePrice * newSharesToIssue;
  const computedMaxCapEur = computedNewSharePrice * minimumNewSharesToIssue;

  const { socialChannels, companyVideo, disableTwitterFeed } = companyData;

  const isTwitterFeedEnabled =
    some(socialChannels, (channel: any) => channel.type === "twitter" && channel.url.length) &&
    !disableTwitterFeed;
  const isYouTubeVideoAvailable = companyVideo && companyVideo.url && companyVideo.url.length
  const twitterUrl = isTwitterFeedEnabled && socialChannels ? (socialChannels.find(c => c.type === 'twitter') as any).url : ''

  return (
    <div>
      <Cover
        companyName={companyData.brandName}
        companyOneliner={companyData.companyOneliner}
        companyLogo={{
          alt: companyData.brandName,
          srcSet: {
            "1x": companyData.companyLogo as string,
          },
        }}
        companyBanner={{
          alt: companyData.brandName,
          srcSet: {
            "1x": companyData.companyBanner as string,
          },
        }}
        tags={companyData.categories}
      />

      <EtoOverviewStatus
        image={{
          srcSet: {
            "1x": etoData.equityTokenImage,
          },
          alt: `${etoData.equityTokenSymbol} - ${etoData.equityTokenName}`,
        }}
        className="mb-4"
        prospectusApproved={true}
        onchain={false}
        tokenPrice="10000"
        companyEquity=""
        companyValuation="10000000"
        declaredCap="100000"
        status="campaigning"
        tokenName={etoData.equityTokenName}
        tokenSymbol={etoData.equityTokenSymbol}
        campaigningWidget={{
          amountBacked: "20",
          investorsBacked: 2,
        }}
        publicWidget={{
          endInDays: 5,
          investorsBacked: 20,
          tokensGoal: 30,
          raisedTokens: 12,
        }}
      />

      <Row>
        <Col className="mb-4">
          <SectionHeader layoutHasDecorator={false} className="mb-4">
            <FormattedMessage id="eto.public-view.eto-timeline" />
          </SectionHeader>
          <Panel>
            <EtoTimeline
              bookBuildingEndDate={bookBuildingEndDate}
              whitelistedEndDate={whitelistedEndDate}
              publicEndDate={publicEndDate}
              inSigningEndDate={inSigningEndDate}
              etoStartDate={etoStartDate}
              etoEndDate={etoEndDate}
              status="campaigning"
            />
          </Panel>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={isTwitterFeedEnabled || isYouTubeVideoAvailable ? 8 : 12} className="mb-4">
          <SectionHeader layoutHasDecorator={false} className="mb-4">
            <FormattedMessage id="eto.public-view.about" />
          </SectionHeader>
          <Panel className="mb-4">
            <p className="mb-4">{companyData.companyDescription || DEFAULT_PLACEHOLDER}</p>
            <div className="d-flex justify-content-between">
              <Link to={companyData.companyWebsite || ""} target="_blank">
                {companyData.companyWebsite || DEFAULT_PLACEHOLDER}
              </Link>
              <SocialProfilesList profiles={companyData.socialChannels || []} />
            </div>
          </Panel>

          <SectionHeader layoutHasDecorator={false} className="mb-4">
            <FormattedMessage id="eto.public-view.legal-information.title" />
          </SectionHeader>

          <Panel className={styles.legalInformation}>
            <Row>
              <Col>
                <div className={styles.group}>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.legal-company-name" />
                    </span>
                    <span className={styles.value}>{companyData.name || DEFAULT_PLACEHOLDER}</span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.incorporation-date" />
                    </span>
                    <span className={styles.value}>
                      {companyData.foundingDate || DEFAULT_PLACEHOLDER}
                    </span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.registration-number" />
                    </span>
                    <span className={styles.value}>
                      {companyData.registrationNumber || DEFAULT_PLACEHOLDER}
                    </span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.number-of-founders" />
                    </span>
                    <span className={styles.value}>
                      {companyData.numberOfFounders || DEFAULT_PLACEHOLDER}
                    </span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.number-of-employees" />
                    </span>
                    <span className={styles.value}>
                      {companyData.numberOfEmployees || DEFAULT_PLACEHOLDER}
                    </span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.last-founding-amount" />
                    </span>
                    <span className={styles.value}>
                      {companyData.lastFundingSizeEur
                        ? `€ ${companyData.lastFundingSizeEur}`
                        : DEFAULT_PLACEHOLDER}
                    </span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.last-founding-round" />
                    </span>
                    <span className={styles.value}>
                      {companyData.companyStage
                        ? FUNDING_ROUNDS[companyData.companyStage]
                        : DEFAULT_PLACEHOLDER}
                    </span>
                  </div>
                </div>
              </Col>
              <Col>
                {/* TODO: Add chart */}
                <div className={styles.group}>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.pre-money-valuation" />
                    </span>
                    <span className={styles.value}>
                      {etoData.fullyDilutedPreMoneyValuationEur
                        ? `€ ${etoData.fullyDilutedPreMoneyValuationEur}`
                        : DEFAULT_PLACEHOLDER}
                    </span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.existing-shares" />
                    </span>
                    <span className={styles.value}>
                      {etoData.existingCompanyShares || DEFAULT_PLACEHOLDER}
                    </span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.minimum-new-shares-to-issue" />
                    </span>
                    <span className={styles.value}>
                      {etoData.minimumNewSharesToIssue || DEFAULT_PLACEHOLDER}
                    </span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.share-nominal" />
                    </span>
                    <span className={styles.value}>
                      {etoData.shareNominalValueEur || DEFAULT_PLACEHOLDER}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </Panel>
        </Col>
        {(isTwitterFeedEnabled || isYouTubeVideoAvailable) && (
          <Col xs={12} md={4} className="mb-4">
            <Video
              youTubeUrl={companyData.companyVideo && companyData.companyVideo.url as string}
              className="mb-4 mt-5"
            />
            {isTwitterFeedEnabled && (
              <>
                <SectionHeader layoutHasDecorator={false} className="mb-4">
                  Twitter
                </SectionHeader>
                <Panel>
                  <TwitterTimelineEmbed url={twitterUrl} userName={companyData.brandName}/>
                </Panel>
              </>
            )}
          </Col>
        )}
      </Row>

      <Row>
        <Col className="mb-4">
          <SectionHeader layoutHasDecorator={false} className="mb-4">
            <FormattedMessage id="eto.public-view.token-terms.title" />
          </SectionHeader>
          <Panel className={styles.tokenTerms}>
            <div className={styles.group}>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.soft-cap" />
                </span>
                <span className={styles.value}>{computedMinCapEur || DEFAULT_PLACEHOLDER}</span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.hard-cap" />
                </span>
                <span className={styles.value}>{computedMaxCapEur || DEFAULT_PLACEHOLDER}</span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.minimum-token-cap" />
                </span>
                <span className={styles.value}>
                  {computedMinNumberOfTokens || DEFAULT_PLACEHOLDER}
                </span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.maximum-token-cap" />
                </span>
                <span className={styles.value}>
                  {computedMaxNumberOfTokens || DEFAULT_PLACEHOLDER}
                </span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.token-discount" />
                </span>
                <span className={styles.value}>
                  {etoData.discountScheme || DEFAULT_PLACEHOLDER}
                </span>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.group}>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.tokens-per-share" />
                </span>
                <span className={styles.value}>
                  {etoData.equityTokensPerShare || DEFAULT_PLACEHOLDER}
                </span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.new-share-price" />
                </span>
                <span className={styles.value}>
                  €{" "}
                  {etoData.fullyDilutedPreMoneyValuationEur && etoData.existingCompanyShares
                    ? (
                        etoData.fullyDilutedPreMoneyValuationEur / etoData.existingCompanyShares
                      ).toPrecision(4)
                    : DEFAULT_PLACEHOLDER}
                </span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.fundraising-currency" />
                </span>
                <span className={styles.value}>
                  {etoData.currencies
                    ? etoData.currencies.map((currency: string) => CURRENCIES[currency]).join(" / ")
                    : DEFAULT_PLACEHOLDER}
                </span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.minimum-ticket-size" />
                </span>
                <span className={styles.value}>
                  € {etoData.minTicketEur || DEFAULT_PLACEHOLDER}
                </span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.maximum-ticket-size" />
                </span>
                <span className={styles.value}>
                  € {etoData.maxTicketEur || DEFAULT_PLACEHOLDER}
                </span>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.group}>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.pre-sale-duration" />
                </span>
                <span className={styles.value}>
                  {etoData.whitelistDurationDays || DEFAULT_PLACEHOLDER}{" "}
                  <FormattedMessage id="eto.public-view.token-terms.days" />
                </span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.public-offer-duration" />
                </span>
                <span className={styles.value}>
                  <FormattedMessage id="eto.public-view.token-terms.weeks" />
                </span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.token-transfers" />
                </span>
                <span className={styles.value}>
                  {etoData.enableTransferOnSuccess ? (
                    <FormattedMessage id="eto.public-view.token-terms.enabled" />
                  ) : (
                    <FormattedMessage id="eto.public-view.token-terms.disabled" />
                  )}
                </span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>Voting rights</span>
                <span className={styles.value}>
                  {etoData.generalVotingRule === "no_voting_rights" || "negative" ? (
                    <FormattedMessage id="eto.public-view.token-terms.disabled" />
                  ) : (
                    <FormattedMessage id="eto.public-view.token-terms.enabled" />
                  )}
                </span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.liquidation-preferences" />
                </span>
                <span className={styles.value}>
                  {etoData.liquidationPreferenceMultiplier !== 0 ? (
                    <FormattedMessage id="eto.public-view.token-terms.enabled" />
                  ) : (
                    <FormattedMessage id="eto.public-view.token-terms.disabled" />
                  )}
                </span>
              </div>
            </div>
          </Panel>
        </Col>
      </Row>

      {((companyData.founders && companyData.founders.members.length) ||
        (companyData.team && companyData.team.members.length)) && (
        <Row>
          <Col className="mb-4">
            <Tabs className="mb-4" layoutSize="large" layoutOrnament={false}>
              {companyData.founders &&
                companyData.founders.members.length > 0 && (
                  <TabContent tab={<FormattedMessage id="eto.public-view.carousel.tab.founders" />}>
                    <Panel>
                      <PeopleSwiperWidget
                        {...swiperMultiRowSettings}
                        people={companyData.founders.members as IPerson[]}
                        navigation={{
                          nextEl: "people-swiper-founders-next",
                          prevEl: "people-swiper-founders-prev",
                        }}
                        layout="vertical"
                      />
                    </Panel>
                  </TabContent>
                )}
              {companyData.team &&
                companyData.team.members.length > 0 && (
                  <TabContent tab={<FormattedMessage id="eto.public-view.carousel.tab.team" />}>
                    <Panel>
                      <PeopleSwiperWidget
                        {...swiperMultiRowSettings}
                        people={companyData.team.members as IPerson[]}
                        navigation={{
                          nextEl: "people-swiper-team-next",
                          prevEl: "people-swiper-team-prev",
                        }}
                        layout="vertical"
                      />
                    </Panel>
                  </TabContent>
                )}
            </Tabs>
          </Col>
        </Row>
      )}

      {((companyData.notableInvestors && companyData.notableInvestors.members.length) ||
        (companyData.partners && companyData.partners.members.length) ||
        (companyData.keyCustomers && companyData.keyCustomers.members.length) ||
        (companyData.boardMembers && companyData.boardMembers.members.length)) && (
        <Row>
          <Col className="mb-4">
            <Tabs className="mb-4" layoutSize="large" layoutOrnament={false}>
              {companyData.notableInvestors &&
                companyData.notableInvestors.members.length > 0 && (
                  <TabContent
                    tab={<FormattedMessage id="eto.public-view.carousel.tab.investors" />}
                  >
                    <Panel>
                      <PeopleSwiperWidget
                        {...swiperSingleRowSettings}
                        people={
                          companyData.notableInvestors.members as IPerson[]
                        }
                        navigation={{
                          nextEl: "people-swiper-investors-next",
                          prevEl: "people-swiper-investors-prev",
                        }}
                        layout="vertical"
                      />
                    </Panel>
                  </TabContent>
                )}
              {companyData.partners &&
                companyData.partners.members.length > 0 && (
                  <TabContent tab={<FormattedMessage id="eto.public-view.carousel.tab.partners" />}>
                    <Panel>
                      <PeopleSwiperWidget
                        {...swiperSingleRowSettings}
                        navigation={{
                          nextEl: "people-swiper-partners-next",
                          prevEl: "people-swiper-partners-prev",
                        }}
                        people={companyData.partners.members as IPerson[]}
                        layout="vertical"
                      />
                    </Panel>
                  </TabContent>
                )}
              {companyData.keyCustomers &&
                companyData.keyCustomers.members.length > 0 && (
                  <TabContent
                    tab={<FormattedMessage id="eto.public-view.carousel.tab.key-customers" />}
                  >
                    <Panel>
                      <PeopleSwiperWidget
                        {...swiperSingleRowSettings}
                        navigation={{
                          nextEl: "people-swiper-partners-next",
                          prevEl: "people-swiper-partners-prev",
                        }}
                        people={
                          companyData.keyCustomers.members as IPerson[]
                        }
                        layout="vertical"
                      />
                    </Panel>
                  </TabContent>
                )}
              {companyData.boardMembers &&
                companyData.boardMembers.members.length > 0 && (
                  <TabContent tab={<FormattedMessage id="eto.public-view.carousel.tab.advisors" />}>
                    <Panel>
                      <PeopleSwiperWidget
                        navigation={{
                          nextEl: "people-swiper-board-members-next",
                          prevEl: "people-swiper-board-members-prev",
                        }}
                        {...swiperSingleRowSettings}
                        people={
                          companyData.boardMembers.members as IPerson[]
                        }
                        layout="vertical"
                      />
                    </Panel>
                  </TabContent>
                )}
            </Tabs>
          </Col>
        </Row>
      )}

      <Row>
        <Col sm={12} md={8} className="mb-4">
          <SectionHeader layoutHasDecorator={false} className="mb-4">
            <FormattedMessage id="eto.public-view.product-vision.title" />
          </SectionHeader>
          <Panel>
            <Accordion>
              <AccordionElement
                title={<FormattedMessage id="eto.form.product-vision.problem-solved" />}
              >
                <p>{companyData.problemSolved || DEFAULT_PLACEHOLDER}</p>
              </AccordionElement>
              <AccordionElement
                title={<FormattedMessage id="eto.form.product-vision.customer-group" />}
              >
                <p>{companyData.customerGroup || DEFAULT_PLACEHOLDER}</p>
              </AccordionElement>
              <AccordionElement
                title={<FormattedMessage id="eto.form.product-vision.product-vision" />}
              >
                <p>{companyData.productVision || DEFAULT_PLACEHOLDER}</p>
              </AccordionElement>
              <AccordionElement
                title={<FormattedMessage id="eto.form.product-vision.inspiration" />}
              >
                <p>{companyData.inspiration || DEFAULT_PLACEHOLDER}</p>
              </AccordionElement>
              <AccordionElement
                title={<FormattedMessage id="eto.form.product-vision.key-product-priorities" />}
              >
                <p>{companyData.keyProductPriorities || DEFAULT_PLACEHOLDER}</p>
              </AccordionElement>
              <AccordionElement
                title={<FormattedMessage id="eto.form.product-vision.use-of-capital" />}
              >
                <p>{companyData.useOfCapital || DEFAULT_PLACEHOLDER}</p>
                {/* TODO: Add chart */}
              </AccordionElement>
              <AccordionElement
                title={<FormattedMessage id="eto.form.product-vision.sales-model" />}
              >
                <p>{companyData.salesModel || DEFAULT_PLACEHOLDER}</p>
              </AccordionElement>
              <AccordionElement
                title={
                  <FormattedMessage id="eto.form.product-vision.marketing-approach" /> ||
                  DEFAULT_PLACEHOLDER
                }
              >
                <p>{companyData.marketingApproach}</p>
              </AccordionElement>
              <AccordionElement
                title={<FormattedMessage id="eto.form.product-vision.selling-proposition" />}
              >
                <p>{companyData.sellingProposition || DEFAULT_PLACEHOLDER}</p>
              </AccordionElement>
            </Accordion>
          </Panel>
        </Col>
        <Col sm={12} md={4}>
          <SectionHeader layoutHasDecorator={false} className="mb-4">
            <FormattedMessage id="eto.form.documents.title" />
          </SectionHeader>
          <DocumentsWidget className="mb-4" groups={documentsData} />

          {companyData.companyNews &&
            companyData.companyNews.length > 0 && (
              <>
                <SectionHeader layoutHasDecorator={false} className="mb-4">
                  <FormattedMessage id="eto.form.media-links.title" />
                </SectionHeader>

                <MediaLinksWidget links={companyData.companyNews as ILink[]} />
              </>
            )}
        </Col>
      </Row>
    </div>
  );
};
