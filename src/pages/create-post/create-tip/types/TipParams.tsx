import React from "react";
import { type TDVStates, type TDVParams } from "../../common/types/TDVParams";
import {
    CREATE_TIP_DESCRIPTION_LABEL,
    CREATE_TIP_DESCRIPTION_PLACEHOLDER,
    CREATE_TIP_FAILED,
    CREATE_TIP_FAILED_SECONDARY,
    CREATE_TIP_MEDIA_BUTTON_TEXT,
    CREATE_TIP_MEDIA_LABEL,
    CREATE_TIP_PENDING,
    CREATE_TIP_SUCCESS,
    CREATE_TIP_THANKS,
    CREATE_TIP_TITLE_LABEL,
    CREATE_TIP_TITLE_PLACEHOLDER,
    CREATE_TIP_VIDEO_WRONG_FILE_SIZE_ERROR,
    CREATE_TIP_VIDEO_WRONG_LENGTH_ERROR,
} from "@/common/strings";

const tipInformationContext = React.createContext<TDVStates>({
    title: "",
    setTitle: () => {},
    description: "",
    setDescription: () => {},
    video: null,
    setVideo: () => {},
});

const createTipTDVLabels: TDVParams<TDVStates>["labels"] = {
    thank: CREATE_TIP_THANKS,
    titleLabel: CREATE_TIP_TITLE_LABEL,
    titlePlaceHolder: CREATE_TIP_TITLE_PLACEHOLDER,
    descriptionLabel: CREATE_TIP_DESCRIPTION_LABEL,
    descriptionPlaceholder: CREATE_TIP_DESCRIPTION_PLACEHOLDER,
    mediaLabel: CREATE_TIP_MEDIA_LABEL,
    mediaButtonText: CREATE_TIP_MEDIA_BUTTON_TEXT,
};

const createTipTDVMessages: TDVParams<TDVStates>["messages"] = {
    wrongFileLengthError: CREATE_TIP_VIDEO_WRONG_LENGTH_ERROR,
    wrongFileSizeError: CREATE_TIP_VIDEO_WRONG_FILE_SIZE_ERROR,
    compressingMessage: CREATE_TIP_PENDING,
    successMessage: CREATE_TIP_SUCCESS,
    failMessage: CREATE_TIP_FAILED_SECONDARY,
    fail2ndMessage: CREATE_TIP_FAILED,
};

export const tipTDVParams: TDVParams<TDVStates> = {
    labels: createTipTDVLabels,
    messages: createTipTDVMessages,
    states: tipInformationContext,
};
