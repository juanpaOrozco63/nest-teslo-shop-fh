import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @Type(()=> Number) // Para convertir el valor a un number por que llega como string | EnableImplicitConversions : true
    limit? : number;

    @IsOptional()
    @Min(0)
    @Type(()=> Number) // Para convertir el valor a un number por que llega como string | EnableImplicitConversions : true
    offset?:number;
}