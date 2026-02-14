import React, { useEffect } from "react";
import "./styles.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import userSvg from "../../assets/user.svg";
function Header() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  function logout() {
    auth.signOut();
    navigate("/");
  }

  function predict() {
    navigate("/predict")
  }
  function goal(){
    navigate("/goal")
  }
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="navbar">
      <p className="navbar-heading">MyFin Vision</p>
      <div className="navbar-heading navbar-link" onClick={predict}>Predict Savings</div>
      <div className="navbar-heading navbar-link" onClick={goal}>Predict Goal</div>
      {user ? (

        <div className="linking">


          <p className="navbar-link" onClick={logout}>
            <span style={{ marginRight: "1rem" }}>
              <img
                src={user.photoURL ? user.photoURL : userSvg}
                width={user.photoURL ? "32" : "24"}
                style={{ borderRadius: "50%" }}
              />
            </span>
            Logout
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Header;
