import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { FUNDING_ROUNDS } from "./registration/pages/LegalInformation";

import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { Accordion, AccordionElement } from "../shared/Accordion";
import { DocumentsWidget } from "../shared/DocumentsWidget";
import { MediaLinksWidget } from "../shared/MediaLinksWidget";
import { NewsWidget } from "../shared/NewsWidget";
import { Panel } from "../shared/Panel";
import { SectionHeader } from "../shared/SectionHeader";
import { SlidePerson } from "../shared/SlidePerson";
import { SocialProfilesList } from "../shared/SocialProfilesList";
import { SwiperWidget } from "../shared/SwiperWidget";
import { Tabs } from "../shared/Tabs";
import { Video } from "../shared/Video";
import { EtoTimeline } from "./overview/EtoTimeline";
import { Cover } from "./publicView/Cover";

import * as facebookIcon from "../../assets/img/inline_icons/social_facebook.svg";
import * as linkedinIcon from "../../assets/img/inline_icons/social_linkedin.svg";
import * as mediumIcon from "../../assets/img/inline_icons/social_medium.svg";
import * as redditIcon from "../../assets/img/inline_icons/social_reddit.svg";
import * as telegramIcon from "../../assets/img/inline_icons/social_telegram.svg";
import * as styles from "./EtoPublicView.module.scss";

const profilesData = [
  {
    name: "LinkedIn",
    url: "linkedin.com",
    svgIcon: linkedinIcon,
  },
  {
    name: "Facebook",
    url: "facebook.com",
    svgIcon: facebookIcon,
  },
  {
    name: "Medium",
    svgIcon: mediumIcon,
  },
  {
    name: "Reddit",
    url: "reddit.com",
    svgIcon: redditIcon,
  },
  {
    name: "Telegram",
    svgIcon: telegramIcon,
  },
];

const documentsData = [
  {
    name: "section name",
    documents: [
      {
        name: "test file",
        url: "test.doc"
      },
      {
        name: "test file",
        url: "test.pdf"
      },
      {
        name: "test file",
        url: "test.doc"
      },
      {
        name: "test file",
        url: "test.pdf"
      },
    ],
  },
  {
    name: "section name",
    documents: [
      {
        name: "test file",
        url: "test.pdf"
      },
      {
        name: "test file",
        url: "test.doc"
      },
      {
        name: "test file",
        url: "test.doc"
      },
      {
        name: "test file",
        url: "test.pdf"
      },
    ],
  },
];

const mediaLinksData = [
  {
    title: "sample link",
    url: "url"
  },
  {
    title: "sample link",
    url: "url"
  },
  {
    title: "sample link",
    url: "url"
  },
]

const swiperSingleRowSettings = {
  slidesPerView: 5,
  loop: true,
  spaceBetween: 50,
  navigation: {
    nextEl: 'swiper-single-row-button-next',
    prevEl: 'swiper-single-row-button-prev'
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    480: {
      slidesPerView: 2,
    },
    640: {
      slidesPerView: 3,
      spaceBetween: 10
    }
  }
};

const swiperMultiRowSettings = {
  slidesPerView: 3,
  slidesPerColumn: 2,
  spaceBetween: 30,
  loop: true,
  navigation: {
    nextEl: 'swiper-multi-row-button-next',
    prevEl: 'swiper-multi-row-button-prev'
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    480: {
      slidesPerView: 2,
    },
    640: {
      slidesPerView: 3,
      spaceBetween: 10
    }
  }
};

const tabsData = [
  { text: "tab 1", path: "/" },
  { text: "tab 2", path: "" },
  { text: "tab 3", path: "" },
]

const peopleCarouselData = [
  {
    image: {
      "1x": "",
      "2x": "",
      "3x": "",
    },
    name: "person name",
    title: "person title",
    bio:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non tenetur, impedit labore vero eum omnis iusto quaerat ea, facere perferendis quae!",
  },
  {
    image: {
      "1x": "",
      "2x": "",
      "3x": "",
    },
    name: "person name",
    title: "person title",
    bio:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non tenetur, impedit labore vero eum omnis iusto quaerat ea, facere perferendis quae!",
  },
  {
    image: {
      "1x": "",
      "2x": "",
      "3x": "",
    },
    name: "person name",
    title: "person title",
    bio:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non tenetur, impedit labore vero eum omnis iusto quaerat ea, facere perferendis quae!",
  },
  {
    image: {
      "1x": "",
      "2x": "",
      "3x": "",
    },
    name: "person name",
    title: "person title",
    bio:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non tenetur, impedit labore vero eum omnis iusto quaerat ea, facere perferendis quae!",
  },
  {
    image: {
      "1x": "",
      "2x": "",
      "3x": "",
    },
    name: "person name",
    title: "person title",
    bio:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non tenetur, impedit labore vero eum omnis iusto quaerat ea, facere perferendis quae!",
  },
  {
    image: {
      "1x": "",
      "2x": "",
      "3x": "",
    },
    name: "person name",
    title: "person title",
    bio:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non tenetur, impedit labore vero eum omnis iusto quaerat ea, facere perferendis quae!",
  },
  {
    image: {
      "1x": "",
      "2x": "",
      "3x": "",
    },
    name: "person name",
    title: "person title",
    bio:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non tenetur, impedit labore vero eum omnis iusto quaerat ea, facere perferendis quae!",
  },
  {
    image: {
      "1x": "",
      "2x": "",
      "3x": "",
    },
    name: "person name",
    title: "person title",
    bio:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non tenetur, impedit labore vero eum omnis iusto quaerat ea, facere perferendis quae!",
  },
]

const day = 86400000;
const etoStartDate = Date.now() - 20 * day;
const bookBuildingEndDate = etoStartDate + 16 * day;
const whitelistedEndDate = bookBuildingEndDate + 7 * day;
const publicEndDate = whitelistedEndDate + 7 * day;
const inSigningEndDate = publicEndDate + 14 * day;
const etoEndDate = inSigningEndDate + 7 * day;

const peopleNodes = peopleCarouselData.map(person => {
  return (
    <SlidePerson
      key={person.name}
      name={person.name}
      title={person.title}
      bio={person.bio}
      srcSet={person.image}
      layout="vertical" />
  )
})

const peopleNodesMultiRow = peopleCarouselData.map(person => {
  return (
    <SlidePerson
      key={person.name}
      name={person.name}
      title={person.title}
      bio={person.bio}
      srcSet={person.image}
      layout="horizontal" />
  )
})
interface IProps {
  companyData: any;
  etoData: any;
}

interface ICurrencies {
  [key: string]: string;
}

export const CURRENCIES: ICurrencies = {
  eth: "ETH",
  eur_t: "nEUR"
}

const Page: React.SFC<IProps> = ({companyData, etoData}) => {
  return (
    <LayoutAuthorized>
      <Cover
        companyName={companyData.brandName}
        companyOneliner={companyData.companyOneliner}
        companyLogo={{
          alt: companyData.brandName,
          srcSet: {
            "1x": companyData.companyLogo
          }
        }}
        companyBanner={{
          alt: companyData.brandName,
          srcSet: {
            "1x": companyData.companyBanner
          }
        }}
        tags={companyData.categories} />

      <Row>
        <Col className="mb-4">
          <SectionHeader className="mb-4"><FormattedMessage id="eto.public-view.eto-timeline" /></SectionHeader>
          <Panel>
            <EtoTimeline
              bookBuildingEndDate={bookBuildingEndDate}
              whitelistedEndDate={whitelistedEndDate}
              publicEndDate={publicEndDate}
              inSigningEndDate={inSigningEndDate}
              etoStartDate={etoStartDate}
              etoEndDate={etoEndDate}
              status="book-building"
            />
          </Panel>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={8} className="mb-4">
          <SectionHeader className="mb-4"><FormattedMessage id="eto.public-view.about" /></SectionHeader>
          <Panel className="mb-4">
            <p className="mb-4">{companyData.companyDescription}</p>
            <div className="d-flex justify-content-between">
              <Link to={companyData.companyWebsite || ""} target="_blank">
                {companyData.companyWebsite}
              </Link>
              <SocialProfilesList profiles={profilesData} />
            </div>
          </Panel>
          <SectionHeader className="mb-4">
            <FormattedMessage id="eto.public-view.legal-information.title"/>
          </SectionHeader>
          <Panel className={styles.legalInformation}>
            <Row>
              <Col>
                <div className={styles.group}>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.legal-company-name"/>
                    </span>
                    <span className={styles.value}>{companyData.name}</span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.incorporation-date"/>
                    </span>
                    <span className={styles.value}>{companyData.foundingDate}</span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.registration-number"/>
                    </span>
                    <span className={styles.value}>{companyData.registrationNumber}</span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.number-of-founders"/>
                    </span>
                    <span className={styles.value}>{companyData.numberOfFounders}</span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.number-of-employees"/>
                    </span>
                    <span className={styles.value}>{companyData.numberOfEmployees}</span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.last-founding-amount"/>
                    </span>
                    <span className={styles.value}>{`€ ${companyData.lastFundingSizeEur}`}</span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.last-founding-round"/>
                    </span>
                    <span className={styles.value}>{FUNDING_ROUNDS[companyData.companyStage]}</span>
                  </div>
                </div>
              </Col>
              <Col>
                {/* TODO: Add chart */}
                <div className={styles.group}>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.pre-money-valuation"/>
                    </span>
                    <span className={styles.value}>{`€ ${etoData.fullyDilutedPreMoneyValuationEur}`}</span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.existing-shares"/>
                    </span>
                    <span className={styles.value}>{etoData.existingCompanyShares}</span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.minimum-new-shares-to-issue"/>
                    </span>
                    <span className={styles.value}>{etoData.minimumNewSharesToIssue}</span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.share-nominal"/>
                    </span>
                    <span className={styles.value}>{etoData.shareNominalValueEur}</span>
                  </div>
                </div>
              </Col>
            </Row>
          </Panel>
        </Col>
        <Col xs={12} md={4} className="mb-4">
          <Video youTubeId="aqz-KE-bpKQ" className="mb-4" />
          <NewsWidget
            isEditable={false}
            activeTab="news"
            news={[]}
          />
          {/* TODO: Add news */}
        </Col>
      </Row>

      <Row>
        <Col className="mb-4">
          <SectionHeader className="mb-4">
            <FormattedMessage id="eto.public-view.token-terms.title"/>
          </SectionHeader>
          <Panel className={styles.tokenTerms}>
              <div className={styles.group}>
                <div className={styles.entry}>
                  <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.soft-cap"/>
                  </span>
                  <span className={styles.value}></span>
                </div>
                <div className={styles.entry}>
                  <span className={styles.label}>
                    <FormattedMessage id="eto.public-view.token-terms.hard-cap"/>
                  </span>
                  <span className={styles.value}></span>
                </div>
                <div className={styles.entry}>
                  <span className={styles.label}>
                    <FormattedMessage id="eto.public-view.token-terms.minimum-token-cap"/>
                  </span>
                  <span className={styles.value}>{etoData.minimumNewSharesToIssue}</span>
                </div>
                <div className={styles.entry}>
                  <span className={styles.label}>
                    <FormattedMessage id="eto.public-view.token-terms.maximum-token-cap"/>
                  </span>
                  <span className={styles.value}>{}</span>
                </div>
                <div className={styles.entry}>
                  <span className={styles.label}>
                    <FormattedMessage id="eto.public-view.token-terms.token-discount"/>
                  </span>
                  <span className={styles.value}>{etoData.discountScheme}</span>
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.group}>
                <div className={styles.entry}>
                  <span className={styles.label}>
                    <FormattedMessage id="eto.public-view.token-terms.tokens-per-share"/>
                  </span>
                  <span className={styles.value}>{etoData.equityTokensPerShare}</span>
                </div>
                <div className={styles.entry}>
                  <span className={styles.label}>
                    <FormattedMessage id="eto.public-view.token-terms.new-share-price"/>
                  </span>
                  <span className={styles.value}>€ {etoData.fullyDilutedPreMoneyValuationEur / etoData.existingCompanyShares}</span>
                </div>
                <div className={styles.entry}>
                  <span className={styles.label}>
                    <FormattedMessage id="eto.public-view.token-terms.fundraising-currency"/>
                  </span>
                  <span className={styles.value}>{etoData.currencies && etoData.currencies.map((currency: string) => CURRENCIES[currency]).join(" / ")}</span>
                </div>
                <div className={styles.entry}>
                  <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.minimum-ticket-size"/>
                  </span>
                  <span className={styles.value}>{etoData.minTicketEu}</span>
                </div>
                <div className={styles.entry}>
                  <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.maximum-ticket-size"/>
                  </span>
                  <span className={styles.value}><FormattedMessage id="eto.public-view.token-terms.unlimited"/></span>
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.group}>
                <div className={styles.entry}>
                  <span className={styles.label}>
                    <FormattedMessage id="eto.public-view.token-terms.pre-sale-duration"/>
                  </span>
                  <span className={styles.value}>{etoData.whitelistDurationDays} <FormattedMessage id="eto.public-view.token-terms.days"/></span>
                </div>
                <div className={styles.entry}>
                  <span className={styles.label}><FormattedMessage id="eto.public-view.token-terms.public-offer-duration"/></span>
                  <span className={styles.value}>
                    <FormattedMessage id="eto.public-view.token-terms.weeks"/>
                  </span>
                </div>
                <div className={styles.entry}>
                  <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.token-transfers"/>
                    Token Transfers after ETO</span>
                  <span className={styles.value}>{etoData.enableTransferOnSuccess ? <FormattedMessage id="eto.public-view.token-terms.enabled"/> : <FormattedMessage id="eto.public-view.token-terms.disabled"/>}</span>
                </div>
                <div className={styles.entry}>
                  <span className={styles.label}>Voting rights</span>
                  <span className={styles.value}>{etoData.generalVotingRule === "no_voting_rights" || "negative" ? <FormattedMessage id="eto.public-view.token-terms.disabled"/> : <FormattedMessage id="eto.public-view.token-terms.enabled"/>}</span>
                </div>
                <div className={styles.entry}>
                  <span className={styles.label}><FormattedMessage id="eto.public-view.token-terms.liquidation-preferences"/></span>
                  <span className={styles.value}>{etoData.liquidationPreferenceMultiplier !== 0 ? <FormattedMessage id="eto.public-view.token-terms.enabled"/> : <FormattedMessage id="eto.public-view.token-terms.disabled"/>}</span>
                </div>
              </div>
          </Panel>
        </Col>
      </Row>

      <Row>
        <Col className="mb-4">
          <Tabs
            tabs={tabsData}
            hasDivider={false}
            size="large"
            className="mb-4" />
          <Panel>
            <SwiperWidget {...swiperMultiRowSettings} slides={peopleNodesMultiRow}/>
          </Panel>
        </Col>
      </Row>

      <Row>
        <Col className="mb-4">
          <Tabs
            tabs={tabsData}
            hasDivider={false}
            size="large"
            className="mb-4" />
          <Panel>
            <SwiperWidget {...swiperSingleRowSettings} slides={peopleNodes}/>
          </Panel>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={8} className="mb-4">
          <SectionHeader className="mb-4"><FormattedMessage id="eto.public-view.product-vision.title"/></SectionHeader>
          <Panel>
            <Accordion>
              <AccordionElement title={<FormattedMessage id="eto.form.product-vision.problem-solved" />}>
                <p>{companyData.problemSolved}</p>
              </AccordionElement>
              <AccordionElement title={<FormattedMessage id="eto.form.product-vision.customer-group" />}>
                <p>{companyData.customerGroup}</p>
              </AccordionElement>
              <AccordionElement title={<FormattedMessage id="eto.form.product-vision.product-vision" />}>
                <p>{companyData.productVision}</p>
              </AccordionElement>
              <AccordionElement title={<FormattedMessage id="eto.form.product-vision.inspiration" />}>
                <p>{companyData.inspiration}</p>
              </AccordionElement>
              <AccordionElement title={<FormattedMessage id="eto.form.product-vision.key-product-priorities" />}>
                <p>{companyData.keyProductPriorities}</p>
              </AccordionElement>
              <AccordionElement title={<FormattedMessage id="eto.form.product-vision.use-of-capital" />}>
                <p>{companyData.useOfCapital}</p>
                {/* TODO: Add chart */}
              </AccordionElement>
              <AccordionElement title={<FormattedMessage id="eto.form.product-vision.sales-model" />}>
                <p>{companyData.salesModel}</p>
              </AccordionElement>
              <AccordionElement title={<FormattedMessage id="eto.form.product-vision.marketing-approach" />}>
                <p>{companyData.marketingApproach}</p>
              </AccordionElement>
              <AccordionElement title={<FormattedMessage id="eto.form.product-vision.selling-proposition" />}>
                <p>{companyData.sellingProposition}</p>
              </AccordionElement>
            </Accordion>
          </Panel>
        </Col>
        <Col xs={12} md={4}>
          <SectionHeader className="mb-4">
            <FormattedMessage id="eto.form.documents.title" />
          </SectionHeader>
          <DocumentsWidget className="mb-4" groups={documentsData} />
          <SectionHeader className="mb-4">
            <FormattedMessage id="eto.form.media-links.title" />
          </SectionHeader>
          <MediaLinksWidget links={mediaLinksData}/>
        </Col>
      </Row>
    </LayoutAuthorized>
  );
};

export const EtoPublicViewComponent: React.SFC<IProps> = props => (
  <EtoPublicView {...props} />
);

export const EtoPublicView = compose<React.SFC>(
  appConnect({
    stateToProps: s => ({
      companyData: s.etoFlow.companyData,
      etoData: s.etoFlow.etoData
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.etoFlow.loadDataStart())
  }),
)(Page);
