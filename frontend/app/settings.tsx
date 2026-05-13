import { Text, View } from "react-native";

export default function Settings() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 20
            }}
        >
            <Text>Welcome to the settings, here you can adjust your application as you please</Text>
        </View>
    );
}
