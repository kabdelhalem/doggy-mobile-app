import React, {useEffect, useState} from "react";
import {Button, Text, TextInput, View} from "react-native";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import {Auth, DataStore} from "aws-amplify";
import {Families, User} from "../models";

const Tab = createMaterialTopTabNavigator();

const JoinFamily = ({navigation}) => {
  const [familyID, onChangeFamilyID] = React.useState("");
  const [name, onChangeName] = React.useState("");
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const retrieveEmail = async () => {
      Auth.currentAuthenticatedUser()
        .then((user) => {
          // Access the user's email from the user object
          const email = user.attributes.email;
          setEmail(email);
        })
        .catch((error) => {
          console.log("Error retrieving user:", error);
        });
    };
    retrieveEmail();
  }, []);

  const handleSubmit = async () => {
    await DataStore.save(
      new User({
        Name: name,
        familiesID: familyID,
        Email: email,
      })
    );
  };

  return (
    <View className="flex items-center justify-normal">
      <View className="w-3/5 items-center justify-center mt-64">
        <TextInput
          className="text-lg"
          multiline
          onChangeText={onChangeName}
          value={name}
          placeholder="Your Name"
        />
      </View>
      <View className="w-3/5 items-center justify-center mt-5">
        <TextInput
          className="text-lg"
          multiline
          onChangeText={onChangeFamilyID}
          value={familyID}
          placeholder="Your Family ID"
        />
      </View>
      <View className="w-3/5 items-center justify-center mt-5">
        <Button title="Join Family" />
      </View>
    </View>
  );
};
const AddFamily = ({navigation, route}) => {
  const [familyName, onChangeFamilyName] = React.useState("");
  const [name, onChangeName] = React.useState("");
  const [email, setEmail] = useState(null);

  const exitToHome = route.params;

  useEffect(() => {
    const retrieveEmail = async () => {
      Auth.currentAuthenticatedUser()
        .then((user) => {
          // Access the user's email from the user object
          const email = user.attributes.email;
          setEmail(email);
        })
        .catch((error) => {
          console.log("Error retrieving user:", error);
        });
    };
    retrieveEmail();
  }, []);

  const handleSubmit = async () => {
    const newFamily = await DataStore.save(
      new Families({
        Family_Name: familyName,
        Users: [],
        Pets: [],
        Events: [],
      })
    );
    const familyID = newFamily.id;

    await DataStore.save(
      new User({
        Name: name,
        familiesID: familyID,
        Email: email,
      })
    );
    props.exitToHome();
  };

  return (
    <View className="flex items-center justify-normal">
      <View className="w-3/5 items-center justify-center mt-64">
        <TextInput
          className="text-lg"
          multiline
          onChangeText={onChangeName}
          value={name}
          placeholder="Your Name"
        />
      </View>
      <View className="w-3/5 items-center justify-center mt-5">
        <TextInput
          className="text-lg"
          multiline
          onChangeText={onChangeFamilyName}
          value={familyName}
          placeholder="Your Family Name"
        />
      </View>
      <View className="w-3/5 items-center justify-center mt-5">
        <Button title="Join Family" onPress={() => handleSubmit()} />
      </View>
    </View>
  );
};

const GetStarted = ({navigation}) => {
  const exitToHome = () => {
    navigation.navigate("Home");
  };

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Join a Family"
        component={JoinFamily}
        navigation={navigation}
      />
      <Tab.Screen
        name="Create a Family"
        initialParams={{exitToHome}}
        component={AddFamily}
      />
    </Tab.Navigator>
  );
};

export default GetStarted;
