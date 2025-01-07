const config = {
  API_URL: process.env.NODE_ENV === 'production'
    ? 'https://robotrader-api.onrender.com'  // Production backend URL
    : 'http://localhost:5002'  // Development backend URL
};

export default config;
