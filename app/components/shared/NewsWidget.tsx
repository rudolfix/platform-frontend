import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Button } from "./Buttons";
import { NavLinkConnected } from "./connectedRouting";
import { InlineIcon } from "./InlineIcon";
import { Panel } from "./Panel";
import { Tabs } from "./Tabs";

import * as iconPlus from "../../assets/img/inline_icons/plus.svg";
import * as iconTrash from "../../assets/img/inline_icons/trash.svg";
import * as styles from "./NewsWidget.module.scss";

type TActiveTab = "news" | "twitter";

interface INews {
  url: string;
  title: string;
}

interface IProps {
  activeTab: TActiveTab;
  news: INews[];
  isEditable: boolean;
  className?: string;
}

export class NewsWidget extends React.Component<IProps> {
  state = {
    activeTab: this.props.activeTab,
  };

  toggleContent = (activeTab: TActiveTab) => {
    this.setState({ activeTab });
  };

  render(): React.ReactNode {
    const { news, isEditable, className } = this.props;
    const { activeTab } = this.state;

    return (
      <div className={cn(styles.newsWidget, isEditable && "is-editable", className)}>
        <Tabs
          size="large"
          hasDivider={false}
          tabs={[
            {
              text: "Twitter",
              handleClick: () => this.toggleContent("twitter"),
              isActive: activeTab === "twitter",
            },
            {
              text: <FormattedMessage id="shared-component.news-widget.tab.company-updates" />,
              handleClick: () => this.toggleContent("news"),
              isActive: activeTab === "news",
            },
          ]}
        />
        <Panel className={styles.contentWrapper}>
          {activeTab === "news" &&
            news.map(({ url, title }) => (
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
          {activeTab === "twitter" && <div>twitter content</div>}
        </Panel>
      </div>
    );
  }
}
