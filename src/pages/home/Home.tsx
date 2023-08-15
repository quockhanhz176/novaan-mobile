import React, {
    useState,
    type FC,
    useEffect,
    useCallback,
    useRef,
} from "react";
import {
    FlatList,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
} from "react-native";
import TitleSection from "./components/TitleSection";
import UserItem from "./components/UserItem";
import homeServices from "./services/homeServices";
import PostListSection from "./components/PostListSection";
import {
    HOME_ADVANCED_SEARCH_BUTTON,
    HOME_ADVANCED_SEARCH_INTRODUCTION,
    HOME_ADVANCED_SEARCH_TITLE,
    HOME_FOLLOWING_POSTS_TITLE,
    HOME_NEWEST_POSTS_TITLE,
    HOME_POST_DETAILS_TITLE,
    HOME_TRENDING_AUTHORS_TITLE,
    HOME_TRENDING_RECIPES_TITLE,
    HOME_TRENDING_TIPS_TITLE,
} from "@/common/strings";
import { type BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { type BottomTabParamList } from "@/types/navigation";
import useBooleanHook from "@/common/components/BooleanHook";
import UserProfile from "../user-profile/UserProfile";
import IconMaterial from "react-native-vector-icons/MaterialIcons";
import InfiniteScroll from "../reel/InfiniteScrollv2";
import { type MinimalPost } from "@/api/post/types/PostListResponse";
import { type PostType } from "@/api/post/types/PostResponse";
import { type RecommendationPost } from "./types/RecommendationPost";
import type RecommendationUserResponse from "@/api/recommendation/types/RecommendationUserResponse";
import { MD2Colors } from "react-native-paper";
import { type Undefinable } from "@/types/app";

interface HomeProps {
    navigation: BottomTabNavigationProp<BottomTabParamList, "Home">;
}

const Home: FC<HomeProps> = ({ navigation }: HomeProps) => {
    const [trendingAuthors, setTrendingAuthors] = useState<
        RecommendationUserResponse[]
    >([]);
    const [trendingRecipes, setTrendingRecipes] = useState<
        RecommendationPost[]
    >([]);
    const [trendingTips, setTrendingTips] = useState<RecommendationPost[]>([]);
    const [newestPosts, setNewestPosts] = useState<RecommendationPost[]>([]);
    const [followingPosts, setFollowingPosts] = useState<RecommendationPost[]>(
        []
    );
    const [profileVisible, hideProfile, showProfile] = useBooleanHook();
    const profileIdRef = useRef<string>();
    const [fullPostVisible, hideFullPost, showFullPost] = useBooleanHook();
    const [loading, setLoading] = useState(true);

    const [viewItem, setViewItem] =
        useState<Undefinable<MinimalPost>>(undefined);

    useEffect(() => {
        Promise.all([
            homeServices.getTrendingAuthors().then((value) => {
                value != null && setTrendingAuthors(value);
            }),
            homeServices.getTrendingRecipes().then((value) => {
                value != null && setTrendingRecipes(value);
            }),
            homeServices.getTrendingTips().then((value) => {
                value != null && setTrendingTips(value);
            }),
            homeServices.getNewestPosts().then((value) => {
                value != null && setNewestPosts(value);
            }),
            homeServices.getPostsFromFollowings().then((value) => {
                value != null && setFollowingPosts(value);
            }),
        ])
            .then(() => {
                setLoading(false);
            })
            .catch(() => {});
    }, []);

    const onAdvancedSearchClick = useCallback(() => {
        navigation.navigate("Search", {
            advancedSearchShown: true,
        });
    }, []);

    const onPostClick = useCallback((postId: string, postType: PostType) => {
        setViewItem({
            postId,
            postType: postType === "recipe" ? "Recipe" : "CulinaryTip",
        });
        showFullPost();
    }, []);

    const onUserClick = useCallback((userId: string) => {
        profileIdRef.current = userId;
        showProfile();
    }, []);

    return (
        <View className="flex-1 w-full bg-white">
            <ScrollView>
                <View className="h-[30]" />
                <PostListSection
                    title={HOME_TRENDING_RECIPES_TITLE}
                    data={trendingRecipes}
                    onItemPress={onPostClick}
                />
                {trendingAuthors.length > 0 && (
                    <TitleSection title={HOME_TRENDING_AUTHORS_TITLE}>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            data={trendingAuthors}
                            renderItem={({ item }) => (
                                <UserItem user={item} onPress={onUserClick} />
                            )}
                            ListHeaderComponent={() => <View className="w-4" />}
                            ListFooterComponent={() => <View className="w-4" />}
                            ItemSeparatorComponent={() => (
                                <View className="w-3" />
                            )}
                        />
                    </TitleSection>
                )}
                <PostListSection
                    title={HOME_TRENDING_TIPS_TITLE}
                    data={trendingTips}
                    onItemPress={onPostClick}
                />
                <View className="mb-12 rounded-lg bg-ctertiary p-4 mx-4">
                    <View className="flex-row">
                        <View className="flex-1">
                            <Text className="text-xl text-capitalize font-bold">
                                {HOME_ADVANCED_SEARCH_TITLE}
                            </Text>
                            <Text className="text-base mt-2">
                                {HOME_ADVANCED_SEARCH_INTRODUCTION}
                            </Text>
                        </View>
                    </View>
                    <View className="items-end mt-6 mb-2">
                        <TouchableOpacity
                            className="bg-cprimary-500 px-6 py-1 rounded-full"
                            onPress={onAdvancedSearchClick}
                        >
                            <Text className="text-white font-bold text-lg">
                                {HOME_ADVANCED_SEARCH_BUTTON}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <PostListSection
                    title={HOME_NEWEST_POSTS_TITLE}
                    data={newestPosts}
                    onItemPress={onPostClick}
                />
                <PostListSection
                    title={HOME_FOLLOWING_POSTS_TITLE}
                    data={followingPosts}
                    onItemPress={onPostClick}
                />
            </ScrollView>
            {loading && (
                <View className="absolute top-0 bottom-0 left-0 right-0 bg-white">
                    <ActivityIndicator
                        animating={true}
                        color={MD2Colors.red400}
                        size={100}
                        className="absolute top-0 bottom-0 right-0 left-0"
                    />
                </View>
            )}
            <Modal
                animationType="slide"
                visible={profileVisible}
                onRequestClose={hideProfile}
            >
                <UserProfile
                    userId={profileIdRef?.current}
                    onClose={hideProfile}
                />
            </Modal>
            <Modal
                animationType="slide"
                visible={fullPostVisible}
                onRequestClose={hideFullPost}
            >
                <View
                    style={{ height: 50 }}
                    className="flex-row justify-between items-center"
                >
                    <TouchableOpacity
                        delayPressIn={0}
                        onPress={hideFullPost}
                        className="px-4 py-2 rounded-lg"
                    >
                        <IconMaterial name="arrow-back" size={24} />
                    </TouchableOpacity>
                    <View className="flex-1 items-center mr-12">
                        <Text className="text-base font-semibold">
                            {HOME_POST_DETAILS_TITLE}
                        </Text>
                    </View>
                </View>
                {viewItem != null && <InfiniteScroll appendId={viewItem} />}
            </Modal>
        </View>
    );
};

export default Home;
