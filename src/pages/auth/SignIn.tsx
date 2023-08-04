import React, { useState, type ReactElement, useEffect } from "react";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm, Controller } from "react-hook-form";

import { authInputStyles } from "@/pages/auth/components/AuthInput";
import AuthButton from "@/pages/auth/components/AuthButton";
import {
    SIGN_IN_WRONG_USERNAME_PASSWORD,
    COMMON_SERVER_CONNECTION_FAIL_ERROR,
    SIGN_IN_EMAIL_TITLE,
    COMMON_EMPTY_FIELD_NOT_ALLOWED,
    SIGN_IN_EMAIL_PLACEHOLDER,
    SIGN_IN_PASSWORD_TITLE,
    SIGN_IN_PASSWORD_PLACEHOLDER,
    SIGN_IN_SIGN_IN_BUTTON_TITLE,
    SIGN_IN_FORGET_PASSWORD,
    SIGN_IN_CREATE_ACCOUNT_TITLE,
    SIGN_IN_CREATE_ACCOUNT_BUTTON_TITLE,
    AUTH_EMAIL_INVALID,
    AUTH_PASSWORD_TOO_SHORT,
    SIGN_IN_GREETING,
    SIGN_IN_GOOGLE_ERROR_OCCURED,
} from "@/common/strings";
import authApi from "@/api/auth/AuthApi";
import OverlayLoading from "@/common/components/OverlayLoading";
import ErrorText from "@/common/components/ErrorText";
import Divider from "@/common/components/Divider";
import GoogleSignInButton from "@/pages/auth/components/GoogleSignInButton";
import { GOOGLE_API_KEY, KEYCHAIN_ID } from "@env";
import { maybeCompleteAuthSession } from "expo-web-browser";
import { useAuthRequest } from "expo-auth-session/providers/google";
import { saveKeychain } from "@/common/keychainService";
import { type RootStackParamList } from "@/types/navigation";
import moment from "moment";
import { useRefreshToken } from "@/api/auth/authApiHook";
import { type TokenPayload } from "@/api/baseApiHook";
import { getPayloadFromToken } from "@/api/common/utils/TokenUtils";

interface SignInProps {
    navigation: NativeStackNavigationProp<RootStackParamList, "SignIn">;
}

interface FormData {
    email: string;
    password: string;
}

const SignIn = (props: SignInProps): ReactElement<SignInProps> => {
    const { navigation } = props;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [, response, promptAsync] = useAuthRequest({
        androidClientId: GOOGLE_API_KEY,
    });
    const { refreshToken } = useRefreshToken();
    const [token, setToken] = useState<string>("");

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "all",
    });

    const handlePersistentSignIn = async (): Promise<void> => {
        setIsLoading(true);

        // Check if there is a token exist
        try {
            const currentUserToken = await getPayloadFromToken<TokenPayload>();
            if (currentUserToken.exp == null) {
                return;
            }

            // Check token exp
            const exp = moment.unix(Number(currentUserToken.exp));
            const expired = moment().diff(exp) >= 0;

            if (!expired) {
                // Skip sign in
                handleSignInSuccessRedirect();
                return;
            }

            // This will also throw error if there are no token exist in keychain store
            const newToken = await refreshToken();
            if (newToken == null) {
                throw new Error();
            }

            // Save new token to secure store
            await saveKeychain(KEYCHAIN_ID, newToken);
            handleSignInSuccessRedirect();
        } catch (e) {
            // Continue with normal sign in
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        maybeCompleteAuthSession();
        void handlePersistentSignIn();
    }, []);

    useEffect(() => {
        if (response?.type === "success") {
            const token = response.authentication?.accessToken;
            if (token == null) {
                alert(SIGN_IN_GOOGLE_ERROR_OCCURED);
                return;
            }
            setToken(token);
        }

        if (response?.type === "error") {
            alert(SIGN_IN_GOOGLE_ERROR_OCCURED);
        }
    }, [response]);

    useEffect(() => {
        if (token === null || token === "") {
            return;
        }

        void handleSignInWithGoogle(token);
    }, [token]);

    const handleSignIn = async (data: FormData): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await authApi.signIn(data.email, data.password);
            if (!("token" in response)) {
                alert(SIGN_IN_WRONG_USERNAME_PASSWORD);
                return;
            }

            // Save token to secure store
            await saveKeychain(KEYCHAIN_ID, response.token);
            handleSignInSuccessRedirect();
        } catch (error) {
            alert(COMMON_SERVER_CONNECTION_FAIL_ERROR);
            console.error(`fail: ${String(error)}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignInWithGoogle = async (token: string): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await authApi.signInWithGoogle(token);
            if (!("token" in response)) {
                alert(SIGN_IN_GOOGLE_ERROR_OCCURED);
                return;
            }
            await saveKeychain(KEYCHAIN_ID, response.token);
            handleSignInSuccessRedirect();
        } catch (error) {
            alert(COMMON_SERVER_CONNECTION_FAIL_ERROR);
            console.error(`fail: ${String(error)}`);
        } finally {
            setIsLoading(false);
        }
    };

    const showGooglePrompt = async (): Promise<void> => {
        try {
            await promptAsync();
        } catch (error) {
            alert(SIGN_IN_GOOGLE_ERROR_OCCURED);
        }
    };

    const handleSignUpRedirect = (): void => {
        navigation.navigate("SignUp");
    };

    const handleSignInSuccessRedirect = (): void => {
        navigation.navigate("Greet");
    };

    return (
        <>
            <View className="flex-1 mt-24 mx-8">
                <View>
                    <Text className="text-6xl font-bold">
                        {SIGN_IN_GREETING}
                    </Text>
                </View>
                <View className="mt-12 w-full">
                    <View>
                        <Text className="text-base">{SIGN_IN_EMAIL_TITLE}</Text>
                    </View>
                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            required: true,
                            pattern:
                                /^\w+([.-]?\w+)*(@\w+([.-]?\w+)*(\.\w{2,3})+)?$/,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                autoCapitalize="none"
                                className={authInputStyles.textInput}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder={SIGN_IN_EMAIL_PLACEHOLDER}
                            />
                        )}
                    />

                    <View className="mt-2">
                        {errors.email?.type === "required" && (
                            <ErrorText>
                                {COMMON_EMPTY_FIELD_NOT_ALLOWED}
                            </ErrorText>
                        )}
                        {errors.email?.type === "pattern" && (
                            <ErrorText>{AUTH_EMAIL_INVALID}</ErrorText>
                        )}
                    </View>

                    <View className="mt-6">
                        <Text>{SIGN_IN_PASSWORD_TITLE}</Text>
                    </View>
                    <Controller
                        control={control}
                        name="password"
                        rules={{ required: true, minLength: 8 }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                autoCapitalize="none"
                                textContentType="password"
                                secureTextEntry={true}
                                className={authInputStyles.textInput}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder={SIGN_IN_PASSWORD_PLACEHOLDER}
                            />
                        )}
                    />

                    <View className="mt-2">
                        {errors.password?.type === "required" && (
                            <ErrorText>
                                {COMMON_EMPTY_FIELD_NOT_ALLOWED}
                            </ErrorText>
                        )}
                        {errors.password?.type === "minLength" && (
                            <ErrorText>{AUTH_PASSWORD_TOO_SHORT}</ErrorText>
                        )}
                    </View>
                </View>

                <View className="mt-8">
                    <Text className="text-cprimary-200 text-sm">
                        {SIGN_IN_FORGET_PASSWORD}
                    </Text>
                </View>
                <View className="mt-4">
                    <AuthButton
                        title={SIGN_IN_SIGN_IN_BUTTON_TITLE}
                        onPress={handleSubmit(handleSignIn)}
                        disabled={isLoading}
                    />
                </View>

                <View className="mt-4 px-12">
                    <Divider title="hoặc đăng nhập với" />
                </View>

                <View className="items-center justify-center mt-4">
                    <GoogleSignInButton handleSignIn={showGooglePrompt} />
                </View>

                <View className="flex-1 items-center justify-center">
                    <View className="flex-row justify-center">
                        <Text>{SIGN_IN_CREATE_ACCOUNT_TITLE}</Text>
                        <TouchableOpacity onPress={handleSignUpRedirect}>
                            <Text className="text-cprimary-300">
                                {SIGN_IN_CREATE_ACCOUNT_BUTTON_TITLE}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {isLoading ? <OverlayLoading /> : null}
        </>
    );
};

export default SignIn;
