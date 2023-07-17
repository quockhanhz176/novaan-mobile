import React, { type ReactElement } from "react";
import { StyleSheet, Text, View } from "react-native";

const SavedPosts = (): ReactElement => {
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
