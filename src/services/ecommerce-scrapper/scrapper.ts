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
    const totalProductCount = await this.getTotalProductCount();
    const calculatePriceWindowSize =
      WindowSizeCalculatorByDistributionType[priceDistribution];

    const products: Product[] = [];
    let leftPriceBound = 0;
    let retries = 0;

    while (
      leftPriceBound < Configuration.PRODUCT_MAX_PRICE &&
      products.length < totalProductCount
    ) {
      const rightPriceBound =
        leftPriceBound +
        calculatePriceWindowSize(totalProductCount, leftPriceBound, retries);

      const nextProductBatch = await this._apiClient.getProducts({
        minPrice: leftPriceBound,
        maxPrice: rightPriceBound,
      });

      if (
        nextProductBatch.total > Configuration.MAX_PRODUCTS_RETURNED_PER_REQUEST
      ) {
        retries++;
        continue;
      }

      leftPriceBound = leftPriceBound + rightPriceBound;
      products.concat(nextProductBatch.products);
      console.log(
        `Succesfully scrapped ${products.length} out of ${totalProductCount}`
      );
    }

    return products;
  }
}
