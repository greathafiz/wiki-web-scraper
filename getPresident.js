import * as cheerio from "cheerio";
import axios from "axios";

export default async function getPresident(url) {
    try {
        const axiosResponse = await axios.request({
            method: "GET",
            url: url,
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
            },
          });
          const html = axiosResponse.data;
          const $ = cheerio.load(html);

          const name = $('.infobox > tbody > tr > th > .fn').text()
          const details = $('tr > .infobox-label:contains("Born")').next().text()

          const president = {
            name: name,
            PersonalDetails: details.replace(']', '] ')
          }

        //   console.log(president);
        return president
    } catch (error) {
        console.error(error);
    }
}

