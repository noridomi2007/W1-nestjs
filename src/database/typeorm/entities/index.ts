export * from './user.entity';
export * from './role.entity';
export * from './post.entity';
export * from './task.entity';

const entities = [__dirname + '/*.entity{.ts,.js}'];
export default entities;
