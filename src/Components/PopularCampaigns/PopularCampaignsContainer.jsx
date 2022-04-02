import React from "react";
import { ethers } from "ethers";
import "./PopularCampiagnContainer.scss";
import CampaignCard from "./../CampaignCard/CampaignCard";
import Button from "../Button/Button";
//import Usefetch from "../../utils/Usefetch";
import { sharkblockABI } from "../../abi";
import Loader from './../loader/Loader';

export default function PopularCampaignsContainer({contract}) {
  // const array = Array(7).fill(0);
  const [allCampainAddr, setAllCampainAddr] = React.useState([]);
  const [allcampaigndetailsArray, setAllcampaigndetailsArray] = React.useState([]);
  const [loading, setloading] =  React.useState(false);
  // const { data, fetch, isFetching, isLoading } = Usefetch({
  //   functionName: "createCampaign",
  // });

  React.useEffect(()=>{
    (async ()=>{
      const allCampaignAddr = await contract.getAllCampaignAddress();
      setAllCampainAddr(allCampaignAddr)
    })();
  },[contract])

  React.useEffect(()=> {
    const provider = ethers.getDefaultProvider("rinkeby");
    setloading(true);
    (async () => {
    const detailArray = [];
     for (const addr of allCampainAddr) {
      const sharkcontract = new ethers.Contract(
        addr,
        sharkblockABI,
        provider
      );
        // let sharkblock = await sharkcontract.getCampaignDetails();
        // let images = await sharkcontract.getImages();
        // let _balance = await sharkcontract.getMyCampaignFund();
        // let transaction = await sharkcontract.getTransactions();
        // let status = await sharkcontract.status();
      
        let all = await Promise.all([sharkcontract.getCampaignDetails(), sharkcontract.getImages(), sharkcontract.getMyCampaignFund(), sharkcontract.getTransactions(), sharkcontract.status()]);
      
         let obj = {
           ...all[0],
           images: all[1],
           pledged: all[2],
           transaction: all[3],
           status: all[4],
           address: sharkcontract.address
         }
        detailArray.push(obj);
      
     }
     setAllcampaigndetailsArray(detailArray);
     setloading(false);
      })()
     
   
  },[allCampainAddr])
  return (
    <>
     { loading && <Loader />}
 
    <div className="PopularCampiagn_Container">
      <div className="campaign_title">
        <div>
          <h1>Popular Campaigns</h1>
          <Button
            style={{
              backgroundColor: "#041d57",
              height: "50px",
              width: "200px",
            }}
          >
            ALL CAMPAIGNS
          </Button>
        </div>
        <span className="divider">-----------------</span>
        <p>
          FundPress has built a platform focused on aiding entrepreneurs,
          startups, and companies raise capital from anyone
        </p>
      </div>
      <div className="allCard_container">
        {allcampaigndetailsArray?.map((data, i) => (
          <CampaignCard key={i} data={data} />
        ))}
      </div>
    </div>
    </>
  );
}
