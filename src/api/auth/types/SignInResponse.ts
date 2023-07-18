export type SignInResponse =
    | {
          success: true;
          token: string;
      }
    | {
          success: false;
          code: number;
      };
