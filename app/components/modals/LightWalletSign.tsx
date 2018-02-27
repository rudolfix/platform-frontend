import * as React from "react";
import { Button, Input } from "reactstrap";

interface IState {
  password: string;
}

interface IDispatchProps {
  onCancel: () => void;
  onAccept: (password?: string) => void;
}

export class LightWalletSignPrompt extends React.Component<IDispatchProps, IState> {
  constructor(props: IDispatchProps) {
    super(props);
    this.state = {
      password: "",
    };
  }

  private passwordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: e.target.value,
    });
  };

  render(): React.ReactNode {
    const { onAccept, onCancel } = this.props;

    return (
      <div>
        <p>Light wallet sign!</p>

        <Input
          placeholder="password"
          type="password"
          onChange={this.passwordChange}
          value={this.state.password}
        />

        <Button onClick={() => onAccept(this.state.password)}>Accept</Button>
        <Button onClick={onCancel}>Reject</Button>
      </div>
    );
  }
}
