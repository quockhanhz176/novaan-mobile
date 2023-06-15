export type SignUpErrReason = "email exists" | "username exists" | "unknown";
export type SignUpResponse =
    | {
          success: true;
      }
    | {
          success: false;
          reason: SignUpErrReason;
      };
