import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Department from "./pages/Department";
import Programme from "./pages/Programme";
import Block from "./pages/Block";
import Room from "./pages/Room";
import Role from "./pages/Role";
import User from "./pages/User";
import Complaint from "./pages/Complaint";
import ComplaintList from "./pages/ComplaintList";
import Reports from "./pages/Reports";

import Layout from "./components/Layout.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        {/* Masters */}
        <Route
          path="/department"
          element={
            <Layout>
              <Department />
            </Layout>
          }
        />

        <Route
          path="/programme"
          element={
            <Layout>
              <Programme />
            </Layout>
          }
        />

        <Route
          path="/block"
          element={
            <Layout>
              <Block />
            </Layout>
          }
        />

        <Route
          path="/room"
          element={
            <Layout>
              <Room />
            </Layout>
          }
        />

        <Route
          path="/role"
          element={
            <Layout>
              <Role />
            </Layout>
          }
        />

        <Route
          path="/user"
          element={
            <Layout>
              <User />
            </Layout>
          }
        />

        {/* Complaints */}

        {/* Raise Complaint */}
        <Route
          path="/complaint"
          element={
            <Layout>
              <Complaint />
            </Layout>
          }
        />

        {/* Complaint List */}
        <Route
          path="/complaints"
          element={
            <Layout>
              <ComplaintList />
            </Layout>
          }
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={
            <Layout>
              <Reports />
            </Layout>
          }
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;