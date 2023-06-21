import BaseApi from "../BaseApi";
import { type UploadTipResponse } from "./types/UploadTipResponse";
import RNFetchBlob from "rn-fetch-blob";

const UPLOAD_TIP_URL = "content/upload/culinary-tips";

const baseApi = new BaseApi();

const uploadTip = async (
    title: string,
    videoUri: string,
    description?: string
): Promise<UploadTipResponse> => {
    const formData = new FormData();
    formData.append("title", title);

    console.log("PostApi.uploadTip - preparing data");

    // TODO: get file/blob from local uri
    // const vid = await fetch(videoUri);
    // console.log("PostApi.uploadTip - blob:" + JSON.stringify(vid));
    // const video = await vid.blob();
    const video = RNFetchBlob.wrap(videoUri);
    formData.append("video", video);

    console.log("PostApi.uploadTip - sending");

    const response = await baseApi.post<FormData>(UPLOAD_TIP_URL, formData, {
        timeout: 30000,
        authorizationRequired: true,
        contentType: "multipart/form-data",
    });

    console.log("PostApi.uploadTip - response: " + JSON.stringify(response));

    if (!response.ok) {
        console.log("not ok");
        return {
            success: false,
            reason: "no",
        };
    }
    console.log("ok");
    return {
        success: true,
    };
};

const postApi = {
    uploadTip,
};

export default postApi;
