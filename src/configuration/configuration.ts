export class Configuration {
  static readonly ecommerceApiBaseUrl = process.env
    .ECOMMERCE_API_BASE_URL as string;
  static readonly ecommerceProductMaxPrice = parseInt(
    process.env.PRODUCT_MAX_PRICE ?? ""
  );
  static readonly ecommerceProductMinPrice = parseInt(
    process.env.PRODUCT_MIN_PRICE ?? ""
  );
  static readonly ecommerceMaxProductsReturned = parseInt(
    process.env.MAX_PRODUCTS_RETURNED ?? ""
  );
  static readonly retryCoeficient = parseInt(
    process.env.RETRY_COEFICIENT ?? ""
  );

  static validateConfiguration() {
    const uninitializedValues = Object.keys(this).filter(
      (key) => this[key] === undefined || isNaN(this[key])
    );

    if (uninitializedValues.length > 0) {
      throw new Error(
        `Missing configuration values: ${uninitializedValues.join(", ")}.`
      );
    }

    console.log("Validated configuration.");
  }
}
