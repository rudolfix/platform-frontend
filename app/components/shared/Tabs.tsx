import * as cn from "classnames";
import * as React from 'react';

import { CommonHtmlProps, TTranslatedString } from '../../types';
import { NavLinkConnected } from "./connectedRouting";

import * as styles from "./Tabs.module.scss";

type TComponent = React.ReactElement<TabContent>;

interface ITabsProps {
  children: (TComponent | boolean)[];
  selectedIndex?: number;
  layoutSize?: "small" | "large";
  layoutOrnament?: boolean;
  layoutPosition?: "left" | "center" | "right";
  "data-test-id"?: string;
}

interface ITabContent {
  routerPath?: string;
  tab: TTranslatedString;
}

export class TabContent extends React.Component<ITabContent> {
  public tab = this.props.tab;
  public routerPath = this.props.routerPath;

  render ():React.ReactNode {
    return (
      <div>{this.props.children}</div>
    )
  }
}

export class Tabs extends React.Component<ITabsProps & CommonHtmlProps> {
  state = {
    activeIndex: this.props.selectedIndex || 0,
  }

  displayName = 'Tabs';

  static defaultProps = {
    layoutSize: "small",
    layoutOrnament: true,
    layoutPosition: "left"
  }

  private handleClick = (index: number) => {
    this.setState({ activeIndex: index });
  }

  private renderTab = (
    index: number,
    tabContent: TComponent
  ) => {
    const {
      layoutSize,
      layoutOrnament,
      "data-test-id": dataTestId,
    } = this.props;

    const isActive = index === this.state.activeIndex ? "is-active" : "";
    const hasOrnament = layoutOrnament ? "has-ornament" : "";
    const commonProps = {
      className: cn(styles.tab, layoutSize, hasOrnament, isActive),
      onClick: () => this.handleClick(index),
      "data-test-id": dataTestId,
    }

    if (!tabContent) {
      return;
    }

    return (
      tabContent && tabContent.props.routerPath
        ? (
          <NavLinkConnected
            to={{ pathname: tabContent.props.routerPath, search: window.location.search }}
            key={tabContent.props.routerPath}
            {...commonProps}
          >
            {tabContent.props.tab}
          </NavLinkConnected>
        ) : (
          <div
            {...commonProps}
            key={index}
          >
            {tabContent.props.tab}
          </div>
        )
    )
  }

  render ():React.ReactNode {
    const {children, layoutSize, layoutPosition, className } = this.props;
    const { activeIndex } = this.state;

    return (
      <div>
        <div className={cn(styles.tabsWrapper, layoutSize, className)}>
          <div className={cn(styles.tabsOverflowWrapper, layoutPosition)}>
            {
              (children).map((child, index) => {
                return typeof child !== "boolean" && this.renderTab(index, child)
              })
            }
          </div>
        </div>
        {  children[activeIndex] }
      </div>
    )
  }
}
