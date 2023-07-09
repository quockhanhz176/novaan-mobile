import { type Context } from "react";
import { Dimensions } from "react-native";

export const validateText = (
    text: string,
    pattern: RegExp,
    onMatchResult: (result: boolean) => void
): void => {
    onMatchResult(pattern.test(text));
};

export const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export type ExtractGenericContext<Type> = Type extends Context<infer X>
    ? X
    : never;

export type Setter<Type> = {
    [Property in keyof Type as `set${Capitalize<string & Property>}`]: (
        value: Type[Property]
    ) => void;
};

export const getUrlExtension = (url: string): string => {
    return url.split(/[#?]/)[0]?.split(".")?.pop()?.trim() ?? "";
};

export const { width: windowWidth, height: windowHeight } =
    Dimensions.get("window");
