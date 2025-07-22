import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { toast } from 'react-toastify';

const Home = () => {
  const location = useLocation();
  const { forgotPassSuccess } = location.state || {};

    useEffect(() => {
      const showToastIfExists = (message) => {
           if (message) toast.success(message);
         };
     
         showToastIfExists(forgotPassSuccess);
         if (forgotPassSuccess) {
           navigate(location.pathname, { replace: true }); // removes toast message from history
         }
    }, [forgotPassSuccess,location.pathname]);
  
  return (
    <div>
      <h1>Home</h1>
      
    </div>
  )
}

export default Home