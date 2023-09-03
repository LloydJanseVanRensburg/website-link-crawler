import { utils, writeFile } from "xlsx";

export default function createWorkbook(name) {
  const workbook = utils.book_new();
  workbook.Props = {
    Title: name,
  };
  return workbook;
}

export function appendToWorkbook(workbook, worksheet) {
  utils.book_append_sheet(workbook, worksheet);
}

export function writeWorkbookToFile(workbook, filePath) {
  writeFile(workbook, filePath);
}
