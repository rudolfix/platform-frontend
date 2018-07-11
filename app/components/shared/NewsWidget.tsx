import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Button } from "./Buttons";
import { NavLinkConnected } from "./connectedRouting";
import { InlineIcon } from "./InlineIcon";
import { Panel } from "./Panel";

import * as iconPlus from "../../assets/img/inline_icons/plus.svg";
import * as iconTrash from "../../assets/img/inline_icons/trash.svg";
import * as styles from "./NewsWidget.module.scss";
import { TabContent, Tabs } from "./Tabs";

interface INews {
  url: string;
  title: string;
}

interface IProps {
  news: INews[];
  isEditable: boolean;
  className?: string;
}

export class NewsWidget extends React.Component<IProps> {
  render(): React.ReactNode {
    const { news, isEditable, className } = this.props;

    return (
      <div className={cn(styles.newsWidget, isEditable && "is-editable", className)}>
        <Tabs layoutSize="large" layoutOrnament={false} layoutPosition="center">
          <TabContent tab="Twitter">
            <Panel className={styles.contentWrapper}>
              <div>twitter content</div>
            </Panel>
          </TabContent>
          <TabContent
            tab={<FormattedMessage id="shared-component.news-widget.tab.company-updates" />}
          >
            <Panel className={styles.contentWrapper}>
              {news.map(({ url, title }) => (
                <div className={styles.newsSingle} key={url}>
                  <NavLinkConnected to={{ pathname: url || "#0", search: location.search }}>
                    {title}
                  </NavLinkConnected>
                  {isEditable && <InlineIcon svgIcon={iconTrash} />}
                </div>
              ))}
              {isEditable && (
                <Button
                  svgIcon={iconPlus}
                  className={styles.addNews}
                  layout="secondary"
                  iconPosition="icon-before"
                >
                  <FormattedMessage id="shared-component-news-widget-add-news" />
                </Button>
              )}
            </Panel>
          </TabContent>
        </Tabs>
      </div>
    );
  }
}
