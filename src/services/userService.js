const API_BASE_URL = "https://dummyjson.com";
const STORAGE_KEY = "userManagementLocalChanges";

function getLocalChanges() {
  const emptyChanges = {
    added: [],
    updated: {},
    deleted: [],
  };

  try {
    const savedChanges = localStorage.getItem(STORAGE_KEY);

    if (!savedChanges) {
      return emptyChanges;
    }

    const parsedChanges = JSON.parse(savedChanges);

    return {
      added: parsedChanges.added ?? [],
      updated: parsedChanges.updated ?? {},
      deleted: parsedChanges.deleted ?? [],
    };
  } catch {
    return emptyChanges;
  }
}

function saveLocalChanges(changes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(changes));
  } catch {
    throw new Error(
      "The changes could not be saved locally. Check your browser storage."
    );
  }
}

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed with status ${response.status}`
    );
  }

  return data;
}

function matchesSearch(user, searchQuery) {
  if (!searchQuery.trim()) {
    return true;
  }

  const query = searchQuery.trim().toLowerCase();

  const searchableFields = [
    user.firstName,
    user.lastName,
    `${user.firstName ?? ""} ${user.lastName ?? ""}`,
    user.email,
    user.username,
    user.phone,
  ];

  return searchableFields.some((field) =>
    String(field ?? "").toLowerCase().includes(query)
  );
}

function matchesGender(user, gender) {
  if (!gender) {
    return true;
  }

  return user.gender?.toLowerCase() === gender.toLowerCase();
}

// GET: Fetch users, search, and filter.
export async function getUsers({
  search = "",
  gender = "",
} = {}) {
  let endpoint = "/users?limit=0";

  if (search.trim()) {
    endpoint = `/users/search?q=${encodeURIComponent(
      search.trim()
    )}&limit=0`;
  } else if (gender) {
    endpoint = `/users/filter?key=gender&value=${encodeURIComponent(
      gender
    )}&limit=0`;
  }

  const data = await apiRequest(endpoint);
  const changes = getLocalChanges();

  // Start with the users returned by the API.
  const usersById = new Map();

  for (const user of data.users ?? []) {
    const updatedUser = changes.updated[String(user.id)];

    usersById.set(String(user.id), {
      ...user,
      ...(updatedUser ?? {}),
    });
  }

  // Include locally updated users that were not returned by
  // the current search or filter.
  for (const [id, updatedUser] of Object.entries(changes.updated)) {
    if (!usersById.has(id)) {
      usersById.set(id, updatedUser);
    }
  }

  // Include users created through this application.
  for (const user of changes.added) {
    const updatedUser = changes.updated[String(user.id)];

    usersById.set(String(user.id), {
      ...user,
      ...(updatedUser ?? {}),
    });
  }

  const deletedIds = new Set(changes.deleted.map(String));

  const users = Array.from(usersById.values()).filter((user) => {
    return (
      !deletedIds.has(String(user.id)) &&
      matchesSearch(user, search) &&
      matchesGender(user, gender)
    );
  });

  return {
    users,
    total: users.length,
  };
}

// GET: Fetch one user by ID.
export async function getUserById(id) {
  const changes = getLocalChanges();
  const normalizedId = String(id);

  if (changes.deleted.map(String).includes(normalizedId)) {
    throw new Error("This user has been deleted.");
  }

  const addedUser = changes.added.find(
    (user) => String(user.id) === normalizedId
  );

  if (addedUser) {
    return {
      ...addedUser,
      ...(changes.updated[normalizedId] ?? {}),
    };
  }

  if (changes.updated[normalizedId]) {
    return changes.updated[normalizedId];
  }

  const data = await apiRequest(`/users/${encodeURIComponent(id)}`);

  return {
    ...data,
    ...(changes.updated[normalizedId] ?? {}),
  };
}

// POST: Create a user.
export async function createUser(userData) {
  const createdUser = await apiRequest("/users/add", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  const changes = getLocalChanges();

  changes.added = [
    ...changes.added.filter(
      (user) => String(user.id) !== String(createdUser.id)
    ),
    createdUser,
  ];

  changes.deleted = changes.deleted.filter(
    (id) => String(id) !== String(createdUser.id)
  );

  saveLocalChanges(changes);

  return createdUser;
}

// PATCH: Update an existing user.
export async function updateUser(id, userData, currentUser) {
  const updatedFromApi = await apiRequest(
    `/users/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(userData),
    }
  );

  const changes = getLocalChanges();
  const normalizedId = String(id);

  const existingLocalUser =
    changes.added.find((user) => String(user.id) === normalizedId) ??
    changes.updated[normalizedId] ??
    currentUser ??
    {};

  const updatedUser = {
    ...existingLocalUser,
    ...updatedFromApi,
    ...userData,
    id: Number(id),
  };

  const addedIndex = changes.added.findIndex(
    (user) => String(user.id) === normalizedId
  );

  if (addedIndex !== -1) {
    changes.added[addedIndex] = updatedUser;
  } else {
    changes.updated[normalizedId] = updatedUser;
  }

  saveLocalChanges(changes);

  return updatedUser;
}

// DELETE: Delete a user.
export async function deleteUser(id) {
  const normalizedId = String(id);
  const currentChanges = getLocalChanges();

  const locallyAddedUser = currentChanges.added.find(
    (user) => String(user.id) === normalizedId
  );

  if (locallyAddedUser) {
    const changes = getLocalChanges();

    changes.added = changes.added.filter(
      (user) => String(user.id) !== normalizedId
    );

    delete changes.updated[normalizedId];

    changes.deleted = changes.deleted.filter(
      (deletedId) => String(deletedId) !== normalizedId
    );

    saveLocalChanges(changes);

    return {
      ...locallyAddedUser,
      isDeleted: true,
    };
  }

  const result = await apiRequest(
    `/users/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );

  const changes = getLocalChanges();

  delete changes.updated[normalizedId];

  if (!changes.deleted.map(String).includes(normalizedId)) {
    changes.deleted.push(normalizedId);
  }

  saveLocalChanges(changes);

  return result;
}