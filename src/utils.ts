import { WIDTHS } from "./consts";
import { logger } from "./logger";
import { Entity } from "./types";

// Only if typescript had exstention functions :(
export const FlipArrayVertically = (elements: any[], numCols: number) => {
  let rows = [];
  for (let i = 0; i < elements.length; i += numCols) {
    rows.push(elements.slice(i, i + numCols));
  }

  rows = rows.map((row) => row.reverse());

  let flippedString = rows.flat().join(" ");

  return flippedString;
};

export const GenerateTerrainMap = (inputStr: string): string => {
  const input = inputStr.split(" ").reverse();
  const arr = Array(256 * 256).fill(1);
  const inputArrSide = Math.sqrt(input.length);

  let totalOffsetX = 0;
  let totalOffsetY = 0;

  let counter = 0;
  for (let x = totalOffsetX; x < inputArrSide + totalOffsetX; x++) {
    for (let y = totalOffsetY; y < inputArrSide + totalOffsetY; y++) {
      let offsetY = y * 256;
      arr[x + offsetY] = input[counter];

      counter++;
    }
  }

  logger.info(`Array has a size of ${Math.sqrt(arr.length)}x${Math.sqrt(arr.length)}`);

  const flipped = FlipArrayVertically(arr, 256); // idk otherwise it's flipped and weird

  return flipped;
};

export const GenerateEntityLocations = (entities: Entity[]): Entity[] => {
  return entities.map((entity) => {
    const x = (entity.Components.BlockObject ? entity.Components.BlockObject.Coordinates.Y : entity.Components.Character.Position.Y) + 128;
    const y = 128 - (entity.Components.BlockObject ? entity.Components.BlockObject.Coordinates.X : entity.Components.Character.Position.X) - (WIDTHS[entity.Template] ?? 1);

    if (entity.Components.BlockObject) {
      entity.Components.BlockObject.Coordinates.X = x;
      entity.Components.BlockObject.Coordinates.Y = y;
    } else {
      entity.Components.Character.Position.X = x;
      entity.Components.Character.Position.Y = y;
    }

    return entity;
  });
};
