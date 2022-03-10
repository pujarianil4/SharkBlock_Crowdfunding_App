import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import "./App.css";
import "antd/dist/antd.css";
import Router from "./routes/Router";
import { factoryABI } from "./abi";
import Usefetch from "./utils/Usefetch";
import { ethers } from "ethers";
import dateinSec from "./utils/dateinSec";

function App() {
  const { enableWeb3 } = useMoralis();
  const [contract, setContract] = useState(null)
  const { data, fetch, isFetching, isLoading } = Usefetch({
    functionName: "setNewmastercontract",
    params:{
      _addr: '0x43a662a6337351B122051ed69a07020DE9366147'
    //  _category: "games",
    //  _title: "this is the future",
    //  _description: "this is the future of gaming industry",
    //  _goal: "1000000",
    //  _startDate:dateinSec(new Date()),
    //  _endDate: dateinSec('10/05/2022'),
    //  _images: ["https://wp.xpeedstudio.com/crowdmerc/wp-content/uploads/2018/03/Mi-VR-Standalone.jpg"]
    }
  });

  useEffect(() => {
    console.log("data==>", data, isFetching, isLoading);

    (async ()=> {
      // const getallcamp = await contract.getAllCampaignAddress();
      //const setmaster = await contract.setNewmastercontract('0x43a662a6337351B122051ed69a07020DE9366147');
      const get = await contract.masterContract();

      console.log("newmaster", get);

    })()
  }, [data, isFetching, isLoading]);

  useEffect(() => {
    const provider = ethers.getDefaultProvider("rinkeby");
    const contract = new ethers.Contract(
      process.env.REACT_APP_FACTORY_CONTRACT_ADD,
      factoryABI,
      provider
    );
    setContract(contract);
    enableWeb3();
  }, []);

  return (
    <div className="App">
      {/* <button onClick={fetch}>setmaster</button> */}
      <Router contract={contract}/>
    </div>
  );
}

export default App;
