import * as cn from "classnames";
import * as React from "react";
import { FormattedDate } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import { TTranslatedString } from "../../../types";

import * as styles from "./EtoTimeline.module.scss";

type TBlockTheme = "blue" | "fluorescent-blue" | "green" | "gray" | "gray-opacity";
type TDatePointType = "short";
interface IProps {
  etoStartDate: string;
  preEtoDuration: number | undefined;
  publicEtoDuration: number | undefined;
  inSigningDuration: number | undefined;
}

interface IDatePointProps {
  date?: number | string;
  type?: TDatePointType;
}

interface IBlockProps {
  title: TTranslatedString;
  theme: TBlockTheme;
  width?: number;
  date?: number;
}

interface IBlockTitle {
  title: TTranslatedString;
  width: number;
}

interface IPointerProps {
  position?: number;
}

const TIMELINE_WIDTH = 1000;
const TIMELINE_HEIGHT = 106;
const TIMELINE_STAGES = 5;
const DEFAULT_BLOCK_WIDTH = TIMELINE_WIDTH / TIMELINE_STAGES;
const MORPHING_TIMELINE_WIDTH = TIMELINE_WIDTH - 2 * DEFAULT_BLOCK_WIDTH; // first and last blocks won't change their sizes
const POINTER_HEIGHT = 61;

const defaultEtoTimelineContext = {
  blockWidth: DEFAULT_BLOCK_WIDTH,
  blockHeight: 30,
  borderHeight: 4,
  backgroundHeight: 18,
};

const EtoTimelineContext = React.createContext(defaultEtoTimelineContext);

const DatePoint: React.SFC<IDatePointProps> = ({ date, type }) => {
  return (
    <g transform={`translate(-33 -9)`}>
      {date && (
        <text className={styles.date}>
          <tspan x={12} y={50}>
            <FormattedDate value={date} />
          </tspan>
        </text>
      )}
      <rect
        width={type === "short" ? 1 : 3}
        height={type === "short" ? 16 : 32}
        x={32}
        y={type === "short" ? 20 : 4}
        className={cn(styles.datePoint, type)}
      />
    </g>
  );
};

const BlockTitle: React.SFC<IBlockTitle> = ({ title, width }) => {
  return (
    <text className={styles.blockText} textAnchor="middle" transform={`translate(${width / 2} 13)`}>
      {title}
    </text>
  );
};

const StartBlock: React.SFC<IBlockProps> = ({ title, width }) => {
  return (
    <EtoTimelineContext.Consumer>
      {({ backgroundHeight, blockWidth, borderHeight, blockHeight }) => {
        const computedWidth = width || blockWidth;

        return (
          <>
            <polygon
              fill="#f6f9fe"
              points={`${blockHeight} 0 ${computedWidth} 0 ${computedWidth} ${backgroundHeight} 0 ${backgroundHeight} 0 ${backgroundHeight}`}
            />
            <rect width={computedWidth} height={borderHeight} y={backgroundHeight} fill="#0C6383" />
            <BlockTitle title={title} width={computedWidth} />
          </>
        );
      }}
    </EtoTimelineContext.Consumer>
  );
};

const EndBlock: React.SFC<IBlockProps> = ({ title, width }) => {
  return (
    <EtoTimelineContext.Consumer>
      {({ backgroundHeight, blockWidth, borderHeight }) => {
        const computedWidth = width || blockWidth;

        return (
          <>
            <polygon
              fill="#f6f9fe"
              points={`0 0 ${computedWidth -
                backgroundHeight} 0 ${computedWidth} ${backgroundHeight} ${computedWidth} ${backgroundHeight} 0 ${backgroundHeight}`}
            />
            <rect
              width={computedWidth}
              height={borderHeight}
              y={backgroundHeight}
              fill="#aabcca"
              fillOpacity=".7"
            />
            <BlockTitle title={title} width={computedWidth} />
          </>
        );
      }}
    </EtoTimelineContext.Consumer>
  );
};

const Block: React.SFC<IBlockProps> = ({ title, theme, width }) => {
  return (
    <EtoTimelineContext.Consumer>
      {({ backgroundHeight, blockWidth, borderHeight }) => {
        const computedWidth = width || blockWidth;

        return (
          <g className={cn(styles.block, theme)}>
            <rect className={styles.blockBackground} width={computedWidth} height="19" />
            <rect
              className={styles.blockBorderBottom}
              width={computedWidth}
              height={borderHeight}
              y={backgroundHeight}
            />
            <BlockTitle title={title} width={computedWidth} />
          </g>
        );
      }}
    </EtoTimelineContext.Consumer>
  );
};

const Pointer: React.SFC<IPointerProps> = ({ position }) => {
  const computedPosition = position || 20;

  return (
    <g transform={`translate(${computedPosition} 0)`}>
      <path
        className={styles.pointer}
        d={`M26.5,25 C28.1568543,25 29.5,23.6568543 29.5,22 C29.5,20.3431457 28.1568543,19 26.5,19 C24.8431457,19 23.5,20.3431457 23.5,22 C23.5,23.6568543 24.8431457,25 26.5,25 Z M26,25.9690531 C24.0268442,25.7230041 22.5,24.0398088 22.5,22 C22.5,19.790861 24.290861,18 26.5,18 C28.709139,18 30.5,19.790861 30.5,22 C30.5,24.0398088 28.9731558,25.7230041 27,25.9690531 L27,79 L26,79 L26,25.9690531 Z`}
      />
      <text className={styles.pointerLabel}>
        <tspan x="14" y="12">
          <FormattedMessage id="shared-component.eto-timeline.today" />
        </tspan>
      </text>
    </g>
  );
};

export const EtoTimeline: React.SFC<IProps> = props => {
  const day = 86400000;
  const today = Date.now() + 50;

  // start/end dates of phases
  const preEtoStartDate = isNaN(Date.parse(props.etoStartDate))
    ? NaN
    : Date.parse(props.etoStartDate);
  const publicEtoStartDate = isNaN(preEtoStartDate)
    ? NaN
    : preEtoStartDate + (props.preEtoDuration || 0) * day;
  const inSigningStartDate = isNaN(publicEtoStartDate)
    ? NaN
    : publicEtoStartDate + (props.publicEtoDuration || 0) * day;
  const inSigningEndDate = isNaN(inSigningStartDate)
    ? NaN
    : inSigningStartDate + (props.inSigningDuration || 0) * day;

  // blocks sizes
  const totalTimeScope = inSigningEndDate - preEtoStartDate;
  const preEtoWidth =
    ((publicEtoStartDate - preEtoStartDate) / totalTimeScope) * MORPHING_TIMELINE_WIDTH;
  const publicEtoWidth =
    ((inSigningStartDate - publicEtoStartDate) / totalTimeScope) * MORPHING_TIMELINE_WIDTH;
  const inSigningWidth =
    ((inSigningEndDate - inSigningStartDate) / totalTimeScope) * MORPHING_TIMELINE_WIDTH;

  const pointerPosition =
    today <= preEtoStartDate
      ? 20
      : today < inSigningEndDate
        ? DEFAULT_BLOCK_WIDTH +
          ((today - preEtoStartDate) / totalTimeScope) * MORPHING_TIMELINE_WIDTH
        : 4 * DEFAULT_BLOCK_WIDTH + 20;

  return (
    <EtoTimelineContext.Provider value={defaultEtoTimelineContext}>
      <svg viewBox={`0 0 ${TIMELINE_WIDTH} ${TIMELINE_HEIGHT}`}>
        <g transform={`translate(0 ${POINTER_HEIGHT})`}>
          <StartBlock title={<FormattedMessage id="eto-timeline.campaining" />} theme="blue" />
          <g transform={`translate(${DEFAULT_BLOCK_WIDTH})`}>
            <Block
              title={<FormattedMessage id="eto-timeline.pre-eto" />}
              width={preEtoWidth}
              theme="fluorescent-blue"
            />
            <DatePoint date={preEtoStartDate} />
          </g>
          <g transform={`translate(${DEFAULT_BLOCK_WIDTH + (preEtoWidth || 0)})`}>
            <Block
              title={<FormattedMessage id="eto-timeline.public-eto" />}
              width={publicEtoWidth}
              theme="green"
            />
            <DatePoint date={publicEtoStartDate} type="short" />
          </g>
          <g
            transform={`translate(${DEFAULT_BLOCK_WIDTH +
              (preEtoWidth || 0) +
              (publicEtoWidth || 0)})`}
          >
            <Block
              title={<FormattedMessage id="eto-timeline.in-signing" />}
              width={inSigningWidth}
              theme="gray"
            />
            <DatePoint date={inSigningStartDate} />
          </g>
          <g transform={`translate(${4 * DEFAULT_BLOCK_WIDTH})`}>
            <EndBlock title={<FormattedMessage id="eto-timeline.claim" />} theme="gray-opacity" />
            <DatePoint date={inSigningEndDate} type="short" />
          </g>
        </g>
        <Pointer position={pointerPosition} />
      </svg>
    </EtoTimelineContext.Provider>
  );
};
