import { Client } from "@notionhq/client";
import fs from "fs";
import os from "os";

const notion = new Client({ auth: process.env.NOTION_KEY });

const folderPath = os.homedir() + "/.local/share/applications/";
console.log("Path: ", folderPath);

async function getDatabase(databaseId) {
  const response = await notion.databases.query({
    database_id: databaseId,
    // filter: {
    //   or: [
    //     {
    //       property: "Archived",
    //       checkbox: {
    //         equals: false,
    //       },
    //     },
    //   ],
    // },
  });
  return response.results;
}

function writeFile(pageName, pageId, pageUrl) {
  const text = `[Desktop Entry]
Type=Application
Name=${pageName}
Comment=Notion Page
Icon=notion-app
Terminal=false
Exec=firefox ${pageUrl}
`;

  const filePath = folderPath + `notion-${pageId}.desktop`;
  fs.writeFileSync(filePath, text);
}

let pages = [];
pages = pages.concat(await getDatabase("0a05d19fd74a452ea546b0b5eee6a26b"));
pages = pages.concat(await getDatabase("68ebb494954e40539a101da60e72e3f5"));

for (const page of pages) {
  const pageName = page.properties.Name.title[0].plain_text;
  // Remove hyphens from string
  const pageId = page.id.replace(/-/g, "");
  console.log("Writing: ", pageName);
  writeFile(pageName, pageId, page.url);
}
