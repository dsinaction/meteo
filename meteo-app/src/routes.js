import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import MainLayout from './layouts/MainLayout';
import NotFoundView from './views/errors/NotFoundView';
import IntervalsView from './views/IntervalsView';
import StationListView from './views/StationListView';
import MonthlyDataView from './views/MonthlyDataView';
import TrendsView from './views/TrendsView';
import DeviationsView from './views/DeviationsView';
import DashboardView from './views/DashboardView';
import AboutView from './views/AboutView';


const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'stations', element: <StationListView /> },
      { path: 'monthlydata', element: <MonthlyDataView /> },
      { path: 'trends', element: <TrendsView /> },
      { path: 'deviations', element: <DeviationsView /> },
      { path: 'interval', element: <IntervalsView /> },
      { path: 'about', element: <AboutView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
