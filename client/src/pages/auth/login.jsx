import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { Link, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
import { useState } from "react";
import { loginUser } from "@/store/auth-slice"; // ✅ Clean import
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const initialState = {
  email: "",
  password: ""
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ Initialize navigation

  function onSubmit(e) {
    e.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        navigate("/"); // ✅ Redirect to home or dashboard
      } else {
        toast.error(data?.payload?.message);
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          "Welcome back, senpai. Your next drip quest awaits!"
        </h1>
        <p className="mt-2">
          Don't have an account yet?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            <b>Register</b>
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText="Sign In"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthLogin;
