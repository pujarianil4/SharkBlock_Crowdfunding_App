import React from "react";
import { Input, Button, Avatar, Tabs, Select, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { ethers } from "ethers";
import AntdProgress from "../ProgressBar/AntdProgress";
import { sharkblockABI } from "../../abi";
import "./CampaignDetails.scss";
import { useParams } from "react-router-dom";
import { ethToInr, weiToGwei } from "../../utils/unitconvert";
import { inPercentage } from "./../../utils/percent";
import { weiToEth } from "./../../utils/unitconvert";
import Loader from "./../loader/Loader";
//import Mug from "https://bafybeievw2qrhzyqbvag64neneiumyttimldwzfuredqkg6zpexyroysxu.ipfs.infura-ipfs.io";

function toDateTime(secs) {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs).toString();
  let news = new Date(t);
  return news.toDateString();
}

export default function CampaignDetails() {
  const { TabPane } = Tabs;
  const [campaignDetails, setCampaignDetails] = React.useState({});
  const [isAuthenticated, setIAuthenticate] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [select, setSelect] = React.useState("ETH");
  const [isLoading, setIsLoading] = React.useState(false);
  const { addr } = useParams();

  const inputValue = {
    ETH: weiToEth(input),
    GWEI: weiToGwei(input),
    WEI: input,
  };

  const handleInvestFetch = async () => {
    if (campaignDetails.status == "0") {
      setIsLoading(true);
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await web3Provider.getSigner();
      //const getGasprice = await signer.getGasPrice();
      const contract = new ethers.Contract(addr, sharkblockABI, signer);
      const tx = await contract.investNow({
        gasLimit: 210000,
        value: inputValue[select],
      });
      tx.wait();
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    } else {
      message.info("Campaign is closed already !");
    }
  };

  const { Option } = Select;

  const handleInvest = () => {
    if (isAuthenticated == "true") {
      handleInvestFetch();
    } else {
      message.info("Please login to invest");
    }
  };

  React.useEffect(() => {
    setIAuthenticate(localStorage.getItem("isAuthenticated"));
    if (campaignDetails?.status == "1") {
      message.error("Campaign is already Closed");
    }
  }, [localStorage.getItem("isAuthenticated"), campaignDetails]);

  React.useEffect(() => {
    if (!isLoading) {
      setCampaignDetails({});
    }
    if (addr) {
      const provider = ethers.getDefaultProvider("rinkeby");
      const sharkcontract = new ethers.Contract(addr, sharkblockABI, provider);
      (async () => {
        // let sharkblock = await sharkcontract.getCampaignDetails();
        // let images = await sharkcontract.getImages();
        // let _balance = await sharkcontract.getMyCampaignFund();
        // let transaction = await sharkcontract.getTransactions();
        // let status = await sharkcontract.status();
        let [sharkblock, images, _balance, transaction, status] =
          await Promise.all([
            sharkcontract.getCampaignDetails(),
            sharkcontract.getImages(),
            sharkcontract.getMyCampaignFund(),
            sharkcontract.getTransactions(),
            sharkcontract.status(),
          ]);
        let obj = {
          ...sharkblock,
          images: images,
          pledged: _balance,
          transaction,
          status,
          address: sharkcontract.address,
        };
        setCampaignDetails(obj);
      })();
    }
  }, [addr, isLoading]);

  return (
    <>
      {isLoading && <Loader />}
      {!campaignDetails?.address && <Loader />}
      <div className="campaign_container">
        <div className="campaign_brif">
          <div className="img_container">
            {campaignDetails?.images && (
              <img
                src={
                  campaignDetails?.images?.[0] ||
                  "https://bafybeievw2qrhzyqbvag64neneiumyttimldwzfuredqkg6zpexyroysxu.ipfs.infura-ipfs.io/"
                }
                alt=""
              />
            )}
            <div>
              {campaignDetails?.images?.length > 0 &&
                campaignDetails?.images?.map((img, i) => (
                  <img key={i} src={img} alt="" />
                ))}
            </div>
          </div>
          <div className="info_campaign">
            <div className="canpaign_account">
              <div>
                <h2>Raised</h2>
                <p>
                  {campaignDetails?.pledged &&
                    inPercentage(
                      ethers.utils.formatUnits(campaignDetails?.pledged),
                      ethers.utils.formatUnits(campaignDetails?.goal)
                    ).toFixed(2)}
                  %
                </p>
              </div>
              <div>
                <h2>Goal</h2>
                <p>
                  {" "}
                  ETH{" "}
                  {campaignDetails?.goal &&
                    ethers.utils.formatUnits(campaignDetails?.goal)}{" "}
                  (Rs.
                  {(campaignDetails?.goal &&
                    ethToInr(
                      ethers.utils.formatUnits(campaignDetails?.goal)
                    )) ||
                    0}
                  )
                </p>
              </div>
            </div>
            <div className="progress_bar">
              <AntdProgress
                percent={
                  (campaignDetails?.goal &&
                    inPercentage(
                      ethers.utils.formatUnits(campaignDetails?.pledged),
                      ethers.utils.formatUnits(campaignDetails?.goal)
                    )) ||
                  0
                }
              />
            </div>
            <div className="pledged">
              <p>Pledged</p>
              <h1>
                ETH{" "}
                {campaignDetails?.pledged &&
                  ethers.utils.formatUnits(campaignDetails?.pledged)}{" "}
                <span>
                  (Rs.
                  {campaignDetails?.pledged &&
                    ethToInr(
                      ethers.utils.formatUnits(campaignDetails?.pledged)
                    )}
                  )
                </span>{" "}
              </h1>
            </div>
            <div className="investors_sharks">
              <p>Sharks</p>
              <h1>{campaignDetails?.transaction?.length}</h1>
            </div>
            <div className="transaction_container">
              <div>
                <Input
                  type="number"
                  disabled={campaignDetails?.status == "1"}
                  onChange={(e) => setInput(e.target.value)}
                  prefix={
                    <img
                      src="https://ipfs.moralis.io:2053/ipfs/QmXKYQE5tLZ4ieo3G31LT3hZw6upX4JXr4TJK5g4qdZf7f"
                      className="ethereum_icon"
                      alt=""
                    />
                  }
                />
                <Select
                  className="select_value"
                  defaultValue="ETH"
                  onChange={(e) => setSelect(e)}
                  style={{ width: "80px" }}
                  bordered={false}
                >
                  <Option value="ETH">ETH</Option>
                  <Option value="GWEI">GWEI</Option>
                  <Option value="WEI">WEI</Option>
                </Select>
              </div>
              <div>
                <Button
                  onClick={handleInvest}
                  disabled={campaignDetails?.status == "1"}
                  className="invest_button"
                  type="primary"
                >
                  INVEST
                </Button>
              </div>
            </div>
            <div className="created_by">
              <Avatar
                style={{ backgroundColor: "#4cc899", margin: "20px 5px" }}
                size="large"
                icon={<UserOutlined />}
              />
              <div>
                <h6>Created by</h6>
                <p>Anil Pujari</p>
              </div>
            </div>
          </div>
        </div>
        <div className="campaign_description">
          <div className="comapign_tabs">
            <Tabs className="custom_tab" defaultActiveKey="1" size="large">
              <TabPane tab="Description" key="1">
                <p>
                  {campaignDetails?.description && campaignDetails?.description}
                </p>
              </TabPane>
              <TabPane tab="Reviews (0)" key="2">
                No reviews yet!
              </TabPane>
              <TabPane tab="Updates" key="3">
                No updates yet!
              </TabPane>
              <TabPane tab="Recent Funds" key="4">
                {campaignDetails?.transaction?.length > 0 ? (
                  <div className="transaction_container">
                    {campaignDetails?.transaction?.map((transaction, i) => (
                      <Transaction key={i} transaction={transaction} />
                    ))}
                  </div>
                ) : (
                  <div>No recent funds yet!</div>
                )}
              </TabPane>
            </Tabs>
          </div>
          <div className="campaign_other_details">
            {campaignDetails?.startDate && (
              <div>
                <h2>Other Details</h2>
                <h3>Start Date -</h3>
                <p>
                  {toDateTime(
                    ethers.utils.formatUnits(campaignDetails?.startDate, "wei")
                  )}
                </p>
                <h3>End Date -</h3>
                <p>
                  {toDateTime(
                    ethers.utils.formatUnits(campaignDetails?.endDate, "wei")
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Transaction({ transaction }) {
  return (
    <div className="transaction_record">
      <h6>{transaction.addr}</h6>{" "}
      <p>{ethers.utils.formatUnits(transaction.amount)}</p>{" "}
      <p>
        {toDateTime(
          ethers.utils.formatUnits(transaction.date, "wei").toString()
        )}
      </p>
    </div>
  );
}
