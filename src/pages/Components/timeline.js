import React, {useContext, useEffect, useState} from "react";
import {WrapperContext} from "../wrapper.js";
import {DataStore} from "aws-amplify/datastore";
import {Event, Pet} from "../../models/index.js";
import {Text, View} from "react-native";

const TimeLine = (props) => {
  const date = props.date;

  const {family, loading} = useContext(WrapperContext);

  const [events, setEvents] = useState(null);
  const [pets, setPets] = useState(null);

  useEffect(() => {
    const queryEvents = async () => {
      const familyId = family.id;

      const currentDate = new Date(date);
      console.log("selected date = ", currentDate);

      const subscription = DataStore.observeQuery(
        Event,
        (e) => e.and((e) => [e.familiesID.eq(familyId)]),
        {}
      ).subscribe((snapshot) => {
        const {items, isSynced} = snapshot;
        // console.log(`[Snapshot] ${items}, isSynced: ${isSynced}`);

        const sortedItems = [...items].sort((b, a) => {
          // Assuming updatedAt is a Date object, use getTime() to compare timestamps
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });
        const filteredEvents = sortedItems.filter((obj) => {
          const localDate = new Date(obj.createdAt)
            .toLocaleDateString()
            .split("T")[0];

          return (
            localDate ===
            currentDate.toLocaleDateString("en-US", {
              month: "numeric",
              day: "numeric",
              year: "numeric",
            })
          );
        });
        setEvents(filteredEvents);
      });

      const petIds = Array.from(
        new Set(events.map((event) => event.eventPetId))
      );
      console.log("petIds:", petIds);
      const pets = await DataStore.query(Pet, (u) =>
        u.and((u) => [u.id.contains(petIds)])
      );
      console.log("Pets in the family:", pets);
      setPets(pets);
    };

    if (!loading) {
      queryEvents();
    }
  }, [loading, date]);

  useEffect(() => {
    const fetchPets = async () => {
      const petIds = Array.from(
        new Set(events.map((event) => event.eventPetId))
      );
      console.log("petIds:", petIds);
      const pets = await DataStore.query(Pet, (u) =>
        u.and((u) => [u.id.contains(petIds)])
      );
      console.log("Pets in the family:", pets);
      setPets(pets);
    };
    fetchPets();
  }, [events]);

  return (
    <View className="relative border-l border-gray-200 dark:border-gray-700">
      {events && pets
        ? events.map((event) => {
            const pet = pets.find((p) => p.id === event.eventPetId);

            return (
              <View className="ml-4">
                <View className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></View>
                <Text className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  {new Date(event.updatedAt).toLocaleTimeString([], {
                    timeStyle: "short",
                  })}
                </Text>

                <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                  {!event.Num1 && !event.Num2
                    ? `${pet.Name} went outside!`
                    : event.Num1 && !event.Num2
                    ? `${pet.Name} went Number 1!`
                    : !event.Num1 && event.Num2
                    ? `${pet.Name} went Number 2!`
                    : `${pet.Name} went Number 1 and Number 2!`}
                </Text>

                <Text className="text-base font-normal text-gray-500 dark:text-gray-400">
                  {event.Description}
                </Text>
              </View>
            );
          })
        : null}
    </View>
  );
};

export default TimeLine;
