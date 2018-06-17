import * as React from "react";
import Slider, { Settings } from "react-slick";
import { Col, Container, Row } from "reactstrap";

import { JoinCta } from "./LandingHeader";
import { PeopleSlider } from "./testimonials/People";

import * as reutersImage from "../../../assets/img/landing/testimonials/reuters.png";
import * as styles from "./Testimonials.module.scss";

const settings: Settings = {
  dots: false,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  arrows: false,
};

export const Testimonials: React.SFC = () => (
  <section>
    <Container>
      <Row>
        <Col xs={8} className={styles.media}>
          <Slider {...settings}>
            <MediaQuote
              imageSrc={reutersImage}
              link="https://www.crowdfundinsider.com/2018/04/132652-zoe-adamovicz-neufund-is-going-to-be-a-game-changer/"
              quote="The Neufund platform bridges the gap between investors and inventors, and at the same time aligns their interests in a whole new way."
            />
            <MediaQuote
              imageSrc={reutersImage}
              link="https://techcrunch.com/2017/01/17/neufund/"
              quote="The blockchain-based platform that Neufund is building creates a new type of ownership that is neither money nor stock, but crypto tokens which represent equity and at the same time are as liquid as a currency."
            />
            <MediaQuote
              imageSrc={reutersImage}
              link="https://www.reuters.com/article/us-neufund-blockchain-funding/berlin-start-up-raises-nearly-12-million-to-create-equity-token-idUSKBN1D72H9?il=0"
              quote="Neufund’s platform will allow investors to finance projects, while acquiring equity in the form of tradable crypto-currencies."
            />
          </Slider>
        </Col>
      </Row>

      <Row>
        <Col className="text-center">
          <h2 className="my-5">Become a member of a progressive investor community</h2>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <PeopleSlider />
        </Col>
      </Row>

      <Row className="align-self-center my-5">
        <Col xs={12}>
          <JoinCta className="justify-content-center" />
        </Col>
      </Row>
    </Container>
  </section>
);

interface IMediaQuoteProps {
  imageSrc: string;
  quote: string;
  link: string;
}

const MediaQuote: React.SFC<IMediaQuoteProps> = ({ imageSrc, quote, link }) => (
  <a href={link} className={styles.mediaQuote}>
    <Row className="justify-content-around">
      <Col className="align-self-center" xs={4}>
        <img src={imageSrc} className={styles.mediaQuoteImage} />
      </Col>
      <Col className="align-self-center" xs={8}>
        <blockquote className={styles.mediaQuoteText}>{`"${quote}"`}</blockquote>
      </Col>
    </Row>
  </a>
);
