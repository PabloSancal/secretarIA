import { IsString, IsUUID } from "class-validator";

export class CreateMessageDto {

    @IsString()
    messageText: string;
    
    @IsUUID()
    userId: string;
    
}