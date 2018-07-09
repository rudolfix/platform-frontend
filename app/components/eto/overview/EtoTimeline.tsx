import * as cn from "classnames";
import * as React from "react";
import { FormattedDate } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import { TStatus } from "../../shared/ProjectStatus";

import * as styles from "./EtoTimeline.module.scss";

type TBlockTheme = "blue" | "fluorescent-blue" | "green" | "gray";
type TDatePointType = "short";
interface IProps {
  bookBuildingEndDate: number;
  whitelistedEndDate: number;
  publicEndDate: number;
  inSigningEndDate: number;
  etoStartDate: number;
  etoEndDate: number;
  status: TStatus;
}

interface IDatePointProps {
  date: number;
  blockWidth: number;
  type?: TDatePointType;
  isConfirmed?: boolean;
  isDeadline?: boolean;
}

interface IBlockProps {
  title: string | React.ReactNode;
  theme: TBlockTheme;
  width: number;
  date?: number;
  type?: "arrow";
  datePointType?: TDatePointType;
}

const DatePoint: React.SFC<IDatePointProps> = ({
  date,
  blockWidth,
  type,
  isConfirmed,
  isDeadline,
}) => {
  return (
    <g transform={`translate(${blockWidth - 33})`}>
      <text className={styles.date}>
        <tspan x="7.293" y="50">
          <FormattedDate value={date} />
        </tspan>
      </text>
      <rect
        width="1"
        height={type === "short" ? "16" : "32"}
        x="32"
        y={type === "short" ? "20" : "4"}
        className={cn(
          styles.datePoint,
          type,
          isConfirmed && "is-confirmed",
          isDeadline && "is-deadline",
        )}
      />
    </g>
  );
};

const Block: React.SFC<IBlockProps> = ({ title, date, datePointType, theme, width, type }) => {
  return (
    <>
      <g transform={type === "arrow" ? "" : "translate(0 8)"} className={cn(styles.block, theme)}>
        <rect className={styles.blockBackground} width={width} height="19" />
        {type === "arrow" ? (
          <polygon
            fill="#AABCCA"
            fill-opacity=".7"
            fill-rule="nonzero"
            points="0 26 160 26 172.996 28 160 30 0 30"
            transform="translate(0, -7)"
          />
        ) : (
          <rect
            className={styles.blockBorderBottom}
            width={width}
            height="4"
            y="19"
            fill="#1FE06D"
          />
        )}
        <text
          className={styles.blockText}
          textAnchor="middle"
          transform={`translate(${width / 2} 14)`}
        >
          {title}
        </text>
      </g>
      {date && <DatePoint date={date} blockWidth={width} type={datePointType} />}
    </>
  );
};

const Pointer: React.SFC = () => {
  return (
    <g transform="translate(10 29)">
      <path
        className={styles.pointer}
        d="M26,29.9775785 C23.19675,29.7249641 21,27.3690213 21,24.5 C21,21.4624339 23.4624339,19 26.5,19 C29.5375661,19 32,21.4624339 32,24.5 C32,27.3690213 29.80325,29.7249641 27,29.9775785 L27,65 L26,65 L26,29.9775785 Z M26.5,29 C28.9852814,29 31,26.9852814 31,24.5 C31,22.0147186 28.9852814,20 26.5,20 C24.0147186,20 22,22.0147186 22,24.5 C22,26.9852814 24.0147186,29 26.5,29 Z"
      />
      <text className={styles.date}>
        <tspan x="11" y="12">
          <FormattedMessage id="shared-component.eto-timeline.today" />
        </tspan>
      </text>
    </g>
  );
};

export class EtoTimeline extends React.Component<IProps> {
  state = {
    pointerPosition: 0,
  };

  componentWillMount(): void {
    const pointerPosition =
      (Date.now() - this.props.etoStartDate) *
      800 /
      (this.props.inSigningEndDate - this.props.etoStartDate);

    this.setState({ pointerPosition });
  }

  render(): React.ReactNode {
    const timePeriod = this.props.inSigningEndDate - this.props.etoStartDate;

    const calculateWidth = (endTime: number, startTime: number): number => {
      return (endTime - startTime) / timePeriod * 800;
    };

    const bookBuildingWidth = calculateWidth(
      this.props.bookBuildingEndDate,
      this.props.etoStartDate,
    );
    const whitelistedWidth = calculateWidth(
      this.props.whitelistedEndDate,
      this.props.bookBuildingEndDate,
    );
    const publicWidth = calculateWidth(this.props.publicEndDate, this.props.whitelistedEndDate);
    const inSigningWidth = calculateWidth(this.props.inSigningEndDate, this.props.publicEndDate);

    return (
      <svg viewBox="0 0 1019 148">
        <g fill="none">
          <g transform="translate(35 67)">
            <g transform="translate(1)">
              <Block
                title={<FormattedMessage id="eto-timeline.campaining" />}
                date={this.props.bookBuildingEndDate}
                width={bookBuildingWidth}
                theme="blue"
              />
            </g>
            <g transform={`translate(${bookBuildingWidth + 1})`}>
              <Block
                title={<FormattedMessage id="eto-timeline.pre-eto" />}
                date={this.props.whitelistedEndDate}
                width={whitelistedWidth}
                theme="fluorescent-blue"
                datePointType="short"
              />
            </g>
            <g transform={`translate(${bookBuildingWidth + whitelistedWidth + 1})`}>
              <Block
                title={<FormattedMessage id="eto-timeline.public-eto" />}
                date={this.props.publicEndDate}
                width={publicWidth}
                theme="green"
              />
            </g>
            <g transform={`translate(${bookBuildingWidth + whitelistedWidth + publicWidth + 1})`}>
              <Block
                title={<FormattedMessage id="eto-timeline.in-signing" />}
                date={this.props.inSigningEndDate}
                width={inSigningWidth}
                theme="gray"
              />
            </g>
            <g transform="translate(801 8)">
              <Block
                title={<FormattedMessage id="eto-timeline.claim" />}
                theme="gray"
                width={162}
                type="arrow"
                datePointType="short"
              />
            </g>
            <DatePoint date={this.props.etoStartDate} blockWidth={1} />
          </g>
          <g transform={`translate(${this.state.pointerPosition})`}>
            <Pointer />
          </g>
        </g>
      </svg>
    );
  }
}
