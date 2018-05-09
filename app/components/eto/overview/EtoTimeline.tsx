import * as React from 'react';
import { FormattedMessage } from 'react-intl';

export const EtoTimeline: React.SFC = () => {
  return (
    <div>
    <svg width="100%" height="64">
  <g fill="none" fill-rule="evenodd">
    <g transform="translate(35 8)">
      <rect width="200" height="30" fill="#0C6383"/>
      <text fill="#FFF" font-family="Roboto-Medium, Roboto" font-size="12" font-weight="400">
        <tspan x="56.061" y="19">
          <FormattedMessage id="eto-timeline.book-building" />
        </tspan>
      </text>
    </g>
    <g transform="translate(748 8)">
      <rect width="200" height="30" fill="#AABCCA"/>
      <text fill="#FFF" font-family="Roboto-Medium, Roboto" font-size="12" font-weight="400">
        <tspan x="68.857" y="19">
          <FormattedMessage id="eto-timeline.in-signing" />
        </tspan>
      </text>
    </g>
    <g transform="translate(949 8)">
      <polygon fill="#C3D0D9" points="0 0 160 0 172.996 15 160 30 0 30"/>
      <text fill="#FFF" font-family="Roboto-Medium, Roboto" font-size="12" font-weight="400">
        <tspan x="56.748" y="19">
          <FormattedMessage id="eto-timeline.pay-off" />
        </tspan>
      </text>
    </g>
    <g transform="translate(236 8)">
      <rect width="200" height="30" fill="#78D7DC"/>
      <text fill="#000" fill-opacity=".56" font-family="Roboto-Medium, Roboto" font-size="12" font-weight="400">
        <tspan x="62.301" y="19">
        <FormattedMessage id="eto-timeline.whitelisted" />
        </tspan>
      </text>
    </g>
    <g transform="translate(437 8)">
      <rect width="310" height="30" fill="#1FE06D"/>
      <text fill="#000" fill-opacity=".56" font-family="Roboto-Medium, Roboto" font-size="12" font-weight="400">
        <tspan x="134.612" y="19">
          <FormattedMessage id="eto-timeline.public" />
        </tspan>
      </text>
    </g>
    <g fill="#000">
      <rect width="1" height="46" x="34"/>
      <text font-family="Roboto-Regular, Roboto" font-size="12">
        <tspan x=".481" y="63">30. Dec 2018</tspan>
      </text>
    </g>
    <g transform="translate(201)">
      <rect width="1" height="46" x="34" fill="#979797"/>
      <text fill="#000" font-family="Roboto-Regular, Roboto" font-size="12">
        <tspan x=".481" y="63">30. Dec 2018</tspan>
      </text>
    </g>
    <g transform="translate(401)">
      <rect width="1" height="46" x="35" fill="#979797"/>
      <text fill="#000" font-family="Roboto-Regular, Roboto" font-size="12">
        <tspan x=".481" y="63">30. Dec 2018</tspan>
      </text>
    </g>
    <g transform="translate(713)">
      <rect width="1" height="46" x="34" fill="#979797"/>
      <text fill="#000" font-family="Roboto-Regular, Roboto" font-size="12">
        <tspan x=".481" y="63">30. Dec 2018</tspan>
      </text>
    </g>
    <g transform="translate(913)">
      <rect width="1" height="46" x="35" fill="#979797"/>
      <text fill="#000" font-family="Roboto-Regular, Roboto" font-size="12">
        <tspan x=".481" y="63">30. Dec 2018</tspan>
      </text>
    </g>
  </g>
</svg>
</div>
)};
