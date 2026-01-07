import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

const rootPath = join(__dirname, '../../nextjs-app/dist');
console.log('StaticModule rootPath:', rootPath);

@Module({
  imports: [
    ...(process.env.NODE_ENV !== 'production'
      ? [
          ServeStaticModule.forRoot({
            rootPath,
            serveRoot: '/',
            exclude: ['/api/(.*)', '/health', '/docs/(.*)', '/redocs/(.*)'],
            renderPath: '/*',
          }),
        ]
      : []),
  ],
})
export class StaticModule {}

