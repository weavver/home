[More documentation](/)

## Developing

This software is basically developed with OSX and Microsoft VS Code. Compatibility with other platforms is not confirmed.


#### Developer Environment Setup:
Ensure [node.js](https://nodejs.org/) is installed.
~~~
1. cd weavver-home-*.zip
2. npm install
3. cd api
4. npm install
5. cd ../website
6. npm install
~~~

Folder "website" consists of a client-side web interface.
Folder "api" consists of server-side code


#### Unit testing
~~~
% npm install ts-mocha -g
% cd weavver-home
% ts-mocha --config mocharc.yml
~~~