import { useState, type FC, useEffect } from "react";
import React, { View, type StyleProp, Image } from "react-native";
import FastImage, { type ImageStyle } from "react-native-fast-image";

import { windowWidth } from "../utils";
import { useFetchResourceUrl } from "@/api/utils/resourceHooks";
interface ResourceImageProps {
    resourceId: string;
    style?: StyleProp<ImageStyle>;
    className?: string;
}

const ResourceImage: FC<ResourceImageProps> = ({
    resourceId,
    style,
    className,
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

    if (resourceUrl === "") {
        return <View></View>;
    }

    return (
        <FastImage
            source={{ uri: resourceUrl }}
            style={[
                dimensions != null
                    ? {
                          width: windowWidth,
                          height:
                              (windowWidth / dimensions.width) *
                              dimensions.height,
                      }
                    : {},
                style,
            ]}
            className={className}
        />
    );
};

export default ResourceImage;
