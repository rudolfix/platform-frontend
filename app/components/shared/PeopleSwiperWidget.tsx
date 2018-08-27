import * as cn from "classnames";
import * as React from "react";
import Swiper from "react-id-swiper/lib/custom";

import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { TTranslatedString } from "../../types";
import { ButtonIcon } from "./Buttons";
import { ISrcSet } from "./ResponsiveImage";
import { SlidePerson, TSlidePersonLayout } from "./SlidePerson";
import { IEtoSocialProfile } from "./SocialProfilesList";

import * as prevIcon from "../../assets/img/inline_icons/arrow_left.svg";
import * as nextIcon from "../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./PeopleSwiperWidget.module.scss";
import { ISocialProfile } from "./SocialProfilesEditor";

export interface IPerson {
  name: string;
  image: string;
  description: string;
  layout?: TSlidePersonLayout;
  role: string;
  socialChannels: IEtoSocialProfile[];
  website: string;
}

interface IProps {
  people: IPerson[];
  navigation?: {
    nextEl: string;
    prevEl: string;
  };
  [key: string]: any;
}

interface IDispatchProps {
  showPersonModal: (
    name: TTranslatedString,
    role: TTranslatedString,
    description: TTranslatedString,
    image: ISrcSet,
    socialChannels: ISocialProfile[],
    website: string,
  ) => void;
}

class PeopleSwiperWidgetComponent extends React.Component<IProps & IDispatchProps> {
  swiper: any = null;

  swiperRef = (ref: any) => {
    if (ref) this.swiper = ref.swiper;
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

    if (numberOfSlides < 5 && numberOfSlides % 2) {
      this.swiper.slideTo(Math.round(numberOfSlides / 2) - 1);
    }
  }

  render(): React.ReactNode {
    const { people, navigation, layout, showPersonModal, ...config } = this.props;

    return (
      <div className={styles.swiperWidget}>
        <Swiper {...config} ref={this.swiperRef}>
          {people.map(({ image, name, description, role, socialChannels, website }, i) => {
            return (
              <div
                key={i}
                onClick={() =>
                  showPersonModal(name, role, description, image, socialChannels, website)
                }
              >
                <SlidePerson
                  socialChannels={socialChannels}
                  role={role}
                  name={name}
                  srcSet={{ "1x": image }}
                  layout={layout}
                />
              </div>
            );
          })}
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

export const PeopleSwiperWidget = appConnect<IDispatchProps>({
  dispatchToProps: dispatch => {
    return {
      showPersonModal: (
        name: TTranslatedString,
        role: TTranslatedString,
        description: TTranslatedString,
        image: string,
        socialChannels: ISocialProfile[],
        website: string,
      ) =>
        dispatch(
          actions.personProfileModal.showPersonProfileModal(
            name,
            role,
            description,
            image,
            socialChannels,
            website,
          ),
        ),
    };
  },
})(PeopleSwiperWidgetComponent);
