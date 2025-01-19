import { Configuration } from "../../configuration/configuration.ts";
import { EcommerceApiClient } from "../ecommerce-api/client.ts";
import type { Product } from "../ecommerce-api/models.ts";
import {
  ExpectedPriceDistribution,
  WindowSizeCalculatorByDistributionType,
} from "./utils.ts";

export class EcommerceScrapper {
  private readonly _apiClient = new EcommerceApiClient();

  private async getTotalProductCount() {
    const response = await this._apiClient.getProducts({
      minPrice: Configuration.PRODUCT_MIN_PRICE,
      maxPrice: Configuration.PRODUCT_MAX_PRICE,
    });
    return response.total;
  }

  public async scrapeProducts(priceDistribution: ExpectedPriceDistribution) {
    // Get total product count from api (equal to total for maximum price range).
    const totalProductCount = await this.getTotalProductCount();

    // Get function to calculate expected price window for a 1000 products. See utils.ts.
    const calculatePriceWindowSize =
      WindowSizeCalculatorByDistributionType[priceDistribution];

    const products: Product[] = [];
    let leftPriceBound = 0;
    let retries = 0;

    while (
      leftPriceBound < Configuration.PRODUCT_MAX_PRICE &&
      products.length < totalProductCount
    ) {
      // Calculate right bound of the price window expected to return about a 1000 products.
      const rightPriceBound =
        leftPriceBound +
        calculatePriceWindowSize(totalProductCount, leftPriceBound, retries);

      // This is expected to fetch slightly less than a thousand products.
      const nextProductBatch = await this._apiClient.getProducts({
        minPrice: leftPriceBound,
        maxPrice: rightPriceBound,
      });

      // If too much products were fetched, discard and try again with a smaller window.
      if (
        nextProductBatch.total > Configuration.MAX_PRODUCTS_RETURNED_PER_REQUEST
      ) {
        retries++;
        continue;
      }

      // Shift the left bound past already fetched products.
      leftPriceBound = leftPriceBound + rightPriceBound;

      products.concat(nextProductBatch.products);
      console.log(
        `Succesfully scrapped ${products.length} out of ${totalProductCount}`
      );
    }

    return products;
  }
}
