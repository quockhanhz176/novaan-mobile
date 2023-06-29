export type UploadResponse =
    | {
          success: true;
      }
    | {
          success: false;
          reason: string;
      };
