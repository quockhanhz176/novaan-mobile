export type UploadTipResponse =
    | {
          success: true;
      }
    | {
          success: false;
          reason: string;
      };
