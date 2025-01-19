import { Configuration } from "../../configuration/configuration.ts";

export enum ExpectedPriceDistribution {
  Equal = "Equal",
  Normal = "Normal",
}

export type ExpectedPriceDistributionType = `${ExpectedPriceDistribution}`;

/**
 * Function interface that returns the expected size of a pricing window containing a maximum of 1000 products.
 * Returns smaller windows for successive retries.
 * Implementation may differ for different expected product price distributions.
 * Position is the current left bound of the pricing window.
 * Retries is the number of times the returned window contained too many products (> 1000)
 */
export type PriceWindowSizeCalculator = (
  totalProductCount: number,
  position: number,
  retries?: number
) => number;

const EqualDistributionWindowSizeCalculator: PriceWindowSizeCalculator = (
  totalProductCount,
  position,
  retries = 0
) => {
  const density =
    totalProductCount /
    (Configuration.PRODUCT_MAX_PRICE - Configuration.PRODUCT_MIN_PRICE);
  return (
    (Configuration.MAX_PRODUCTS_RETURNED_PER_REQUEST / density) *
    0.95 *
    Math.pow(Configuration.RETRY_COEFICIENT, retries)
  );
};

const NormalDistributionWindowSizeCalculator: PriceWindowSizeCalculator = (
  totalProductCount,
  position,
  retries = 0
) => {
  throw new Error("Not implemented.");
};

export const WindowSizeCalculatorByDistributionType: Record<
  ExpectedPriceDistributionType,
  PriceWindowSizeCalculator
> = {
  [ExpectedPriceDistribution.Equal]: EqualDistributionWindowSizeCalculator,
  [ExpectedPriceDistribution.Normal]: NormalDistributionWindowSizeCalculator,
};
