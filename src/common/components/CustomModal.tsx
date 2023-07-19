import React, {
    useRef,
    type FC,
    useEffect,
    Fragment,
    type ReactNode,
    useState,
    memo,
} from "react";
import { Animated } from "react-native";
import TouchableView from "@/common/components/TouchableView";
import { windowHeight } from "../utils";

interface CusomModalProps {
    visible: boolean;
    onDismiss?: () => void;
    children?: ReactNode;
}

// TODO: not render CreatePostPopup when hidden without compromising animation
const CustomModal: FC<CusomModalProps> = ({ visible, onDismiss, children }) => {
    const [internalVisible, setInternalVisible] = useState(visible);

    const dismissModal = (): void => {
        onDismiss?.();
    };

    const slideAnimation = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if (visible) {
            setInternalVisible(true);
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
            }).start(() => {
                setInternalVisible(false);
            });
        }
    }, [visible]);

    return (
        <>
            <>
                {internalVisible && (
                    <TouchableView
                        onPress={dismissModal}
                        className="absolute top-0 left-0 right-0 bottom-0 bg-[#00000077]"
                    />
                )}
                <Animated.View
                    onTouchEnd={dismissModal}
                    className="absolute bottom-0 top-0 left-0 right-0"
                    style={{
                        transform: [
                            {
                                translateY: slideAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [windowHeight, 0],
                                }),
                            },
                        ],
                    }}
                >
                    {children}
                </Animated.View>
            </>
        </>
    );
};

export default memo(CustomModal);
