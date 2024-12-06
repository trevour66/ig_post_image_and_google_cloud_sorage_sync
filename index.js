const {
  processAllFilesInGoogleCloudStorage,
} = require("./processAllFilesInGoogleCloudStorage");
const {
  is_function_running,
  updateFunctionStatus,
} = require("./database/index");
const { logger } = require("./config");

const run_process = async () => {
  try {
    const functionStatus = await is_function_running("general_process");

    if (functionStatus) {
      throw new Error("Process is already running");
    }

    await updateFunctionStatus("general_process", 1);

    await processAllFilesInGoogleCloudStorage();

    await updateFunctionStatus("general_process", 0);

    // console.log('done')
    logger.info("DONE", { timestamp: new Date().toLocaleString() });

    process.exit(0);
  } catch (error) {
    console.log(`Error ${error.message}`);
    logger.error(error.message, { timestamp: new Date().toLocaleString() });

    process.exit(0);
  }
};

run_process();
