import React from "react";
// import Progress from "../ProgressBar/Progress";
import { useMoralisFile, useMoralis } from 'react-moralis'
 import Moralis from "moralis";
// import {Buffer} from 'buffer';
import { ethers } from "ethers";
import { HeartFilled, InboxOutlined } from "@ant-design/icons";
import { Modal, Input, Upload, message } from 'antd';
import "./landingheader.scss";
import Button from "../Button/Button";
import robot from "../../assets/images/robot.png";
import Header from "./../Header/Header";
import AntdProgress from './../ProgressBar/AntdProgress';
import Usefetch from "../../utils/Usefetch";
import dateinSec from "../../utils/dateinSec";




export default function LandingHeader() {
  const [isModelvisible, setIsModelVisible ] = React.useState(false); 
   const [file, setFile] = React.useState(null);
   const [uploaded, setFileuploaded]= React.useState(false);
   const [loading, setIsloading]= React.useState(false);
   const [error, setError]= React.useState(false);
   const [fileUrls, setFileUrls] = React.useState([]);
   const [form, setForm] = React.useState({
     category: "",
     title:"",
     description:"",
     goal: "1",
     startDate:"",
     endDate:""
   })
  const { Dragger } = Upload;
  const allfields = form.category && form.title && form.description && form.goal && form.startDate && form.endDate && uploaded;
  const {user, isAuthenticated} = useMoralis()

  const handleInput =(e) => {
    const { name, value } = e.target;
    let obj = {
      ...form,
      file: file,
      [name]: value
    }
    //console.log("form", obj);
    setForm(obj)
  }

  const handleUpload = async (file) => {
    message.loading("File is uploading..");
    setIsloading(true);
     try {
      const file1 = new Moralis.File(file.name , file);
      await file1.saveIPFS();
      const fileURL = file1.ipfs();
      message.success("File uploaded successfully");
      setFileuploaded(true);
      setFileUrls([...fileUrls, fileURL]);
      setIsloading(false);
     } catch (error) {
        console.error(error);
        setIsloading(false);
        message.error("File upload failed");
     }
  }

  const { data, fetch, isFetching, isLoading } = Usefetch({
    functionName: "createCampaign",
    params:{
     _category: form.category,
     _title: form.title,
     _description: form.description,
     _goal: ethers.utils.parseEther(`${form.goal || 0}`) ,
     _startDate:dateinSec(new Date(form.startDate)),
     _endDate: dateinSec(new Date(form.endDate)),
     _images: fileUrls,
     _owner: user? user.get('ethAddress'): '0x0'
    }
  });

  const handleModal =(bool) =>{
    if(isAuthenticated){
      setIsModelVisible(bool);
    } else {
      message.error("Please login to create a campaign");
    }
    
  }

  const handleSubmit = async (e) =>{
    fetch();
    handleModal(false);
  };
 
  React.useEffect(()=>{
 if(user){
  console.log("user", user.get('ethAddress'), user);
 }
   console.log("file", isFetching, isLoading, data);
  },[isFetching, isLoading, data])



  return (
    <>
    <div className="landing_container">
      <div className="landing_header_container">
        <Header />
      </div>
      <div className="welcome_container">
        <div className="welcome_content">
          <h1>Exclusive Bunny Cam</h1>
          <AntdProgress  percent={52} status='active' style={{width: '80%', marginLeft: '60px'}}/>
          <div className="offer">
            <h2>ETH 14,000.00</h2>
            <p>Goal</p>
            <br />
            <h2>ETH 9,000.00</h2>
            <p>Pledged</p>
          </div>
          <div className="buttons">
            <Button
              style={{ backgroundColor: "#041d57" ,  height: '50px', width: '200px'}}
              icon={<HeartFilled />}
              
            >
              INVEST NOW
            </Button>

            <Button  style={{ backgroundColor: "#3e5a97", width: '250px', height: '50px' }} onClick={()=>handleModal(true)}>
              START A CAMPAIGN
            </Button>
          </div>
        </div>
        <div className="welcome_img">
          <img src={robot} alt="welcome" />
        </div>
      </div>
    </div>
    <Modal visible={isModelvisible} onCancel={()=> handleModal(false)} footer={null}>
      <div className="input_class_container">
     <div>
     <Input required onChange={handleInput} type='text' name="category" className="input_class" placeholder="Enter Category" />
      <Input required onChange={handleInput} type='text' name="title" className="input_class" placeholder="Enter Title" />
      <Input required onChange={handleInput} type='number' name="goal" className="input_class" placeholder="Your Investment Goal" />
     </div>
      <Input.TextArea required onChange={handleInput} name="description" className="input_class_text_area" placeholder="Enter Description" />
     </div>
      <div className="input_class_container">
      <Input required onChange={handleInput} type='date' name="startDate" className="input_class" />
      <Input required onChange={handleInput} type='date' name="endDate" className="input_class"  placeholder="End Date"/>
      </div>
        <input type='file' required  onChange={(e)=> handleUpload(e.target.files[0])} />
        <span style={{color: '#4cc899'}}>{loading && "File is uploading.."}</span>
  
  <Button  onClick={handleSubmit} disabled={!uploaded && !allfields}>SUBMIT</Button>
    </Modal>
    </>
  );
}
