import React, { type FC } from "react";
import { StyleSheet, Text, View } from "react-native";

const SavedPosts: FC = () => {
    return (
        <View style={styles.container}>
            <Text>SavedPosts</Text>
        </View>
    );
};

export default SavedPosts;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
