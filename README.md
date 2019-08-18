# youtube-oauth-api
google의 API를 사용하기 위해 API에 대한 접근권한을 가지고 있어야 하는데
그런 접근권한은 AccessToken을 발급받으면서 부터 사용할 수 있다.
본 프로젝트는 그런 권한을 구글로부터 획득하기위한 API서버이다.

# Features
- nodejs 10.16.0
- serverless 1.49.0 (Enterprise Plugin: 1.3.4, Platform SDK: 2.1.0)

# TODO
- [x] sls 일단 배포해보기
- [-] oauth2.0 의 동작 알아보기
- [x] oauth2.0 google client key, secret key를 받아보기
--------------------------


# How dose it work?

- OAuth2.0 Google의 API키와 Secret Credentials를 받는다.
-


# Getting Started

1. get Environment File from @drakejin
2. install globla cli

```
npm install -g nodemon serverless
npm start
```

3. set up environment value

```
{선택1} cp .envrc.dummy .env
{선택1} cp .envrc.dummy .envrc
```

4. modify `.env*` file
```
#!/bin/bash
export NODE_PATH=src

export AWS_DEFAULT_REGION=ap-northeast-2
export AWS_REGION=ap-northeast-2
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=

export GOOGLE_OAUTH2_CLIENT_ID=
export GOOGLE_OAUTH2_CLIENT_SECRET=
```


# DATABASE SOURCE

``` SQL
create table oauth_tokens (
	idx SERIAL PRIMARY key,
	scope VARCHAR(1000) not null,
	access_token VARCHAR(300) not null,
	refresh_token VARCHAR(300) not null,
	token_type VARCHAR(50) not null,
	expires_in INTEGER not null,
	created_at TIMESTAMP not null default current_timestamp,
	updated_at TIMESTAMP default current_timestamp
)

create sequence sequence_oauth_tokens_idx start 1 increment 1;
```