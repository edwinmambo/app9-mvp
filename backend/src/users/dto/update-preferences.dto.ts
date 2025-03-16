import { IsArray, IsString, IsNotEmpty } from 'class-validator';

export class UpdatePreferencesDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  preferredTopics: string[];
}