import { TEtoKeyIndividualType } from "@neufund/shared-modules";

export const areThereIndividuals = (
  individual: TEtoKeyIndividualType | undefined,
): individual is TEtoKeyIndividualType =>
  !!individual &&
  !!individual.members &&
  !!individual.members[0] &&
  // need to check whether name is not empty
  // due to the way key individuals form saved values in past
  individual.members[0].name.length > 0;
