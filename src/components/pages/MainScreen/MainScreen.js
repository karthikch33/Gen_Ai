import React, { useState } from 'react';  
import { useNavigate } from 'react-router-dom';  
import { Button, Layout, Menu, theme } from 'antd';
import { GiHamburgerMenu } from 'react-icons/gi';    
import { HiDatabase  } from "react-icons/hi";     
import { SiCrehana } from "react-icons/si";
import { Outlet } from 'react-router-dom';  
import { SiMysql } from "react-icons/si";
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import { MdInsertDriveFile   } from "react-icons/md";
import { TbPlugConnected } from "react-icons/tb"
import { VscGitPullRequestCreate } from "react-icons/vsc";
import { BsFillEyeFill   } from "react-icons/bs";
import { TbReportAnalytics } from "react-icons/tb";
import { FaDiagramProject } from "react-icons/fa6";
import { SiOracle } from "react-icons/si";
import { SiEnterprisedb } from "react-icons/si";   
import Sider from 'antd/es/layout/Sider';
import { Content, Header } from 'antd/es/layout/layout';
import { BiSolidFileExport } from 'react-icons/bi';
import { GrTransaction } from 'react-icons/gr';
import { SiOpenproject } from "react-icons/si";
import { AiOutlineDashboard } from 'react-icons/ai';
import { GrProjects } from "react-icons/gr";
import { FaLink } from "react-icons/fa6";
import { ToastContainer } from 'react-toastify';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { IoHomeOutline } from 'react-icons/io5';

const items = [  
  { 
    key:'/project',
    icon: <FaDiagramProject  className='fs-4'/>,  
    label: 'Project',
    children:[
      {  
        key: '/project/createproject',  
        icon: <SiOpenproject  className='fs-4'/>,  
        label: 'Create Project',  
      }, 
      {
        key: '/project/manageprojects',
        icon: <GrProjects className='fs-4' />,  
        label: 'Manage Project'
      }   
    ]   
  },   
  {  
    icon: <FaLink  className='fs-4' />,  
    label: 'Connections',
    children:[
      {
        key:'/connections',
        icon: <TbPlugConnected className='fs-4' />,  
        label: 'Create Connections',
        children:[ {  
          key: '/connections/Erp',  
          icon: <SiEnterprisedb  className='fs-4'/>,  
          label: 'ERP',  
        }, 
        {  
          key: '/connections/flatfile',  
          icon: <MdInsertDriveFile  className='fs-4' />,  
          label: 'Files',
          children:[
            {
              key: '/connections/excel',  
              icon: <SiCrehana  className='fs-4'/>,  
              label: 'Excel',
            },
            {
              key: '/connections/txt',  
              icon: <SiCrehana  className='fs-4'/>,  
              label: 'TXT',
            },
            {
              key: '/connections/csv',  
              icon: <SiCrehana  className='fs-4'/>,  
              label: 'CSV',
            },
            {
              key: '/connections/xml',  
              icon: <SiCrehana  className='fs-4'/>,  
              label: 'XML',
            },
            
          ]
        },    
        {  
          key:'/database',
          icon: <HiDatabase  className='fs-4' />,  
          label: 'Database',
          children:[
            {  
              key: '/connections/Hana',  
              icon: <SiCrehana  className='fs-4'/>,  
              label: 'HANA',  
            }, 
            {
              key: '/connections/MySql',
              icon: <SiMysql className='fs-4' />,  
              label: 'MySQL'
            },
            {
              key: '/connections/Oracle',
              icon: <SiOracle className='fs-4' />,  
              label: 'Oracle'
            }
            ]   
        }]
      },
      {
        key: '/connections/view-connections',
        icon: <BsFillEyeFill className='fs-4' />,  
        label: 'Manage Connections'
      }        
    ]},  
  {  
    key: '/bussinessrules/manage',  
    icon: <i className={'fas fa-scale-balanced'}></i> ,  
    label: 'Bussiness Rules',
  },    
  {
    key: '/reports',
    icon: <TbReportAnalytics className='fs-4' />,  
    label: 'Reports'
  },
  {
    key : '/workspace',
     icon:<i className={'fas fa-blog'}></i>,  
    label: 'My WorkSpace',
    children:[
      {  
        key: '/workspace/extractions',  
        icon: <BiSolidFileExport className='fs-4' />,  
        label: 'Extractions'  
      },  
      {  
        key: '/workspace/cleanse',  
        icon: <GrTransaction className='fs-4' />,  
        label: 'Cleanse'  
      },  
      {  
        key: '/workspace/cleansedata',  
        icon: <AiOutlineDashboard className='fs-4' />,  
        label: 'Cleanse Data'  
      },  
      {  
        key: '/workspace/transformdata',  
        icon: <AiOutlineDashboard className='fs-4' />,  
        label: 'Transform Data'  
      }  ,
      {  
        key: '/workspace/preload',  
        icon: <AiOutlineDashboard className='fs-4' />,  
        label: 'Preload'  
      } ,
      {  
        key: '/workspace/load',  
        icon: <AiOutlineDashboard className='fs-4' />,  
        label: 'Load'  
      }  ,
      {  
        key: '/workspace/reconsile',  
        icon: <AiOutlineDashboard className='fs-4' />,  
        label: 'Re Consile'  
      }
    ]
  }
  
];

const MainScreen = () => 
 {  
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);  
  const [selectedKey, setSelectedKey] = useState('1'); // Add state for the selected key  
  const {  
    token: { colorBgContainer },  
  } = theme.useToken();  

  const handleMenuClick = (e) => {  
    setSelectedKey(e.key); 
    navigate(e.key);
  };  

  const returnHome = () => {
    navigate('/');
  }

  return (  
    <div>  
     <ToastContainer
          position='top-center'
          autoClose={1000}
          hideProgressBar={true}
          closeOnClick
          newestOnTop={true}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
          />
      <Layout hasSider>  
        <Sider trigger={null} collapsible collapsed={collapsed} className='main-part'>  
          <div className="fixed logo d-flex align-items-center justify-content-center">  
            <h3 className='text-center text-white fs-5 mb-0 '>  
              <span className='sm-logo' onClick={returnHome} style={{cursor:'pointer'}}>AI</span>  
              <span className='lg-logo' onClick={returnHome} style={{cursor:'pointer'}}>Gen AI</span>  
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
      <Button  
        type="text"  
        icon={collapsed ? <GiHamburgerMenu /> : <GiHamburgerMenu />}  
        onClick={() => setCollapsed(!collapsed)}  
        style={{  
          fontSize: '16px',
          width: 64,  
          height: 64,  
          marginRight: '8px' // Add some space between buttons
        }}  
      />
      <Button
        icon={<IoHomeOutline />}
        onClick={()=>navigate('/')}
        style={{
          fontSize: '16px',
        }}
      />
    </div>
          </Header>  
         
          <Content  
            style={{  
              margin: '24px 16px',  
              padding: 24,  
              // minHeight: 280,
              overflowY:"scroll",  
              // border:"10px solid red",
              background: colorBgContainer,  
            }}  
          >  
            <Outlet/>  
          </Content>  
        </Layout>  
      </Layout>  
    </div>     
  )    
};  

export default MainScreen;