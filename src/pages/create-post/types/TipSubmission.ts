import type * as ImagePicker from "react-native-image-picker";

export default interface TipSubmission {
    title: string;
    description: string;
    video: ImagePicker.Asset | null | undefined;
}
