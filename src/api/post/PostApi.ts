import BaseApi from "../BaseApi";
import { type UploadTipResponse } from "./types/UploadTipResponse";

const UPLOAD_TIP_URL = "content/upload/tips";

const baseApi = new BaseApi();

const uploadTip = async (
    title: string,
    description: string,
    videoUri: string,
    extension: string
): Promise<UploadTipResponse> => {
    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Description", description);
    formData.append("Video", {
        name: `upload.${extension}`,
        uri: videoUri,
        type: `video/${extension}`,
    } as any);

    const response = await baseApi.post<FormData>(UPLOAD_TIP_URL, formData, {
        timeout: 30000,
        authorizationRequired: true,
        contentType: "multipart/form-data",
        needJsonBody: false,
    });

    console.log("PostApi.uploadTip - response: " + JSON.stringify(response));

    if (!response.ok) {
        return {
            success: false,
            reason: "no",
        };
    }
    return {
        success: true,
    };
};

const postApi = {
    uploadTip,
};

export default postApi;
