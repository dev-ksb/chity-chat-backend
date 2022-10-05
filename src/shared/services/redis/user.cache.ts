import { ServerError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';
import { config } from '@root/config';
import { BaseCache } from '@service/redis/base.cache';
import { IUserDocument } from '@user/interfaces/user.interface';
import Logger from 'bunyan';

const log: Logger = config.createLogger('userCache');

export class UserCache extends BaseCache {
  constructor() {
    super('userCache');
  }

  public async saveUserToCache(key: string, userUId: string, createdUser: IUserDocument): Promise<void> {
    const createdAt = new Date();
    const {
      _id,
      uId,
      username,
      email,
      avatarColor,
      blocked,
      blockedBy,
      postsCount,
      profilePicture,
      followersCount,
      followingCount,
      notifications,
      work,
      location,
      school,
      quote,
      bgImageId,
      bgImageVersion,
      social
    } = createdUser;
    const firstList: string[] = [
      '_id',
      `${_id}`,
      'uId',
      `${uId}`,
      'username',
      `${username}`,
      'email',
      `${email}`,
      'avatarColor',
      `${avatarColor}`,
      'createdAt',
      `${createdAt}`,
      'postsCount',
      `${postsCount}`
    ];
    const secondList: string[] = [
      'blocked',
      JSON.stringify(blocked),
      'blockedBy',
      JSON.stringify(blockedBy),
      'profilePicture',
      `${profilePicture}`,
      'followersCount',
      `${followersCount}`,
      'followingCount',
      `${followingCount}`,
      'notifications',
      JSON.stringify(notifications),
      'social',
      JSON.stringify(social)
    ];
    const thirdList: string[] = [
      'work',
      `${work}`,
      'location',
      `${location}`,
      'school',
      `${school}`,
      'quote',
      `${quote}`,
      'bgImageVersion',
      `${bgImageVersion}`,
      'bgImageId',
      `${bgImageId}`
    ];

    const dataToSave: string[] = [...firstList, ...secondList, ...thirdList];

    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      await this.client.ZADD('user', { score: parseInt(userUId, 10), value: `${key}` });

      await this.client.HSET(`users:${key}`, dataToSave);
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error, Try again.');
    }
  }

  public async getUserFromCache(userId: string): Promise<IUserDocument | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      const response: IUserDocument = this.client.HGETALL(`users:${userId}`) as unknown as IUserDocument;
      response.createdAt = new Date(Helpers.parseJSON(`${response.createdAt}`));
      response.postsCount = Helpers.parseJSON(`${response.postsCount}`);
      response.blocked = Helpers.parseJSON(`${response.blocked}`);
      response.blockedBy = Helpers.parseJSON(`${response.blockedBy}`);
      response.notifications = Helpers.parseJSON(`${response.notifications}`);
      response.social = Helpers.parseJSON(`${response.social}`);
      response.followersCount = Helpers.parseJSON(`${response.followersCount}`);
      response.followingCount = Helpers.parseJSON(`${response.followingCount}`);
      response.bgImageId = Helpers.parseJSON(`${response.bgImageId}`);
      response.bgImageVersion = Helpers.parseJSON(`${response.bgImageVersion}`);
      response.profilePicture = Helpers.parseJSON(`${response.profilePicture}`);
      response.work = Helpers.parseJSON(`${response.work}`);
      response.school = Helpers.parseJSON(`${response.school}`);
      response.location = Helpers.parseJSON(`${response.location}`);
      response.quote = Helpers.parseJSON(`${response.quote}`);

      return response;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    }
  }
}
