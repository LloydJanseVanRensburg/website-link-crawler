const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');
const fs = require('fs');

const websiteURL = 'https://www.mr-amsterdam.com/';
const targetDomain = 'www.mobypark.com';
const visitedPages = new Set();
const nonPageExtensions = /\.(pdf|jpg|jpeg|png|gif|doc|xls|ppt)$/i;
const specificWords = ['mobypark'];

async function scrapeWebsite(url) {
    try {
        if (!visitedPages.has(url)) {
            console.log(`Page link: ${url}`);
            visitedPages.add(url);

            const response = await axios.get(url);

            const $ = cheerio.load(response.data);

            const links = [];

            $('a').each((index, element) => {
                const href = $(element).attr('href');
                if (href) {
                    const absoluteURL = new URL(href, url).toString();

                    if (!nonPageExtensions.test(new URL(absoluteURL).pathname)) {
                        links.push(absoluteURL);
                    }
                }
            });

            const targetDomainLinks = links.filter(link => {
                const hostname = new URL(link).hostname;
                const hasSpecificWord = specificWords.some(word => link.includes(word));
                return hostname === targetDomain || hasSpecificWord;
            });

            if(targetDomainLinks.length > 0) {
                fs.appendFileSync('output_links.txt', `PAGE_LINK: ${url}` + '\n');
                fs.appendFileSync('output_links.txt', `====================================================` + '\n');
                fs.appendFileSync('output_links.txt', targetDomainLinks.join('\n') + '\n');
                fs.appendFileSync('output_links.txt', `====================================================` + '\n');
            }

            // Recursively scrape links on the current page.
            for (const link of links) {
                if (new URL(link).hostname === new URL(websiteURL).hostname) {
                    await scrapeWebsite(link);
                }
            }
        }
    } catch (error) {
        console.error(`Error while scraping ${url}:`);
    }
}

// Start the web scraping by visiting the initial URL.
scrapeWebsite(websiteURL);
