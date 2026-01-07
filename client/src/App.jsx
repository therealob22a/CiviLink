import { BrowserRouter } from "react-router-dom"
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css'
import { AuthProvider } from "./auth/AuthContext.jsx";
import { NotificationsProvider } from "./auth/NotificationsContext.jsx";
import CommonRoutes from "./routes/CommonRoutes";
import UserRoutes from "./routes/UserRoutes";
import OfficerRoutes from "./routes/OfficerRoutes";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationsProvider>
          <div className="App">
            <CommonRoutes/>
            <UserRoutes/>
            <OfficerRoutes/>
            <AdminRoutes/>
          </div>
        </NotificationsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App