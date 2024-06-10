# Chat Server
A Node.js chat server built using Express, Mongoose, and Socket.io, designed to make real-time messaging seamless and secure. Whether you're building a chat app for your business or just experimenting with web technologies, this server has got you covered!

## Features
- **💬 Real-time Messaging**: Enjoy instant communication with Socket.io
- **🔒 Secure Authentication**: Safeguard user access with JWT-based authentication.
- **🗄️ Robust Data Storage**: Store and retrieve messages effortlessly with MongoDB.
- **📊 Structured Logging**: Keep track of server events with Winston
- **✅ Request Validation**: Ensure data integrity with Celebrate
- **🛡️ End-to-end Encryption**: Protect user privacy with encrypted messaging.
- **🌐 CORS Support**: Handle cross-origin requests with ease.
- **🔄 Clustering**: Improve performance and scalability by utilizing multiple CPU cores.
- **🧪 Unit and Integration Testing**: Ensure reliability with comprehensive tests using Jest and SuperTest.

## Prerequisites
- Node.js (v14 or higher)
- npm (vg or higher)
- MongoDB

## Setup Instructions

1. Clone the repository:
   - `git clone https://github.com/probablypenera007/chat-server.git`
   - `cd chat-server`
2. Install dependencies: 
   - `npm install`
3. Set-up environment variables:
    - MONGODB_URI=mongo_uri_string
    - JWT_SECRET=JWT_secret_key 
    ### Generating a new JWT Secret Key:
    You can generate a secure JWT secret key by running the following command in your terminal:
    ```
    node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
    ```
 
    - NODE_ENV=production
    - SECRET_KEY=secret_key_for_message_encryption
    ### Geneating a new Secret Key for Encryption of messages:
     You can generate a secure Secret key for message encryption by running the following command in your terminal:
    ```
    node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
    ```
    
## Running the Application
- `npm run dev`: starts the app in development mode using `nodemon`
- `npm run start`: starts the application in production mode.
- `npm run lint`: runs the linter to check for code quality and formatting issues.
- `npm run test`: runs the test suite using Jest. 

## Testing Socket.io Connectivity

1. Make sure the server is running: `npm run dev`
2. Open your browser and navigate to `http://localhost:3001`
3. Open the developer console to see the log messages for Socket.io connectivity.

# API Endpoints

## User Authentication
### Signup:
- **Endpoint**: POST /signup
- **Request Body** : 
    ```json
      { 
        "username": "admin", 
        "password": "password" 
      }
    ```
- **Response**: 
    ```json
      { 
        "username": "admin" 
      }
    ```



### Login:
- **Endpoint**: POST /signin
- **Request Body**:
    ```json
        { 
          "username": "admin", 
          "password": "password" 
        }
    ```


- **Response**: 
    ```json
        {
          "token": "jwt-token" 
        }
    ```



## Messages

### Send Message:
- **Endpoint**: POST /messages
- **Request Body**:
    ```json
    { 
      "receiverId": "userId", 
      "message": "Hello" 
    }
    ```
- **Response**:
    ```json
    { 
      "message": { 
         "sender": "userId", 
         "receiver": "userId", 
         "message": "encrypted message", 
         "messageStatus": "sent" 
       } 
    }
    ```

### Get Messages:
- **Endpoint**: GET /messages/:from/:to
- **Response**:
    ```json
    { 
      "messages": [
        { 
          "sender": "userId", 
          "receiver": "userId", 
          "message": "decrypted message", 
          "messageStatus": "read" 
        }
      ] 
    }
    ```

### Delete Messages:
- **Endpoint**: DELETE /messages/:messageId
- **Response**:
    ```json
    { 
      "message": "Message deleted successfully" 
    }
    ```

## Postman Collection
For easy testing of the API endpoints, you can use this [Postman Collection](./chat-server.postman_collection.json)

## CI/CD Pipeline
This project includes a basic CI/CD setup using GitHub Actions. The configuration files is located in `.github/workflows/chat-server-cicd.yml` and is deigned to automate the following tasks:
- Running tests
- Linting codebase
- Deploying to the specified environment

## Clustering for Scalability
To handle high-traffic and improve performance, this server leverages Node.js' clustering. Ther server forks worker processes equal to the number of CPU cores, ensuring efficient load distribution.

## Testing 
This project includes comprehensive testing to ensure reliability and correctness:
  ### Unit Testing
  - Unit tests are written using Jest to verify the functionality of individual components and modules

  ### Integration Testing
  - Integration tests are conducted to ensure that different parts of the application work together as expected. These tests include interactions with the database and API endpoints

  ### Conclusion
  Thank you for exploring the Chat Server project! This server is designed to be a solid foundation for building real-time chat applications with robust features and scalability in mind. Whether you're using it as a learning tool or as a base for your next big project, I hope it meets your needs and exceeds your expectations.

  If you have any questions, suggestions, or feedback, feel free to open an issue on GitHub. Happy coding, and may your messages always be instant and your connections always be strong! 👨🏽‍💻