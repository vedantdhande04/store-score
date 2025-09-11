import React from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import AdminDashboard from '../components/AdminDashboard';
import UserDashboard from '../components/UserDashboard';
import OwnerDashboard from '../components/OwnerDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboardByRole = () => {
    switch (user.role) {
      case 'System Administrator':
        return <AdminDashboard />;
      case 'Normal User':
        return <UserDashboard />;
      case 'Store Owner':
        return <OwnerDashboard />;
      default:
        return <p>Welcome! Your role is not defined.</p>;
    }
  };

  return (
    <Layout>
      {renderDashboardByRole()}
    </Layout>
  );
};

export default Dashboard;