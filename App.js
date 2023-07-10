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
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useEffect, useState} from "react";
import {Families, User} from "./src/models/index.js";
import Loading from "./src/pages/loading.js";
import HomeScreen from "./src/pages/Home.js";
Amplify.configure(awsmobile);

function SignOutButton() {
  const {signOut} = useAuthenticator();
  return <Button onPress={signOut} title="Sign Out" />;
}
const Stack = createNativeStackNavigator();

function HomeScreen2({navigation}) {
  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Text>Details Screen</Text>
    </View>
  );
}

function App() {
  const [hasFamily, setHasFamily] = useState(null);

  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      } catch (error) {
        console.error("Error querying families:", error);
      }
    };

    retrieveEmail();
  }, []);

  return (
    <Wrapper>
      <NavigationContainer>
        <Stack.Navigator>
          {loading ? (
            <Stack.Screen name="Loading" component={Loading} />
          ) : hasFamily ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Home2" component={HomeScreen2} />
            </>
          ) : (
            <Stack.Screen name="Details" component={DetailsScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </Wrapper>
  );
}

export default withAuthenticator(App);
