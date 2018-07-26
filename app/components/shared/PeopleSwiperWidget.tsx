import * as cn from "classnames";
import * as React from "react";
import Swiper from "react-id-swiper/lib/custom";

import { ButtonIcon } from "./Buttons";
import { SlidePerson, TSlidePersonLayout } from "./SlidePerson";

import * as prevIcon from "../../assets/img/inline_icons/arrow_left.svg";
import * as nextIcon from "../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./PeopleSwiperWidget.module.scss";

interface IPerson {
  name: string;
  image: string;
  description: string;
  layout?: TSlidePersonLayout;
  role?: string;
}

interface IProps {
  people: IPerson[];
  navigation?: {
    nextEl: string;
    prevEl: string;
  };
  [key: string]: any;
}

export class PeopleSwiperWidget extends React.Component<IProps> {
  swiper: any = null;

  swiperRef = (ref: any) => {
    this.swiper = ref.swiper;
  };

  goNext = () => {
    if (this.swiper) {
      this.swiper.slideNext();
    }
  };

  goPrev = () => {
    if (this.swiper) {
      this.swiper.slidePrev();
    }
  };

  componentDidMount(): void {
    const numberOfSlides = this.props.people.length;

    if (numberOfSlides % 2) {
      this.swiper.slideTo(Math.round(numberOfSlides / 2) - 1);
    }
  }

  render(): React.ReactNode {
    const { people, navigation, layout, ...config } = this.props;

    return (
      <div className={styles.swiperWidget}>
        <Swiper {...config} ref={this.swiperRef}>
          {people.map(({ image, name, description, role }, i) => (
            <div key={i}>
              <SlidePerson
                role={role}
                description={description}
                name={name}
                srcSet={{ "1x": image }}
                layout={layout}
              />
            </div>
          ))}
        </Swiper>
        {navigation && (
          <>
            <ButtonIcon
              svgIcon={prevIcon}
              className={cn(styles.prev, navigation.prevEl)}
              onClick={this.goPrev}
            />
            <ButtonIcon
              svgIcon={nextIcon}
              className={cn(styles.next, navigation.nextEl)}
              onClick={this.goNext}
            />
          </>
        )}
      </div>
    );
  }
}
