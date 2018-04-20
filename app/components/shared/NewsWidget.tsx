import * as cn from "classnames";
import * as React from "react";

import { Button } from "./Buttons";
import { NavLinkConnected } from "./connectedRouting";
import { InlineIcon } from "./InlineIcon";
import { PanelWhite } from "./PanelWhite";
import { Tabs } from "./Tabs";

import * as iconPlus from "../../assets/img/inline_icons/plus.svg";
import * as iconTrash from "../../assets/img/inline_icons/trash.svg";

type TActiveTab = "news" | "twitter";

interface INews {
  path: string;
  title: string;
}

interface IProps {
  activeTab: TActiveTab;
  news: INews[];
  isEditable: boolean;
  className?: string;
}

export const NewsWidget: React.SFC<IProps> = ({ news, isEditable, activeTab, className }) => {
  return (
    <PanelWhite className={cn(className)}>
      <Tabs
        tabs={[
          {
            text: "Latest news",
            handleClick: () => {},
            isActive: activeTab === "news",
          },
          {
            text: "Twitter",
            handleClick: () => {},
            isActive: activeTab === "twitter",
          },
        ]}
      />
      <div>
        {news.map(({ path, title }) => (
          <div>
            <NavLinkConnected to={{ pathname: path || "#0", search: location.search }}>
              {title}
            </NavLinkConnected>
            {isEditable && <InlineIcon svgIcon={iconTrash} />}
          </div>
        ))}
      </div>
      {isEditable && (
        <Button svgIcon={iconPlus} iconPosition="icon-before">
          Add news
        </Button>
      )}
    </PanelWhite>
  );
};
