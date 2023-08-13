import React, {
    useRef,
    useState,
    useEffect,
    useContext,
    forwardRef,
    useImperativeHandle,
    type ReactElement,
    useCallback,
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
import IconFeather from "react-native-vector-icons/Feather";
import LinearGradient from "react-native-linear-gradient";
import { SCROLL_ITEM_HEIGHT } from "../../commons/constants";
import { ScrollItemContext } from "../../components/scroll-items/ScrollItemv2";
import { throttle } from "lodash";
import { type Undefinable } from "@/types/app";
import FastImage from "react-native-fast-image";

interface VideoViewerProps {
    onShowDetails: () => void;
    onShowProfile: () => void;
    pauseVideo: () => void;
    resumeVideo: () => void;
    paused: boolean;
}

interface VideoViewerWrapProps {
    isVideoPaused: boolean;
    onShowDetails: () => void;
    onShowProfile: () => void;
}

const VideoViewer = ({
    onShowDetails,
    onShowProfile,
    pauseVideo,
    resumeVideo,
    paused,
}: VideoViewerProps): ReactElement<VideoViewerProps> => {
    const { currentPost } = useContext(ScrollItemContext);

    const videoRef = useRef<Video>(null);

    const [currentTimeStamp, setCurrentTimeStamp] = useState(0);
    const [videoDuration, setVideoDuration] = useState(1);

    const [playToggle, setPlayToggle] = useState<boolean>();
    const [pauseToggle, setPauseToggle] = useState<boolean>();

    const { resourceUrl, fetchUrl } = useFetchResourceUrl();

    useEffect(() => {
        if (currentPost == null) {
            return;
        }
        void fetchUrl(currentPost.video)
            .then((success) => {
                if (!success) {
                    // Do something to alert user or retry
                }
            })
            .catch(console.log);
    }, [currentPost]);

    const toggleVideoPlayPause = useCallback(
        throttle(
            (
                paused: boolean,
                playToggle: Undefinable<boolean>,
                pauseToggle: Undefinable<boolean>
            ) => {
                if (!paused) {
                    setPauseToggle(
                        pauseToggle !== undefined ? !pauseToggle : true
                    );
                    pauseVideo();
                } else {
                    setPlayToggle(
                        playToggle !== undefined ? !playToggle : true
                    );
                    resumeVideo();
                }
            },
            1000
        ),
        []
    );

    const onVideoPress = (e: GestureResponderEvent): void => {
        toggleVideoPlayPause(paused, playToggle, pauseToggle);
    };

    const onSeek = (progress: number): void => {
        setCurrentTimeStamp(videoDuration * progress);
        videoRef.current?.seek(progress * videoDuration);
    };

    const onVideoError = async (error): Promise<void> => {
        if (currentPost == null) {
            return;
        }

        console.log("VideoViewer - video error:" + JSON.stringify(error));
        if (error.error?.what === 1 && error.error?.extra === -1005) {
            void fetchUrl(currentPost.video);
        }
    };

    if (currentPost == null) {
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
                    playInBackground={false}
                    playWhenInactive={false}
                    onLoad={({ duration }) => {
                        setVideoDuration(duration);
                        paused && pauseVideo();
                    }}
                    onProgress={({ currentTime }) => {
                        // Update timestamp each 2 seconds to avoid re-rendering
                        if (currentTime - currentTimeStamp <= 1.2) {
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
                                {currentPost.creator.avatar == null ||
                                currentPost.creator.avatar === "" ? (
                                    <IconFeather name="user" size={30} />
                                ) : (
                                    <FastImage
                                        source={{
                                            uri: currentPost.creator.avatar,
                                        }}
                                        className="h-full w-full"
                                    />
                                )}
                            </View>
                            <Text className="text-white font-medium">
                                {currentPost.creator.username}
                            </Text>
                        </TouchableOpacity>
                        <Text
                            className="text-white pt-2"
                            style={{ fontSize: 15 }}
                        >
                            {currentPost.title}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const VideoViewerWrap = forwardRef<any, VideoViewerWrapProps>((props, ref) => {
    const [paused, setPaused] = useState(props.isVideoPaused);

    useEffect(() => {
        setPaused(props.isVideoPaused);
    }, [props.isVideoPaused]);

    const pauseVideo = useCallback((): void => {
        setPaused(true);
    }, []);

    const resumeVideo = useCallback((): void => {
        setPaused(false);
    }, []);

    useImperativeHandle(
        ref,
        () => ({
            pauseVideo,
            resumeVideo,
        }),
        []
    );

    return (
        <VideoViewer
            {...props}
            paused={paused}
            pauseVideo={pauseVideo}
            resumeVideo={resumeVideo}
        />
    );
});

VideoViewerWrap.displayName = "VideoViewerWrap";

export default VideoViewerWrap;
