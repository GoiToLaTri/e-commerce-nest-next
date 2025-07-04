import { Global, Module } from '@nestjs/common';
import { AccessContorlService } from './access-control.service';

@Global()
@Module({
  imports: [],
  providers: [AccessContorlService],
  exports: [AccessContorlService],
})
export class SharedModule {}
