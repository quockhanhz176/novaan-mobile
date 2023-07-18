import { getData, storeData } from "@/common/AsyncStorageService";
import React, { useState, type FC } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

const Home: FC = () => {
    const [outer, setOuter] = useState(true);
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

const Component1: FC = () => {
    const [state1, setState1] = useState(0);
    return (
        <TouchableOpacity
            onPress={() => {
                setState1(state1 + 1);
                void storeData("reelListData", {
                    list: [{ postId: "aaaaaaaa", postType: "CulinaryTip" }],
                    lastItem: 3,
                    lastUpdate: new Date(),
                });
            }}
        >
            <Text>{state1}</Text>
        </TouchableOpacity>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
