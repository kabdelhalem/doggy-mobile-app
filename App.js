import {Button, Text, View} from "react-native";
import "core-js/full/symbol/async-iterator";
import {Amplify, Auth, DataStore} from "aws-amplify";
import {
  useAuthenticator,
  withAuthenticator,
} from "@aws-amplify/ui-react-native";

import awsmobile from "./src/aws-exports.js";
import {SafeAreaView} from "react-native-safe-area-context";
import {Wrapper} from "./src/pages/wrapper.js";
import {NavigationContainer, NavigationActions} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useEffect, useRef, useState} from "react";
import {Families, User} from "./src/models/index.js";
import Loading from "./src/pages/loading.js";
import HomeScreen from "./src/pages/Home.js";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import Settings from "./src/pages/Settings.js";
import GetStarted from "./src/pages/GetStarted.js";
Amplify.configure(awsmobile);

function SignOutButton() {
  const {signOut} = useAuthenticator();
  return <Button onPress={signOut} title="Sign Out" />;
}
const Stack = createNativeStackNavigator();

function DetailsScreen() {
  const detailsScreenRef = useRef(null);

  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Text ref={detailsScreenRef}>Details Screen</Text>
    </View>
  );
}

function App({navigation}) {
  const [hasFamily, setHasFamily] = useState(null);

  const [loading, setLoading] = useState(true);
  // let loading = useRef(false);

  useEffect(() => {
    // Call this function inside an effect or any other appropriate place in your component

    const retrieveEmail = async () => {
      Auth.currentAuthenticatedUser()
        .then((user) => {
          // Access the user's email from the user object
          const email = user.attributes.email;
          console.log("User's email:", email);
          queryUser(email);
        })
        .catch((error) => {
          console.log("Error retrieving user:", error);
        });
    };
    // Retrieve the current authenticated user

    // Define the email address to check

    // Perform the query
    const queryUser = async (email) => {
      try {
        // Find the user with the target email address
        const users = await DataStore.query(User);

        console.log(users.filter((u) => u.Email === email)[0]);

        if (users.filter((u) => u.Email === email).length === 0) {
          console.log("User not found");
          setHasFamily(false);
          setLoading(false);
          return;
        } else {
          queryFamily(users.filter((u) => u.Email === email)[0]);
        }
      } catch (error) {
        console.error("Error querying users:", error);
      }
    };

    const queryFamily = async (user) => {
      try {
        const families = await DataStore.query(Families, user.familiesID);

        // Log the families that include the user
        console.log("Families that include the user:", families);
        if (families) {
          setHasFamily(true);
        } else {
          setHasFamily(false);
        }
        done();
      } catch (error) {
        console.error("Error querying families:", error);
      }
    };

    const done = () => {
      setLoading(false);
    };

    retrieveEmail();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Wrapper>
        <NavigationContainer>
          <Stack.Navigator ref={(x) => (global.stackNavigator = x)}>
            {loading ? (
              <Stack.Screen name="Loading" component={Loading} />
            ) : hasFamily ? (
              <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Settings" component={Settings} />
              </>
            ) : (
              <Stack.Screen
                name="Get Started"
                component={GetStarted}
                screenProps={{rootNavigation: navigation}}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </Wrapper>
    </GestureHandlerRootView>
  );
}

export default withAuthenticator(App);
