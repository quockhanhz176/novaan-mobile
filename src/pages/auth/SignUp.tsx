import { type RootStackParamList } from "App";
import React, { useState, type ReactElement } from "react";
import { Text, TextInput, View, TouchableOpacity, Alert } from "react-native";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";

import { authInputStyles } from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import {
    AUTH_EMAIL_INVALID,
    AUTH_PASSWORD_TOO_SHORT,
    COMMON_EMPTY_FIELD_NOT_ALLOWED,
    COMMON_SERVER_CONNECTION_FAIL_ERROR,
    SIGN_UP_EMAIL_EXISTS_ERROR,
    SIGN_UP_EMAIL_PLACEHOLDER,
    SIGN_UP_EMAIL_TITLE,
    SIGN_UP_FAIL_TITLE,
    SIGN_UP_PASSWORD_PLACEHOLDER,
    SIGN_UP_PASSWORD_TITLE,
    SIGN_UP_REENTER_PASSWORD_DIFFERENT_ERROR,
    SIGN_UP_REENTER_PASSWORD_PLACEHOLDER,
    SIGN_UP_REENTER_PASSWORD_TITLE,
    SIGN_UP_SIGN_IN_BUTTON_TITLE,
    SIGN_UP_SIGN_IN_TITLE,
    SIGN_UP_SIGN_UP_BUTTON_TITLE,
    SIGN_UP_SUCCESS_MESSAGE,
    SIGN_UP_SUCCESS_TITLE,
    SIGN_UP_USERNAME_EXISTS_ERROR,
    COMMON_UNKNOWN_ERROR,
    SIGN_UP_NAME_PLACEHOLDER,
    SIGN_UP_NAME_TITLE,
    AUTH_NAME_INVALID,
} from "@/common/strings";
import authApi from "@/api/auth/AuthApi";
import OverlayLoading from "@/components/common/OverlayLoading";
import { useForm, Controller } from "react-hook-form";
import ErrorText from "@/components/common/ErrorText";

interface SignUpProps {
    navigation: NativeStackNavigationProp<RootStackParamList, "SignUp">;
}

interface FormData {
    displayName: string;
    email: string;
    password: string;
    reenterPassword: string;
}

const SignUp = (props: SignUpProps): ReactElement<SignUpProps> => {
    const { navigation } = props;

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            displayName: "",
            email: "",
            password: "",
            reenterPassword: "",
        },
        mode: "all",
    });

    const handleSignUp = async (data: FormData): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await authApi.signUp(
                data.displayName,
                data.email,
                data.password
            );
            if (!response.success) {
                const failureMessage =
                    response.reason === "email exists"
                        ? SIGN_UP_EMAIL_EXISTS_ERROR
                        : response.reason === "username exists"
                        ? SIGN_UP_USERNAME_EXISTS_ERROR
                        : COMMON_UNKNOWN_ERROR;
                Alert.alert(SIGN_UP_FAIL_TITLE, failureMessage);
                return;
            }

            Alert.alert(SIGN_UP_SUCCESS_TITLE, SIGN_UP_SUCCESS_MESSAGE);
            navigation.navigate("SignIn");
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            console.log(`error: ${error.toString()}`);
            Alert.alert(
                SIGN_UP_FAIL_TITLE,
                COMMON_SERVER_CONNECTION_FAIL_ERROR
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignInRedirect = (): void => {
        navigation.navigate("SignIn");
    };

    return (
        <>
            <View className="flex-1 mt-20 mx-8">
                <View>
                    <Text className="text-4xl font-bold">
                        Tạo tài khoản mới
                    </Text>
                </View>
                <View className="mt-10 w-full">
                    <Text>{SIGN_UP_EMAIL_TITLE}</Text>
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
                                placeholder={SIGN_UP_EMAIL_PLACEHOLDER}
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

                    <Text className="mt-6">{SIGN_UP_NAME_TITLE}</Text>
                    <Controller
                        control={control}
                        name="displayName"
                        rules={{
                            required: true,
                            pattern: /^([a-zA-Z]+\s?)+[a-zA-Z]+$/,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className={authInputStyles.textInput}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder={SIGN_UP_NAME_PLACEHOLDER}
                            />
                        )}
                    />
                    <View className="mt-2">
                        {errors.displayName?.type === "required" && (
                            <ErrorText>
                                {COMMON_EMPTY_FIELD_NOT_ALLOWED}
                            </ErrorText>
                        )}
                        {errors.displayName?.type === "pattern" && (
                            <ErrorText>{AUTH_NAME_INVALID}</ErrorText>
                        )}
                    </View>

                    <Text className="mt-6">{SIGN_UP_PASSWORD_TITLE}</Text>
                    <Controller
                        control={control}
                        name="password"
                        rules={{
                            required: true,
                            minLength: 8,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className={authInputStyles.textInput}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                textContentType="password"
                                secureTextEntry={true}
                                placeholder={SIGN_UP_PASSWORD_PLACEHOLDER}
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

                    <Text className="mt-6">
                        {SIGN_UP_REENTER_PASSWORD_TITLE}
                    </Text>
                    <Controller
                        control={control}
                        name="reenterPassword"
                        rules={{
                            required: true,
                            validate: (value, formValues) =>
                                value === watch("password"),
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                className={authInputStyles.textInput}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                textContentType="password"
                                secureTextEntry={true}
                                placeholder={
                                    SIGN_UP_REENTER_PASSWORD_PLACEHOLDER
                                }
                            />
                        )}
                    />
                    <View className="mt-2">
                        {errors.reenterPassword?.type === "required" && (
                            <ErrorText>
                                {COMMON_EMPTY_FIELD_NOT_ALLOWED}
                            </ErrorText>
                        )}
                        {errors.reenterPassword?.type === "validate" && (
                            <ErrorText>
                                {SIGN_UP_REENTER_PASSWORD_DIFFERENT_ERROR}
                            </ErrorText>
                        )}
                    </View>
                </View>

                <View className="mt-8">
                    <AuthButton
                        title={SIGN_UP_SIGN_UP_BUTTON_TITLE}
                        onPress={handleSubmit(handleSignUp)}
                    />
                </View>

                <View className="flex-1 items-center justify-center">
                    <View className="flex-row justify-center">
                        <Text>{SIGN_UP_SIGN_IN_TITLE}</Text>
                        <TouchableOpacity onPress={handleSignInRedirect}>
                            <Text className="text-cprimary-300">
                                {SIGN_UP_SIGN_IN_BUTTON_TITLE}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {isLoading && <OverlayLoading />}
        </>
    );
};

export default SignUp;
