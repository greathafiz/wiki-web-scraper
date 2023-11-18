import * as cheerio from "cheerio";
import axios from "axios";
import getPresident from "./getPresident.js";
import fs from "node:fs";
import { error } from "node:console";

const baseUrl =
  "https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States";

const run = async () => {
  try {
    const axiosResponse = await axios.request({
      method: "GET",
      url: baseUrl,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      },
    });
    const html = axiosResponse.data;
    const $ = cheerio.load(html);

    const urls = [];

    $("td > b").each((index, element) => {
      const url = $(element).find("a").attr("href");

      urls.push(url);
    });

    const presidents = await Promise.all(
      urls.map((url) => {
        return getPresident(`https://en.wikipedia.org${url}`);
      })
    );

    console.log(presidents);

    const fileName = "us-presidents.json";
    let data = JSON.stringify(presidents);

    fs.writeFile(fileName, data, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Data written to ${fileName} successfully`);
      }
    });
  } catch (error) {
    console.error(error);
  }
};
run();
