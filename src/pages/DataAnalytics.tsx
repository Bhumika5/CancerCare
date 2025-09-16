import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = 'http://localhost:3000';

const getLocal = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

const DataAnalytics = () => {
  const { isAuthenticated } = useAuth();
  const [usersCount, setUsersCount] = useState<number>(0);
  const [bookings, setBookings] = useState<any[]>([]);

  const fetchAll = async () => {
    try {
      const [bookingsRes, usersCountRes] = await Promise.all([
        fetch(`${API_URL}/bookings`),
        fetch(`${API_URL}/users/count`),
      ]);
      const [bookingsJson, usersCountJson] = await Promise.all([
        bookingsRes.json(),
        usersCountRes.json(),
      ]);
      setBookings(Array.isArray(bookingsJson) ? bookingsJson : []);
      setUsersCount(Number(usersCountJson?.count || 0));
    } catch (e) {
      // Fallback to localStorage for demo/offline mode
      const localBookings = getLocal('bookings');
      setBookings(Array.isArray(localBookings) ? localBookings : []);
      const localUsers = getLocal('users');
      const currentUser = (() => { try { return JSON.parse(localStorage.getItem('currentUser') || 'null'); } catch { return null; } })();
      const approxCount = Array.isArray(localUsers) && localUsers.length > 0 ? localUsers.length : (currentUser ? 1 : 0);
      setUsersCount(approxCount);
    }
  };

  // Initial fetch and focus refresh
  useEffect(() => {
    fetchAll();
    const onFocus = () => fetchAll();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // Poll every 2s for near real-time updates
  useEffect(() => {
    const interval = setInterval(fetchAll, 2000);
    return () => clearInterval(interval);
  }, []);

  // Refresh when auth state changes (e.g., after login/register)
  useEffect(() => {
    fetchAll();
  }, [isAuthenticated]);

  // Also react to localStorage updates from other tabs/actions
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === 'bookings' || e.key === 'users' || e.key === 'currentUser') {
        fetchAll();
      }
    };
    const onCustom = () => fetchAll();
    window.addEventListener('storage', onStorage);
    window.addEventListener('bookings-updated', onCustom as any);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-purple-200" />
            <h1 className="text-base lg:text-lg font-semibold mb-1">
              Data Analytics
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Comprehensive insights and analytics for cancer screening data across South India
            </p>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Total Users</CardTitle>
            <Users className="w-8 h-8 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{usersCount}</div>
            <CardDescription>Registered on portal</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Total Bookings</CardTitle>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{Math.max(bookings.length, (() => { try { return (JSON.parse(localStorage.getItem('bookings') || '[]') || []).length; } catch { return 0; } })())}</div>
            <CardDescription>Screening appointments booked</CardDescription>
          </CardContent>
        </Card>
      </section>

      {/* Charts removed as requested */}

      {/* Looker Studio Dashboard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Analytics Dashboard</CardTitle>
            <CardDescription>Interactive Looker Studio dashboard for comprehensive data analysis</CardDescription>
          </CardHeader>
          <CardContent>
  <div className="relative w-full pb-[75%] h-0 overflow-hidden rounded-lg border bg-gray-50">
    <iframe
      src="https://lookerstudio.google.com/embed/reporting/d209471a-1dc4-4370-9da3-c0e3a3d66fe0/page/8uSRF"
      className="absolute top-0 left-0 w-full h-full"
      frameBorder="0"
      allowFullScreen
      sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      title="Cancer Screening Analytics Dashboard"
    />
  </div>
  <div className="mt-4 text-center">
    <p className="text-sm text-gray-500">
      If the dashboard doesn't load, please ensure you're signed into your Google account
    </p>
  </div>
</CardContent>

        </Card>
      </section>
    </div>
  );
};

export default DataAnalytics; 