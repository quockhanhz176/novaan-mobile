import React, { useEffect, type ReactElement, useState, useMemo } from "react";
import { useUserFollowing } from "@/api/profile/ProfileApi";
import { FlatList, View, Modal } from "react-native";
import FollowingItem from "./components/FollowingItem";
import { content } from "@root/tailwind.config";
import { type MinimalUserInfo } from "@/api/profile/types";
import { type Undefinable } from "@/types/app";
import UserProfile from "../../UserProfile";

interface FollowingProps {
    userId?: string;
    setFollowingCount?: (setter: (value: number) => number) => void;
}

const Following = ({
    userId,
    setFollowingCount,
}: FollowingProps): ReactElement<FollowingProps> => {
    const {
        content: following,
        ended,
        getNext,
        refresh,
    } = useUserFollowing(userId);

    const [loading, setLoading] = useState(false);

    const [viewingProfile, setViewProfile] = useState(false);
    const [selectedProfile, setSelectedProfile] =
        useState<Undefinable<MinimalUserInfo>>(undefined);

    const isEmpty = useMemo(
        () => ended && content.length === 0,
        [content, ended]
    );

    useEffect(() => {
        refresh();
        void getNext();
    }, [userId]);

    const handleGetMoreFollowing = async (): Promise<void> => {
        if (ended) {
            return;
        }
        setLoading(true);
        await getNext();
        setLoading(false);
    };

    const handleItemPress = (item: MinimalUserInfo): void => {
        setSelectedProfile(item);
        setViewProfile(true);
    };

    const handleFetchProfileFailed = (): void => {
        setSelectedProfile(undefined);
        setViewProfile(false);
    };

    return (
        <View className="flex-1">
            <FlatList
                style={{ display: isEmpty ? "none" : "flex" }}
                data={following}
                className="w-full"
                keyExtractor={(item) => item.userId}
                contentContainerStyle={{ marginTop: 8 }}
                renderItem={({ item }) => (
                    <FollowingItem
                        followInfo={item}
                        onItemPress={handleItemPress}
                        setFollowingCount={setFollowingCount}
                    />
                )}
                onEndReached={handleGetMoreFollowing}
                onEndReachedThreshold={1}
                refreshing={loading}
                showsVerticalScrollIndicator={false}
            />
            <Modal animationType="slide" visible={viewingProfile}>
                <UserProfile
                    userId={selectedProfile?.userId}
                    onClose={handleFetchProfileFailed}
                />
            </Modal>
        </View>
    );
};

export default Following;
