import { HttpException } from '@nestjs/common';

export class OcowanException extends HttpException {
  constructor(message, code) {
    super(message, code);
    this.name = 'OcowanException';
  }
}

export class AlreadyOcowanException extends OcowanException {
  constructor(message, code) {
    super(message, code);
    this.name = 'AlreadyOcowanException';
  }
}

export class FailOcowanException extends OcowanException {
  constructor(message, code) {
    super(message, code);
    this.name = 'FailOcowanException';
  }
}
