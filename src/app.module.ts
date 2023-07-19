import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PoliciesModule } from './policies/policies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from './file/file.module';
import { ClaimModule } from './claim/claim.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PoliciesModule,
    ClaimModule,
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'insuranceDB',
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   synchronize: true,
    // }),

    TypeOrmModule.forRoot({
      url: 'mysql://root:pSMCztxvegoQU6SMotD8@containers-us-west-99.railway.app:5612/railway',
      type: 'mysql',
      host: 'containers-us-west-99.railway.app',
      port: 5612,
      username: 'root',
      password: 'pSMCztxvegoQU6SMotD8',
      database: 'railway',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
