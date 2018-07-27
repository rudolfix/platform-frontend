import { injectable } from "inversify";

import { TGeneralEtoData, TPartialCompanyEtoData, TPartialEtoSpecData } from "./EtoApi.interfaces";
import { IEtoFiles, TEtoUploadFile } from "./EtoFileApi.interfaces";
import { getSampleEtoFiles } from "./fixtures";

@injectable()
export class EtoFileApi {
  constructor() {}
  private etoFiles = getSampleEtoFiles();

  public async getFileEtoData(): Promise<IEtoFiles> {
    return Promise.resolve(this.etoFiles);
  }

  public async putFileEtoData(file: File, name: TEtoUploadFile): Promise<IEtoFiles> {
    this.etoFiles.uploadedDocuments[name].url = "IPFS url";
    this.etoFiles.uploadedDocuments[name].file = file;
    return Promise.resolve(this.etoFiles);
  }
}
