import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProfilePage from './ProfilePage';

const DebugPage = () => {
  const { username } = useParams();
  
  // Debug page is essentially the same as ProfilePage but with debug username
  return <ProfilePage />;
};

export default DebugPage;
