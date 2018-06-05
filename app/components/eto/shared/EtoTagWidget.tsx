import * as cn from "classnames";
import { includes } from "lodash";
import * as React from "react";
import { Creatable } from "react-select";
import Select from "react-virtualized-select";
import { Col, Input } from "reactstrap";

import { Tag } from "../../shared/Tag";

import * as checkIcon from "../../../assets/img/inline_icons/close_no_border.svg";
import * as styles from "./EtoTagWidget.module.scss";

interface IPropsWrapper {
  selectedTagsLimit: number;
  options: { value: string; label: string }[];
  selectedTags?: string[];
}

interface IProps {
  disabled: boolean;
  handleAddition: (tag: string) => void;
  handleSelectedTagClick: (tag: string) => void;
  selectedTags: string[];
  options: { value: string; label: string }[];
}

interface IStateWrapper {
  selectedTags: string[];
}

const TagsFormEditor: React.SFC<IProps> = props => {
  return (
    <div>
      <Select
        disabled={props.disabled}
        options={props.options}
        simpleValue
        clearable={false}
        matchPos="start"
        matchProp="value"
        selectComponent={Creatable}
        onChange={e => props.handleAddition(e as any)}
        placeholder={"Add category"}
        noResultsText="No matching word"
        className={cn("mb-3", styles.tagsForm)}
      />
      {!!props.selectedTags.length && (
        <div>
          {props.selectedTags.map(tag => (
            <Tag
              onClick={() => props.handleSelectedTagClick(tag)}
              text={tag}
              className={cn(styles.tag, "ml-1")}
              svgIcon={checkIcon}
              size="small"
              key={tag}
              end
            />
          ))}
        </div>
      )}
    </div>
  );
};

export class EtoTagWidget extends React.Component<IPropsWrapper, IStateWrapper> {
  state = {
    selectedTags: this.props.selectedTags || [],
  };

  createTag = (tag: string) => {
    const { selectedTags } = this.state;
    const tagExist = includes(selectedTags, tag);

    if (tagExist) {
      return;
    }
    this.setState({ selectedTags: [tag, ...selectedTags] });
  };

  handleTagDeselection = (tag: string) => {
    const { selectedTags } = this.state;

    this.setState({
      selectedTags: selectedTags.filter(filteredTag => filteredTag !== tag),
    });
  };

  render(): React.ReactNode {
    return (
      <TagsFormEditor
        disabled={this.state.selectedTags.length === this.props.selectedTagsLimit}
        selectedTags={this.state.selectedTags}
        handleAddition={this.createTag}
        handleSelectedTagClick={this.handleTagDeselection}
        options={this.props.options}
      />
    );
  }
}
