import React, { useState } from 'react';  
import { GiHamburgerMenu } from 'react-icons/gi';  
import { AiOutlineDashboard, AiOutlineBgColors } from 'react-icons/ai';  
import { Button, Layout, Menu, theme } from 'antd';
import { FaLink } from "react-icons/fa6";  
import { BiSolidFileExport } from "react-icons/bi";
import { GrTransaction } from "react-icons/gr";
import { Link, Outlet } from 'react-router-dom';  
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;  

const items = [   
  {  
    key: 'extractions',  
    icon: <BiSolidFileExport className='fs-4' />,  
    label: 'Extractions'  
  },  
  {  
    key: '3',  
    icon: <GrTransaction className='fs-4' />,  
    label: 'Cleanse'  
  },  
  {  
    key: '4',  
    icon: <AiOutlineDashboard className='fs-4' />,  
    label: 'Cleanse Data'  
  },  
  {  
    key: '5',  
    icon: <AiOutlineDashboard className='fs-4' />,  
    label: 'Transform Data'  
  }  ,
  {  
    key: '6',  
    icon: <AiOutlineDashboard className='fs-4' />,  
    label: 'Preload'  
  } ,
  {  
    key: '7',  
    icon: <AiOutlineDashboard className='fs-4' />,  
    label: 'Load'  
  }  ,
  {  
    key: '8',  
    icon: <AiOutlineDashboard className='fs-4' />,  
    label: 'Re Consile'  
  }   
];  

const Layouter = () => {  
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);  
  const [selectedKey, setSelectedKey] = useState('1'); // Add state for the selected key  
  const {  
    token: { colorBgContainer },  
  } = theme.useToken();  

  const handleMenuClick = (e) => {  
    setSelectedKey(e.key); 
    navigate(e.key);
  };  

  return (  
    <>  
      <Layout hasSider>  
        <Sider trigger={null} collapsible collapsed={collapsed}>  
          <div className="fixed logo d-flex align-items-center justify-content-center">  
            <h3 className='text-center text-white fs-5 mb-0 '>  
              <span className='sm-logo'>LLM</span>  
              <span className='lg-logo'>Large Language Model</span>  
            </h3>  
          </div>  
          <Menu  
            theme="dark"  
            mode="inline"  
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick} 
            items={items}  
          />  
        </Sider>  
        <Layout>  
          <Header style={{ padding: 0, background: colorBgContainer }} className='d-flex justify-content-between ps-3 pe-5'>  
            <Button  
              type="text"  
              icon={collapsed ? <GiHamburgerMenu /> : <GiHamburgerMenu />}  
              onClick={() => setCollapsed(!collapsed)}  
              style={{  
                fontSize: '16px',  
                width: 64,  
                height: 64,  
              }}  
            />  
          </Header>  
          <Content  
            style={{  
              margin: '24px 16px',  
              padding: 24,  
              minHeight: 280,  
              background: colorBgContainer,  
            }}  
          >  
            <Outlet />  
          </Content>  
        </Layout>  
      </Layout>  
    </>  
  );  
}  

export default Layouter;