import * as React from "react";
import Slider, { Settings } from "react-slick";
import { Col, Row } from "reactstrap";

import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { Accordion, AccordionElement } from "../shared/Accordion";
import { InlineIcon } from "../shared/InlineIcon";
import { Panel } from "../shared/Panel";
import { SectionHeader } from "../shared/SectionHeader";
import { EtoOverviewStatus } from "./overview/EtoOverviewStatus";
import { Cover } from "./publicView/Cover";

import * as downloadIcon from "../../assets/img/inline_icons/download.svg";
import * as tokenIcon from "../../assets/img/neu_icon.svg";
import { ResponsiveImage } from "../shared/ResponsiveImage";
import { Tabs } from "../shared/Tabs";
import { Video } from "../shared/Video";
import * as styles from "./EtoPublicView.module.scss";

const coverData = {
  coverImage: {
    alt: "",
    src: "",
    srcSet: {
      "1x": "",
      "2x": "",
      "3x": "",
    },
    width: 1230,
    height: 380,
  },
  company: {
    name: "name",
    shortDescription: "short description",
    website: {
      title: "www.example.com",
      url: "www.whatewerworks.in",
    },
    logo: {
      alt: "",
      src: "",
      srcSet: {
        "1x": "",
        "2x": "",
        "3x": "",
      },
      width: 1,
      height: 1,
    },
    tags: ["incubator", "innovation", "iot", "germany"],
  },
};

const documentsData = [
  {
    name: "document 1 name",
    url: "document 1",
  },
  {
    name: "document 2 name",
    url: "document 2",
  },
  {
    name: "document 3 name",
    url: "document 3",
  },
];

const tabsData = [
  { text: "Team", path: "/" },
  { text: "Investors", path: "/#a" },
  { text: "Partners", path: "/#b" },
  { text: "Key customers", path: "/#c" },
  { text: "Advisors", path: "/#d" },
];

const sliderSettings: Settings = {
  dots: false,
  infinite: true,
  autoplay: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
  arrows: true,
  responsive: [
    {
      breakpoint: 500,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
  ],
};

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
];

export const EtoPublicView: React.SFC = () => {
  return (
    <LayoutAuthorized>
      <Cover company={coverData.company} coverImage={coverData.coverImage} />

      <Row>
        <Col xs={12} md={5} className="mb-4">
          <Video youTubeId="aqz-KE-bpKQ" />
        </Col>
        <Col xs={12} md={7} className="mb-4">
          <Panel>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Non tenetur, impedit labore
              vero eum omnis iusto quaerat ea, facere perferendis quae! Perferendis quae, blanditiis
              qui iusto excepturi maiores possimus reprehenderit?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Non tenetur, impedit labore
              vero eum omnis iusto quaerat ea, facere perferendis quae! Perferendis quae, blanditiis
              qui iusto excepturi maiores possimus reprehenderit?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Non tenetur, impedit labore
              vero eum omnis iusto quaerat ea, facere perferendis quae! Perferendis quae, blanditiis
              qui iusto excepturi maiores possimus reprehenderit?
            </p>
          </Panel>
        </Col>
      </Row>

      <Row>
        <Col className="mb-4">
          <SectionHeader className="mb-4">ETO Overview</SectionHeader>
          <EtoOverviewStatus
            cap="HARD CAP: 750M EDT"
            duration="22.02.2018 to 22.5.2019"
            tokensSupply="50000000"
            tokenName="ABC"
            tokenImg={tokenIcon}
            status="book-building"
          />
        </Col>
      </Row>

      <Row>
        <Col className="mb-4">
          <Tabs tabs={tabsData} size="large" className="mb-4" />
          <Panel>
            <div className={styles.peopleCarouselWrapper}>
              <Slider {...sliderSettings}>
                {peopleCarouselData.map(({ image, name, title, bio }) => (
                  <div key={name}>
                    <div className={styles.peopleCarouselSlideContent}>
                      <div className={styles.peopleCarouselImage}>
                        <ResponsiveImage srcSet={image} alt={name} />
                      </div>
                      <div>
                        <h4 className={styles.peopleCarouselName}>{name}</h4>
                        <h5 className={styles.peopleCarouselTitle}>{title}</h5>
                        <p className={styles.peopleCarouselBio}>{bio}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </Panel>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={8} className="mb-4">
          <SectionHeader className="mb-4">Product pitch</SectionHeader>
          <Panel>
            <Accordion>
              <AccordionElement title="What is exact problem the company is solving and how">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis soluta similique
                  rem cumque placeat accusantium voluptate labore ipsa recusandae aperiam? Fuga
                  recusandae accusamus nihil. Vel fugit voluptates debitis blanditiis error.
                </p>
              </AccordionElement>
              <AccordionElement title="Exact target segment of the product">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis soluta similique
                  rem cumque placeat accusantium voluptate labore ipsa recusandae aperiam? Fuga
                  recusandae accusamus nihil. Vel fugit voluptates debitis blanditiis error.
                </p>
              </AccordionElement>
              <AccordionElement title="Product / company vision">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis soluta similique
                  rem cumque placeat accusantium voluptate labore ipsa recusandae aperiam? Fuga
                  recusandae accusamus nihil. Vel fugit voluptates debitis blanditiis error.
                </p>
              </AccordionElement>
              <AccordionElement title="Founders motivation">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis soluta similique
                  rem cumque placeat accusantium voluptate labore ipsa recusandae aperiam? Fuga
                  recusandae accusamus nihil. Vel fugit voluptates debitis blanditiis error.
                </p>
              </AccordionElement>
              <AccordionElement title="How will the raised capital be used">
                <p>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis soluta
                    similique rem cumque placeat accusantium voluptate labore ipsa recusandae
                    aperiam? Fuga recusandae accusamus nihil. Vel fugit voluptates debitis
                    blanditiis error.
                  </p>
                </p>
              </AccordionElement>
              <AccordionElement title="Product roadmap">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis soluta similique
                  rem cumque placeat accusantium voluptate labore ipsa recusandae aperiam? Fuga
                  recusandae accusamus nihil. Vel fugit voluptates debitis blanditiis error.
                </p>
              </AccordionElement>
              <AccordionElement title="What is the business model">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis soluta similique
                  rem cumque placeat accusantium voluptate labore ipsa recusandae aperiam? Fuga
                  recusandae accusamus nihil. Vel fugit voluptates debitis blanditiis error.
                </p>
              </AccordionElement>
              <AccordionElement title="What is the marketing stategy">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis soluta similique
                  rem cumque placeat accusantium voluptate labore ipsa recusandae aperiam? Fuga
                  recusandae accusamus nihil. Vel fugit voluptates debitis blanditiis error.
                </p>
              </AccordionElement>
              <AccordionElement title="USP">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis soluta similique
                  rem cumque placeat accusantium voluptate labore ipsa recusandae aperiam? Fuga
                  recusandae accusamus nihil. Vel fugit voluptates debitis blanditiis error.
                </p>
              </AccordionElement>
              <AccordionElement title="Who are your key competitors">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis soluta similique
                  rem cumque placeat accusantium voluptate labore ipsa recusandae aperiam? Fuga
                  recusandae accusamus nihil. Vel fugit voluptates debitis blanditiis error.
                </p>
              </AccordionElement>
            </Accordion>
          </Panel>
        </Col>
        <Col xs={12} md={4}>
          <SectionHeader className="mb-4">Documents</SectionHeader>
          <Panel className={styles.documents}>
            {documentsData.map(({ name, url }) => (
              <a href={url} download>
                <InlineIcon width="20px" height="20px" svgIcon={downloadIcon} />
                {name}
              </a>
            ))}
          </Panel>
        </Col>
      </Row>
    </LayoutAuthorized>
  );
};
