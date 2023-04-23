import path from "path";
import axios from "axios";
import fs from "fs";
import { getFileExtension } from "./data";

export enum ImgType {
  BADGE = "badges",
  RACE = "races",
  ICON_SEASON = "icons/season",
  ICON_RACE = "icons/race",
}
export const saveImage = async (
  url: string | undefined,
  name: string,
  type: ImgType,
) => {
  if (!url) throw "URL of the race icon is incorrect. Please try again.";
  try {
    const extension = getFileExtension(url);
    const localFilePath =
      process.env.ENV === "prod"
        ? path.resolve(
            __dirname,
            `../../../__CDN/${type}`,
            `${name}.${extension}`,
          )
        : path.resolve(__dirname, `${name}.${extension}`);

    const newPath = `http://cdn.masochist.me/${type}/${name}.${extension}`;
    const response = await axios({
      method: "GET",
      responseType: "stream",
      url,
      headers: {
        "Content-Type": "image/*",
        "Accept": "image/*",
      },
    });

    const pipe = response.data.pipe(fs.createWriteStream(localFilePath));

    pipe.on("finish", () => {
      console.log("--> Successfully downloaded and saved a file!");
    });
    return newPath;
  } catch (err: any) {
    if (err?.response?.status === 415)
      throw new Error(
        "This type of file is not supported. You need to upload an image.",
      );
    else
      throw new Error(
        `Could not save the image on the server :( \nReason: ${err}`,
      );
  }
};
