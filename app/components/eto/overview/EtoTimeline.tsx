import * as cn from "classnames";
import * as React from "react";
import { FormattedDate } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import { TStatus } from "../../shared/ProjectStatus";

import * as styles from "./EtoTimeline.module.scss";

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
}

const DatePoint: React.SFC<IDatePointProps> = ({date, blockWidth}) => {
  return (
    <g transform={`translate(${blockWidth - 33})`}>
      <text className={styles.date}>
        <tspan x="7.293" y="67">
          <FormattedDate value={date} />
        </tspan>
      </text>
      <rect width="1" height="46" x="32" fill="#979797"/>
    </g>
  )
}

type TBlockTheme = "navy-blue"
  | "blue"
  | "green"
  | "gray";

interface IBlockProps {
  title: string | React.ReactNode;
  theme: TBlockTheme;
  width: number;
  date: number;
}

const Block: React.SFC<IBlockProps> = ({
  title,
  date,
  theme,
  width
}) => {
  return (
    <>
      <g transform="translate(0 8)" className={cn(styles.block, theme)}>
        <rect
          className={styles.blockBackground}
          width={width}
          height="30" />
        <text
          className={styles.blockText}
          fill="#FFF"
          fontSize="12"
          fontWeight="400"
          textAnchor="middle"
          transform={`translate(${width / 2} 19)`}>
          {title}
        </text>
      </g>
      <DatePoint date={date} blockWidth={width} />
    </>
  )
}

const BlockPayOff: React.SFC = () => {
  return (
    <>
      <polygon
        className={styles.blockBackground}
        points="0 0 160 0 172.996 15 160 30 0 30" />
      <text className={styles.blockText}>
        <tspan x="60.91" y="19">
          <FormattedMessage id="eto-timeline.pay-off"/>
        </tspan>
      </text>
    </>
  )
}

interface IPointerProps {
  date: number;
}

const Pointer: React.SFC<IPointerProps> = ({date}) => {
  return (
    <g transform="translate(10 10)">
      <path fill="#979797" d="M26,29.9775785 C23.19675,29.7249641 21,27.3690213 21,24.5 C21,21.4624339 23.4624339,19 26.5,19 C29.5375661,19 32,21.4624339 32,24.5 C32,27.3690213 29.80325,29.7249641 27,29.9775785 L27,65 L26,65 L26,29.9775785 Z M26.5,29 C28.9852814,29 31,26.9852814 31,24.5 C31,22.0147186 28.9852814,20 26.5,20 C24.0147186,20 22,22.0147186 22,24.5 C22,26.9852814 24.0147186,29 26.5,29 Z"/>
      <text className={styles.date}>
        <tspan x="1.293" y="11">
          <FormattedDate value={date} />
        </tspan>
      </text>
    </g>
  )
}

export class EtoTimeline extends React.Component <IProps> {
  state = {
    pointerPosition: 0
  }

  componentWillMount(): void {
    const pointerPosition = (Date.now() - this.props.etoStartDate) * 800 / (this.props.inSigningEndDate - this.props.etoStartDate);

    this.setState({ pointerPosition });
  }

  render (): React.ReactNode {
    const timePeriod = this.props.inSigningEndDate - this.props.etoStartDate;

    const calculateWidth = (endTime: number, startTime: number): number => {
      return (endTime - startTime) / timePeriod * 800;
    }

    const bookBuildingWidth = calculateWidth(this.props.bookBuildingEndDate, this.props.etoStartDate);
    const whitelistedWidth = calculateWidth(this.props.whitelistedEndDate, this.props.bookBuildingEndDate);
    const publicWidth = calculateWidth(this.props.publicEndDate, this.props.whitelistedEndDate);
    const inSigningWidth = calculateWidth(this.props.inSigningEndDate, this.props.publicEndDate);

    return (
      <svg viewBox="0 0 1019 148">
        <g fill="none">
          <g transform="translate(35 67)">
            <g transform="translate(1)">
              <Block
                title={<FormattedMessage id="eto-timeline.book-building"/>}
                date={this.props.bookBuildingEndDate}
                width={bookBuildingWidth}
                theme="navy-blue" />
            </g>
            <g transform={`translate(${bookBuildingWidth + 1})`}>
              <Block
                title={<FormattedMessage id="eto-timeline.whitelisted"/>}
                date={this.props.whitelistedEndDate}
                width={whitelistedWidth}
                theme="blue" />
            </g>
            <g transform={`translate(${bookBuildingWidth + whitelistedWidth + 1})`}>
              <Block
                title={<FormattedMessage id="eto-timeline.public"/>}
                date={this.props.publicEndDate}
                width={publicWidth}
                theme="green" />
            </g>
            <g transform={`translate(${bookBuildingWidth + whitelistedWidth + publicWidth + 1})`}>
              <Block
                title={<FormattedMessage id="eto-timeline.in-signing"/>}
                date={this.props.inSigningEndDate}
                width={inSigningWidth}
                theme="gray" />
            </g>
            <g transform="translate(801 8)">
              <BlockPayOff />
            </g>
            <DatePoint date={this.props.etoStartDate} blockWidth={1} />
          </g>
          <g transform={`translate(${this.state.pointerPosition})`}>
            <Pointer date={Date.now()} />
          </g>
        </g>
      </svg>
    );
  }
}
