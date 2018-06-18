import * as React from "react";
import { ReactNode } from "react-redux";

interface IProps {
  condition: (y: number) => boolean;
  children: (visible: boolean) => ReactNode;
}

interface IState {
  isInTarget: boolean;
}

export class ScrollSpy extends React.Component<IProps, IState> {
  state: IState = {
    isInTarget: false,
  };

  render(): React.ReactNode {
    return this.props.children(this.state.isInTarget);
  }

  componentDidMount(): void {
    window.addEventListener("scroll", this.scrollSpy);
  }

  componentWillUnmount(): void {
    window.removeEventListener("scroll", this.scrollSpy);
  }

  private scrollSpy = () => {
    const result = this.props.condition(window.scrollY);

    if (result !== this.state.isInTarget) {
      this.setState({
        isInTarget: result,
      });
    }
  };
}
