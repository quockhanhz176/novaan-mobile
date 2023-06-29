import WarningAsterisk from "@/common/components/WarningAeterisk";
import {
    ADD_INSTRUCTION_MESSAGE_TITLE,
    ADD_INSTRUCTION_TITLE,
    ADD_INSTRUCTION_DESCRIPTION_PLACEHOLDER,
    ADD_INSTRUCTION_DESCRIPTION_TITLE,
    ADD_INSTRUCTION_IMAGE_BUTTON_TEXT,
    ADD_INSTRUCTION_IMAGE_TITLE,
    ADD_INSTRUCTION_SUBMIT_BUTTON_TITLE,
    ADD_INSTRUCTION_NO_DESCRIPTION_ERROR,
    ADD_INSTRUCTION_WRONG_IMAGE_SIZE,
} from "@/common/strings";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { type RootStackParamList } from "@root/App";
import React, { useState, type FC, useRef } from "react";
import {
    Image,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import IconEvill from "react-native-vector-icons/EvilIcons";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconIon from "react-native-vector-icons/Ionicons";
import { type Asset, launchImageLibrary } from "react-native-image-picker";
import { customColors } from "@root/tailwind.config";
import type Instruction from "../types/Instruction";

export interface AddInstructionParams {
    information:
        | {
              type: "add";
          }
        | {
              type: "edit";
              instruction: Instruction;
          };
    submitInstruction?: (instruction: Instruction) => void;
}

interface AddInstructionProps {
    route: {
        params: AddInstructionParams;
    };
    navigation?: NativeStackNavigationProp<RootStackParamList, "AddIngredient">;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const AddInstruction: FC<AddInstructionProps> = ({
    route: {
        params: { information, submitInstruction },
    },
    navigation,
}: AddInstructionProps) => {
    const [description, setDescription] = useState(
        information.type === "edit" ? information.instruction.description : ""
    );
    const [imageUri, setImageUri] = useState<string | undefined>(
        information.type === "edit"
            ? information.instruction.imageUri
            : undefined
    );
    const imageAsset = useRef<Asset | undefined>(undefined);
    const labelClassName = "text-base font-medium uppercase";

    const navigateBack = (): void => {
        navigation?.pop();
    };

    const getId = (): number =>
        information.type === "add" ? -1 : information.instruction.id;

    const getStep = (): number =>
        information.type === "add" ? -1 : information.instruction.step;

    const submit = (): void => {
        const error = (message: string): void => {
            Alert.alert(ADD_INSTRUCTION_MESSAGE_TITLE, message);
        };

        if (description === "") {
            error(ADD_INSTRUCTION_NO_DESCRIPTION_ERROR);
            return;
        }

        if (
            imageUri != null &&
            imageAsset.current?.fileSize != null &&
            imageAsset.current.fileSize > MAX_IMAGE_SIZE
        ) {
            error(ADD_INSTRUCTION_WRONG_IMAGE_SIZE);
            return;
        }

        submitInstruction?.({
            id: getId(),
            step: getStep(),
            description,
            imageUri,
        });

        navigation?.pop();
    };

    const selectImage = async (): Promise<void> => {
        // pick video
        const photoResponse = await launchImageLibrary({
            mediaType: "photo",
            includeBase64: true,
        });
        if (photoResponse.didCancel === true) {
            return;
        }
        const asset = photoResponse.assets?.[0];
        if (asset == null) {
            console.error("impossible!");
            return;
        }
        setImageUri(asset.uri);
        imageAsset.current = asset;
    };

    const removeImage = (): void => {
        setImageUri(undefined);
    };

    return (
        <ScrollView>
            <View className="h-[55] flex-row items-center justify-between px-1 border-b-2 border-cgrey-platinum">
                <View className="flex-row space-x-2 items-center">
                    <TouchableOpacity
                        onPress={navigateBack}
                        activeOpacity={0.2}
                        className="h-10 w-10 items-center justify-center"
                    >
                        <IconEvill name="close" size={25} color="#000" />
                    </TouchableOpacity>
                    <Text className="text-xl font-medium">
                        {ADD_INSTRUCTION_TITLE}
                    </Text>
                </View>
                <TouchableOpacity className="px-3" onPress={submit}>
                    <Text className="text-lg font-bold text-cprimary-500">
                        {ADD_INSTRUCTION_SUBMIT_BUTTON_TITLE}
                    </Text>
                </TouchableOpacity>
            </View>
            <View className="px-3 py-7 mt-8">
                <Text className={labelClassName}>
                    {ADD_INSTRUCTION_DESCRIPTION_TITLE}
                    <WarningAsterisk />
                </Text>
                <TextInput
                    multiline={true}
                    numberOfLines={2}
                    autoCapitalize="none"
                    placeholder={ADD_INSTRUCTION_DESCRIPTION_PLACEHOLDER}
                    value={description}
                    textAlignVertical="top"
                    onChangeText={setDescription}
                    maxLength={500}
                    className="text-base py-2 first-line:border-cgrey-platinum"
                    // classname doesn't work
                    style={{ borderBottomWidth: 1 }}
                />
                <Text className={labelClassName + " mt-10"}>
                    {ADD_INSTRUCTION_IMAGE_TITLE}
                </Text>
                {imageUri == null ? (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={selectImage}
                        className="h-[380] mt-2 rounded-md overflow-hidden bg-ctertiary border-cprimary-500 align-middle items-center"
                        style={{ borderWidth: 1.3 }}
                    >
                        <View className="flex-row px-5 justify-center items-center space-x-2 h-full">
                            <IconEntypo
                                size={60}
                                name="camera"
                                color={customColors.cprimary[500]}
                            />
                            <Text className="w-[200] text-base text-cprimary-500">
                                {ADD_INSTRUCTION_IMAGE_BUTTON_TEXT}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={selectImage}
                        className="h-[380] mt-2 rounded-md overflow-hidden bg-ctertiary align-middle items-center"
                    >
                        <View className="w-full h-full">
                            <Image
                                className="h-full w-full"
                                source={{ uri: imageUri }}
                            />
                            <TouchableOpacity
                                className="absolute top-3 right-3 w-[30] h-[30] rounded-md items-center justify-center"
                                style={{
                                    backgroundColor: "#00000066",
                                }}
                                onPress={removeImage}
                            >
                                <IconIon
                                    name="close"
                                    size={25}
                                    color={"#ffffff"}
                                />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );
};

export default AddInstruction;
