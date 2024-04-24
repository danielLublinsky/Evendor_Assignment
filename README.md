# Evendor_Assignment
 Evendor Assignment REPO

### HOW TO RUN:
+ first we need to install all the packets run in `./Evendor_Assignment`:
`npm install`
+ as well as in the react repo `./Evendor_Assignment/evendor_reactNative`:
`npm install`
+ check your ip by typing `ipconfig` and save it for later

+ then run the server from `./Evendor_Assignment`: `node server.js`

+ then got to `./Evendor_Assignment/evendor_reactNative/App.tsx` scroll to the bottom and you will find this line: `export const SERVER_ADDRESS = 'http://192.168.1.7:3000';`
change the address to the address from the `ipconfig`

+ and if you have react native installed on your machine, you can open a new cmd at `./Evendor_Assignment/evendor_reactNative` type: `npm run android`, enjoy :)
