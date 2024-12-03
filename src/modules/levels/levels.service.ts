import { Injectable } from '@nestjs/common';

import { LevelsModel } from './entities/levels.model';
import { WhereOptions } from 'sequelize';

import { levelInfo, levelList } from 'src/constants/levels.constants';
import LevelsLogsService from './logs.service';
import GenericService from 'src/common/generic.service';

@Injectable()
export default class LevelsService extends GenericService<LevelsModel> {
  constructor(private readonly logsService: LevelsLogsService) {
    super(LevelsModel);
  }

  async increment(
    increaseData: { [key: string]: number },
    where: WhereOptions<LevelsModel>,
  ): Promise<{ exp: number; level?: number }> {
    const levelData = await super.findOne({
      where,
    });

    let { exp, level } = levelData;
    // 현재 레벨의 최대 경험치를 가져옴.
    const currentLevelExp: levelInfo = levelList.find(
      (level) => exp > level.expMin && exp < level.expMax,
    );

    if (currentLevelExp.expMax < levelData.exp + increaseData.exp) {
      increaseData.level = 1;
      level += 1;
    }
    exp += increaseData.exp;

    await levelData.increment({
      exp: increaseData.exp,
      level: increaseData.level ?? 0,
    });
    await this.logsService.create({
      users_id: where['users_id'],
      exp: increaseData['exp'],
    });
    return {
      exp,
      level,
    };
  }
}
