# OCOWAN API

NestJS 프레임워크를 기반으로 구축된 효율적이고 확장 가능한 서버 사이드 애플리케이션입니다.

## 소개

이 프로젝트는 [NestJS](https://github.com/nestjs/nest) 프레임워크를 사용한 TypeScript 기반 API 서버입니다.
RESTful API 설계 패턴을 따르고 있습니다.

## 기술 스택

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: MySQL (Sequelize ORM)
- **Cache**: Redis (ioredis)
- **Authentication**: Passport, JWT
- **Storage**: AWS S3, Azure Blob Storage
- **Validation**: class-validator, 
- **Testing**: Jest
- **Logging**: Winston
- **API Documentation**: 

## 설치 방법

```bash
# 패키지 설치
$ npm install
```

## 환경 설정

```
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=ocowan_db

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=your_bucket_name

```

## 실행 방법

```bash
# 개발 모드
$ npm run start

# 개발 모드 (파일 변경 감지)
$ npm run start:dev

# 프로덕션 모드
$ npm run start:prod
```

## 테스트

```bash
# 단위 테스트
$ npm run test

# e2e 테스트
$ npm run test:e2e

# 테스트 커버리지
$ npm run test:cov
```

## API 기능

- JWT 인증 및 권한 관리
- 파일 업로드 (AWS S3, Azure Blob Storage)
- 데이터 CRUD 작업
- CRUD 표준 클래스 구현
- REDIS 캐싱
- 요청 제한 (Rate Limiting)
- 요청, 응답 일괄처리 인터셉터
- 로깅 기능
- 기타 비즈니스 로직

## 프로젝트 주요 구조

```
src/
├── auth/               # 인증 관련 모듈
├── common/             # 예외 일괄처리 인터셉터, CRUD 표준 클래스
├── interceptors/       # 요청, 응답 일괄처리 인터셉터

├── modules/            # 기능별 모듈
│   ├── dto/            # 모듈별 Data Transfer Objects
│   ├── entities/       # 모듈별 데이터베이스 엔티티
│   ├── auth/           # 인증 모듈
│   ├── controllers/    # 모듈별 컨트롤러 레이어
│   └── services/       # 모듈별 서비스 레이어
├── app.module.ts       # 루트 모듈
└── main.ts             # 애플리케이션 진입점
```

## 라이센스

이 프로젝트는 [MIT 라이센스](LICENSE)를 따릅니다.
