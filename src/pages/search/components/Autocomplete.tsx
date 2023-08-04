import { delay } from "lodash";
import React, {
    useEffect,
    type ReactElement,
    type RefObject,
    useRef,
    type FC,
} from "react";
import { type LayoutRectangle, View } from "react-native";

interface AutoCompleteProps {
    searchBarRef: RefObject<View>;
    children: ReactElement;
    showing: boolean;
}

const AutoComplete: FC<AutoCompleteProps> = ({
    searchBarRef,
    children,
    showing,
}) => {
    const searchInputLayout = useRef<LayoutRectangle>({
        x: 0,
        y: 0,
        height: 100,
        width: 50,
    });

    useEffect(() => {
        delay(() => {
            searchBarRef.current?.measure(
                (_x, _y, width, height, pageX, pageY) => {
                    searchInputLayout.current = {
                        x: pageX ?? 0,
                        y: pageY ?? 0,
                        width: width ?? 0,
                        height: height ?? 0,
                    };
                }
            );
        }, 200);
    }, []);

    return (
        <>
            {showing && (
                <View
                    className="absolute"
                    style={{
                        top:
                            searchInputLayout.current.y +
                            searchInputLayout.current.height,
                        left: searchInputLayout.current.x,
                        width: searchInputLayout.current.width,
                    }}
                >
                    {children}
                </View>
            )}
        </>
    );
};

export default AutoComplete;
