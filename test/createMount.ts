import { mount, ReactWrapper } from "enzyme";
import { ReactElement } from "react";

const mountedComponents: ReactWrapper[] = [];

export function createMount(node: ReactElement<{}>): ReactWrapper<any, any> {
  const mountedComponent = mount(node);
  mountedComponents.push(mountedComponent);

  return mountedComponent;
}

export function autoUnmountEnzymeComponentsHook(): void {
  mountedComponents.forEach(c => c.unmount());
  mountedComponents.length = 0;
}
