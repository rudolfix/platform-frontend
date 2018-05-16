import * as React from "react";
import { FormattedDate, FormattedMessage } from "react-intl";

import { TStatus } from "../../shared/ProjectStatus";

import * as stylesCommon from "../EtoOverviewCommon.module.scss";

interface IProps {
  bookBuildingEndDate: number;
  whitelistedEndDate: number;
  publicEndDate: number;
  inSigningEndDate: number;
  etoStartDate: number;
  etoEndDate: number;
  status: TStatus;
}

const positions = {
  "book-building": 100,
  whitelisted: 300,
  public: 560,
  "in-signing": 810,
  "pay-off": 960,
};

export const EtoTimeline: React.SFC<IProps> = props => {
  return (
    <div>
      <svg viewBox="0 0 1122 119">
        {/* indicator */}
        <g transform={`translate(${positions[props.status]})`}>
          <path
            fill="#979797"
            d="M35,28.9775785 C32.19675,28.7249641 30,26.3690213 30,23.5 C30,20.4624339 32.4624339,18 35.5,18 C38.5375661,18 41,20.4624339 41,23.5 C41,26.3690213 38.80325,28.7249641 36,28.9775785 L36,64 L35,64 L35,28.9775785 Z M35.5,28 C37.9852814,28 40,25.9852814 40,23.5 C40,21.0147186 37.9852814,19 35.5,19 C33.0147186,19 31,21.0147186 31,23.5 C31,25.9852814 33.0147186,28 35.5,28 Z"
          />
          <text fill="#000" className={stylesCommon.label}>
            <tspan x="11" y="11">
              <FormattedDate value={Date.now()} />
            </tspan>
          </text>
        </g>
        <g transform="translate(0 56)">
          {/* book building */}
          <g transform="translate(35 8)">
            <rect width="200" height="30" fill="#0C6383" />
            <text className={stylesCommon.label} fill="#FFF">
              <tspan x="56.061" y="19">
                <FormattedMessage id="eto-timeline.book-building" />
              </tspan>
            </text>
          </g>
          {/* in signing */}
          <g transform="translate(748 8)">
            <rect width="200" height="30" fill="#AABCCA" />
            <text className={stylesCommon.label} fill="#FFF">
              <tspan x="68.857" y="19">
                <FormattedMessage id="eto-timeline.in-signing" />
              </tspan>
            </text>
          </g>
          {/* pay off */}
          <g transform="translate(949 8)">
            <polygon fill="#C3D0D9" points="0 0 160 0 172.996 15 160 30 0 30" />
            <text className={stylesCommon.label} fill-opacity="0.56">
              <tspan x="56.748" y="19">
                <FormattedMessage id="eto-timeline.pay-off" />
              </tspan>
            </text>
          </g>
          {/* whitelisted */}
          <g transform="translate(236 8)">
            <rect width="200" height="30" fill="#78D7DC" />
            <text className={stylesCommon.label} fill-opacity="0.56">
              <tspan x="62.301" y="19">
                <FormattedMessage id="eto-timeline.whitelisted" />
              </tspan>
            </text>
          </g>
          {/* public */}
          <g transform="translate(437 8)">
            <rect width="310" height="30" fill="#1FE06D" />
            <text className={stylesCommon.label} fill-opacity="0.56">
              <tspan x="134.612" y="19">
                <FormattedMessage id="eto-timeline.public" />
              </tspan>
            </text>
          </g>
          {/* labels */}
          <g fill="#000">
            <rect width="1" height="46" x="34" />
            <text className={stylesCommon.label}>
              <tspan x=".481" y="63">
                <FormattedDate value={props.etoStartDate} />
              </tspan>
            </text>
          </g>
          <g transform="translate(201)">
            <rect width="1" height="46" x="34" fill="#979797" />
            <text className={stylesCommon.label}>
              <tspan x=".481" y="63">
                <FormattedDate value={props.bookBuildingEndDate} />
              </tspan>
            </text>
          </g>
          <g transform="translate(401)">
            <rect width="1" height="46" x="35" fill="#979797" />
            <text className={stylesCommon.label}>
              <tspan x=".481" y="63">
                <FormattedDate value={props.whitelistedEndDate} />
              </tspan>
            </text>
          </g>
          <g transform="translate(713)">
            <rect width="1" height="46" x="34" fill="#979797" />
            <text className={stylesCommon.label}>
              <tspan x=".481" y="63">
                <FormattedDate value={props.publicEndDate} />
              </tspan>
            </text>
          </g>
          <g transform="translate(913)">
            <rect width="1" height="46" x="35" fill="#979797" />
            <text className={stylesCommon.label}>
              <tspan x=".481" y="63">
                <FormattedDate value={props.inSigningEndDate} />
              </tspan>
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};
