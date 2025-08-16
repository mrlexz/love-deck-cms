import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import CoverImage from "@/assets/images/cover.png";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

function Login() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (code === import.meta.env.VITE_LOGIN_CODE) {
        const currentTime = new Date().getTime().toString();
        localStorage.setItem("code", code);
        localStorage.setItem("loginTime", currentTime);
        // Dispatch custom event to notify App component of auth change
        window.dispatchEvent(new Event('auth-changed'));
        navigate("/");
      } else {
        alert("Invalid code");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <img src={CoverImage} alt="Logo" className="mx-auto w-[200px]" />
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Code</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="Enter your code"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" onClick={handleLogin}>
            Enter
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
