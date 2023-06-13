import { type RootStackParamList } from "App";
import React, { useState, type ReactElement } from "react";
import { Text, TextInput, View, TouchableOpacity, Alert } from "react-native";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";

import { authInputStyles } from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";
import {
    SIGN_IN_WRONG_USERNAME_PASSWORD,
    SIGN_IN_ERROR_OCCURED,
    COMMON_ALERT_TITLE,
    COMMON_FIELD_WRONG_FORMAT,
    SIGN_IN_EMAIL_TITLE,
    COMMON_EMPTY_FIELD_NOT_ALLOWED,
    SIGN_IN_EMAIL_PLACEHOLDER,
    SIGN_IN_PASSWORD_TITLE,
    SIGN_IN_PASSWORD_PLACEHOLDER,
    SIGN_IN_SIGN_IN_BUTTON_TITLE,
    SIGN_IN_FORGET_PASSWORD,
    SIGN_IN_CREATE_ACCOUNT_TITLE,
    SIGN_IN_CREATE_ACCOUNT_BUTTON_TITLE,
} from "@/common/messages";
import authApi from "@/api/auth/AuthApi";
import { COLOR_CRIMSON } from "@/common/colors";
import { validateText } from "@/common/utils";

interface SignInProps {
    navigation: NativeStackNavigationProp<RootStackParamList, "SignIn">;
}

const SignIn = (props: SignInProps): ReactElement<SignInProps> => {
    const { navigation } = props;

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [validEmail, setValidEmail] = useState(true);
    const [validPassword, setValidPassword] = useState(true);

    const errorTextDefaultClass = `italic text-[${COLOR_CRIMSON}] text-xs`;

    const handleSignIn = async (): Promise<void> => {
        if (!validEmail || !validPassword) {
            Alert.alert(COMMON_ALERT_TITLE, COMMON_FIELD_WRONG_FORMAT);
            return;
        }

        const promise = authApi.signIn(email, password);
        try {
            const response = await promise;
            if (response.success) {
                navigation.navigate("MainScreen");
            } else {
                alert(SIGN_IN_WRONG_USERNAME_PASSWORD);
            }
        } catch (error) {
            alert(SIGN_IN_ERROR_OCCURED);
            console.error(`fail: ${String(error)}`);
        }
    };

    const validateEmail = (): void => {
        validateText(email, /\s*[^\s]+\s*/, setValidEmail);
    };
    const validatePassword = (): void => {
        validateText(password, /\s*[^\s]+\s*/, setValidPassword);
    };

    const handleSignUpRedirect = (): void => {
        navigation.navigate("SignUp");
    };

    return (
        <View className="flex-1 my-16 mx-8">
            <View>
                <Text className="text-4xl font-bold">Xin chào</Text>
            </View>
            <View className="mt-16 w-full">
                <View>
                    <Text>{SIGN_IN_EMAIL_TITLE}</Text>
                    <Text
                        className={
                            errorTextDefaultClass +
                            " " +
                            (validEmail ? "hidden" : "flex")
                        }
                    >
                        {COMMON_EMPTY_FIELD_NOT_ALLOWED}
                    </Text>
                </View>
                <TextInput
                    className={authInputStyles.textInput}
                    onChangeText={setEmail}
                    defaultValue={email}
                    placeholder={SIGN_IN_EMAIL_PLACEHOLDER}
                    onTextInput={validateEmail}
                />
                <View>
                    <Text className="mt-8">{SIGN_IN_PASSWORD_TITLE}</Text>
                    <Text
                        className={
                            errorTextDefaultClass +
                            " " +
                            (validPassword ? "hidden" : "flex")
                        }
                    >
                        {COMMON_EMPTY_FIELD_NOT_ALLOWED}
                    </Text>
                </View>
                <TextInput
                    className={authInputStyles.textInput}
                    onChangeText={setPassword}
                    defaultValue={password}
                    textContentType="password"
                    placeholder={SIGN_IN_PASSWORD_PLACEHOLDER}
                    secureTextEntry={true}
                    onTextInput={validatePassword}
                />
            </View>
            <View className="mt-4">
                <Text style={{ color: "#FFCD80" }}>{SIGN_IN_FORGET_PASSWORD}</Text>
            </View>
            <View className="mt-4">
                <AuthButton
                    title={SIGN_IN_SIGN_IN_BUTTON_TITLE}
                    onPress={handleSignIn}
                />
            </View>
            <View className="mt-40 flex-row justify-center">
                <Text>{SIGN_IN_CREATE_ACCOUNT_TITLE}</Text>
                <TouchableOpacity onPress={handleSignUpRedirect}>
                    <Text>{SIGN_IN_CREATE_ACCOUNT_BUTTON_TITLE}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SignIn;
