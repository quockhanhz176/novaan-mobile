// Read docs here for more info
// https://docs.expo.dev/versions/latest/sdk/securestore/
import * as SecureStore from "expo-secure-store";

export const saveKeychain = async (
    key: string,
    value: string
): Promise<void> => {
    await SecureStore.setItemAsync(key, value);
};

export const getKeychainValue = async (key: string): Promise<string> => {
    const keychain = await SecureStore.getItemAsync(key);
    if (keychain == null) {
        throw new Error("Keychain not found");
    }

    return keychain;
};

export const deleteKeychainValue = async (key: string): Promise<boolean> => {
    try {
        await SecureStore.deleteItemAsync(key);
    } catch {
        return false;
    }

    return true;
};
