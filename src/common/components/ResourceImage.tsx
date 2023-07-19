import { useState, type FC, useEffect, type ReactNode, memo } from "react";
import React, { View, type StyleProp, Image } from "react-native";
import FastImage, {
    type ResizeMode,
    type ImageStyle,
} from "react-native-fast-image";

import { windowWidth } from "../utils";
import { useFetchResourceUrl } from "@/api/utils/resourceHooks";
interface ResourceImageProps {
    resourceId: string;
    style?: StyleProp<ImageStyle>;
    className?: string;
    defaultView?: ReactNode;
    width?: number;
    resizeMode?: ResizeMode;
}

const ResourceImage: FC<ResourceImageProps> = ({
    resourceId,
    style,
    className,
    defaultView,
    width,
    resizeMode = "contain",
}) => {
    const [dimensions, setDimensions] = useState<{
        width: number;
        height: number;
    }>();

    const { resourceUrl, fetchUrl } = useFetchResourceUrl();

    useEffect(() => {
        fetchUrl(resourceId)
            .then((success) => {
                if (!success) {
                    // Do something to alert user or retry
                }
            })
            .catch(console.log);
    }, []);

    useEffect(() => {
        if (resourceUrl == null || resourceUrl === "") {
            return;
        }
        Image.getSize(resourceUrl, (width, height) => {
            setDimensions({ width, height });
        });
    }, [resourceUrl]);

    return (
        <View
            style={[
                dimensions != null
                    ? {
                          width: width ?? windowWidth,
                          height:
                              ((width ?? windowWidth) / dimensions.width) *
                              dimensions.height,
                      }
                    : {},
                style,
            ]}
            className={className}
        >
            {resourceUrl != null && resourceUrl !== "" ? (
                <FastImage
                    source={{ uri: resourceUrl }}
                    className="flex-1"
                    resizeMode={resizeMode}
                />
            ) : (
                defaultView
            )}
        </View>
    );
};

export default memo(ResourceImage);
