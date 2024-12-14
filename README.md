# Contract Management System Backend

A Node.js backend service for managing contracts with real-time updates using WebSocket and Supabase (PostgreSQL) for data storage.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm
- Supabase account

### Environment Variables
Create a `.env` file in the root directory with the following variables:

```env


Install the dependencies:

```
npm install
```

create .env file in the root directory with the following variables:

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY= (optional, to bypass the anonymous key) 
```

Run the following command to start the server: This will start the server on port 5000 

```
npm start
```

The project use the following dependencies:

- nodemon
- express
- supabase
- ws
- cors
- dotenv

