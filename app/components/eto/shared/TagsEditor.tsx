import * as React from "react";

import { Input } from "reactstrap";
import { Button } from "../../shared/Buttons";
import { Tag } from "../../shared/Tag";

import * as checkIcon from "../../../assets/img/inline_icons/check.svg";
import * as plusIcon from "../../../assets/img/inline_icons/plus_bare.svg";
import * as styles from "./TagsEditor.module.scss";



interface IProps {
  selectedTagsLimit: number;
  selectedTags: string[];
  availiableTags: string[];
}




interface IState {
  selectedTags: string[];
  tags: string[];
}




export class TagsEditor extends React.Component<IProps, IState> {
  state = {
    selectedTags: this.props.selectedTags,
    tags: this.props.availiableTags
  };

  inputRef: HTMLInputElement | null = null;
  tabComponentClassName = '.js-tab-component';


  componentDidMount(): void {
    const { selectedTags, availiableTags } = this.props;

    if (!Boolean(selectedTags.length)) {
      return;
    }

    const tags = availiableTags.filter(avaliableTag => !selectedTags.includes(avaliableTag));
    this.setState({ tags })
  }


  private createTag(): void {
    const { tags, selectedTags } = this.state;
    const tag: string = this.inputRef!.value.trim().replace(/\s\s+/g, ' ') || '';
    const tagExist: boolean = tags.includes(tag) || selectedTags.includes(tag);
    const isTooShort: boolean = tag.length < 1;

    if (tagExist || isTooShort) {
      return;
    }

    this.setState({ tags: [tag, ...tags] })
    this.inputRef!.value = '';
  }


  private selectTag(e: { target: HTMLElement }): void {
    const { selectedTagsLimit } = this.props;
    const { tags, selectedTags } = this.state;
    const tagElement: any = e.target.closest(this.tabComponentClassName);
    const tag: string = tagElement!.innerText;
    const isLimitReached: boolean = selectedTags.length === selectedTagsLimit;


    if (isLimitReached) {
      return;
    }

    this.setState({
      selectedTags: [tag, ...selectedTags],
      tags: tags.filter(filteredTag => filteredTag !== tag)
    })
  }


  private deselectTag(e: { target: HTMLElement }): void {
    const { tags, selectedTags } = this.state;
    const tagElement: any = e.target.closest(this.tabComponentClassName);
    const tag: string = tagElement!.innerText;

    this.setState({
      selectedTags: selectedTags.filter(filteredTag => filteredTag !== tag),
      tags: [tag, ...tags]
    })
  }


  private handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    this.createTag()
  }

  render(): React.ReactNode {
    const { tags, selectedTags } = this.state;

    return (
      <div className={styles.tagsEditor}>
        <form
          className={styles.form}
          onSubmit={e => this.handleSubmit(e)}>
          <Input
            placeholder="Add category"
            innerRef={input => this.inputRef = input} />
          <Button type="submit">Add</Button>
        </form>
        {
          Boolean(selectedTags.length) && (
            <div className={styles.selectedTags}>
              {
                selectedTags.map(tag => (
                  <Tag
                    onClick={e => this.deselectTag(e)}
                    text={tag}
                    svgIcon={checkIcon}
                    size="small"
                    theme="dark"
                    key={tag} />
                ))
              }
            </div>
          )
        }
        {
          Boolean(tags.length) && (
            <div>
              {
                tags.map(tag => (
                  <Tag
                    onClick={e => this.selectTag(e)}
                    size="small"
                    svgIcon={plusIcon}
                    text={tag}
                    key={tag} />
                ))
              }
            </div>
          )
        }
      </div>
    );
  }
}
