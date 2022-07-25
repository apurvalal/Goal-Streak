# Task Streak

## Tools and Frameworks:

- [ ] React
- [ ] React Router
- [ ] Node.js
- [ ] Express
- [ ] MongoDB
- [ ] Mongoose

## Folder Structure:

- [ ] client
  - [ ] src
    - [ ] App
    - [ ] index
    - [ ] views
      - [ ] login
      - [ ] register
      - [ ] tasks
- [ ] server
  - [ ] models
    - [ ] user
  - [ ] index

## About the project:

Users can use the app to track their daily tasks. The app will keep track of the number of days that they have completed their tasks and also the longest streak of days that they have completed their tasks.
For demo purposes, the app will end a streak if the user has marked a task as complete within 10 seconds instead of a day.

## Approach:

The app will use a React Router to route the user to the login page, the register page, and the tasks page.
The login page will be the first page that the user sees.
If the user does not have an account, they can go to the register page.
After login, the user will be taken to the tasks page. Here, the user can see a list of tasks that they have to complete.
On clicking on the Marked as Complete button, the current streak of the user will be updated and displayed.
The user can also see the longest streak of days that they have completed their tasks.
The updation of the current streak is done by a POST request to the server. The server updates the current streak of the user after checking if the user has completed a task within 10 seconds.
On clicking the Marked as Complete button, the server updates the last_task_date of the user which is used to check whether the user has completed a task within 10 seconds.

## Installation:

1. Clone the repository
```sh
  git clone https://github.com/apurvalal/Task-Streak.git
```
2. Install dependencies
```sh
npm install``` or 
```sh yarn install```
3. Install and start MongoDB
4. In the `server/index.js` file, you can change the port number.
5. Start the server
```sh npm start``` or 
```sh yarn start```
6. Go to the client folder and run the react app.
```sh npm start``` or 
```sh yarn start```
7. Go to `http://localhost:3030/` to see the app running.
