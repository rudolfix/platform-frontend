import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { Proportion } from "./Proportion";
import { ITag, Tag } from "./Tag";

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
  quote?: {
    text: string;
    credits: string;
  };
  to?: string;
  logo?: string;
  topImage: IResponsiveImage;
  quoteImage?: IResponsiveImage;
  badge?: IResponsiveImage;
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
  const Wrapper: React.SFC = ({ children }) => {
    if (props.to) {
      return (
        <a href={props.to} target="_blank" className={cn(styles.card, props.className, props.teaser && styles.teaser)}>
          {children}
        </a>
      );
    }

    return <div className={cn(styles.card, props.className, props.teaser && styles.teaser)}>{children}</div>;
  };

  return (
    <Wrapper>
      <Proportion width={100} height={50}>
        <div className={styles.top}>
          {props.badge && (
            <img
              className={styles.badge}
              src={props.badge.src}
              srcSet={props.badge.srcSet}
              alt={props.badge.alt}
            />
          )}
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
          disabledOnMobile={true}
        >
          <div className={styles.descriptionWrapper}>
            {props.name && <h3 className={styles.name}>{props.name}</h3>}
            <p className={cn(styles.description, props.teaser && styles.teaser)}>
              {props.description}
            </p>
          </div>
        </Proportion>
        <blockquote
          className={cn(styles.quote, props.teaser && styles.teaser)}
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
          {!props.teaser && (
            <>
              {props.quote &&
                props.quote.text && (
                  <div className={styles.quoteWrapper}>
                    <p>
                      {'"'}
                      {props.quote.text}
                      {'"'}
                    </p>
                    <p>{props.quote.credits}</p>
                  </div>
                )}
            </>
          )}
        </blockquote>
      </div>
    </Wrapper>
  );
};
