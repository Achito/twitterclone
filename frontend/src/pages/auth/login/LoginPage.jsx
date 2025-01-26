import { useState } from "react";
import { Link,  } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import XSvg from "../../../components/svgs/X.jsx";

import { useMutation, useQueryClient} from "@tanstack/react-query";
// import toast from "react-hot-toast";

const LoginPage = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ email, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");
        if (data.error) throw new Error(data.error);
        console.log(data);
        
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalide the authUser on App.js (Main) query to refetch the user (rerun) the function, so the user will be authenticated and redirected
      queryClient.invalidateQueries({queryKey: ["authUser"]});
  
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Add login logic
    loginMutation(formData);
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">Welcome back.</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>
          <label className="input input-bordered rounded flex items-center gap-2">
            <RiLockPasswordLine />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button type="submit" className="btn btn-primary rounded">
            {isPending ? "Loading..." : "Sign In"}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg">Dont have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
