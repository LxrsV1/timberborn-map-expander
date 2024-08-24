import { GenerateEntityLocations, GenerateTerrainMap } from "./utils";
import { logger } from "./logger";
import { readFileSync, writeFileSync, existsSync, createWriteStream, copyFileSync, mkdirSync, rmSync, rmdirSync } from "fs";
import StreamZip from "node-stream-zip";
import { WorldFileData } from "./types";
import archiver from "archiver";

// TODO: make config file
const config = {
  outputSize: 256,
};

const main = async () => {
  logger.warn("Only maps with a perfact square size are supported!");
  const zip = new StreamZip.async({ file: "./timberfiles/input.timber" });
  await zip.extract("world.json", "./timberfiles/world.json.temp");
  await zip.extract("save_metadata.json", "./timberfiles/save_metadata.json.temp");
  await zip.extract("save_thumbnail.jpg", "./timberfiles/save_thumbnail.png.temp");
  await zip.extract("version.txt", "./timberfiles/version.txt.temp");
  await zip.close();

  if (!(await existsSync("./timberfiles/input.timber")) || !(await existsSync("./timberfiles/world.json.temp")))
    return logger.fatal("Either no world file was given, or the world.json file could not be found within the zip.", true);

  const inputJson = JSON.parse(await readFileSync("./timberfiles/world.json.temp", "utf-8")) as WorldFileData | undefined;
  if (!inputJson) return logger.fatal("Couldn't get json from file.", true);

  const input = inputJson?.Singletons?.TerrainMap?.Heights?.Array;
  if (!input) return logger.fatal("Couldn't find the correct array that indicates all terrain height.", true);

  const terrain = GenerateTerrainMap(input);
  const entities = GenerateEntityLocations(inputJson.Singletons.MapSize.Size.X, config.outputSize, inputJson?.Entities);

  const splittedTerrain = terrain.split(" ");

  const result: WorldFileData = inputJson; // Creating copy to work on
  result.Singletons.MapSize.Size = { X: 256, Y: 256 };
  result.Singletons.TerrainMap.Heights.Array = terrain;
  result.Singletons.WaterMapNew.WaterColumns.Array = Array(config.outputSize * config.outputSize)
    // .map((_, i) => `0:0:0:${splittedTerrain[i]}`)
    .fill("0:0:0:0")
    .join(" ");
  result.Singletons.WaterMapNew.ColumnOutflows.Array = Array(config.outputSize * config.outputSize)
    .fill("0|0:0|0:0|0:0|0")
    .join(" ");
  result.Singletons.WaterEvaporationMap.EvaporationModifiers.Array = Array(config.outputSize * config.outputSize)
    .fill(1)
    .join(" ");
  result.Singletons.SoilMoistureSimulator.MoistureLevels.Array = Array(config.outputSize * config.outputSize)
    .fill(0)
    .join(" ");
  result.Singletons.SoilContaminationSimulator.ContaminationCandidates.Array = Array(config.outputSize * config.outputSize)
    .fill(0)
    .join(" ");
  result.Singletons.SoilContaminationSimulator.ContaminationLevels.Array = Array(config.outputSize * config.outputSize)
    .fill(0)
    .join(" ");
  result.Entities = entities;

  const mapEditableResult: WorldFileData = {
    GameVersion: result.GameVersion,
    Timestamp: result.Timestamp,
    Singletons: {
      MapSize: {
        Size: {
          X: config.outputSize,
          Y: config.outputSize,
        },
      },
      TerrainMap: result.Singletons.TerrainMap,
      WaterMapNew: result.Singletons.WaterMapNew,
      WaterEvaporationMap: result.Singletons.WaterEvaporationMap,
      SoilMoistureSimulator: result.Singletons.SoilMoistureSimulator,
      SoilContaminationSimulator: result.Singletons.SoilContaminationSimulator,
      HazardousWeatherHistory: {
        HistoryData: [],
      },
      MapThumbnailCameraMover: result.Singletons.MapThumbnailCameraMover,
    },
    Entities: result.Entities.filter((ent) => ["BadwaterSource", "Watersource"].includes(ent.Template)),
  };

  logger.info("Starting with writing timber save file...");

  await mkdirSync("./timberfiles/output");
  await writeFileSync("./timberfiles/output/world.json", JSON.stringify(result));
  await copyFileSync("./timberfiles/save_metadata.json.temp", "./timberfiles/output/save_metadata.json");
  await copyFileSync("./timberfiles/save_thumbnail.png.temp", "./timberfiles/output/save_thumbnail.png");
  await copyFileSync("./timberfiles/version.txt.temp", "./timberfiles/output/version.txt");

  const archive = archiver("zip");
  archive
    .directory("./timberfiles/output", false)
    .on("error", (err) => logger.fatal(err, true))
    .pipe(createWriteStream("./timberfiles/output.timber"));

  await archive.finalize();

  await writeFileSync("./timberfiles/output/world.json", JSON.stringify(mapEditableResult));

  const editableMapArchive = archiver("zip");
  editableMapArchive
    .directory("./timberfiles/output", false)
    .on("error", (err) => logger.fatal(err, true))
    .pipe(createWriteStream("./timberfiles/editablemap.timber"));

  await editableMapArchive.finalize();

  await rmSync("./timberfiles/world.json.temp");
  await rmSync("./timberfiles/save_metadata.json.temp");
  await rmSync("./timberfiles/save_thumbnail.png.temp");
  await rmSync("./timberfiles/version.txt.temp");
  await rmSync("./timberfiles/output/world.json");
  await rmSync("./timberfiles/output/save_metadata.json");
  await rmSync("./timberfiles/output/save_thumbnail.png");
  await rmSync("./timberfiles/output/version.txt");
  await rmdirSync("./timberfiles/output");

  logger.info("Done!");
};

main();
