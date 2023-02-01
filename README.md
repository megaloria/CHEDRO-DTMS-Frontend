# DTMS Frontend

The application for **DTMS**'s frontend application. This application is developed using mainly using **React JS**. The application is using **yarn** for node package management.

## Prerequisite

1. [Git](https://git-scm.com/downloads)
2. [Node JS v18.13.0](https://nodejs.org/en/download) (**Note**: Please download LTS version instead of latest release)
3. [Yarn](https://yarnpkg.com/en/docs/install)


## How to install

- Clone the repository.


```
    git clone https://<your-username>@bitbucket.org/chedro4/dtms-frontend.git
```

- Go to the project directory and install dependencies.


```
    cd dtms-frontend
    yarn install
```

- Copy the `.env` file by copying the `.env.format` file.


```
    // for Unix
    cp .env.format .env
    // for Windows
    copy .env.format .env
```

- Run the development server.


```
    yarn start
```