"use client";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { LockKeyhole, ShieldUser, UserRound } from "lucide-react";
import { useState } from "react";

function LoginPage() {
  const [showHideBtn, setShowHideBtn] = useState("Show");

  return (
    <div className="bg-[#0A0A0A] min-h-screen flex flex-col items-center justify-center">
      <ShieldUser className="stroke-neutral-300" size={44} />
      <h2 className="text-neutral-400 text-[1.5rem] mt-2">Admin Login</h2>
      <form onSubmit={handleAdminLogin} className="flex flex-col gap-6 mt-8 w-[20rem]">
        <InputGroup className="border-[#373737] border-2 bg-[#151515]">
          <InputGroupInput
            placeholder="Username"
            className="text-white placeholder:text-[1rem] placeholder:text-[#A1A1A1] selection:bg-white selection:text-black"
            type="username"
            autoComplete="name"
            required
          />
          <InputGroupAddon>
            <UserRound className="size-5 stroke-2 stroke-[#A1A1A1]" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end"></InputGroupAddon>
        </InputGroup>

        <InputGroup className="border-[#373737] border-2 bg-[#151515]">
          <InputGroupInput
            placeholder="Password"
            className="text-white placeholder:text-[1rem] placeholder:text-[#A1A1A1] selection:bg-white selection:text-black"
            type={showHideBtn === "Show" ? "password" : "text"}
            required
          />
          <InputGroupAddon>
            <LockKeyhole className="size-5 stroke-2 stroke-[#A1A1A1]" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end"></InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              className="hover:text-neutral-200 hover:bg-transparent cursor-pointer"
              onClick={() => {
                if (showHideBtn === "Show") setShowHideBtn("Hide");
                else setShowHideBtn("Show");
              }}
              type="button"
            >
              {showHideBtn}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <Button
          variant="outline"
          className="hover:opacity-85 cursor-pointer text-[1.1rem] font-semibold"
        >
          Login
        </Button>
      </form>
    </div>
  );
}

async function handleAdminLogin(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
}

export default LoginPage;
