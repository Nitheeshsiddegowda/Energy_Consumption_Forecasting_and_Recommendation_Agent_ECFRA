import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Signup() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const signup = async () => {

    try{

      await axios.post(
        "http://127.0.0.1:8000/api/accounts/register/",
        form
      );

      alert("Registration Successful");

      navigate("/login");

    }

    catch{

      alert("Registration Failed");

    }

  };

  return (

    <div className="auth-container">

      <div className="auth-card">

        <h1>Create Account</h1>

        <input
          placeholder="Username"
          onChange={(e)=>
            setForm({...form,username:e.target.value})
          }
        />

        <input
          placeholder="Email"
          onChange={(e)=>
            setForm({...form,email:e.target.value})
          }
        />

        <input
          placeholder="Phone"
          onChange={(e)=>
            setForm({...form,phone:e.target.value})
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>
            setForm({...form,password:e.target.value})
          }
        />

        <button onClick={signup}>
          Signup
        </button>

        <p>

          Already have an account?

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>

  );

}

export default Signup;