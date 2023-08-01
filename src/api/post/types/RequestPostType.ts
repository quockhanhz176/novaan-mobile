import { type PostType } from "./PostResponse";

type RequestPostType = "Recipe" | "CulinaryTip";

export const getRequestPostType = (type: PostType): RequestPostType => {
    if (type === "recipe") {
        return "Recipe";
    }

    return "CulinaryTip";
};

export default RequestPostType;
