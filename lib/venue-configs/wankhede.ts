export interface VenueConfig {
  id: string;
  name: string;
  svgViewBox: string;
  capacity: number;
  zones: {
    id: string;
    label: string;
    type: string;
    svgShape: { type: string; cx: number; cy: number; rx: number; ry: number };
    nearGates: string[];
  }[];
  gates: {
    id: string;
    label: string;
    position: { cx: number; cy: number };
    nearStands: string[];
  }[];
  toilets: {
    id: string;
    position: { cx: number; cy: number };
  }[];
  foodStalls: {
    id: string;
    position: { cx: number; cy: number };
    emoji: string;
  }[];
  routePaths: Record<string, string>;
}

export const WANKHEDE_CONFIG: VenueConfig = {
  id: "wankhede",
  name: "Wankhede Stadium",
  svgViewBox: "0 0 340 300",
  capacity: 33000,
  zones: [
    {
      id: "S1", label: "North Stand", type: "stand",
      svgShape: { type: "ellipse", cx: 170, cy: 255, rx: 55, ry: 32 },
      nearGates: ["A"]
    },
    {
      id: "S2", label: "East Stand", type: "stand",
      svgShape: { type: "ellipse", cx: 278, cy: 148, rx: 38, ry: 55 },
      nearGates: ["B"]
    },
    {
      id: "S3", label: "South Stand", type: "stand",
      svgShape: { type: "ellipse", cx: 170, cy: 48, rx: 55, ry: 32 },
      nearGates: ["C"]
    },
    {
      id: "S4", label: "West Stand", type: "stand",
      svgShape: { type: "ellipse", cx: 62, cy: 148, rx: 38, ry: 55 },
      nearGates: ["D"]
    },
  ],
  gates: [
    { id: "A", label: "Gate A", position: { cx: 170, cy: 270 }, nearStands: ["S1"] },
    { id: "B", label: "Gate B", position: { cx: 307, cy: 148 }, nearStands: ["S2"] },
    { id: "C", label: "Gate C", position: { cx: 170, cy: 18 },  nearStands: ["S3"] },
    { id: "D", label: "Gate D", position: { cx: 33, cy: 148 },  nearStands: ["S4"] },
  ],
  toilets: [
    { id: "wc1", position: { cx: 126, cy: 36 } },
    { id: "wc2", position: { cx: 214, cy: 36 } },
  ],
  foodStalls: [
    { id: "fs1", position: { cx: 110, cy: 262 }, emoji: "🍔" },
    { id: "fs2", position: { cx: 230, cy: 262 }, emoji: "🥤" },
  ],
  routePaths: {
    "C-S3": "M170 18 Q170 38 170 56",  
    "A-S3": "M170 270 Q140 200 140 80 Q140 56 170 56",
    "B-S3": "M307 148 Q250 148 200 80 Q185 56 170 56",
    "D-S3": "M33 148 Q90 148 140 80 Q155 56 170 56",
  }
};
