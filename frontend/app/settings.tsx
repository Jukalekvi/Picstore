import { Text, View } from "react-native";
import { globalStyles } from "@/styles/globalStyles";

export default function Settings() {
    return (
        <View style={globalStyles.centeredContent}>
            <Text style={{ textAlign: 'center' }}>
                Welcome to the settings, here you can adjust your application as you please
            </Text>
        </View>
    );
}