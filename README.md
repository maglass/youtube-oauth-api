# youtube-oauth-api
google의 API를 사용하기 위해 API에 대한 접근권한을 가지고 있어야 하는데
그런 접근권한은 AccessToken을 발급받으면서 부터 사용할 수 있다.
본 프로젝트는 그런 권한을 구글로부터 획득하기위한 API서버이다.

# Features
- nodejs 10.16.0
- serverless 1.49.0 (Enterprise Plugin: 1.3.4, Platform SDK: 2.1.0)
- direnv
- ngrok(for develop)
- nodemon(for develop)

# Getting Started

0. nodejs 10.16.0
1. get Environment File from @drakejin
2. install globla cli

```
brew cask install ngrok
npm install -g nodemon serverless
```

3. set up environment value

```
cp .envrc.dummy .envrc
# call @drakejin by `step 1`
```

4. set environment variables(.feat direnv)

```
brew install direnv
echo 'eval "$(direnv hook bash)"' >> ~/.zshrc
echo 'eval "$(direnv hook bash)"' >> ~/.bashrc
source ~/.zshrc
cd ${PROJECT_PATH}
direnv allow
```

5. install nodejs dependencies

```
npm install
```

6. npm run start
