import path from "path";
import fileDirName from "../utils/dirname.js";
import scrapeWebsite from "../utils/scrapeWeb.js";

const { __dirname } = fileDirName(import.meta);

export async function getHomePage(req, res) {
  try {
    const homePagePath = path.join(
      __dirname,
      "..",
      "public",
      "html",
      "home.html",
    );
    res.status(200).sendFile(homePagePath);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error check logs" });
  }
}

export async function postScrapeWebsite(req, res) {
  try {
    const { url, targetDomain, keywords } = req.body;

    await scrapeWebsite(url, targetDomain, keywords.split(","));

    res.status(200).json({ downloadLink: "/download/12345" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error check logs" });
  }
}

export async function getDownloadFileById(req, res) {
  try {
    res.status(200).json({ foo: "bar" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error check logs" });
  }
}
