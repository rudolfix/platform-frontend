import { includes } from "lodash";
import * as React from "react";
import { Creatable } from 'react-select'
import Select from "react-virtualized-select";
import { Col, Input } from "reactstrap";

import { Button } from "../../shared/Buttons";
import { Tag } from "../../shared/Tag";

import * as checkIcon from "../../../assets/img/inline_icons/close_no_border.svg";

interface IPropsWrapper {
  selectedTagsLimit: number;
  options: { value: string; label: string }[];
}

interface IProps {
  handleSubmit: any;
  handleSelectedTagClick: any;
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
        options={props.options}
        simpleValue
        clearable={false}
        matchPos="start"
        matchProp="value"
        selectComponent={Creatable}
        onChange={e => props.handleSubmit(e)}
        placeholder={"Add category"}
        noResultsText="No matching word"
        className="mb-3"
      />
      {!!props.selectedTags.length && (
        <div>
          {props.selectedTags.map((tag, index) => (
            <Tag
              onClick={() => props.handleSelectedTagClick(tag)}
              text={tag}
              className="w-25 ml-1"
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
    selectedTags: [],
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
        selectedTags={this.state.selectedTags}
        handleSubmit={this.createTag}
        handleSelectedTagClick={this.handleTagDeselection}
        options={this.props.options}
      />
    );
  }
}
