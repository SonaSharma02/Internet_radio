# InternetRadio
[![Version 1.0](https://img.shields.io/badge/Version-v1.0.0-blue)]()

<br>

# Overview

Welcome to my **Project** – it is a Cross-platform Real-time Audio Streaming designed to emulate the functionality and user experience. With a sleek and intuitive interface, users can browse through the platform to broadcast live audio, listen to live streams, and interact with each other through real-time commenting. The platform utilizes WebRTC and WebSockets to enable real-time audio streaming and communication.

<br>

# Tech Stacks

<p>
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=react,nodejs,express,mongodb,redux,bootstrap,git,github,vscode" />
  </a>
</p>
<br>

# Features

This project includes the following features:
<ul>
    <li><strong>Authentication:</strong> To access the platform, users can authenticate through either their Email or Phone Number.</li>
    <li><strong>Create Profile:</strong> Users can create a personalized profile,with the ability to Upload Avatar.</li>
    <li><strong>Create Rooms:</strong> Users can create private Rooms to connect with others .</li>
    <li><strong>Join Rooms:</strong> Users can easily join Rooms.</li>
    <li><strong>Real-Time Audio Sharing:</strong> Users can use our seamless audio sharing feature to facilitate instant connections and dynamic conversations.</li>
</ul>

<br>

# Learnings

<li><strong>WebRTC and Socket.io:</strong> Gained experience in WebRTC and Socket.io for real-time audio sharing and communication.</li> 
<li><strong>Cross-platform compatibility:</strong> Learned to develop a single codebase that works seamlessly across various platforms and devices.</li> <li><strong>Audio processing:</strong> Improved understanding of audio processing and handling in real-time.</li> 
<li><strong>Scalability:</strong> Implemented scalable architecture to support multiple users and real-time communication.</li> 
<li><strong>Performance optimization:</strong> Optimized the application for real-time audio sharing, ensuring low latency and high-quality audio.</li> 
<li><strong>User Experience:</strong> Learned to design and implement user-friendly interfaces for real-time audio sharing.</li>

<br>

# Setup Project

### How to run the Project
### Install without docker

Follow the following steps to get development environment running without Docker.

* Clone repository from GitHub
  
  ```
  
  git clone https://github.com/sidharth1017/InternetRadio.git
  
  ```

* Go to frontend folder

  ```
  
  cd .\frontend\
  
  ```

* Install node modules

   ```
   
   npm install

   ```

* Now, go to backend folder in another terminal
  
  ```
  
  cd .\backend\
  
  ```

* Similarly install node modules here too

  ```
   
   npm install
  
  ```

### Starting servers

* Frontend server

  You have to create .env file to run the server
  
  ```
  
    REACT_APP_API_URL=http://localhost:5500
    REACT_APP_SOCKET_SERVER_URL=http://localhost:5500
    NODE_ENV=development
  
  ```
  Go to terminal where you installed frontend node modules

  ```

  npm start

  ```

  Note - Server will start on port 5500

* Backend server
  
  You have to create .env file to run the server
  ```
  
    HASH_SECRET = 
    SMS_SID = 
    SMS_AUTH_TOKEN = 
    SMS_FROM_NUMBER = 
    DB_URL = 
    JWT_ACCESS_TOKEN_SECRET = 
    JWT_REFRESH_TOKEN_SECRET = 
    EMAIL = 
    PASSWORD =
    BASE_URL = http://localhost:5500
    FRONT_URL = http://localhost:3000
    NODE_ENV = development
  
  ```
  
  Now, go to the terminal where you installed backend node modules
  
    ```

      npm run dev

    ```

### Install and run with docker

Follow the following steps to get development environment running using Docker.
  ```
    docker-compose -f .\docker-compose.dev.yml up -d --build
  ```

---

<br>

# Conclusion

Thank you for checking out this project which dives deep into cross-platform real-time audio sharing and creating an interactive user experience. 

Feel free to explore the code, contribute, or use it for your personal projects. Your feedback and contributions are always welcome.

<p align="center">
  Happy coding! 💻🎧
</p>
