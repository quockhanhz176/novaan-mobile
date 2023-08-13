import React, {
    useEffect,
    type ReactElement,
    useState,
    useContext,
    memo,
    useCallback,
} from "react";
import { useUserFollower } from "@/api/profile/ProfileApi";
import { FlatList, View, Modal } from "react-native";
import { type MinimalUserInfo } from "@/api/profile/types";
import { type Undefinable } from "@/types/app";
import UserProfile, { UserProfileContext } from "../../UserProfile";
import EmptyFollowing from "./components/EmptyFollowing";
import { BOTTOM_NAV_HEIGHT, FOLLOWING_ITEM_HEIGHT } from "@/common/constants";
import FollowerItem from "./components/FollowerItem";

const Following = (): ReactElement => {
    const { userInfo } = useContext(UserProfileContext);
    const {
        content,
        ended,
        getNext: getNextFollower,
    } = useUserFollower(userInfo?.userId);

    const [viewingProfile, setViewProfile] = useState(false);
    const [selectedProfile, setSelectedProfile] =
        useState<Undefinable<MinimalUserInfo>>(undefined);

    const fetchMoreFollower = async (): Promise<void> => {
        if (ended) {
            return;
        }
        await getNextFollower();
    };

    useEffect(() => {
        if (userInfo == null) {
            return;
        }
        void fetchMoreFollower();
    }, [userInfo]);

    const handleItemPress = (item: MinimalUserInfo): void => {
        setSelectedProfile(item);
        setViewProfile(true);
    };

    const handleFetchProfileFailed = (): void => {
        setSelectedProfile(undefined);
        setViewProfile(false);
    };

    const renderItem = useCallback(
        ({ item }: { item: MinimalUserInfo }): any => {
            return (
                <FollowerItem followInfo={item} onItemPress={handleItemPress} />
            );
        },
        []
    );

    return (
        <View className="flex-1">
            {content == null || content.length === 0 ? (
                <EmptyFollowing />
            ) : (
                <FlatList
                    data={content}
                    className="w-full"
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ marginTop: 8 }}
                    renderItem={renderItem}
                    getItemLayout={(_, index) => ({
                        length: FOLLOWING_ITEM_HEIGHT,
                        offset: FOLLOWING_ITEM_HEIGHT * index,
                        index,
                    })}
                    style={{ paddingBottom: BOTTOM_NAV_HEIGHT }}
                    onEndReached={fetchMoreFollower}
                    showsVerticalScrollIndicator={false}
                />
            )}
            <Modal animationType="slide" visible={viewingProfile}>
                <UserProfile
                    userId={selectedProfile?.id}
                    onClose={handleFetchProfileFailed}
                />
            </Modal>
        </View>
    );
};

export default memo(Following);
