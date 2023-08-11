import type * as ImagePicker from "react-native-image-picker";

export default interface TipSubmission {
    title: string;
    description: string;
    video: ImagePicker.Asset | null | undefined;
    thumbnail: string | null | undefined;
}

export interface TipEdit extends Pick<TipSubmission, "title" | "description"> {
    video: ImagePicker.Asset | null | undefined | string;
}

export interface TipEdit extends Pick<TipSubmission, "title" | "description"> {
    video: ImagePicker.Asset | null | undefined | string;
}
