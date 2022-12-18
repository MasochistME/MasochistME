import path from "path";
import axios from "axios";
import fs from "fs";
import { getFileExtension } from "./data";

export const saveImage = async (url: string, name: string) => {
  try {
    // const localFilePath = path.resolve(__dirname, "../../../__CDN/badges", `${name}.${extension}`);
    const extension = getFileExtension(url);
    const localFilePath = path.resolve(
      __dirname,
      "../../",
      `${name}.${extension}`,
    );
    const newPath = `http://cdn.masochist.me/badges/${name}.${extension}`;
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
    throw new Error(err);
  }
};
