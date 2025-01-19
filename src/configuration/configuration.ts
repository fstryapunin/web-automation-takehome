export class Configuration {
  static readonly ecommerceApiBaseUrl = process.env.ECOMMERCE_API_BASE_URL;
  static validateConfiguration() {
    const uninitializedValues = Object.keys(this).filter(
      (key) => this[key] === undefined
    );

    if (uninitializedValues.length > 0) {
      throw new Error(
        `Missing configuration values: ${uninitializedValues.join(", ")}.`
      );
    }

    console.log("Validated configuration.");
  }
}
