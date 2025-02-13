import React from 'react';  
import { Select } from 'antd';
import './MyWorkSpace.css';  
import TextArea from 'antd/es/input/TextArea';

const { Option } = Select;

const MyWorkSpace = () => {  
  return (  
    <div className='container-fluid' style={{ width: "95.5vw" }}>  
    <div className='row w-100 d-flex justify-content-between my-3'>
    <Select  
      defaultValue="Select a value"  
      style={{ width: 200 }}  
      onChange={''}  
    >  
      <Option value="option1">Option 1</Option>  
      <Option value="option2">Option 2</Option>  
      <Option value="option3">Option 3</Option>  
    </Select>
    <Select  
      defaultValue="Select a value"  
      style={{ width: 200 }}  
      onChange={''}  
    >  
      <Option value="option1">Option 1</Option>  
      <Option value="option2">Option 2</Option>  
      <Option value="option3">Option 3</Option>  
    </Select>
    <Select  
      defaultValue="Select a value"  
      style={{ width: 200 }}  
      onChange={''}  
    >  
      <Option value="option1">Option 1</Option>  
      <Option value="option2">Option 2</Option>  
      <Option value="option3">Option 3</Option>  
    </Select>
    </div>
      <div className='row' style={{ width: "100%", height: "73.5vh", border: '1px solid green'}}>  
        
        <div className='col-md-3 border border-primary' style={{ height: "100%",padding:"0px"}}>  
          <h5 className="text-center">Chat Box</h5>  
          <div style={{width:"100%",height:"93.5%",border:"1px solid black",display:"flex",alignItems:"end"}}>
                <div style={{width:"100%",height:"200px",border:"1px solid purple"}}>
                        <TextArea>
                            Type Here
                        </TextArea>
                </div>
          </div>
        </div>  
        
        <div className='col-md-9 border border-warning' style={{ height: "100%",padding:"0px",display:"flex",justifyContent:"center"}}>  
          <div className='row' style={{ height: "100%" }}>  
            <div className='col-12' style={{ height: "50%",padding:"0px"}}>  
              <div className='border border-danger h-100 d-flex justify-content-center align-items-center'>  
                <h6>Bussiness Rules</h6>  
              </div>  
            </div>  
            <div className='col-12' style={{ height: "50%",padding:"0px"}}>  
              <div className='border border-secondary h-100 d-flex justify-content-center align-items-center'>  
                <h6>Table</h6>  
              </div>  
            </div>  
          </div>  
        </div>  
      </div>  
    </div>  
  );  
}  

export default MyWorkSpace;