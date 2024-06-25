import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/navbar";

import "./css/navbar.style.css"
import "./css/projectList.style.css"
import "./css/createProject.style.css"
import "./css/loginPage.style.css"
import "./css/utils.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import { ProjectList } from "./components/projectList";
import { CreateProjectPage, EditProject } from "./components/create-project-page";
import { LoginUser } from "./components/login-pages";
import Cookies from "js-cookie";

function App() {
  return (
    <div className="App">
      {!Cookies.get("_access_token") ? <>
        <Routes>
          <Route path="/login" element={<LoginUser />} />
          <Route path="*" element={<LoginUser />} />
        </Routes>
      </> :
        <>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<ProjectList />} />
              <Route path="/create-project" element={<CreateProjectPage />} />
              <Route path="/edit-project/:projectId" element={<EditProject />} />
            </Routes>
          </main>
        </>}
    </div>
  );
}

export default App;
