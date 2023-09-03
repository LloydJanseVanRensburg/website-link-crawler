import axios from "axios";
import * as cheerio from "cheerio";
import { URL } from "url";
import createWorksheet from "./createWorksheet.js";
import { appendToWorkbook } from "./createWorkbook.js";
import checkLinkStatus from "./checkLinkStatus.js";

const visitedPages = new Set();
const nonPageExtensions = /\.(pdf|jpg|jpeg|png|gif|doc|xls|ppt)$/i;

async function scrapeWebsite(url, targetDomain, specificWords, workbook) {
  try {
    if (!visitedPages.has(url)) {
      visitedPages.add(url);

      const response = await axios.get(url);

      const $ = cheerio.load(response.data);
      const pageTitle = $("title").text();
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
        let checkedLinks = [];

        for (const link of targetDomainLinks) {
          const linkStatus = await checkLinkStatus(link);
          const statusText = linkStatus ? "Good" : "Broken";
          checkedLinks.push({
            url: link,
            status: statusText,
          });
        }

        const worksheet = createWorksheet(checkedLinks, url);
        appendToWorkbook(workbook, worksheet);
      }

      for (const link of links) {
        if (new URL(link).hostname === new URL(url).hostname) {
          await scrapeWebsite(link, targetDomain, specificWords, workbook);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export default scrapeWebsite;
