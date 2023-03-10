import React, { useContext } from "react";
// COMPONENTS
import { Context } from "../../data/Context";
// NPMS
import { useCookies } from "react-cookie";

const UserInfo = () => {
  const { state } = useContext(Context);
  return (
    <section id="userInfo">
      <article id="userName">{state.name}</article>
      <article id="userSurname">{state.surname}</article>
      <article id="userTitle">{state.title}</article>
      <article id="userEmail">{state.email}</article>
    </section>
  );
};

export default UserInfo;
