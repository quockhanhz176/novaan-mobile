import React, { type FC, useContext, useMemo } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import WarningAsterisk from "@/common/components/WarningAeterisk";
import { type NativeStackNavigationProp } from "@react-navigation/native-stack";
import { recipeInformationContext } from "../types/RecipeParams";
import {
    CREATE_RECIPE_COOK_TIME_TITLE,
    CREATE_RECIPE_PDT_SUBTITLE,
    CREATE_RECIPE_PORTION_DIFFICULTY_PLACEHOLDER,
    CREATE_RECIPE_PORTION_DIFFICULTY_TITLE,
    CREATE_RECIPE_PORTION_TITLE,
    CREATE_RECIPE_PORTION_TYPE_PLACEHOLDER,
    CREATE_RECIPE_PREPARE_TIME_TITLE,
} from "@/common/strings";
import DropDown from "./DropDown";
import { customColors } from "@root/tailwind.config";
import RecipeTimeInput from "./RecipeTimeInput";
import portionTypeItems from "../types/PortionTypeItems";
import difficultyItems from "../types/DifficultyItems";
import { type RootStackParamList } from "@/types/navigation";

export interface TitleDescriptionVideoProps {
    navigation?: NativeStackNavigationProp<RootStackParamList, "CreateTip">;
}

const PortionDificultyTime: FC<TitleDescriptionVideoProps> = (
    props: TitleDescriptionVideoProps
) => {
    const {
        isEditing,
        cookTime,
        prepTime,
        portionQuantity,
        portionType,
        difficulty,
        setPortionType,
        setPortionQuantity,
        setDifficulty,
        setCookTime,
        setPrepTime,
    } = useContext(recipeInformationContext);

    // const inputRefs = [
    //     useRef<TextInput>(null),
    //     useRef<TextInput>(null),
    //     useRef<TextInput>(null),
    //     useRef<TextInput>(null),
    //     useRef<TextInput>(null),
    // ];

    // useEffect(() => {
    //     // setup input
    //     const keyboardDidHideSubscription = Keyboard.addListener(
    //         "keyboardDidHide",
    //         () => {
    //             inputRefs.forEach((ref) => {
    //                 ref.current?.blur();
    //             });
    //         }
    //     );

    //     return () => {
    //         keyboardDidHideSubscription?.remove();
    //     };
    // }, []);

    const difficultyDropdownItems = useMemo(
        () =>
            difficultyItems.map((i) => ({
                label: i.label,
                value: i.value.toString(),
            })),
        []
    );

    const portionDropdownItems = useMemo(
        () =>
            portionTypeItems.map((i) => ({
                label: i.label,
                value: i.value.toString(),
            })),
        []
    );

    const labelClassName = "text-base font-medium uppercase";

    const setQuantity = (value: string): void => {
        if (value === "") {
            value = "1";
        }

        const parseValue = parseFloat(value);
        setPortionQuantity(isNaN(parseValue) ? 0 : parseValue);
    };

    const setCookHour = (value: number): void => {
        cookTime.hour = value;
        setCookTime(cookTime);
    };

    const setCookMinute = (value: number): void => {
        cookTime.minute = value;
        setCookTime(cookTime);
    };

    const setPrepHour = (value: number): void => {
        prepTime.hour = value;
        setPrepTime(prepTime);
    };

    const setPrepMinute = (value: number): void => {
        prepTime.minute = value;
        setPrepTime(prepTime);
    };

    const toNumber = (value: string): number => {
        let numberValue = parseFloat(value);
        if (Number.isNaN(numberValue)) {
            numberValue = 0;
        }
        return numberValue;
    };

    const onDifficultyChange = (value: string): void => {
        setDifficulty(toNumber(value));
    };

    const onPortionTypeChange = (value: string): void => {
        setPortionType(toNumber(value));
    };

    return (
        <ScrollView
            className="flex-1 bg-white"
            keyboardShouldPersistTaps="always"
        >
            {!isEditing && (
                <Text className="text-base p-5 bg-ctertiary">
                    {CREATE_RECIPE_PDT_SUBTITLE}
                </Text>
            )}
            <View className="px-3 py-7">
                <Text className={labelClassName}>
                    {CREATE_RECIPE_PORTION_TITLE}
                    <WarningAsterisk />
                </Text>
                <View className="z-10 flex-row space-x-2 justify-center mt-2 px-20">
                    <TextInput
                        // ref={inputRefs[0]}
                        value={
                            portionQuantity === 0
                                ? ""
                                : portionQuantity.toString()
                        }
                        maxLength={4}
                        placeholder="0"
                        keyboardType="decimal-pad"
                        textAlign="center"
                        className="text-base flex-1 py-2 bg-cgrey-seasalt rounded-md"
                        onChangeText={setQuantity}
                    />
                    <View className="flex-2">
                        <DropDown
                            placeholder={CREATE_RECIPE_PORTION_TYPE_PLACEHOLDER}
                            items={portionDropdownItems}
                            selectValue={portionType.toString()}
                            style={{
                                borderWidth: 0,
                                justifyContent: "center",
                                borderTopLeftRadius: 6,
                                borderTopRightRadius: 6,
                                borderBottomLeftRadius: 6,
                                borderBottomRightRadius: 6,
                                backgroundColor: customColors.cgrey.seasalt,
                                alignItems: "center",
                                // borderBottomWidth: 1,
                                borderRadius: 0,
                                borderBottomColor: customColors.cgrey.platinum,
                            }}
                            textStyle={{
                                fontSize: 15,
                                textAlign: "center",
                            }}
                            dropDownContainerStyle={{
                                borderWidth: 0,
                                marginTop: 5,
                            }}
                            listItemContainerStyle={{
                                backgroundColor: customColors.cgrey.seasalt,
                            }}
                            onValueChange={onPortionTypeChange}
                        />
                    </View>
                </View>
                <Text className={labelClassName + " mt-20"}>
                    {CREATE_RECIPE_PORTION_DIFFICULTY_TITLE}
                    <WarningAsterisk />
                </Text>
                <View className="mt-5 z-[3000] px-20">
                    <DropDown
                        selectValue={difficulty.toString()}
                        placeholder={
                            CREATE_RECIPE_PORTION_DIFFICULTY_PLACEHOLDER
                        }
                        items={difficultyDropdownItems}
                        onValueChange={onDifficultyChange}
                        style={{
                            borderWidth: 0,
                            justifyContent: "center",
                            alignItems: "center",
                            // borderBottomWidth: 1,
                            borderRadius: 0,
                            borderBottomColor: customColors.cgrey.platinum,
                            borderTopLeftRadius: 6,
                            borderTopRightRadius: 6,
                            borderBottomLeftRadius: 6,
                            borderBottomRightRadius: 6,
                            backgroundColor: customColors.cgrey.seasalt,
                        }}
                        textStyle={{
                            fontSize: 15,
                            textAlign: "center",
                        }}
                        dropDownContainerStyle={{
                            borderWidth: 0,
                            marginTop: 5,
                        }}
                        listItemContainerStyle={{
                            backgroundColor: customColors.cgrey.seasalt,
                        }}
                    />
                </View>
                <View className="flex-row justify-between mt-20 items-center">
                    <Text className={labelClassName}>
                        {CREATE_RECIPE_PREPARE_TIME_TITLE}
                        <WarningAsterisk />
                    </Text>
                    <RecipeTimeInput
                        value={prepTime}
                        onHourChange={setPrepHour}
                        onMinuteChange={setPrepMinute}
                        // hourInputRef={inputRefs[1]}
                        // minuteInputRef={inputRefs[2]}
                    />
                </View>
                <View className="flex-row justify-between mt-10 items-center">
                    <Text className={labelClassName}>
                        {CREATE_RECIPE_COOK_TIME_TITLE}
                        <WarningAsterisk />
                    </Text>
                    <RecipeTimeInput
                        value={cookTime}
                        onHourChange={setCookHour}
                        onMinuteChange={setCookMinute}
                        // hourInputRef={inputRefs[3]}
                        // minuteInputRef={inputRefs[4]}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

export default PortionDificultyTime;
