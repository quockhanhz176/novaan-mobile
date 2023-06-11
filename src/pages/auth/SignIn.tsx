import { type RootStackParamList } from "App";
import React, { useState, type ReactElement } from "react";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";

import { authInputStyles } from "components/auth/AuthInput";
import AuthButton from "components/auth/AuthButton";

interface SignInProps {
    navigation: NativeStackNavigationProp<RootStackParamList, "SignIn">;
}

const SignIn = (props: SignInProps): ReactElement<SignInProps> => {
    const { navigation } = props;

    const [accountId, setAccountId] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSignIn = (): void => {
        navigation.navigate("MainScreen");
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
                <Text>Tên đăng nhập/Email</Text>
                <TextInput
                    className={authInputStyles.textInput}
                    onChangeText={setAccountId}
                    defaultValue={accountId}
                    placeholder="Nhập tên đăng nhập hoặc email"
                />
                <Text className="mt-8">Mật khẩu</Text>
                <TextInput
                    className={authInputStyles.textInput}
                    onChangeText={setPassword}
                    defaultValue={password}
                    textContentType="password"
                    placeholder="Nhập mật khẩu"
                />
            </View>
            <View className="mt-4">
                <Text style={{ color: "#FFCD80" }}>Quên mật khẩu?</Text>
            </View>
            <View className="mt-4">
                <AuthButton title="Đăng nhập" onPress={handleSignIn} />
            </View>
            <View className="mt-40 flex-row justify-center">
                <Text>Bạn chưa có tài khoản? </Text>
                <TouchableOpacity onPress={handleSignUpRedirect}>
                    <Text>Đăng ký ngay</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SignIn;
