// lib/fakeDatabase.ts
export type UserRole = "admin" | "seller" | "buyer";

export type User = {
  id: string;
  username: string;
  email: string;
  password: string; // Add this line for demo only!
  roles: UserRole[];
};

const users: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@site.com",
    password: "test123",
    roles: ["admin"],
  },
  {
    id: "2",
    username: "seller",
    email: "seller@site.com",
    password: "test123",
    roles: ["seller"],
  },
  {
    id: "3",
    username: "buyer",
    email: "buyer@site.com",
    password: "test123",
    roles: ["buyer"],
  },
];

export type Card = {
  id: string;
  sellerId: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
  price: number;
  status: "active" | "sold" | "blocked";
};

export type Order = {
  id: string;
  cardId: string;
  buyerId: string;
  sellerId: string;
  price: number;
  status: "completed" | "pending" | "cancelled";
  date: string;
};

const cards: Card[] = [
  {
    id: "c1",
    sellerId: "2",
    cardNumber: "4111 1111 1111 1111",
    expiration: "12/26",
    cvv: "123",
    price: 100,
    status: "active",
  },
  {
    id: "c2",
    sellerId: "2",
    cardNumber: "5555 5555 5555 4444",
    expiration: "11/25",
    cvv: "321",
    price: 80,
    status: "sold",
  },
];

const orders: Order[] = [
  {
    id: "o1",
    cardId: "c1",
    buyerId: "3",
    sellerId: "2",
    price: 100,
    status: "completed",
    date: "2025-06-13",
  },
];

export const fakeDb = {
  // USERS
  getUsers: async () => [...users],
  getUserById: async (id: string) => users.find((u) => u.id === id),
  addUser: async (user: User) => {
    users.push(user);
    return user;
  },

  // CARDS
  getCards: async () => [...cards],
  getCardsBySeller: async (sellerId: string) =>
    cards.filter((c) => c.sellerId === sellerId),
  addCard: async (card: Card) => {
    cards.push(card);
    return card;
  },
  updateCardStatus: async (id: string, status: Card["status"]) => {
    const card = cards.find((c) => c.id === id);
    if (card) card.status = status;
    return card;
  },

  // ORDERS
  getOrders: async () => [...orders],
  getOrdersByBuyer: async (buyerId: string) =>
    orders.filter((o) => o.buyerId === buyerId),
  addOrder: async (order: Order) => {
    orders.push(order);
    return order;
  },
};
