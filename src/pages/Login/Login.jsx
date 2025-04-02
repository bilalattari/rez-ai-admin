import React from "react";
import { LoginForm } from "@/components/loginForm";
import { Megaphone } from "lucide-react";

const Login = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <span className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Megaphone className="size-6" />
          </div>
          Rezai admin
        </span>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
