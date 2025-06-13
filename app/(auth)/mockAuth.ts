// Simple mock user DB
export const users = [
  { email: "admin@site.com", password: "admin123", role: "admin" },
  { email: "buyer@site.com", password: "buyer123", role: "buyer" },
  { email: "seller@site.com", password: "seller123", role: "seller" },
];

export function loginMock(email: string, password: string) {
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    // Save to localStorage for "persistence"
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  }
  return null;
}

export function logoutMock() {
  localStorage.removeItem("user");
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("user");
  if (!data) return null;
  return JSON.parse(data);
}
