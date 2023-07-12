import React, {
    useRef,
    type FC,
    useState,
    useCallback,
    useEffect,
} from "react";
import { type GestureResponderEvent, View } from "react-native";
import Video from "react-native-video";
import PlayPause from "./PlayPause";
import Seeker from "./Seeker";
import { useFetchResourceUrl } from "@/api/utils/resourceHooks";

interface VideoViewrProps {
    videoId: string;
    isPaused?: boolean;
}

const VideoViewer: FC<VideoViewrProps> = ({
    videoId,
    isPaused: pausedFromHigherUp = true,
}: VideoViewrProps) => {
    const videoRef = useRef<Video>(null);
    const [paused, setPaused] = useState(pausedFromHigherUp);
    const [currentTimeStamp, setCurrentTimeStamp] = useState(0);
    const [playToggle, setPlayToggle] = useState<boolean>();
    const [pauseToggle, setPauseToggle] = useState<boolean>();
    const videoDuration = useRef(1);

    const { resourceUrl, fetchUrl } = useFetchResourceUrl();

    useEffect(() => {
        void fetchUrl(videoId)
            .then((success) => {
                if (!success) {
                    // Do something to alert user or retry
                }
            })
            .catch(console.log);
    }, []);

    useEffect(() => {
        setPaused(pausedFromHigherUp);
    }, [pausedFromHigherUp]);

    const onVideoPress = (e: GestureResponderEvent): void => {
        const pauseState = !paused;
        setPaused(pauseState);
        if (pauseState) {
            setPauseToggle(pauseToggle !== undefined ? !pauseToggle : true);
        } else {
            setPlayToggle(playToggle !== undefined ? !playToggle : true);
        }
    };

    const onSeek = useCallback(
        (progress: number): void => {
            videoRef.current?.seek(progress * videoDuration.current);
        },
        [videoDuration.current]
    );

    const onVideoError = async (): Promise<void> => {
        // Show error
    };

    return (
        <View
            className="absolute top-0 left-0 bottom-0 right-0"
            onTouchEnd={onVideoPress}
        >
            {resourceUrl !== "" && (
                <Video
                    paused={paused}
                    ref={videoRef}
                    source={{
                        uri: resourceUrl,
                    }}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                    }}
                    resizeMode="contain"
                    repeat
                    onLoad={({ duration }) => {
                        videoRef.current?.seek(1);
                        videoDuration.current = duration;
                    }}
                    onProgress={({ currentTime }) => {
                        setCurrentTimeStamp(currentTime);
                    }}
                    onError={onVideoError}
                />
            )}
            <PlayPause showToggle={pauseToggle} icon="pause" />
            <PlayPause showToggle={playToggle} icon="play" />
            <Seeker
                progress={currentTimeStamp / videoDuration.current}
                onSeek={onSeek}
            />
        </View>
    );
};

export default VideoViewer;
