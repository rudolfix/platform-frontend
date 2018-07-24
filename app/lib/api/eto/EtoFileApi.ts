import { injectable } from "inversify";

import { TGeneralEtoData, TPartialCompanyEtoData, TPartialEtoSpecData } from "./EtoApi.interfaces";
import { getSampleEtoFiles } from "./fixtures";

@injectable()
export class EtoFileApi {
  constructor() {}
  private etoFiles = getSampleEtoFiles();

  public async getFileEtoData(): Promise<object> {
    return Promise.resolve(this.etoFiles);
  }
}
