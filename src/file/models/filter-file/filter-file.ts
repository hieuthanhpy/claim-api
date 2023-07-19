import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class FilterFile {
   
    @ApiPropertyOptional()
    relationId: string;
}
