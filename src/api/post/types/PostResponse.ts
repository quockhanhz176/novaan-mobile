type PostResponse = {
    id: string;
    creatorId: string;
    title: string;
    description: string;
    video: string;
    status: number;
    createdAt?: Date; // 2023-06-29T20:11:06.124Z
    updatedAt?: Date;
    adminComment?: string;
} & (
    | {
          type: "recipe";
          difficulty: number;
          portionQuantity: number;
          portionType: number;
          prepTime: string;
          cookTime: string;
          instructions: Array<{
              step: number;
              description: string;
              image?: string;
          }>;
          ingredients: Array<{
              name: string;
              amount: number;
              unit: string;
          }>;
      }
    | {
          type: "tip";
      }
);

export default PostResponse;
