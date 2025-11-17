export type ImageResource =
  | string
  | {
      resource: string;
      color?: string;
      clipContent?: boolean;
      preserveAspectRatio?: string;
    };
