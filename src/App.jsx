import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";

import UsersPage from "./pages/UsersPage";
import UserDetailsPage from "./pages/UserDetailsPage";
import AddUserPage from "./pages/AddUserPage";
import EditUserPage from "./pages/EditUserPage";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={<Navigate to="/users" replace />}
        />

        <Route path="/users" element={<UsersPage />} />

        <Route
          path="/users/add"
          element={<AddUserPage />}
        />

        <Route
          path="/users/:id"
          element={<UserDetailsPage />}
        />

        <Route
          path="/users/:id/edit"
          element={<EditUserPage />}
        />

        <Route
          path="*"
          element={<Navigate to="/users" replace />}
        />
      </Route>
    </Routes>
  );
}

export default App;