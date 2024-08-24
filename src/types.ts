export interface WorldFileData {
  GameVersion: string;
  Timestamp: string;
  Singletons: Singletons;
  Entities: Entity[];
}

export interface Singletons {
  MapSize: MapSize;
  TerrainMap: TerrainMap;
  WaterMapNew: WaterMapNew;
  WaterEvaporationMap: WaterEvaporationMap;
  SoilMoistureSimulator: SoilMoistureSimulator;
  SoilContaminationSimulator: SoilContaminationSimulator;
  HazardousWeatherHistory: HazardousWeatherHistory;
  MapThumbnailCameraMover: MapThumbnailCameraMover;
}

export interface MapSize {
  Size: Size;
}

export interface Size {
  X: number;
  Y: number;
}

export interface TerrainMap {
  Heights: Heights;
}

export interface Heights {
  Array: string;
}

export interface WaterMapNew {
  Levels: number;
  WaterColumns: WaterColumns;
  ColumnOutflows: ColumnOutflows;
}

export interface WaterColumns {
  Array: string;
}

export interface ColumnOutflows {
  Array: string;
}

export interface WaterEvaporationMap {
  Levels: number;
  EvaporationModifiers: EvaporationModifiers;
}

export interface EvaporationModifiers {
  Array: string;
}

export interface SoilMoistureSimulator {
  MoistureLevels: MoistureLevels;
}

export interface MoistureLevels {
  Array: string;
}

export interface SoilContaminationSimulator {
  ContaminationCandidates: ContaminationCandidates;
  ContaminationLevels: ContaminationLevels;
}

export interface ContaminationCandidates {
  Array: string;
}

export interface ContaminationLevels {
  Array: string;
}

export interface HazardousWeatherHistory {
  HistoryData: any[];
}

export interface MapThumbnailCameraMover {
  CurrentConfiguration: CurrentConfiguration;
}

export interface CurrentConfiguration {
  Position: Position;
  Rotation: Rotation;
  ShadowDistance: number;
}

export interface Position {
  X: number;
  Y: number;
  Z: number;
}

export interface Rotation {
  X: number;
  Y: number;
  Z: number;
  W: number;
}

export interface Entity {
  Id: string;
  Template: string;
  Components: Components;
}

export interface Components {
  Character: Character;
  WaterSource: WaterSource;
  BlockObject: BlockObject;
}

export interface WaterSource {
  SpecifiedStrength: number;
  CurrentStrength: number;
}

export interface BlockObject {
  Coordinates: Coordinates;
}

export interface Coordinates {
  X: number;
  Y: number;
  Z: number;
}

export interface Character {
  Position: Coordinates;
  Name: string;
}
