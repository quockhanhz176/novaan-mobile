/* eslint-disable @typescript-eslint/no-unused-vars */
import { getData, storeData } from "@/common/AsyncStorageService";
import moment from "moment";
import React, { useState, type FC, memo, useCallback } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

const Home: FC = () => {
    const [outer, setOuter] = useState(true);

    console.log("render outer");
    return (
        <View style={styles.container}>
            <TouchableOpacity
                className="w-[100] h-[100] bg-black mb-10"
                onPress={async () => {
                    setOuter(!outer);
                    const data = await getData("reelListData");
                    console.log(JSON.stringify(data));
                }}
            />
            <Component1 />
        </View>
    );
};

const Component1: FC = memo(function Component1() {
    const [state1, setState1] = useState(0);

    const increase = useCallback(() => {
        setState1(1 - state1);
    }, [state1]);

    console.log("render inner");
    return (
        <TouchableOpacity
            // onPress={() => {
            //     setState1(state1 + 1);
            //     void storeData("reelListData", {
            //         list: [{ postId: "aaaaaaaa", postType: "CulinaryTip" }],
            //         lastItem: 3,
            //         lastUpdate: moment(),
            //     });
            // }}
            onPress={increase}
        >
            <Text>{state1}</Text>
        </TouchableOpacity>
    );
});

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
