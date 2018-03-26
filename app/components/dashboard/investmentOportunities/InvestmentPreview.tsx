import * as React from 'react';
import { Button } from '../../shared/Buttons';
import { ITag, Tag } from '../../shared/Tag';

interface IPreFoundingStatus {
  money: string;
  investorsNum: number;
  leadInvestors: string[];
}

interface INeufundTerms {
  goal: number;
  currentValuation: number;
}

interface IEtoStatus {

}

interface IProps {
  company: string;
  tags: ITag[];
  terms: INeufundTerms;
  // etoStatus: IEtoStatus;
  detailsLink: string;
  preFoundingStatus: IPreFoundingStatus;
}

export const InvestmentPreview: React.SFC<IProps> = ({ company, tags, terms }) => {
  return (
    <article>
      <div>
        {
          tags.map(tag => <Tag {...tag}/>)
        }
      </div>
      <div></div>
      <div></div>
      <Button layout="secondary">Details</Button>
    </article>
  )
}
