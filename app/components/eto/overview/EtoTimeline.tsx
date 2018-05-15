import * as React from "react";
import { FormattedMessage } from "react-intl";

import * as stylesCommon from "../EtoOverviewCommon.module.scss";

export const EtoTimeline: React.SFC = () => {
  return (
    <div>
      <svg viewBox="0 0 1122 64">
        <g transform="translate(35 8)">
          <rect width="200" height="30" fill="#0C6383" />
          <text className={stylesCommon.label} fill="#FFF">
            <tspan x="56.061" y="19">
              <FormattedMessage id="eto-timeline.book-building" />
            </tspan>
          </text>
        </g>
        <g transform="translate(748 8)">
          <rect width="200" height="30" fill="#AABCCA" />
          <text className={stylesCommon.label} fill="#FFF">
            <tspan x="68.857" y="19">
              <FormattedMessage id="eto-timeline.in-signing" />
            </tspan>
          </text>
        </g>
        <g transform="translate(949 8)">
          <polygon fill="#C3D0D9" points="0 0 160 0 172.996 15 160 30 0 30" />
          <text className={stylesCommon.label} fill-opacity="0.56">
            <tspan x="56.748" y="19">
              <FormattedMessage id="eto-timeline.pay-off" />
            </tspan>
          </text>
        </g>
        <g transform="translate(236 8)">
          <rect width="200" height="30" fill="#78D7DC" />
          <text className={stylesCommon.label} fill-opacity="0.56">
            <tspan x="62.301" y="19">
              <FormattedMessage id="eto-timeline.whitelisted" />
            </tspan>
          </text>
        </g>
        <g transform="translate(437 8)">
          <rect width="310" height="30" fill="#1FE06D" />
          <text className={stylesCommon.label} fill-opacity="0.56">
            <tspan x="134.612" y="19">
              <FormattedMessage id="eto-timeline.public" />
            </tspan>
          </text>
        </g>
        <g fill="#000">
          <rect width="1" height="46" x="34" />
          <text className={stylesCommon.label}>
            <tspan x=".481" y="63">
              30. Dec 2018
            </tspan>
          </text>
        </g>
        <g transform="translate(201)">
          <rect width="1" height="46" x="34" fill="#979797" />
          <text className={stylesCommon.label}>
            <tspan x=".481" y="63">
              30. Dec 2018
            </tspan>
          </text>
        </g>
        <g transform="translate(401)">
          <rect width="1" height="46" x="35" fill="#979797" />
          <text className={stylesCommon.label}>
            <tspan x=".481" y="63">
              30. Dec 2018
            </tspan>
          </text>
        </g>
        <g transform="translate(713)">
          <rect width="1" height="46" x="34" fill="#979797" />
          <text className={stylesCommon.label}>
            <tspan x=".481" y="63">
              30. Dec 2018
            </tspan>
          </text>
        </g>
        <g transform="translate(913)">
          <rect width="1" height="46" x="35" fill="#979797" />
          <text className={stylesCommon.label}>
            <tspan x=".481" y="63">
              30. Dec 2018
            </tspan>
          </text>
        </g>
      </svg>
    </div>
  );
};
