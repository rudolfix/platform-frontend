import { expect } from "chai";
import * as fetchMock from "fetch-mock";
import * as Yup from "yup";

import {
  JsonHttpClient,
  NetworkingError,
  ResponseParsingError,
  ResponseStatusError,
} from "../../../app/lib/api/JsonHttpClient";
import { expectToBeRejected } from "../../testUtils";
import { getSampleMalformedProducts, getSampleProducts, IProduct, productSchema } from "./fixtures";

describe("JsonHttpClient", () => {
  const API_URL = "https://some-api.com/";

  afterEach(() => {
    expect(fetchMock.done()).to.be.true;
    fetchMock.restore();
  });

  describe("get requests", () => {
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
      });

      expect(actualResponse.statusCode).to.be.eq(200);
      expect(actualResponse.body).to.be.deep.eq(mockedResponse);
    });

    it("should work without baseUrl param", async () => {
      const mockedResponse = getSampleProducts();
      fetchMock.once(`${API_URL}products`, {
        status: 200,
        body: mockedResponse,
      });

      const httpClient = new JsonHttpClient();
      const actualResponse = await httpClient.get<IProduct[]>({
        url: `${API_URL}products`,
        responseSchema: Yup.array()
          .required()
          .of(productSchema),
      });

      expect(actualResponse.statusCode).to.be.eq(200);
      expect(actualResponse.body).to.be.deep.eq(mockedResponse);
    });

    it("should work with custom headers", async () => {
      const customHeaders = {
        apiToken: "some dummy token",
      };
      const mockedResponse = getSampleProducts();
      const requestMatcher: fetchMock.MockMatcherFunction = (url, opts) => {
        if (url !== `${API_URL}products`) {
          return false;
        }
        if (opts.method !== "GET") {
          return false;
        }
        if ((opts as any).headers.apiToken !== customHeaders.apiToken) {
          return false;
        }
        return true;
      };
      fetchMock.once(requestMatcher, {
        status: 200,
        body: mockedResponse,
      });

      const httpClient = new JsonHttpClient();
      const actualResponse = await httpClient.get<IProduct[]>({
        url: `${API_URL}products`,
        headers: customHeaders,
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
    it("should make POST request", async () => {
      const body = {
        name: "productC",
        quantity: 1,
      };
      const mockedResponse = getSampleProducts();
      const requestMatcher: fetchMock.MockMatcherFunction = (url, opts) => {
        if (url !== `${API_URL}products`) {
          return false;
        }
        if (opts.method !== "POST") {
          return false;
        }
        if ((opts as any).body !== JSON.stringify(body)) {
          return false;
        }
        return true;
      };
      fetchMock.postOnce(requestMatcher, {
        status: 200,
        body: mockedResponse,
      });

      const httpClient = new JsonHttpClient();
      const actualResponse = await httpClient.post<IProduct[]>({
        baseUrl: API_URL,
        url: "products",
        body: body,
        responseSchema: Yup.array()
          .required()
          .of(productSchema),
      });

      expect(actualResponse.statusCode).to.be.eq(200);
      expect(actualResponse.body).to.be.deep.eq(mockedResponse);
    });
  });
});
