# JAVASCRIPT PRACTICE #
## OVERVIEW ##
- This document provides information about JavaScript Big Practice.
- Build a Pomodoro Web Application ([reference app](Pomofocus.io)).

## TARGET ##
- Apply knowledge of HTML5/CSS3/JavaScript (with ES6 syntax).
- Apply MVC concept
- DOM manipulation, form validation.
- Understand and apply localStorage
- Understand how asynchronous code works & apply in practice (API call or any place we can mock API in code).
- Use DevTools for debugging issues
- Deploy to the hosting (with help from supporter)(optional)
## TECHNIQUES ##
- HTML5/CSS3
- JavaScript
- MVC
- localStorage
- JSON Server: use JSON Server for working with full fake REST API
## TIMELINE ##
- 8 working days (18/02 - 01/03)
## TEAM SIZE ##
- 1 dev
## EDITOR ##
- VSCode
## MAIN FEATURE ##
- An app for task management with [pomodoro technique](https://en.wikipedia.org/wiki/Pomodoro_Technique) (a time management method)
- Features
  - Version 1:
    - Add task: set task name, set a estimated number of pomodoros (a ) for task
    - Edit task: edit task name, edit number of pomodoros which are done
    - Delete task
    - Mark task as done
    - See the total number of pomodoros, number of pomodoros which are done, estimated finish time
  - Version 2: data is saved in localStorage
    - See a timer
    - Start the timer
    - Reset the timer
    - Finish the timer earlier than default time.
    - Number of act pomodoro is updated automatically (plus 1) every time the timer is finished
  - Version 3:
    - Login the app or create new account (email must include `@` and `.com`, password length must be greater than 4)
    - Logout the app

## GETTING STARTED ##
- Clone my repository:
```
git clone -b feat/big-practice git@gitlab.asoft-python.com:g-myle/javascript-training.git
```
- Go to `big-practice` folder
```
cd javascript-training/big-practice
```
- Install packages:
```
npm install
```
- Build app
```
npm run build
```
- Run app
```
npm run dev
```
- Open http://localhost:1234/ link
