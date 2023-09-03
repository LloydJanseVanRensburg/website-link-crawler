import { utils } from "xlsx";

export default function createWorksheet(allLinks, pageLink) {
  const worksheet = utils.aoa_to_sheet([
    [pageLink],
    [],
    ["Links", "Status"],
    ...allLinks.map((link) => [link.url, link.status]),
  ]);

  worksheet["!cols"] = [{ wch: 80 }, { wch: 10 }];

  return worksheet;
}
