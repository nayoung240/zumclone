# 0.2 Babel, Nodemon, Express 설치를 통한 NodeJs 서버 만들기

### package.json 생성
```jsx
$ npm init -y
```

### Nodemon 설치
: 프로젝트 변경사항을 감지하여 서버를 재시작해주는 프로그램
```jsx
$ npm i nodemon -D
```

### 파일 생성
- babel.config.json
- nodemon.json
- src/server.js

### babel 설치
: 작성한 코드를 NodeJS 코드로 컴파일해줌
```jsx
$ npm i @babel/preset-env -D
```

### src/server.js에 대해 babel-node 명령문 실행시키기
```
"exec" : "babel-node src/server.js"
```

### express 설치
: Node.js를 위한 웹 프레임워크
```
$ npm i express
```

### pug 설치
: express의 패키지 view engine
- PUG 문법으로 작성하면 HTML 로 바꿔준다.
```
$npm i pug
```

> `npm run dev` 실행하면 script.js 가 실행된다

<br><br>

# 0.3 Express 설정하기 (view, server)

### server.js -> app.js -> home.pug
- src/public/js/app.js 생성 - 유저에게 보여지는 frontend 자바스크립트
- src/views/home.pug 생성 - view engine 설정 / html5 문법

### views나 server.js를 수정할 때만 nodemon 재시작하기
```
// nodemon.json
"ignore": ["src/public/*"]
```

### MVP CSS [https://andybrewer.github.io/mvp/]
