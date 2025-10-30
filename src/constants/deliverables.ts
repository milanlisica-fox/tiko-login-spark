export type RecommendedDeliverable = { id: string; title: string; tokens: number };
export const RECOMMENDED_DELIVERABLES: RecommendedDeliverable[] = [
  { id: "1", title: "Editable Image Files Adapted Under NDA", tokens: 2 },
  { id: "2", title: "Video File Created Non NDA", tokens: 1 },
  { id: "3", title: "PDF Files Created Non NDA", tokens: 10 },
  { id: "4", title: "Non Editable Image Files Created Non NDA", tokens: 2 },
];

export type DeliverableVariant = { variant: string; size: string };
export type DeliverablesGroup = { kvType: string; variants: DeliverableVariant[] };

export const DELIVERABLES_LIST: DeliverablesGroup[] = [
  {
    kvType: "Q7 KV",
    variants: [
      { variant: "Clean", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
      { variant: "80/20", size: "PDF, PT EXT, LS EXT" },
      { variant: "70/30", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
    ],
  },
  {
    kvType: "B7 KV",
    variants: [
      { variant: "Clean", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
      { variant: "80/20", size: "PDF, PT EXT, LS EXT" },
      { variant: "70/30", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
    ],
  },
  {
    kvType: "Combo KV (Q7 &B7)",
    variants: [
      { variant: "Clean", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
      { variant: "80/20", size: "PDF, PT EXT, LS EXT" },
      { variant: "70/30", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
    ],
  },
  {
    kvType: "Family KV (Q7, B7 & B7R) - (Bespoke KV)",
    variants: [
      { variant: "Clean", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
      { variant: "80/20", size: "PDF, PT EXT, LS EXT" },
      { variant: "70/30", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
    ],
  },
  {
    kvType: "B7 & B7R KV (Bespoke KV)",
    variants: [
      { variant: "Clean", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
      { variant: "80/20", size: "PDF, PT EXT, LS EXT" },
      { variant: "70/30", size: "1:1, 16:9, 9:16, PT, LS, Ex Pt, Ex LS" },
    ],
  },
];


