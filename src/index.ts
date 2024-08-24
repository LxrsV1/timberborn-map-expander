import { FlipArrayVertically, GenerateTerrainMap } from "./utils";

import { logger } from "./logger";
import { readFileSync, writeFileSync } from "fs";

// TODO: make config file
const config = {
  output: "terrain.txt",
};

const main = async () => {
  const input = await readFileSync("./input.txt", "utf-8");
  const terrain = GenerateTerrainMap(input);

  await writeFileSync(config.output, terrain);

  logger.info(`Wrote terrain height info to ${config.output}.`);
};

main();
