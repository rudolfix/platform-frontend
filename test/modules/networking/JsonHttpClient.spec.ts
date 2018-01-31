import { expect } from "chai";
import * as fetchMock from "fetch-mock";
import * as Yup from "yup";

import {
  JsonHttpClient,
  NetworkingError,
  ResponseParsingError,
  ResponseStatusError,
} from "../../../app/modules/networking/JsonHttpClient";
import { expectToBeRejected } from "../../testUtils";
import { getSampleMalformedProducts, getSampleProducts, IProduct, productSchema } from "./fixtures";

describe("JsonHttpClient", () => {
  afterEach(() => {
    expect(fetchMock.done()).to.be.true;
    fetchMock.restore();
  });

  describe("get requests", () => {
    const API_URL = "https://some-api.com/";

    it("should make GET request and parse the response", async () => {
      const mockedResponse = getSampleProducts();
      fetchMock.once(`${API_URL}products`, {
        status: 200,
        body: mockedResponse,
      });

      const httpClient = new JsonHttpClient();
      const actualResponse = await httpClient.get<IProduct[]>({
        baseUrl: API_URL,
        url: "products",
        responseSchema: Yup.array()
          .required()
          .of(productSchema),
      });

      expect(actualResponse.statusCode).to.be.eq(200);
      expect(actualResponse.body).to.be.deep.eq(mockedResponse);
    });

    it("should work with query parameters", async () => {
      const mockedResponse = getSampleProducts();
      fetchMock.once(`${API_URL}products?some=param&some2=param2`, {
        status: 200,
        body: mockedResponse,
      });

      const httpClient = new JsonHttpClient();
      const actualResponse = await httpClient.get<Array<IProduct>>({
        baseUrl: API_URL,
        url: "products",
        queryParams: {
          some: "param",
          some2: "param2",
        },
        responseSchema: Yup.array()
          .required()
          .of(productSchema),
      });

      expect(actualResponse.statusCode).to.be.eq(200);
      expect(actualResponse.body).to.be.deep.eq(mockedResponse);
    });

    it("should throw an error on malformed response (missing fields)", async () => {
      const expectedResponse = getSampleMalformedProducts();
      fetchMock.mock(`${API_URL}products`, {
        status: 200,
        body: expectedResponse,
      });

      const httpClient = new JsonHttpClient();

      await expectToBeRejected(
        () =>
          httpClient.get<Array<IProduct>>({
            baseUrl: API_URL,
            url: "products",
            responseSchema: Yup.array()
              .required()
              .of(productSchema),
          }),
        new ResponseParsingError("[0].quantity is a required field"),
      );
    });

    it("should throw an error on malformed response (non json)", async () => {
      fetchMock.mock(`${API_URL}products`, {
        status: 200,
        body: "not a json",
        sendAsJson: false,
      });

      const httpClient = new JsonHttpClient();

      await expectToBeRejected(
        () =>
          httpClient.get<Array<IProduct>>({
            baseUrl: API_URL,
            url: "products",
            responseSchema: Yup.array()
              .required()
              .of(productSchema),
          }),
        new ResponseParsingError("Response is not a json"),
      );
    });

    it("should throw an error on non 20x response", async () => {
      const expectedErrorMessage = "error message";
      const expectedStatusCode = 500;
      fetchMock.mock(`${API_URL}products`, {
        status: expectedStatusCode,
        body: { errorMessage: expectedErrorMessage },
      });

      const httpClient = new JsonHttpClient();

      await expectToBeRejected(
        () =>
          httpClient.get<Array<IProduct>>({
            baseUrl: API_URL,
            url: "products",
            responseSchema: Yup.array()
              .required()
              .of(productSchema),
          }),
        new ResponseStatusError(500),
      );
    });

    it("should throw an error on networking problems", async () => {
      fetchMock.mock(`${API_URL}products`, {
        throws: new Error("test"),
      });

      const httpClient = new JsonHttpClient();

      await expectToBeRejected(
        () =>
          httpClient.get<Array<IProduct>>({
            baseUrl: API_URL,
            url: "products",
            responseSchema: Yup.array()
              .required()
              .of(productSchema),
          }),
        new NetworkingError(),
      );
    });
  });

  describe("post requests", () => {
    it("should make POST request");
  });
});
