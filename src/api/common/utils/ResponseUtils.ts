export const responseObjectValid = (target: any): boolean => {
    if (typeof target !== "object" || target == null) {
        return false;
    }
    if (target.success != null && target.success === false) {
        return false;
    }
    return true;
};
