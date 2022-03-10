import React from "react";
import { Tooltip, message, Popover } from "antd";
import { useMoralis } from "react-moralis";
import Button from "../Button/Button";
import { UnlockFilled, WalletFilled, UserOutlined } from "@ant-design/icons";
import logo from "../../assets/images/logo.jpg";
import metamaskicon from "../../assets/images/metamask.webp";
import "./Header.scss";
import { useNavigate } from 'react-router-dom';
export default function Header() {
  const { authenticate, isAuthenticated, user, logout } = useMoralis();
  const navigate = useNavigate();
  const handleAuthentication = (action) => {
    if (action) {
      authenticate({ signingMessage: "Authenticate" });
    } else {
      logout();
      localStorage.setItem("isAuthenticated", false);
    }
  };
  const handleNavigate = () => {
    
    navigate(`/dashboard`);
 
  }
  React.useEffect(() => {
    if (isAuthenticated && localStorage.getItem("isAuthenticated") === false) {
      message.success("You are logged in successfully");
      localStorage.setItem("isAuthenticated", true);
    }
  }, [user, isAuthenticated]);

  const content = (
    <div>
      <p onClick={handleNavigate}>DASHBOARD</p>
      <p onClick={() => handleAuthentication(false)}>LOG OUT</p>
    </div>
  );

  return (
    <div className="header_container">
      <div>
        <div className="logo_container">
          <img src={logo} alt="logo" />
        </div>
      </div>
      <div>
        {isAuthenticated && user && (
          <Tooltip title={user.get("ethAddress")}>
            {" "}
            <Button
              style={{
                backgroundColor: "transparent",
                color: "#4cc899",
                width: "250px",
                border: "0px",
              }}
              icon={
                <img
                  className="metamask_icon"
                  src={metamaskicon}
                  alt="metamask_icon"
                />
              }
              type="text"
            >
              CONNECTED TO WALLET
            </Button>
          </Tooltip>
        )}

        {isAuthenticated && user ? (
          <Popover content={content}>
            <UserOutlined
              size="large"
              style={{
                fontSize: "20px",
                border: "1px solid #4cc899",
                padding: "10px",
                margin: "10px",
                borderRadius: "50%",
              }}
            />
          </Popover>
        ) : (
          <Button
            onClick={() => handleAuthentication(true)}
            style={{
              backgroundColor: "transparent",
              color: "black",
              width: "180px",
            }}
            icon={<WalletFilled style={{ color: "#4cc899" }} />}
            type="text"
          >
            {isAuthenticated ? "DISCONNECT" : "CONNECT WALLET"}
          </Button>
        )}
      </div>
    </div>
  );
}
