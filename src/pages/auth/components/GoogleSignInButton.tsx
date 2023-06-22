import React, { type ReactElement } from "react";
import { Image, Text, View, Pressable } from "react-native";

import images from "@/images";
import { SIGN_IN_WITH_GOOGLE } from "@/common/strings";

interface GoogleSignInButtonProps {
    handleSignIn: () => void;
}

const GoogleSignInButton = (
    props: GoogleSignInButtonProps
): ReactElement<GoogleSignInButtonProps> => {
    return (
        <Pressable
            onPress={props.handleSignIn}
            className="border-2 border-cprimary-300 rounded-xl "
        >
            <View className="flex-row items-center px-4 py-2">
                <Image
                    source={images.googleLogo}
                    style={{ width: 36, height: 36 }}
                />
                <Text className="px-4">{SIGN_IN_WITH_GOOGLE}</Text>
            </View>
        </Pressable>
    );
};

export default GoogleSignInButton;
