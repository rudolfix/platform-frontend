import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { Document } from './Document';

storiesOf('Document', module)
  .add('doc', () => (<Document extension="doc" />))
  .add('pdf', () => (<Document extension="pdf" />))
