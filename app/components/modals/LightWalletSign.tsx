import * as React from "react";
import { Input } from "reactstrap";
import { Button } from "../shared/Buttons";

interface IState {
  password: string;
}

interface IStateProps {
  isUnlocked: boolean;
}

interface IOwnProps {
  onCancel: () => void;
  onAccept: (password?: string) => void;
}

type IProps = IStateProps & IOwnProps;

export class LightWalletSignPrompt extends React.Component<IProps, IState> {
  constructor(props: IProps) {
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
        {this.props.isUnlocked ? (
          <div />
        ) : (
          <div>
            <p>Please enter your password to unlock the wallet</p>
            <Input
              placeholder="password"
              type="password"
              onChange={this.passwordChange}
              value={this.state.password}
            />
          </div>
        )}
        <div className="mt-3">
          <Button onClick={() => onAccept(this.state.password)}>Accept</Button>
          <Button layout="secondary" onClick={onCancel}>
            Reject
          </Button>
        </div>
      </div>
    );
  }
}
