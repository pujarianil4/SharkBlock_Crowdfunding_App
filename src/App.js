import React, { useEffect, useState } from "react";
import "./App.css";
import "antd/dist/antd.css";
import Router from "./routes/Router";
import { factoryABI } from "./abi";
import { ethers } from "ethers";
function App() {

  const [contract, setContract] = useState(null)

  useEffect(() => {
    const provider = ethers.getDefaultProvider("rinkeby");

    const contract = new ethers.Contract(
      process.env.REACT_APP_FACTORY_CONTRACT_ADD,
      factoryABI,
      provider
    );
    setContract(contract);
 
  }, []);

  return (
    <div className="App">
      {/* <button onClick={fetch}>setmaster</button> */}
      <Router contract={contract}/>
    </div>
  );
}

export default App;
