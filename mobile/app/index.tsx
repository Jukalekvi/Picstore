import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>This will be the main screen of the app.</Text>
      <Text>Welcome to Picstore!</Text>
    </View>
  );
}
