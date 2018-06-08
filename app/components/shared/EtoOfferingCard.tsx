import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { InlineIcon } from "./InlineIcon";
import { Proportion } from "./Proportion";
import { ITag, Tag } from "./Tag";

import * as linkIcon from "../../assets/img/inline_icons/icon_link.svg";
import * as styles from "./EtoOfferingCard.module.scss";

export interface IResponsiveImage {
  alt: string;
  src: string;
  srcSet?: string;
}

export interface IEtoOfferingProps {
  roundName?: string;
  tags: ITag[];
  name?: string;
  description: string;
  quote: {
    text: string;
    person: string;
    position: string;
  };
  to: string;
  logo?: string;
  topImage: IResponsiveImage;
  quoteImage?: IResponsiveImage;
  quoteBackground?: string;
  quoteColor?: string;
  className?: string;
  teaser?: boolean;
}

interface IPropsRoundLabel {
  text: string | React.ReactNode;
}

const RoundLabel: React.SFC<IPropsRoundLabel> = ({ text }) => {
  return (
    <div className={styles.roundLabel}>
      <svg viewBox="0 0 170 100">
        <path
          className={styles.curvyBackground}
          d="M0,102 L0,0 L170.694,0 C166.486,25.398 156.794,41.95 141.616,49.655 C128.623,56.253 93.071,57.423 48.428,72.351 C35.003,76.84 18.86,86.723 0,102 Z"
        />
      </svg>
      <span>{text}</span>
    </div>
  );
};

export const EtoOfferingCard: React.SFC<IEtoOfferingProps> = props => {
  return (
    <Link to={props.to} className={cn(styles.card, props.className)}>
      <Proportion width={10} height={6}>
        <div className={styles.top}>
          {props.topImage && (
            <img
              className={styles.image}
              src={props.topImage.src}
              srcSet={props.topImage.srcSet}
              alt={props.topImage.alt}
            />
          )}
          {props.roundName ? <RoundLabel text={props.roundName} /> : <div />}
          {props.logo && (
            <img className={styles.logo} src={props.logo} alt={`${props.name} logo`} />
          )}
          {props.teaser && (
            <div className={styles.teaserMessage}>
              <FormattedMessage id="shared-component.eto-offering-card.teaser" />
            </div>
          )}
          <div className={styles.tags}>
            {props.tags.map((tag, index) => <Tag {...tag} key={index} />)}
          </div>
        </div>
      </Proportion>
      <div className={styles.bottom}>
        <Proportion
          width={10}
          height={4}
          className={styles.descriptionProportion}
          disabledOnMobile={true}>
          <div className={styles.descriptionWrapper}>
            {props.name && <InlineIcon svgIcon={linkIcon} />}
            {props.name && <h3 className={styles.name}>{props.name}</h3>}
            <p className={cn(styles.description, props.teaser && styles.teaser)}>
              {props.description}
            </p>
          </div>
        </Proportion>
        <blockquote
          className={styles.quote}
          style={{ background: props.quoteBackground, color: props.quoteColor }}
        >
          {props.quoteImage && (
            <img
              className={styles.image}
              src={props.quoteImage.src}
              srcSet={props.quoteImage.srcSet}
              alt={props.quoteImage.alt}
            />
          )}
          {props.teaser ? (
            <svg width="163" height="265" viewBox="0 0 163 265">
              <path
                fill="#FFF"
                d="M162.98,80.772 L162.98,80.772 C162.993,80.982 163,81.192 163,81.405 C163.008,114.091 143.567,143.504 113.472,156.339 C100.352,161.935 91.872,174.971 91.872,189.55 L91.872,213.63 C91.872,219.357 87.225,224 81.492,224 C75.758,224 71.11,219.357 71.11,213.63 L71.11,189.551 C71.11,166.651 84.539,146.127 105.32,137.264 C127.584,127.768 142.026,106.101 142.236,81.958 C142.226,81.776 142.222,81.592 142.222,81.407 C142.222,47.956 114.978,20.741 81.492,20.741 C48.005,20.741 20.762,47.956 20.762,81.407 C20.762,87.135 16.115,91.777 10.381,91.777 C4.648,91.777 0,87.135 0,81.407 C0,36.52 36.557,0 81.493,0 C126.216,0 162.64,36.174 162.98,80.772 Z M81.5,265 C75.7010101,265 71,260.29899 71,254.5 C71,248.70101 75.7010101,244 81.5,244 C87.2989899,244 92,248.70101 92,254.5 C92,260.29899 87.2989899,265 81.5,265 Z"
              />
            </svg>
          ) : (
            <>
              <p>
                {'"'}
                {props.quote.text}
                {'"'}
              </p>
              <p>
                {"- "}
                {props.quote.person}
                {", "}
                {props.quote.position}
                {" @ "}
                {props.name}
              </p>
            </>
          )}
        </blockquote>
      </div>
    </Link>
  );
};
