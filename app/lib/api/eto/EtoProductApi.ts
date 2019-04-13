import { inject, injectable } from "inversify";

import { symbols } from "../../../di/symbols";
import { IHttpClient } from "../client/IHttpClient";
import { TEtoProducts } from "./EtoProductsApi.interfaces";

const BASE_PATH = "/api/eto-listing/";
const PRODUCTS_PATH = "/products";
const ETO_PRODUCT_PATH = "/etos/me/product";

@injectable()
export class EtoProductApi {
  constructor(
    @inject(symbols.authorizedJsonHttpClient) private authorizedHttpClient: IHttpClient,
  ) {}

  public async getProducts(): Promise<TEtoProducts> {
    const productsResponse = await this.authorizedHttpClient.get<TEtoProducts>({
      baseUrl: BASE_PATH,
      url: PRODUCTS_PATH,
    });

    return productsResponse.body;
  }

  public async changeProductType(productId: string): Promise<TEtoProducts> {
    const productsResponse = await this.authorizedHttpClient.put<TEtoProducts>({
      baseUrl: BASE_PATH,
      url: ETO_PRODUCT_PATH,
      body: {
        productId,
      },
    });

    return productsResponse.body;
  }
}
