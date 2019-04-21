# hongkong-map-timeline

## Setup Environment

### Requirements

- MongoDB
- npm

## Development

### API server

```bash
# install dependencies
cd backend
# set the enviroment variables with ```.env``` file
cp .env-sample .env

# modify the env file

# install dependecies and start the server
npm install


npm run dev
# the server will listen on port 1337
```

For Windows users who encounter issues installing **bcrypt** (Can't find Python executable), please run the following command to install the Windows Build Tools using **an elevated (Administrator) terminal** window which installs the **VS Build Tools** and also **Python 2.7**

```bash
npm install --global --production windows-build-tools
```

### Import the data via api

```bash
cd scripts/had-import

# install dependecies
npm install

# import the csv to db
node had-importer.js import data/had_result_20190311.csv localhost:1337

```

### Start the frontend server

```bash
cd app


# install dependecies and start the server
npm install

# the server will listen on port 3000
npm run dev
```
