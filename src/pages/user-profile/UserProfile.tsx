import React, { type FC } from "react";
import { StyleSheet, Text, View } from "react-native";

const UserProfile: FC = () => {
    return (
        <View style={styles.container}>
            <Text>UserProfile</Text>
        </View>
    );
};

export default UserProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
