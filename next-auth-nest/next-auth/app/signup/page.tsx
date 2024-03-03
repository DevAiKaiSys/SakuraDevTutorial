"use client";
import Link from "next/link";
import React, { useRef } from "react";
import InputBox from "../ui/inputbox";
import { Button } from "../ui/button";

type FormInputs = {
  name: string;
  email: string;
  password: string;
};

const SignupPage = () => {
  const data = useRef<FormInputs>({
    name: "",
    email: "",
    password: "",
  });
  
  const register = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({
          name: data.current.name,
          email: data.current.email,
          password: data.current.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res);
    if (!res.ok) {
      alert(res.statusText);
      return;
    }
    const response = await res.json();
    alert("User Registered!");
    console.log({ response });
  };

  return (
    <div className="m-2 border rounded overflow-hidden shadow">
      <div className="p-2 bg-gradient-to-b from-white to-slate-200 text-slate-600">
        Sign up
      </div>
      <div className="p-2 flex flex-col gap-6">
        <InputBox
          autoComplete="off"
          name="name"
          labelText="Name"
          required
          onChange={(e) => (data.current.name = e.target.value)}
        />
        <InputBox
          name="email"
          labelText="Email"
          required
          onChange={(e) => (data.current.email = e.target.value)}
        />
        <InputBox
          name="password"
          labelText="password"
          type="password"
          required
          onChange={(e) => (data.current.password = e.target.value)}
        />
        <div className="flex justify-center items-center gap-2">
          <Button onClick={register}>Submit</Button>
          <Link className="" href={"/"}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
