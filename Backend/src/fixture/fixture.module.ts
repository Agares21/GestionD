import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FixtureService } from "./fixture.service";
import { FixtureController } from "./fixture.controller";
import { Fixture } from "./fixture.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Fixture])],
  controllers: [FixtureController],
  providers: [FixtureService],
  exports: [FixtureService],
})
export class FixtureModule {}
