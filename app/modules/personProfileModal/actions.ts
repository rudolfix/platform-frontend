import { ISocialProfile } from "../../components/shared/SocialProfilesEditor";
import { TTranslatedString } from "../../types";
import { createAction, createSimpleAction } from "../actionsUtils";

export const personProfileModalActions = {
  showPersonProfileModal: (
    name: TTranslatedString,
    role: TTranslatedString,
    description: TTranslatedString,
    image: string,
    socialChannels: ISocialProfile[],
    website: string,
  ) =>
    createAction("PERSON_PROFILE_MODAL_SHOW", {
      name,
      role,
      description,
      socialChannels,
      image,
      website,
    }),

  hidePersonProfileModal: () => createSimpleAction("PERSON_PROFILE_MODAL_HIDE"),
};
