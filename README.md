# 🃏 StoreJoker Frontend

Welcome to the **StoreJoker** frontend! This is a modern, high-quality dashboard and storefront web app built with [Next.js 15](https://nextjs.org/), [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), and a senior-grade frontend stack.

## Features

- **Role-based dashboards**: Separate admin, seller, and buyer experiences
- **Modern authentication**: Login/register with animated transitions and role selection
- **Advanced UI**: Beautiful, responsive dark theme with Framer Motion animations
- **Data fetching & caching**: Powered by TanStack Query (`@tanstack/react-query`)
- **Global state management**: Using Zustand
- **Type-safe forms**: Built with React Hook Form and Zod validation
- **Accessible components**: Headless UI, Radix, and custom controls
- **Instant feedback**: Toast notifications, loading skeletons, and more
- **Reusable layouts**: Sidebar, navbar, and dashboard structure
- **Optimized for developer experience**: TypeScript, ESLint, Prettier, and more

---

## 🚀 Getting Started

### 1. **Clone the repository**

```bash
git clone https://github.com/farsbrayek3/storejoker-front.git
cd storejoker-front
```

### 2. **Install dependencies**

Make sure you have [Node.js](https://nodejs.org/) (v18+ recommended) and [npm](https://www.npmjs.com/) installed.

```bash
npm install
```

### 3. **Environment variables**

Create a `.env.local` file in the root directory.  
Add any necessary environment variables here (for example, API URLs, keys, etc):

```env
NEXT_PUBLIC_API_URL=https://your-api-url.com
# Add other variables as needed
```

> **Note:** If you don't know what variables you need, check the codebase for any `process.env.` usage or ask your backend team.

### 4. **Run the development server**

```bash
npm run dev
```

- The app will be available at [http://localhost:3000](http://localhost:3000)
- HMR (hot module reload) is enabled for instant feedback

### 5. **Build for production**

```bash
npm run build
npm start
```

---

## 🛠️ Project Structure

```
storejoker-front/
├── app/                # Next.js 15 app directory
│   ├── dashboard/      # All dashboard pages (admin, seller, buyer)
│   ├── (auth)/         # Authentication pages (login, register)
│   ├── layout.tsx      # Global layout, providers
│   └── ...             # Other routes
├── components/         # Reusable UI components
├── stores/             # Zustand stores
├── styles/             # Global styles & Tailwind config
├── public/             # Static assets
├── README.md
├── package.json
└── ...
```

---

## 🧑‍💻 Tech Stack

- **Next.js 15 / React 19**
- **TypeScript**
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for animation
- **TanStack Query (react-query)** for data fetching
- **Zustand** for global state
- **React Hook Form** + **Zod** for forms & validation
- **Headless UI** for accessible components
- **Lucide React** for icons
- **react-hot-toast** for notifications
- **react-loading-skeleton** for skeletons
- **clsx** for conditional classes
- **Day.js** for date formatting

---

## 🌐 Authentication & Roles

- **Login/Register**: Modern, animated forms with role selection (admin, seller, buyer)
- **Role-based access**: After login, you are routed to the appropriate dashboard based on your role
- **Change roles in dev**: Use the role selector on the login/register forms for fast role switching (for development/testing)

---

## 📝 Scripts

| Script          | Description                   |
| --------------- | ----------------------------- |
| `npm run dev`   | Start app in development mode |
| `npm run build` | Build app for production      |
| `npm start`     | Start production build        |
| `npm run lint`  | Run ESLint checks             |

---

## 📦 Useful Commands

- **Install a new package:**  
  `npm install <package-name>`
- **Upgrade dependencies:**  
  `npm update`
- **Format code:**  
  If you use Prettier:  
  `npx prettier --write .`

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -am 'Add feature'`)
4. Push to the branch (`git push origin feat/your-feature`)
5. Create a new Pull Request

---

## 👨‍🔬 Testing

> (Add testing instructions here if you use tools like Jest, React Testing Library, or Cypress.)

---

## 📄 License

This project is licensed under the MIT License.

---

## ❤️ Credits

- Built by [@farsbrayek3](https://github.com/farsbrayek3)
- Powered by the awesome open source community

---

## 📞 Need Help?

Open an issue or discussion on [GitHub](https://github.com/farsbrayek3/storejoker-front/issues).
