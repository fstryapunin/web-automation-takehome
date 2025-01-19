import { ProductRequest, ProductResponse } from "./models";

export class EcommerceApiClient {
  private readonly _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  // This method should be moved to a base class if multiple Api clients are used in the solution.
  private async request(url: string, requestInit?: RequestInit) {
    const response = await fetch(url, requestInit);

    if (!response.ok) {
      // Additional logging can be added here.
      throw new Error(`Failed to fetch products. Status: ${response.status}`);
    }

    return response;
  }

  public async getProducts(
    request: ProductRequest,
    requestInit?: RequestInit
  ): Promise<ProductResponse> {
    const requestUrl = new URL("/products", this._baseUrl);

    if (request.minPrice) {
      requestUrl.searchParams.append("minPrice", request.minPrice.toString());
    }

    if (request.maxPrice) {
      requestUrl.searchParams.append("maxPrice", request.maxPrice.toString());
    }

    const response = await fetch(requestUrl, requestInit);

    return await response.json();
  }
}
