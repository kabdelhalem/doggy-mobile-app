import {DataStore} from "aws-amplify/datastore";
import React, {createContext, useEffect, useState} from "react";
import {User, Families} from "../models";
import {getCurrentUser, fetchAuthSession} from "aws-amplify/auth";

const WrapperContext = createContext();

const Wrapper = (props) => {
  const [hasFamily, setHasFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [family, setFamily] = useState(null);

  useEffect(() => {
    const retrieveEmail = async () => {
      try {
        const {tokens: session} = await fetchAuthSession();
        console.log("The session: ", session.idToken.payload.email);
        queryUser(session.idToken.payload.email);
      } catch (error) {
        console.log("Error retrieving user:", error);
      }
    };

    const queryUser = async (email) => {
      // console.log("queryUser: ", email);
      try {
        const userResult = await DataStore.query(User, (u) =>
          u.Email.eq(email)
        );
        console.log("userResult: ", userResult);
        const currentUser = userResult[0];

        if (!currentUser) {
          console.log("User not found");
          setHasFamily(false);
        } else {
          await queryFamily(currentUser);
          setUser(currentUser);
        }

        // console.log("users: ", users);
      } catch (error) {
        console.error("Error querying users:", error);
      } finally {
        setLoading(false);
      }
    };

    const queryFamily = async (user) => {
      try {
        const familiesResult = await DataStore.query(Families, user.familiesID);
        const currentFamily = familiesResult[0];

        // Log the families that include the user
        console.log("Families that include the user:", familiesResult);

        if (currentFamily) {
          setFamily(currentFamily);
          setHasFamily(true);
        } else {
          setHasFamily(false);
        }
      } catch (error) {
        console.error("Error querying families:", error);
      }
    };

    retrieveEmail();
  }, []);

  return (
    <WrapperContext.Provider value={{user, family, hasFamily, loading}}>
      {props.children}
    </WrapperContext.Provider>
  );
};

export {Wrapper, WrapperContext};
