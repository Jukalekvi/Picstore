import { Text, View } from "react-native";
import { globalStyles } from "@/styles/globalStyles";

export default function Index() {
    return (
        <View style={globalStyles.centeredContent}>
            <Text style={{ textAlign: 'center' }}>
                Welcome to Picstore, the application for filling galleries with pictures you have taken and sharing them with
            </Text>
        </View>
    );
}