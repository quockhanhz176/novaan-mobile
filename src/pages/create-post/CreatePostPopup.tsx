import React, { useRef, type FC, useEffect, Fragment } from "react";
import { TouchableOpacity, Text, View, Animated } from "react-native";
import IconEvill from "react-native-vector-icons/EvilIcons";
import IconAnt from "react-native-vector-icons/AntDesign";
import TouchableView from "@/common/components/TouchableView";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { type RootStackParamList } from "App";
import {
    CREATE_POST_UPLOAD_TITLE,
    CREATE_POST_UPLOAD_RECIPE_TITLE,
    CREATE_POST_UPLOAD_TIP_TITLE,
} from "@/common/strings";

interface CreatePostPopupProps {
    visible?: boolean;
    setVisible?: (boolean) => void;
    navigation: NativeStackNavigationProp<RootStackParamList, "MainScreens">;
}

// TODO: not render CreatePostPopup when hidden without compromising animation
const CreatePostPopup: FC<CreatePostPopupProps> = (
    props: CreatePostPopupProps
) => {
    const { visible = true, setVisible = (_visible) => {}, navigation } = props;
    const dismissModal = (): void => {
        setVisible(false);
    };
    const openCreateTip = (): void => {
        navigation.navigate("CreateTip");
        dismissModal();
    };
    const slideAnimation = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnimation, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnimation, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const createButtonCn = "flex-row items-center space-x-6";
    const iconWrapperCn =
        "w-[50] h-[50]  bg-[#f2f2f2] items-center justify-center rounded-full";
    const buttonTextCn = "text-base";
    return (
        <Fragment>
            {visible && (
                <TouchableView
                    onPress={dismissModal}
                    className="absolute top-0 left-0 right-0 bottom-0 bg-[#00000033]"
                />
            )}
            <Animated.View
                className="absolute bottom-0 bg-white w-full px-[15] pt-[15] rounded-t-lg"
                style={{
                    transform: [
                        {
                            translateY: slideAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [200, 0],
                            }),
                        },
                    ],
                }}
            >
                <View className="flex-row justify-between">
                    <Text className="text-xl font-medium">
                        {CREATE_POST_UPLOAD_TITLE}
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            setVisible(false);
                        }}
                    >
                        <IconEvill name="close" size={30} color="#000" />
                    </TouchableOpacity>
                </View>
                <View className="mt-7 space-y-5 pb-6">
                    <TouchableOpacity className={createButtonCn}>
                        <View className={iconWrapperCn}>
                            <IconAnt name="upload" size={20} />
                        </View>
                        <Text className={buttonTextCn}>
                            {CREATE_POST_UPLOAD_RECIPE_TITLE}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={createButtonCn}
                        onPress={openCreateTip}
                    >
                        <View className={iconWrapperCn}>
                            <IconAnt name="form" size={20} />
                        </View>
                        <Text className={buttonTextCn}>
                            {CREATE_POST_UPLOAD_TIP_TITLE}
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </Fragment>
    );
};

export default CreatePostPopup;
