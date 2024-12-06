const compress_images = require("compress-images");
const fs = require("fs");
const path = require("path");
const { Storage } = require("@google-cloud/storage");
const { logger } = require("./config");
const { MongoClient } = require("mongodb");

require("dotenv").config();

const SERVICE_ACCOUNT_PATH = process.env.SERVICE_ACCOUNT_PATH;
const connURI = process.env.MONGODB_URI;
const client = new MongoClient(connURI);
const storage = new Storage({
  keyFilename: SERVICE_ACCOUNT_PATH,
});
const bucketName = "like_and_share_ig_post_images";

// Function to upload a file to Google Cloud Storage
async function processAllFilesInGoogleCloudStorage() {
  console.log("here");
  let pageToken = "";

  do {
    console.log("here do");

    const [files, query] = await storage.bucket(bucketName).getFiles({
      autoPaginate: false,
      pageToken,
    });

    console.log(files.length);
    console.log(query);

    // await workOnFiles(files);

    for (let index = 0; index < files.length; index++) {
      const element = files[index];

      const fileName = element.name;
      const publicURL = element.publicUrl() ?? "";

      if (publicURL === "") continue;

      const post = await getIGPostByImageCDN(publicURL);

      if (post === false) {
        // console.log("post false");
        continue;
      } // there was an error

      if (post !== null) {
        // console.log("post null");

        continue;
      } // post exist

      // Post does not exist

      // console.log("post");
      // console.log(post);

      await deleteFile(fileName);
    }

    pageToken = query?.pageToken ?? "";
  } while (pageToken !== "");

  console.log("done");
}

async function deleteFile(fileName) {
  try {
    console.log(`deleting ${fileName}`);
    const del_res = await storage.bucket(bucketName).file(fileName).delete();
    console.log(`${fileName} deleted`);

    // console.log(del_res);
  } catch (error) {
    console.log(error);
  }
}

async function getIGPostByImageCDN(image_cdn) {
  try {
    const database = client.db("myappdb");
    const ig_profile_posts = database.collection("ig_profile_posts");

    const query = {
      image_cdn: image_cdn,
    };

    const post = ig_profile_posts.findOne(query);

    return post;
  } catch (err) {
    return false;
  }
}

processAllFilesInGoogleCloudStorage();

module.exports = {
  processAllFilesInGoogleCloudStorage,
};
