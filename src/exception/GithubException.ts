import { HttpException } from '@nestjs/common';

export class GithubException extends HttpException {
  constructor(message, code = 200) {
    super(message, code);
    this.name = 'GithubException';
  }
}

export class GithubLoginFailException extends GithubException {
  constructor(message, code = 200) {
    super(message, code);
    this.name = 'GithubLoginFailException';
  }
}

export class GithubRegisterFailException extends GithubException {
  constructor(message, code = 200) {
    super(message, code);
    this.name = 'GithubRegisterFailException';
  }
}
export class GithubNotFoundException extends GithubException {
  constructor(message, code = 200) {
    super(message, code);
    this.name = 'GithubNotFoundException';
  }
}
