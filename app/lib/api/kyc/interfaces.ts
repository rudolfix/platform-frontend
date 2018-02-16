export interface IApiKycService {
  getKycState: () => Promise<string>;

  submitPersonalData: (data: IKycPersonalData) => Promise<{}>;
  startPersonalInstantId: () => Promise<{}>;
  submitManualVerificationData: (data: IKycManualVerificationData) => Promise<{}>;

  submitCompanyData: (data: IKycCompanyData) => Promise<{}>;
}

export interface IKycCompanyData {
  companyName?: string;
  placeOfIncorporation?: string;
  managingDirector?: string;

  street?: string;
  postalCode?: string;
  city?: string;
  country?: string;
}

export interface IKycPersonalData {
  firstName?: string;
  secondName?: string;
  birthDate?: string;
  placeOfBirth?: string;
}

export interface IKycManualVerificationData {
  street?: string;
  postalCode?: string;
  city?: string;
  country?: string;
}
