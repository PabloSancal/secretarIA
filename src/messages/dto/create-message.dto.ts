import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateMessageDto {

    @IsString()
    messageText: string;
    
    @IsUUID()
    @IsOptional() //Todo: Eliminar optional cuando se haga users service
    userId: string;
    
}