import React from "react";
import "./DashBoardCard.scss";
import { Avatar,message } from "antd";
import {useWeb3ExecuteFunction} from 'react-moralis'
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { UserOutlined } from '@ant-design/icons';
import Mug from "../../assets/images/mug.jpg";
import { ethToInr } from "../../utils/unitconvert";
import AntdProgress from "../ProgressBar/AntdProgress";
import { inPercentage } from './../../utils/percent';
import Button from "../Button/Button";
import Usefetch from "../../utils/Usefetch";
import { sharkblockABI } from "../../abi";

export default function DashboardCard({data}) {
  const navigate = useNavigate();
  const { data: onclosedata, fetch: onClose } = useWeb3ExecuteFunction({
    abi: sharkblockABI,
    contractAddress: data.address,
    functionName: "closeCampaign",
  });
  const { data: onwithdrawdata, fetch: onwithdraw, isFetching, isLoading, error } = useWeb3ExecuteFunction({
    abi: sharkblockABI,
    contractAddress: data.address,
    functionName: "tranferFromCampaign",
  });
  const handleNavigate = () => {
    if(data.status == '1'){
    navigate(`/campaign/${data?.address}`);
    } else {
      message.info("Campaign is closed");
    }
  }

   React.useEffect(()=>{
console.log("withdraw", onwithdrawdata, isFetching, isLoading);
console.error("error", error)
   },[onwithdrawdata, isFetching, isLoading])

  return (
    <div  className="dash_campaigncard_container">
      <div onClick={handleNavigate} className="img_container">
        <img src={data?.images[0]} alt="" />
      </div>
      <div>
    <AntdProgress percent={data?.goal && inPercentage(ethers.utils.formatUnits(data?.pledged),ethers.utils.formatUnits(data?.goal)) || 0} />
      </div>
      <div className="info_campaign">
        <a href="#">{data?.category}</a>
        <h3>
          {data?.title}
        </h3>
        <p>
          {data?.description}
        </p>
        <div className="financial_info">
          <span>
            <h4>Pledged</h4>
            <p>Eth {ethers.utils.formatUnits(data?.pledged)} <br /> Rs.{ethToInr(ethers.utils.formatUnits(data?.pledged))}</p>
          </span>
          <span>
            <h4>Goal</h4>
            <p>ETH {ethers.utils.formatUnits(data?.goal)} <br /> Rs.{ethToInr(ethers.utils.formatUnits(data?.goal))}</p>
          </span>
          <span>
            <h4>Sharks</h4>
            <p>{data?.transaction.length}</p>
          </span>
        </div>
        <div className="created_by">
        <Button style={{width: '120px', margin: '5px'}} onClick={onwithdraw}> WITHDRAW </Button>
        <Button style={{width: '120px', margin: '5px 10px'}} onClick={onClose}> CLOSE </Button>
        </div>
      </div>
    </div>
  );
}
