import { injectable } from "inversify";
import { IApiKycService } from "./interfaces";

const simulateRequest = <T>(result: T): Promise<T> => {
  return new Promise(function(resolve): void {
    setTimeout(() => {
      resolve(result);
    }, 1000);
  });
};

@injectable()
export class ApiKycService implements IApiKycService {
  // function for mocking api requests
  getKycState(): Promise<string> {
    return simulateRequest("none");
  }

  submitCompanyData(): Promise<{}> {
    return simulateRequest({});
  }

  submitPersonalData(): Promise<{}> {
    return simulateRequest({});
  }

  startPersonalInstantId(): Promise<{}> {
    return simulateRequest({});
  }

  submitManualVerificationData(): Promise<{}> {
    return simulateRequest({});
  }
}
