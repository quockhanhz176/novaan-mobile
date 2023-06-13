import { type RootStackParamList } from "App";
import React, { useState, type ReactElement } from "react";
import { Text, TextInput, View, TouchableOpacity } from "react-native";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";

import { authInputStyles } from "@/components/auth/AuthInput";
import AuthButton from "@/components/auth/AuthButton";

interface SignUpProps {
    navigation: NativeStackNavigationProp<RootStackParamList, "SignIn">;
}

const SignUp = (props: SignUpProps): ReactElement<SignUpProps> => {
    const { navigation } = props;

    const [accountId, setAccountId] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSignUp = (): void => {
        console.log("Sign In");
    };

    const handleSignInRedirect = (): void => {
        navigation.navigate("SignIn");
    };

    return (
        <View className="flex-1 my-16 mx-8">
            <View>
                <Text className="text-2xl font-bold">Tạo tài khoản mới</Text>
            </View>
            <View className="mt-8 w-full">
                <Text>Tài khoản email</Text>
                <TextInput
                    className={authInputStyles.textInput}
                    onChangeText={setAccountId}
                    defaultValue={accountId}
                    placeholder="Nhập tài khoản email của bạn"
                />
                <Text className="mt-8">Tên đăng nhập</Text>
                <TextInput
                    className={authInputStyles.textInput}
                    onChangeText={setPassword}
                    defaultValue={password}
                    textContentType="none"
                    placeholder="Nhập tên đăng nhập"
                />
                <Text className="mt-8">Tên</Text>
                <TextInput
                    className={authInputStyles.textInput}
                    onChangeText={setPassword}
                    defaultValue={password}
                    textContentType="none"
                    placeholder="Nhập tên của bạn"
                />
                <Text className="mt-8">Mật khẩu</Text>
                <TextInput
                    className={authInputStyles.textInput}
                    onChangeText={setPassword}
                    defaultValue={password}
                    textContentType="password"
                    placeholder="Nhập mật khẩu của bạn"
                />
                <Text className="mt-8">Nhập lại mật khẩu</Text>
                <TextInput
                    className={authInputStyles.textInput}
                    onChangeText={setPassword}
                    defaultValue={password}
                    textContentType="password"
                    placeholder="Nhập lại mật khẩu của bạn"
                />
            </View>
            <View className="mt-8">
                <AuthButton title="Đăng ký" onPress={handleSignUp} />
            </View>
            <View className="mt-4 flex-row justify-center">
                <Text>Bạn đã có tài khoản? </Text>
                <TouchableOpacity onPress={handleSignInRedirect}>
                    <Text>Đăng nhập</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SignUp;
