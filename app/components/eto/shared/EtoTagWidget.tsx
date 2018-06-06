import * as cn from "classnames";
import * as React from "react";
import { Creatable } from "react-select";
import Select from "react-virtualized-select";
import { Col, Input } from "reactstrap";

import { Tag } from "../../shared/Tag";

import { Field, FieldProps, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as checkIcon from "../../../assets/img/inline_icons/close_no_border.svg";
import * as styles from "./EtoTagWidget.module.scss";

interface IProps {
  name: string;
  selectedTagsLimit: number;
  options: { value: string; label: string }[];
}

interface IInternalProps {
  values: string[];
  onChange: (e: any) => any;
  handleSelectedTagClick: (tag: string) => void;
  disabled: boolean;
}

const TagsFormEditor: React.SFC<IProps & IInternalProps> = props => (
  <div>
    <Select
      disabled={props.disabled}
      options={props.options}
      clearable={false}
      matchPos="start"
      matchProp="value"
      simpleValue
      selectComponent={Creatable}
      onChange={e => props.onChange(e)}
      placeholder={"Add category"}
      noResultsText="No matching word"
      className={cn("mb-3", styles.tagsForm)}
    />
    {!!props.values && (
      <div>
        {props.values.map(tag => (
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

export class EtoTagWidget extends React.Component<IProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render(): React.ReactNode {
    const { name, selectedTagsLimit } = this.props;
    const { setFieldValue, values } = this.context.formik as FormikProps<any>;
    return (
      <Field
        name={name}
        render={({ field }: FieldProps) => (
          <TagsFormEditor
            {...this.props}
            {...field}
            onChange={(e: string) =>
              !values[name].some((tag: string) => tag === e) &&
              setFieldValue(name, [...values[name], e])
            }
            handleSelectedTagClick={(selectedTag: string) => {
              const newValues = values[name].filter((tag: string) => tag !== selectedTag);
              return setFieldValue(name, newValues);
            }}
            disabled={values[name].length === selectedTagsLimit}
            values={values[name]}
          />
        )}
      />
    );
  }
}
