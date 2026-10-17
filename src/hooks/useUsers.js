import { useCallback, useEffect, useState } from "react";
import {
  getUsers,
  deleteUser as deleteUserRequest,
} from "../services/userService";

export function useUsers({ search = "", gender = "" } = {}) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = useCallback(() => {
    setReloadKey((previous) => previous + 1);
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadUsers() {
      setIsLoading(true);
      setError("");

      try {
        const result = await getUsers({ search, gender });

        if (isActive) {
          setUsers(result.users);
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            requestError.message || "Failed to load users."
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      isActive = false;
    };
  }, [search, gender, reloadKey]);

  const removeUser = useCallback(async (userId) => {
    await deleteUserRequest(userId);

    setUsers((previousUsers) =>
      previousUsers.filter(
        (user) => String(user.id) !== String(userId)
      )
    );
  }, []);

  return {
    users,
    setUsers,
    isLoading,
    error,
    refresh,
    removeUser,
  };
}