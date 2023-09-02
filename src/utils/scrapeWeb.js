import axios from "axios";
import * as cheerio from "cheerio";
import { URL } from "url";
import fs from "fs";

const visitedPages = new Set();
const nonPageExtensions = /\.(pdf|jpg|jpeg|png|gif|doc|xls|ppt)$/i;

async function scrapeWebsite(url, targetDomain, specificWords) {
  try {
    if (!visitedPages.has(url)) {
      console.log(`Page link: ${url}`);
      visitedPages.add(url);

      const response = await axios.get(url);

      const $ = cheerio.load(response.data);

      const links = [];

      $("a").each((index, element) => {
        const href = $(element).attr("href");
        if (href) {
          const absoluteURL = new URL(href, url).toString();

          if (!nonPageExtensions.test(new URL(absoluteURL).pathname)) {
            links.push(absoluteURL);
          }
        }
      });

      const targetDomainLinks = links.filter((link) => {
        const hostname = new URL(link).hostname;
        const hasSpecificWord = specificWords.some((word) =>
          link.includes(word),
        );
        return hostname === targetDomain || hasSpecificWord;
      });

      if (targetDomainLinks.length > 0) {
        // add to Excel sheet
      }

      for (const link of links) {
        if (new URL(link).hostname === new URL(url).hostname) {
          await scrapeWebsite(link, targetDomain, specificWords);
        }
      }
    }
  } catch (error) {
    console.error(`Error while scraping ${url}:`);
  }
}

export default scrapeWebsite;
