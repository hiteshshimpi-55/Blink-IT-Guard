# Blink-IT-Guard

## Installation

1. Clone / unzip the project.
2. run `npm install`
3. make db.sqlite3 file in the root directory
4. make .env file and fill the contents as shown in env example file
5. run `npm run dev`

## Endpoints

1. BASE URL `localhost:[Port]/api/v1/`
2. Signup: `/signup`
3. Login: `/login`
4. Refresh Token: `/refresh`
5. Upload Image: `/upload`

## Docker Instructions

### Building Docker Image

1. Navigate to the root directory of the project in the terminal.
2. Run the following command to build the Docker image:

   ```bash
   docker build -t blink-it-guard .
   ```
