// App.js
import React, { useEffect } from 'react';
import PublicRoutes from './routes/PublicRoutes';
import PrivateRoutes from './routes/PrivateRoutes';
import { Route, Routes, useLocation } from 'react-router-dom';
import { clearStorage } from './helper/tokenHelper';

const App = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname === "/login" || pathname === "/signup") {
      clearStorage()
    }
  }, [pathname])

  return (
    <Routes>
      <Route path="/*" element={<PublicRoutes />} />
      <Route path="/dashboard/*" element={<PrivateRoutes />} />
    </Routes>
  );
};

export default App;
