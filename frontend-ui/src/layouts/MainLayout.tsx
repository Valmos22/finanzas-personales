import { Outlet } from 'react-router-dom';
import Aside from '../components/aside/Aside';
import NavDashboard from '../components/NavDashboard/NavDashboard';


const MainLayout = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <NavDashboard />
        <Aside />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default MainLayout