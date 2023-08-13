import { type SetStateAction, type Context, type Dispatch } from "react";
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

export type StateDispatcher<Type> = {
    [Property in keyof Type as `set${Capitalize<string & Property>}`]: Dispatch<
        SetStateAction<Type[Property]>
    >;
};

export const getUrlExtension = (url: string): string => {
    return url.split(/[#?]/)[0]?.split(".")?.pop()?.trim() ?? "";
};

export const { width: windowWidth, height: windowHeight } =
    Dimensions.get("window");

export type DistributiveOmit<T, K extends PropertyKey> = T extends any
    ? Omit<T, K>
    : never;

export type IntersectUnion<T, U, V> = T extends U ? T & V : T;

export type NonConcrete<T> = { [Property in keyof T]?: T[Property] };

export type WithExp<T> = T & { exp: number };
