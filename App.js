import {Button, View} from "react-native";

import {Amplify} from "aws-amplify";
import {
  useAuthenticator,
  withAuthenticator,
} from "@aws-amplify/ui-react-native";

import awsmobile from "./src/aws-exports.js";
import {SafeAreaView} from "react-native-safe-area-context";
Amplify.configure(awsmobile);

function SignOutButton() {
  const {signOut} = useAuthenticator();
  return <Button onPress={signOut} title="Sign Out" />;
}

function App() {
  return (
    <View className="flex-1 items-center justify-center ">
      <SignOutButton />
    </View>
  );
}

export default withAuthenticator(App);
