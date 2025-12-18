import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { toast } from "sonner";

const formSchema = z.object({
  fullName: z.string().min(3, "Name should be atleast of 3 characters"),
  email: z.email().min(2, {
    message: "Please enter valid email",
  }),
  password: z.string().min(6, {
    message: "Password should be atleast 6 characters",
  })
});

const Signup = () => {
   const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: ""
    },
  });

  const handleSubmit = async(values) => {
    let payload = {
      fullName: values.fullName,
      email: values.email,
      password: values.password
    }
      
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_API_URL}/auth/user/register`,
      headers: {},
      data: payload,
    };

    await axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          toast.success("User registered successfully");
          navigate("/login");
        }
      })
      .catch((error) => {
        console.log(error);
         toast.error("Error")
      });
  };

    useEffect(() => {
      if (isLoggedIn) {
        navigate("/")
      }
    }, [isLoggedIn])
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register your account</CardTitle>
          <CardDescription>
            Enter your email and password below to register to your account
          </CardDescription>
          {/* <CardAction>
            <Button variant="link">Login</Button>
          </CardAction> */}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          <Button type="submit" className="w-full">
            Register
          </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center gap-1">
          Got an account? <Link to={"/login"} className="underline">Login</ Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
