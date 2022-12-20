import path from "path";
import axios from "axios";
import fs from "fs";
import { getFileExtension } from "./data";

export enum ImgType {
  BADGE = "badges",
  RACE = "races",
}
export const saveImage = async (url: string, name: string, type: ImgType) => {
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
      console.log("Successfully downloaded file!");
    });
    return newPath;
  } catch (err: any) {
    throw new Error(
      `Could not save the image on the server :( \nReason: ${err}`,
    );
  }
};
