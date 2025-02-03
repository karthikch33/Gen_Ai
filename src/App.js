import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import FlatFile from './components/pages/Connections/FlatFile/flatFile';
import Layouter from './components/pages/WorkSpace/SideBar/Layouter';
import CreateProject from './components/pages/Project/CreateProject';
import MainScreen from './components/pages/MainScreen/MainScreen';
import MySqlForm from './components/pages/Connections/Forms/MySqlForm';
import HanaForm from './components/pages/Connections/Forms/HanaForm';
import ErpForm from './components/pages/Connections/Forms/ErpForm';
import OracleForm from './components/pages/Connections/Forms/OracleForm';
import ViewConnection from './components/pages/Connections/ViewConnections/ViewConnection';
import LandingPage from './components/pages/LandingPage';
import ManageProjects from './components/pages/Project/ManageProjects';
import ViewSapTables from './components/pages/Connections/ViewConnections/ViewSapTables';
import ViewHanaTables from './components/pages/Connections/ViewConnections/ViewHanaTables';


function App() {
  return (
    <>
        <BrowserRouter>
          <Routes>
            {/* MainScreen Route*/}
            <Route path="/" element={<MainScreen/>} >
              <Route index element={<LandingPage/>}/>
            </Route>

            {/* Project Routes */}
            <Route path='/project' element={<MainScreen/>} >
            <Route path='createproject' element={<CreateProject/>}/>
            <Route path='manageprojects' element={<ManageProjects/>}/>
            </Route>

            {/* Connections Routes */}
            <Route path="/connections" element={<MainScreen/>}>
              <Route path='mysql' element={<MySqlForm/>}/>
              <Route path='mysql/:id/:project_id' element={<MySqlForm/>}/>
              <Route path='hana' element={<HanaForm/>}/>
              <Route path='hana/:id/:project_id' element={<HanaForm/>}/>
              <Route path='erp' element={<ErpForm/>}/>
              <Route path='erp/:id/:project_id' element={<ErpForm/>}/>
              <Route path='oracle' element={<OracleForm/>}/>
              <Route path='oracle/:id/:project_id' element={<OracleForm/>}/>
              <Route path='flatfile' element={<FlatFile/>} />
              <Route path='view-connections' element={<ViewConnection/>} />
              <Route path='view-tables' element={<ViewSapTables/>} />
              <Route path='view-tables/:id/:conn_name' element={<ViewHanaTables/>} />
            </Route>
            
            {/* Workspace Routes*/}
            <Route path="/workspace" element={<MainScreen/>}>
                <Route path='extractions' element={''}/>
                <Route path='cleanse' element={''}/>
                <Route path='cleansedata' element={''}/>
                <Route path='transformdata' element={''}/>
                <Route path='preload' element={''}/>
                <Route path='load' element={''}/>
                <Route path='reconsile' element={''}/>
            </Route>
            
          </Routes>

        </BrowserRouter>
    </>
  );
}

export default App;
