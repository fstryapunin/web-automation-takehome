import "dotenv/config";
import { EcommerceScrapper } from "./services/ecommerce-scrapper/scrapper.ts";
import { ExpectedPriceDistribution } from "./services/ecommerce-scrapper/utils.ts";

const scrapper = new EcommerceScrapper();
const products = await scrapper.scrapeProducts(ExpectedPriceDistribution.Equal);

console.log(
  `Finished scrapping. Scrapped a total of ${products.length} products.`
);
