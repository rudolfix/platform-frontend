import * as cn from "classnames";
import * as React from "react";
import { Link } from "react-router-dom";

import { Input } from "reactstrap";
import { InlineIcon } from "./InlineIcon";

import * as linkIcon from "../../assets/img/inline_icons/social_link.svg";
import * as styles from "./SocialProfilesEditor.module.scss";

export interface ISocialProfile {
  name: string;
  svgIcon: string;
  url?: string;
  label?: string;
}

interface IProps {
  className?: string;
  profiles: ISocialProfile[];
}

export class SocialProfilesEditor extends React.Component<IProps> {
  private toggleProfileVisibility(): void {
    return;
  }

  render(): React.ReactNode {
    const { profiles, className } = this.props;

    return (
      <div className={cn(styles.socialProfilesEditor, className)}>
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
          <div className={cn(Boolean(url) && "is-visible", styles.inputWrapper)} key={name}>
            <Input
              name={`socialProfile${name}`}
              placeholder={label || `${name} profile`}
              value={url || ""}
            />
            {
              url && <a href={url || "#0"} className={styles.linkWrapper} target="_blank">
                <InlineIcon svgIcon={linkIcon} />
              </a>
            }
          </div>
        ))}
      </div>
    );
  }
}
