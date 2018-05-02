import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { Button } from "./Buttons";
import { NavLinkConnected } from "./connectedRouting";
import { InlineIcon } from "./InlineIcon";
import { PanelWhite } from "./PanelWhite";
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
      <PanelWhite className={cn(styles.newsWidget, isEditable && "is-editable", className)}>
        <Tabs
          tabs={[
            {
              text: <FormattedMessage id="shared-component-news-widget-tab-latest" />,
              handleClick: () => this.toggleContent("news"),
              isActive: activeTab === "news",
            },
            {
              text: "Twitter",
              handleClick: () => this.toggleContent("twitter"),
              isActive: activeTab === "twitter",
            },
          ]}
        />
        {
          <div className={styles.contentWrapper}>
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
          </div>
        }
        {activeTab === "twitter" && <div>twitter content</div>}
      </PanelWhite>
    );
  }
}
