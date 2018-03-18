import * as React from 'react';
import * as styles from './Accordion.module.scss';
import { InlineIcon } from './InlineIcon';

interface IAccordionElementProps {
  title: string;
  children: any;
}

interface IAccordionElementState {
  isOpened: boolean
}

export class AccordionElement extends React.Component<IAccordionElementProps, IAccordionElementState> {

  state = {
    isOpened: false
  }

  toggleClose = () => {
    this.setState(({ isOpened: !this.state.isOpened }))
  }

  render(): React.ReactChild {
    const { title, children } = this.props;
    const { isOpened } = this.state;

    return (
      <div className={styles.accordionElement}>
        <h4 className={`${styles.accordionElement} ${isOpened ? 'is-opened' : ''}`} onClick={this.toggleClose}>
          <span>{title}</span>
          <InlineIcon svgIcon={''} />
        </h4>
        <div>{children}</div>
      </div>
    )
  }
}


export const Accordion: React.SFC = ({ children }) => (
  <div>
    {children}
  </div>
)