# React guidelines

## Functional components:

* you should almost always prefer functional components only valid reason for having class style
  component is when you have internal state or heavily use life cycle methods
* if you need to do something while components shows up you can use `onEnterAction` HOC
* functional components should always be of a type `React.SFC<IProps>` not `()=>..`

## Class components:

* avoid constructors: \* use class field declarations to set initial state, bind functions etc

```javascript
class Component extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      value: 0,
    };
    this.onBack = this.onBack.bind(this);
  }

  onBack() {
    // do something with this
  }
}
```

becomes:

```javascript
class Component extends React.Component<IProps, IState> {
  private state = {
    value: 0,
  };

  private onBack = () => {
    // do something with this
  };
}
```

## Connected components

* use `appConnect<IStateProps, IDispatchProps, IOwnProps>`
* use separate interfaces for props from state, dispatch, own
