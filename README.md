# Chat Server
This is a Node.js chat server built using Express, Mongoose, and Socket.io, designed for real-time messaging. The server also uses Helmet for security, CORS for handling cross-origin requests, and Celebrate for request validation.

## Features
- Real-time messaging with Socket.io
- JWT-based user authentication
- MongoDB for data storage
- Structured logging with Winston
- Request validation with Celebrate
- End-to-end messaging encryption

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
    - NODE_ENV=production
    - SECRET_KEY=secret_key_for_message_encryption
    
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
       - POST /signup
       - Request Body: 
        { 
          "username": "admin", 
          "password": "password" 
        }


       - Response: 
        { 
          "username": "admin" 
        }


### Login:
        - POST /signin
        - Request Body: 
         { 
           "username": "admin", 
           "password": "password" 
         }


        - Response: 
         {
           "token": "jwt-token" 
         }


## Messages
### Send Message:
        - POST /messages
        - Request Body: 
        { 
          "receiverId": "userId", 
          "message": "Hello" 
        }


        - Response: 
        { 
          "message": { 
             "sender": "userId", 
             "receiver": "userId", 
             "message": "encrypted message", 
             "messageStatus": "sent" 
           } 
        }


### Get Messages:
        - GET /messages/:from/:to
        - Response: 
        { 
          "messages":[
              { 
                "sender": "userId", 
                "receiver": "userId", 
                "message": "decrypted message", 
                "messageStatus": "read" 
              }] 
         }


### Delete Messages:
        - DELETE /messages/:messageId
        - Response: 

        { 
          "message": "Message deleted successfully" 
        }

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
