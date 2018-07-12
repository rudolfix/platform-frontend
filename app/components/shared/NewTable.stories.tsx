import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { NewTable } from './NewTable';

const titles = ["Token", "Balance", "Value EUR", "Price EUR", "nEUR Reward", "ETO Status"];

storiesOf('NewTable', module)
  .add('default', () => (<NewTable titles={titles} />))
