const config = {
  API_URL: process.env.NODE_ENV === 'production'
    ? 'https://robotrader-api.onrender.com'  // We'll deploy the backend to Render
    : 'http://localhost:5002'
};

export default config;
