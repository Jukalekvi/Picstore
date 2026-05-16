import { Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { getGlobalStyles } from "@/styles/globalStyles";

export default function Index() {
    const { colors } = useTheme();
    const styles = getGlobalStyles(colors);

    return (
        <View style={styles.centeredContent}>
            <Text style={[styles.mainTitle, { fontSize: 28 }]}>Picstore</Text>
            <Text style={{ textAlign: 'center', color: colors.textMain, fontSize: 16 }}>
                Welcome to Picstore, the application for filling galleries with pictures you have taken and sharing them with.
            </Text>
            <Text style={{ textAlign: 'center', color: colors.textMain, fontSize: 16 }}>
                Later this page will also show your feed (activities of your friends & followed people )
            </Text>
        </View>
    );
}