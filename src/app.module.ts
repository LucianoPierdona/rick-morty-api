import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CharacterModule } from './character/character.module';

@Module({
  imports: [CharacterModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
