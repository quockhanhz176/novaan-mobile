// DisplayPost is an object containing enough information (thumbnail, title, ...) to display the post in a list
interface SearchResponsePost {
    id: string;
    authorId: string;
    avatar: string;
    authorName: string;
    title: string;
    thumbnails: string;
    averageRating: number;
}

export type SearchResponseTip = SearchResponsePost;

export type SearchResponseRecipe = SearchResponsePost & {
    cookTime: string;
};

export default SearchResponsePost;
