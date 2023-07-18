import React, { type FC } from "react";
import { StyleSheet, Text, View } from "react-native";

const Search: FC = () => {
    return (
        <View style={styles.container}>
            <Text>Search</Text>
        </View>
    );
};

export default Search;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
