import "dotenv/config";
import { Configuration } from "./configuration/configuration.ts";
import { EcommerceScrapper } from "./services/ecommerce-scrapper/scrapper.ts";
import { ExpectedPriceDistribution } from "./services/ecommerce-scrapper/utils.ts";

Configuration.validateConfiguration();

const scrapper = new EcommerceScrapper();
const products = await scrapper.scrapeProducts(ExpectedPriceDistribution.Equal);

console.log(
  `Finished scrapping. Scrapped a total of ${products.length} products.`
);
