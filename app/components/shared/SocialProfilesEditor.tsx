import * as cn from "classnames";
import * as React from "react";

import { Input } from "reactstrap";
import { InlineIcon } from "./InlineIcon";

import { Link } from "react-router-dom";
import * as linkIcon from "../../assets/img/inline_icons/social_link.svg";
import * as styles from "./SocialProfilesEditor.module.scss";

export interface ISocialProfile {
  name: string;
  svgIcon: string;
  url?: string;
  label?: string;
}

interface IProps {
  profiles: ISocialProfile[];
}

export class SocialProfilesEditor extends React.Component<IProps> {
  private toggleProfileVisibility(): void {
    return;
  }

  render(): React.ReactNode {
    const { profiles } = this.props;

    return (
      <div className={styles.socialProfilesEditor}>
        <div className={styles.tabs}>
          {profiles.map(({ url, name, svgIcon }) => (
            <div
              onClick={this.toggleProfileVisibility}
              className={cn(Boolean(url) && "is-selected", styles.tab)}
              key={name}
            >
              <InlineIcon svgIcon={svgIcon} />
            </div>
          ))}
        </div>
        {profiles.map(({ name, label, url }) => (
          <div className={cn(Boolean(url) && "is-visible", styles.inputWrapper)}>
            <Input
              name={`socialProfile${name}`}
              placeholder={label || `${name} profile`}
              value={url || ""}
            />
            <Link to={url || "#0"} className={styles.linkWrapper} target="_blank">
              <InlineIcon svgIcon={linkIcon} />
            </Link>
          </div>
        ))}
      </div>
    );
  }
}
