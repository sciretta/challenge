import { ObjectType, Field, Int, InputType } from "@nestjs/graphql";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

@ObjectType()
export class VehicleDTO {
  @Field((type) => Int)
  makeId: number;

  @Field()
  makeName: string;

  @Field((type) => [VehicleTypesDTO])
  vehicleTypes: VehicleTypesDTO[];
}

@ObjectType()
export class VehicleTypesDTO {
  @Field((type) => Int)
  typeId: number;

  @Field()
  typeName: string;
}

@InputType()
export class Filter {
  @Field(() => Int)
  @IsInt()
  @Min(1) // Asume que `currentPage` debe ser al menos 1
  currentPage: number;

  @Field(() => Int)
  @IsInt()
  @Min(1) // Asume que `pages` debe ser al menos 1
  limit: number;

  @Field(() => String, { nullable: true }) // `nullable` indica que el campo es opcional
  @IsOptional()
  @IsString()
  make?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  type?: string;
}
