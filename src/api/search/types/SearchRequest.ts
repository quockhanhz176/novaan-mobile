interface SearchRequest {
    queryString?: string;
    start?: number;
    limit?: number;
    sortType?: "Relevant" | "Likes" | "Rating" | "CookTime" | "ReleaseDate";
    difficulty?: "Easy" | "Medium" | "Hard";
    allergens?: string[];
    cuisines?: string[];
    diets?: string[];
    categories?: string[];
}

export default SearchRequest;
