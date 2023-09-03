import path from "path";
import fileDirName from "../utils/dirname.js";
import scrapeWebsite from "../utils/scrapeWeb.js";
import createWorkbook, {
  writeWorkbookToFile,
} from "../utils/createWorkbook.js";

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

    const keywordsArr = keywords ? keywords.split(",") : [];

    const workbook = createWorkbook(url);
    await scrapeWebsite(url, targetDomain, keywordsArr, workbook);
    const fileName = `${Date.now()}.xlsx`;
    const workbookFilePath = path.join(
      __dirname,
      "..",
      "..",
      "outputs",
      fileName,
    );
    writeWorkbookToFile(workbook, workbookFilePath);

    res.status(200).json({ downloadLink: `/download/${fileName}` });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error check logs" });
  }
}

export async function getDownloadFileById(req, res) {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "..", "..", "outputs", filename);

    res.download(filePath, (e) => {
      if (e) {
        console.error(e);
        res.status(500).send("Error downloading file");
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error check logs" });
  }
}
