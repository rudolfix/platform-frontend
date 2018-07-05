import * as cn from "classnames";
import * as React from 'react';
import Swiper from 'react-id-swiper/lib/custom';
import { ButtonIcon } from './Buttons';

import * as prevIcon from "../../assets/img/inline_icons/arrow_left.svg";
import * as nextIcon from "../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./SwiperWidget.module.scss";

interface IProps {
  slides: React.ReactNode[];
  navigation?: {
    nextEl: string;
    prevEl: string;
  };
  [key: string]: any;
}

export class SwiperWidget extends React.Component<IProps> {
  swiper: any = null;

  private goNext(): void {
    if (this.swiper) {
      this.swiper!.slideNext();
    }
  }

  private goPrev(): void {
    if (this.swiper) {
      this.swiper!.slidePrev();
    }
  }

  render(): React.ReactNode {
    const { slides, navigation, ...config } = this.props;

    return (
      <div className={styles.swiperWidget}>
        <Swiper {...config} ref={(node: any) => node && (this.swiper = node.swiper)}>
          {
            slides.map((slide, i) => <div key={i}>{slide}</div>)
          }
        </Swiper>
        {navigation && (<>
          <ButtonIcon
            svgIcon={prevIcon}
            className={cn(styles.prev, navigation!.prevEl)}
            onClick={this.goPrev}
          />
          <ButtonIcon
            svgIcon={(nextIcon)}
            className={cn(styles.next, navigation!.nextEl)}
            onClick={this.goNext}
          />
        </>)}
      </div>
    )
  }
}
