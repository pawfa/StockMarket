# CoinsChart
Cryptocurrency coins chart application using NodeJS and Angular.

## Description

Example application to learn NodeJS and websockets. It shows history of cryptocurrency price and also live price. Websockets allow to see checkbox and chart changes at the same time on all clients. You can see working demo [here](http://charts.pawfa.usermd.net/). Every code review and criticism is welcome.


## Getting Started

### Technology Stack
Component         | Technology
---               | ---
Frontend          | [Angular 5](https://github.com/angular/angular)
Backend           | [NodeJs](https://nodejs.org/en/) and [ExpressJs](https://expressjs.com/)
Client Build Tools| [angular-cli](https://github.com/angular/angular-cli), 
Server Build Tools| npm


### Dependencies

- Node 6.0 or above,
- npm 5 or above,
- Angular-cli 1.6.3

### Installing

To install this application, run the following commands:
```bash
git clone https://github.com/pawfa/CoinsChart.git
cd CoinsChart
```
This will get a copy of the project installed locally.

### Executing program
Before running the application you need to make sure that there is correct url in frontend directory in file data.service.ts:
```bash
this.socket = io.connect('http://localhost:3001/');
```
and in backend directory in file app.js
```bash
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
```

To run the server, cd into the `backend` folder and run:
 
```bash
node app.js
```
To run the client, cd into the `frontend` folder and run:
 
```bash
npm install && npm start
```
