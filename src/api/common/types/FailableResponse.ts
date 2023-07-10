export type FailableResponse<T> =
    | {
          success: true;
          value: T;
      }
    | {
          success: false;
          code: number;
      };
