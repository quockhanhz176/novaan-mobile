export type SignUpResponse =
    | {
          success: true;
      }
    | {
          success: false;
          reason: "email exists" | "username exists" | "unknown";
      };
