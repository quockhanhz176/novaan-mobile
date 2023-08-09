import IconLabelButton from "@/common/components/IconLabelButton";
import OverlayLoading from "@/common/components/OverlayLoading";
import { customColors } from "@root/tailwind.config";
import React, { useState, type FC, useCallback } from "react";
import { TouchableOpacity, View, Text, TextInput, Modal } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import searchServices from "../../services/searchServices";
import { USER_SEARCH_NO_USER, USER_SEARCH_TITLE } from "@/common/strings";
import { FlatList } from "react-native-gesture-handler";
import UserSearchResultItem from "./UserSearchResultItem";
import usePagingHook from "@/common/components/PagingHook";
import type UserSearchResult from "../../types/UserSearchResult";
import type PreferenceSuite from "../../types/PreferenceSuite";
import useBooleanHook from "@/common/components/BooleanHook";
import UserProfile from "@/pages/user-profile/UserProfile";
import { getUserIdFromToken } from "@/api/common/utils/TokenUtils";

interface UserSearchProps {
    navigateBack: () => void;
}

interface SearchParams {
    searchString: string;
    preferenceSuite?: PreferenceSuite;
}

const SEARCH_BATCH_SIZE = 10;

const UserSearch: FC<UserSearchProps> = ({ navigateBack }) => {
    const [searchString, setSearchString] = useState("");

    const fetchUser = useCallback(
        async (
            start: number,
            size: number,
            params: SearchParams
        ): Promise<UserSearchResult[] | null> => {
            if (params == null || params.searchString === "") {
                return null;
            }

            const userIdPromise = getUserIdFromToken();

            const results = await searchServices.searchUser(
                params.searchString,
                params.preferenceSuite,
                start,
                size
            );

            if (results == null) {
                return results;
            }

            const userId = await userIdPromise;
            return results.flatMap((value) => {
                if (value.id === userId) {
                    offsetRef.current += 1;
                    return [];
                }
                return value;
            });
        },
        []
    );

    const [searchResults, search, getNext, reset, loading, offsetRef] =
        usePagingHook<UserSearchResult, SearchParams>(
            fetchUser,
            SEARCH_BATCH_SIZE
        );
    const [profileVisible, hideProfile, showProfile] = useBooleanHook();
    const [profileId, setProfileId] = useState<string>();

    const clearSearchString = useCallback(() => {
        setSearchString("");
        reset();
    }, []);

    const onFollowChange = useCallback((_userId: string, newValue: boolean) => {
        offsetRef.current += newValue ? 1 : -1;
    }, []);

    const onItemPress = useCallback((userId: string) => {
        console.log("userId", userId);
        setProfileId(userId);
        showProfile();
    }, []);

    const renderSearchResult = useCallback(
        ({ item }: { item: UserSearchResult }) => (
            <UserSearchResultItem
                user={item}
                onFollowChange={onFollowChange}
                onPress={onItemPress}
            />
        ),
        []
    );

    const onSubmitEditing = useCallback((): void => {
        void search({ searchString });
    }, [searchString]);

    return (
        <>
            <View className="flex-1 bg-white">
                <View className="h-[55] flex-row px-1 items-center border-cgrey-platinum p-3">
                    <TouchableOpacity
                        onPress={navigateBack}
                        activeOpacity={0.2}
                        className="h-10 w-10 items-center justify-center"
                    >
                        <IconMaterial
                            name="arrow-back"
                            size={24}
                            color="#000"
                        />
                    </TouchableOpacity>
                    <Text className="text-lg font-medium">
                        {USER_SEARCH_TITLE}
                    </Text>
                </View>
                <View className="flex-1">
                    <View className="w-full flex-row items-center px-3 pb-3">
                        <View
                            className="rounded-xl border border-cgrey-platinum pl-2 pr-2
                                flex-row flex-1 items-center h-[44] space-x-2 mr-2"
                        >
                            <TextInput
                                autoCapitalize="none"
                                className="flex-1 px-1 text-base"
                                returnKeyType="search"
                                value={searchString}
                                onChangeText={setSearchString}
                                onSubmitEditing={onSubmitEditing}
                            />
                            {searchString !== "" && (
                                <IconLabelButton
                                    iconPack="Ionicons"
                                    iconProps={{
                                        name: "close",
                                        size: 20,
                                        color: customColors.cgrey.dim,
                                    }}
                                    buttonProps={{
                                        onPress: clearSearchString,
                                    }}
                                    buttonClassName="p-[2] space-x-0"
                                />
                            )}
                        </View>
                    </View>
                    <View className="flex-1">
                        {loading ? (
                            <OverlayLoading />
                        ) : (
                            searchResults != null &&
                            (searchResults.length > 0 ? (
                                <FlatList
                                    data={searchResults}
                                    renderItem={renderSearchResult}
                                    onEndReached={getNext}
                                    onEndReachedThreshold={1}
                                />
                            ) : (
                                <View className="flex-1 justify-center items-center">
                                    <Text className="text-cgrey-battleship">
                                        {USER_SEARCH_NO_USER}
                                    </Text>
                                </View>
                            ))
                        )}
                        <LinearGradient
                            colors={["#bbbbbb88", "#bbbbbb22", "#00000000"]}
                            className="h-1 left-0 right-0"
                            style={{
                                position: "absolute",
                                top: 0,
                            }}
                        />
                    </View>
                </View>
            </View>
            <Modal
                animationType="slide"
                visible={profileVisible}
                onRequestClose={hideProfile}
            >
                <UserProfile userId={profileId} onClose={hideProfile} />
            </Modal>
        </>
    );
};

export default UserSearch;
