import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20
      }}
    >
      <Text>Welcome to Picstore, the application for filling galleries with pictures you have taken and sharing them with</Text>
    </View>
  );
}
