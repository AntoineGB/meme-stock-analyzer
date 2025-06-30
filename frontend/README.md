# **Service: Frontend**

This service is the user interface. It's a `React` single-page application built with `Vite` and styled with `Chakra UI`.

### **Features**

* Displays a grid of memes fetched from the backend API.  
* Default view is sorted by "hype score" to show the most relevant content first.  
* Features a search bar for performing semantic searches.  
* Handles loading and error states gracefully.  

### **Local Execution**

Prerequisites: Node.js v16+, `npm`.

1. **Install Dependencies:**  
   ```
   # From within the /frontend directory  
   npm install
   ```

2. **Configure Environment:**  
   The API URL is managed via an environment file. Copy the example and modify if needed.  
   ```
   cp .env.example .env
   ```

   By default, `VITE_API_URL` points **ALREADY** to my deployed-backend-service public IP.

   > [!IMPORTANT]  
   > If you want to make local development in the backend, then modify `VITE_API_URL` to
   > your loopback address `127.0.0.1:8000`
3. **Run the Development Server:**  
   ```
   npm run dev
   ```

   The application will be available at `http://localhost:5173`.


### **Production Build**

To create an optimized production build:  
```
npm run build
```

The output will be in the /dist directory, ready for static hosting.