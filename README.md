# 📍 Locus – Location-Based Social Networking Platform

Locus is a high-performance, full-stack social networking application built to explore the intersection of geographic context and real-time user interaction. Developed with a focus on modern UI/UX and PWA standards, it provides a seamless "native-app" feel directly in the browser.

🌐 **Live Demo:** [https://locus-space.vercel.app/](https://locus-space.vercel.app/)

💻 **GitHub Repository:** [https://github.com/sumitchauhan-co/Posto](https://github.com/sumitchauhan-co/Posto)

---

## ✨ Key Features

* **Interactive Mapping:** Integrated **Leaflet** for real-time location-based sharing and discovery.
* **Centralized State:** Optimized data flow using **React Context API** for a lightweight alternative to external libraries.
* **Advanced Animations:** High-performance UI transitions, staggered lists, and pulsing loaders powered by **Framer Motion**.
* **Media Optimization:** Cloud-based image handling via **Cloudinary** and **ImageKit** for fast asset delivery.
* **PWA Ready:** Compliant with Progressive Web App standards for mobile-first accessibility and offline-ready shortcuts.
* **Performance Focused:** Strategic optimization of **Largest Contentful Paint (LCP)** and React hydration to ensure instant load times.

---

## 🛠️ Technical Stack

| Category | Tools & Technologies |
| :--- | :--- |
| **Frontend** | React.js, Context API, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js, REST API |
| **Database** | MongoDB, Mongoose |
| **Mapping** | Leaflet.js |
| **Auth** | JSON Web Tokens (JWT) |
| **Storage** | Cloudinary, ImageKit |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone [https://github.com/sumitchauhan-co/Posto.git](https://github.com/sumitchauhan-co/Posto.git)
cd Posto
```

### 2. Backend setup

```bash
cd Backend
npm install
```

Create a .env file in the Backend directory and add your MongoDB URI, JWT Secret, and Cloudinary credentials.

```bash
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

```bash
npm start
```

### 3. Frontend setup

```bash
cd ../Frontend
npm install
```

Create a .env file in the Frontend directory to point to your backend API.

```bash
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

## 📈 Optimization Highlights

* Custom Loader: Designed a background grid of pulsing tiles using Framer Motion to improve perceived performance during initial data fetches.

* Idempotency Fixes: Resolved React hydration errors related to random number generation and dynamic content to ensure stable production builds.

* Responsive Architecture: Mobile-first design utilizing Tailwind CSS for seamless cross-device compatibility.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

This project is licensed under the MIT License.

Developed by Sumit Chauhan Engineering Student & Full-Stack Developer