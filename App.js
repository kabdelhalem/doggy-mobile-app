import {Button, Text, View} from "react-native";
import {DataStore} from "aws-amplify/datastore";
import {Amplify} from "aws-amplify";
import {
  Authenticator,
  useAuthenticator,
  withAuthenticator,
} from "@aws-amplify/ui-react-native";
import {getCurrentUser, fetchAuthSession} from "aws-amplify/auth";
import "expo-dev-client";
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
import awsmobile from "./src/aws-exports.ts";
Amplify.configure(awsmobile);

const Stack = createNativeStackNavigator();

function App({navigation}) {
  const [hasFamily, setHasFamily] = useState(null);

  const [loading, setLoading] = useState(true);
  // let loading = useRef(false);

  useEffect(() => {
    // Call this function inside an effect or any other appropriate place in your component

    const retrieveEmail = async () => {
      try {
        const {tokens: session} = await fetchAuthSession();
        // console.log("The session: ", session.idToken.payload.email);
        queryUser(session.idToken.payload.email);
      } catch (error) {
        console.log("Error retrieving user:", error);
      }
    };
    // Retrieve the current authenticated user

    // Define the email address to check

    // Perform the query
    const queryUser = async (email) => {
      try {
        const userResult = await DataStore.query(User, (u) =>
          u.Email.eq(email)
        );
        console.log("userResult: ", userResult);

        if (userResult.length === 0) {
          console.log("User not found");
          setHasFamily(false);
          setLoading(false);
        } else {
          queryFamily(userResult[0]);
        }
      } catch (error) {
        console.error("Error querying users:", error);
      }
    };

    const queryFamily = async (user) => {
      const subscription = DataStore.observeQuery(Families, (f) =>
        f.and((f) => [f.id.eq(user.familiesID)])
      ).subscribe((snapshot) => {
        const {items, isSynced} = snapshot;
        console.log("Families that include the user:", items);
        if (items.length !== 0) {
          setHasFamily(true);
        } else {
          setHasFamily(false);
        }
        setLoading(false);
      });
    };

    retrieveEmail();
  }, []);

  return (
    // <Authenticator.Provider>
    //   <Authenticator>
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
    //   {/* </Authenticator>
    // </Authenticator.Provider> */}
  );
}

export default withAuthenticator(App);
