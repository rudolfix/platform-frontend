import * as React from 'react';

import { TTranslatedString } from '../../types';
import * as styles from './NewTable.module.scss'
import { Panel } from './Panel';

interface INewTableHeader {
  titles: TTranslatedString[];
}


export const NewTable:React.SFC<INewTableHeader> = ({titles}) => {
  return (
    <Panel>
      <table>
        <thead>
          <tr>
            {titles.map((title, index) => <th key={index}>{title}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>asdfasdfasdfasf</th>
            <th>asdfasdfasdfasfasdfasdfasdfasfasdfasdfasdfasf</th>
            <th>asdfasdfasdfasf</th>
            <th>asdfasdfasdfasf</th>
          </tr>
        </tbody>
      </table>
    </Panel>
  )
}
