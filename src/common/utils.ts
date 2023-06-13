export const validateText = (
    text: string,
    pattern: RegExp,
    onMatchResult: (result: boolean) => void
): void => {
    onMatchResult(pattern.test(text));
};
