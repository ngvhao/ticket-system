import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateBookingDto {
  @IsNotEmpty()
  eventId: number;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  quantity: number;

  @IsOptional()
  jobId: string;
}
