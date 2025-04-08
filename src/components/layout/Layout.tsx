
import { Outlet } from 'react-router-dom';
import { MainNavbar } from '@/components/navigation/MainNavbar';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
