import {FlashList} from "@shopify/flash-list";
import React, {useContext, useEffect, useState} from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Button,
} from "react-native";
import {WrapperContext} from "./wrapper";
import {DataStore} from "aws-amplify";
import {Families, Pet, User} from "../models";
import {ScrollView} from "react-native-gesture-handler";
import {useAuthenticator} from "@aws-amplify/ui-react-native";
// import Clipboard from "@react-native-clipboard/clipboard";
function SignOutButton() {
  const {signOut} = useAuthenticator();
  return <Button onPress={signOut} title="Sign Out" />;
}
const Settings = () => {
  const {family, loading} = useContext(WrapperContext);

  const [users, setUsers] = useState(null);
  const [pets, setPets] = useState(null);

  const [addNewDog, setAddNewDog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const familyId = family.id;

      try {
        const family = await DataStore.query(Families, (u) =>
          u.id.eq(familyId)
        );
        console.log(await family[0].Users.values);
        setUsers(await family[0].Users.values);
        setPets(await family[0].Pets.values);
      } catch (error) {
        console.error("Error retrieving users:", error);
      }

      console.log("users: ", users);
    };
    if (!loading) {
      fetchData();
    }
  }, [loading]);

  const copyToClipboard = () => {
    // Clipboard.setString(family.id);
  };

  return (
    <SafeAreaView className="flex items-center ">
      <View className="flex justify-between">
        <View className="flex items-center">
          <View className="flex flex-row items-center justify-evenly">
            <Text className="pt-2 text-xl mr-3">Family</Text>
            <TouchableOpacity onPress={copyToClipboard}>
              <Image
                className="w-5 h-5 mt-2"
                source={require("../images/copy.png")}
              ></Image>
            </TouchableOpacity>
          </View>
          {!users ? null : (
            <ScrollView className="w-screen h-4">
              <FlashList
                data={users}
                renderItem={({item}) => (
                  <View className="flex flex-row mx-10 mt-2 divide-solid bg-white p-4 items-center rounded-lg">
                    <Image
                      className="w-10 h-10"
                      source={require("../images/user.png")}
                    ></Image>
                    <View className="flex flex-col ml-10">
                      <Text>{item.Name}</Text>
                      <Text>{item.Email}</Text>
                    </View>
                  </View>
                )}
                estimatedItemSize={200}
              />
            </ScrollView>
          )}

          <Text className="pt-2 text-xl">Pets</Text>

          {!pets ? null : (
            <ScrollView className="w-screen h-5">
              <FlashList
                data={pets}
                renderItem={({item}) => (
                  <View className="flex flex-row mx-10 mt-2 divide-solid bg-white p-4 items-center rounded-lg">
                    <Image
                      className="w-10 h-10"
                      source={require("../images/dog.png")}
                    ></Image>
                    <View className="flex flex-col ml-10">
                      <Text>{item.Name}</Text>
                    </View>
                  </View>
                )}
                estimatedItemSize={200}
              />
            </ScrollView>
          )}
          <SignOutButton />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
