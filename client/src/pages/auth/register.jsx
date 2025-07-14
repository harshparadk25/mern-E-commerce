import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/auth-slice"; // ✅ Clean import
import { toast } from "sonner";

const initialState = {
  userName: "", // ✅ Should match backend field
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await dispatch(registerUser(formData));

      if (result?.payload?.success) {
        toast.success(result.payload.message || "Registration successful");
        navigate("/auth/login");
      } else {
        throw new Error(result?.payload?.message || "Registration failed");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            <b>Login</b>
          </Link>
        </p>
      </div>

      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthRegister;
