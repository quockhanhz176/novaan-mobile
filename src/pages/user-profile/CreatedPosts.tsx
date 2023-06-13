import React, { type FC } from "react";
import { StyleSheet, Text, View } from "react-native";

const CreatedPosts: FC = () => {
    return (
        <View style={styles.container}>
            <Text>CreatedPosts</Text>
        </View>
    );
};

export default CreatedPosts;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
