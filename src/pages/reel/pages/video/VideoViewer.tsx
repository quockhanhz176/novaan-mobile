import React, {
    useRef,
    type FC,
    useState,
    useEffect,
    memo,
    useContext,
} from "react";
import {
    Text,
    type GestureResponderEvent,
    View,
    TouchableOpacity,
} from "react-native";
import Video from "react-native-video";
import PlayPause from "./components/PlayPause";
import Seeker from "./components/Seeker";
import { useFetchResourceUrl } from "@/api/utils/resourceHooks";
import ButtonColumn from "./components/interact-btn/ButtonColumn";
import ResourceImage from "@/common/components/ResourceImage";
import IconFeather from "react-native-vector-icons/Feather";
import LinearGradient from "react-native-linear-gradient";
import { SCROLL_ITEM_HEIGHT } from "../../commons/constants";
import { ScrollItemContext } from "../../components/scroll-items/ScrollItemv2";

interface VideoViewerProps {
    isPaused?: boolean;
    onShowDetails: () => void;
    onShowProfile: () => void;
}

const VideoViewer: FC<VideoViewerProps> = ({
    isPaused = true,
    onShowDetails,
    onShowProfile,
}: VideoViewerProps) => {
    const { currentPost: post } = useContext(ScrollItemContext);

    const videoRef = useRef<Video>(null);
    const [paused, setPaused] = useState(false);

    const [currentTimeStamp, setCurrentTimeStamp] = useState(0);
    const [videoDuration, setVideoDuration] = useState(1);

    const [playToggle, setPlayToggle] = useState<boolean>();
    const [pauseToggle, setPauseToggle] = useState<boolean>();

    const { resourceUrl, fetchUrl } = useFetchResourceUrl();

    useEffect(() => {
        if (post == null) {
            return;
        }
        void fetchUrl(post.video)
            .then((success) => {
                if (!success) {
                    // Do something to alert user or retry
                }
            })
            .catch(console.log);
    }, [post]);

    useEffect(() => {
        // Avoid unecessary render
        if (isPaused === paused) {
            return;
        }
        setPaused(isPaused);
    }, [isPaused]);

    const onVideoPress = (e: GestureResponderEvent): void => {
        const pauseState = !paused;
        setPaused(pauseState);
        if (pauseState) {
            setPauseToggle(pauseToggle !== undefined ? !pauseToggle : true);
        } else {
            setPlayToggle(playToggle !== undefined ? !playToggle : true);
        }
    };

    const onSeek = (progress: number): void => {
        videoRef.current?.seek(progress * videoDuration);
    };

    const onVideoError = async (error): Promise<void> => {
        if (post == null) {
            return;
        }

        console.log("VideoViewer - video error:" + JSON.stringify(error));
        if (error.error?.what === 1 && error.error?.extra === -1005) {
            void fetchUrl(post.video);
        }
    };

    if (post == null) {
        return <View></View>;
    }

    return (
        <View
            className="absolute top-0 left-0 bottom-0 right-0 bg-black"
            style={{ height: SCROLL_ITEM_HEIGHT }}
            onTouchEnd={onVideoPress}
        >
            {resourceUrl !== "" && (
                <Video
                    paused={paused}
                    ref={videoRef}
                    source={{
                        uri: resourceUrl,
                    }}
                    className="absolute top-0 left-0 bottom-0 right-0 w-full h-full"
                    resizeMode="contain"
                    repeat
                    onLoad={({ duration }) => {
                        videoRef.current?.seek(0);
                        setVideoDuration(duration);
                    }}
                    onProgress={({ currentTime }) => {
                        // Update timestamp each 2 seconds to avoid re-rendering
                        if (currentTime - currentTimeStamp <= 2) {
                            return;
                        }
                        setCurrentTimeStamp(currentTime);
                    }}
                    onError={onVideoError}
                    minLoadRetryCount={3}
                />
            )}
            <PlayPause showToggle={pauseToggle} icon="pause" />
            <PlayPause showToggle={playToggle} icon="play" />
            <View className="absolute bottom-0 left-0 right-0 flex-col-reverse w-full h-full">
                <LinearGradient
                    colors={["#ffffff00", "#00000066"]}
                    className="absolute bottom-0 top-0 left-0 right-0 h-[140]"
                />
                <Seeker
                    progress={currentTimeStamp / videoDuration}
                    onSeek={onSeek}
                />
                <View className="flex-row-reverse items-end">
                    <ButtonColumn onShowDetails={onShowDetails} />
                    <View className="flex-1 pl-6 pr-6">
                        <TouchableOpacity
                            className="flex-row items-center space-x-3"
                            // TODO: Add on press to change to profile here
                            onPress={onShowProfile}
                            onPressOut={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <View className="bg-xanthous w-[35] h-[35] rounded-full items-center justify-center overflow-hidden">
                                {post.creator.avatar == null ||
                                post.creator.avatar === "" ? (
                                    <IconFeather name="user" size={30} />
                                ) : (
                                    <ResourceImage
                                        resourceId={post.creator.avatar}
                                        className="h-full w-full"
                                    />
                                )}
                            </View>
                            <Text className="text-white font-medium">
                                {post.creator.username}
                            </Text>
                        </TouchableOpacity>
                        <Text
                            className="text-white pt-2"
                            style={{ fontSize: 15 }}
                        >
                            {post.title}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default memo(VideoViewer);
