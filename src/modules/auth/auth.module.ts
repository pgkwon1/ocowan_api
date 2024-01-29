import { Module } from '@nestjs/common';
import AuthService from './auth.service';
import GithubService from '../github/github.service';
import { SequelizeModule } from '@nestjs/sequelize';
import GithubModel from '../github/entities/github.model';
import { JwtStrateGy } from './jwt.strategy';

@Module({
  imports: [SequelizeModule.forFeature([GithubModel])],
  providers: [AuthService, GithubService, JwtStrateGy],
})
export class AuthModule {}
