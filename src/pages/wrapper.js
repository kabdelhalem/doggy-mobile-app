import {Auth, DataStore} from "aws-amplify";
import React, {createContext, useEffect, useState} from "react";
import {User, Families} from "../models";

const WrapperContext = createContext();

const Wrapper = (props) => {
  const [hasFamily, setHasFamily] = useState(null);

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [family, setFamily] = useState(null);

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
          setUser(users.filter((u) => u.Email === email)[0]);
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
          setFamily(families);
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
    <WrapperContext.Provider value={{user, family, loading}}>
      {props.children}
    </WrapperContext.Provider>
  );
};

export {Wrapper, WrapperContext};
