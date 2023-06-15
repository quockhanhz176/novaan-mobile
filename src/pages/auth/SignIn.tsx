import { type RootStackParamList } from "App";
import React, { useState, type ReactElement } from "react";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm, Controller } from "react-hook-form";

import { authInputStyles } from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
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
} from "@/common/strings";
import authApi from "@/api/auth/AuthApi";
import OverlayLoading from "@/components/common/OverlayLoading";
import ErrorText from "@/components/common/ErrorText";

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

    const handleSignIn = async (data: FormData): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await authApi.signIn(data.email, data.password);
            if (response.success) {
                navigation.navigate("MainScreen");
            } else {
                alert(SIGN_IN_WRONG_USERNAME_PASSWORD);
            }
        } catch (error) {
            alert(COMMON_SERVER_CONNECTION_FAIL_ERROR);
            console.error(`fail: ${String(error)}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUpRedirect = (): void => {
        navigation.navigate("SignUp");
    };

    return (
        <>
            <View className="flex-1 mt-32 mx-8">
                <View>
                    <Text className="text-6xl font-bold">
                        {SIGN_IN_GREETING}
                    </Text>
                </View>
                <View className="mt-16 w-full">
                    <View>
                        <Text className="text-base">{SIGN_IN_EMAIL_TITLE}</Text>
                    </View>
                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            required: true,
                            pattern:
                                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
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

                <View className="flex-1 align-middle justify-center">
                    <View className="flex-row justify-center">
                        <Text>{SIGN_IN_CREATE_ACCOUNT_TITLE}</Text>
                        <TouchableOpacity onPress={handleSignUpRedirect}>
                            <Text className="text-cprimary-200">
                                {SIGN_IN_CREATE_ACCOUNT_BUTTON_TITLE}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {isLoading && <OverlayLoading />}
        </>
    );
};

export default SignIn;
