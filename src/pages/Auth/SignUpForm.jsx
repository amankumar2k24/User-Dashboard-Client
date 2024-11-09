import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RegisterUser } from "../../services/api.services";
import { HiOutlineUser } from "react-icons/hi";
import { SyncLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { setData, setToken } from "../../helper/tokenHelper";

const SignUpForm = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [hide, setHide] = useState(true);
  const [initialData, setInitialData] = useState({
    username: "",
    password: "",
    email: "",
  });

  useEffect(() => {
    setInitialData({
      username: "",
      password: "",
      email: "",
    });
  }, []);

  const handleInput = (event) => {
    const { value, id } = event.target;
    setInitialData((preVal) => ({ ...preVal, [id]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("clicking");

    setLoading(true);

    try {
      const res = await RegisterUser(initialData);
      //   console.log("res", res);

      if (res) {
        toast.success(res.message);
        setLoading(false);
        dispatch(login({ user: res.result }));
        localStorage.setItem("isAuthenticated", true);
        setData(res.data);
        navigate("/login");
      }
    } catch (err) {
      console.log("error", err);
      setLoading(false);
      toast.error(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="registerForm ">
      <div className=" bg-gray-600 h-screen">
        <div className=" border h-full border-t-2 border-x-0 mt-[2px] border-b-0 border-white dark:bg-gray-800 flex items-center justify-center px-5 py-5">
          <div className="max-w-[1000px] bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden">
            <div className="md:flex w-full">
              <div className="hidden md:block object-left sm:w-[400px] lg:w-[500px] sm:h-[500px]">
                <img className="" src="/img/signin.jpg" alt="register" />
              </div>

              <div className="w-full md:w-1/2 py-5 px-5 md:px-10">
                <div className="text-center mb-10">
                  <h1 className="font-bold text-3xl text-gray-900">REGISTER</h1>
                  <p>Enter your information to register</p>
                </div>
                <div>
                  <div className="flex flex-col -mx-3">
                    <div className="w-full px-3 mb-3.5">
                      <label htmlFor="" className="text-xs font-semibold px-1">
                        {" "}
                        User name
                      </label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <HiOutlineUser />
                        </div>
                        <input
                          type="text"
                          className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-gray-600 text-gray-900"
                          placeholder="John"
                          id="username"
                          value={initialData.username}
                          onInput={handleInput}
                        />
                      </div>
                    </div>

                    <div className="w-full px-3 mb-5">
                      <label
                        htmlFor="email"
                        className="text-xs font-semibold px-1"
                      >
                        Email Address
                      </label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <HiOutlineUser />
                        </div>
                        <input
                          type="email"
                          className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-gray-600 text-gray-900"
                          placeholder="Enter your email"
                          id="email"
                          value={initialData.email}
                          onChange={handleInput}
                        />
                      </div>
                    </div>

                    <div className="w-full px-3 mb-3.5">
                      <label htmlFor="" className="text-xs font-semibold px-1">
                        Password
                      </label>
                      <div className="flex">
                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                          <HiOutlineUser />
                        </div>
                        <input
                          type={`${hide ? "password" : "text"}`}
                          className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-gray-600 text-gray-900"
                          placeholder="************"
                          id="password"
                          value={initialData.password}
                          onChange={handleInput}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex -mx-3">
                    <div className="w-full px-3 mb-5">
                      <button
                        className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold"
                        onClick={handleRegister}
                      >
                        {loading ? (
                          <SyncLoader size={8} color="#fff" />
                        ) : (
                          " REGISTER NOW"
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="text-black text-center">
                    Already have an account? <br />
                    <NavLink
                      to="/login"
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                    >
                      Login now
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUpForm;
