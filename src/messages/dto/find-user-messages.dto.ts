import { IsUUID } from "class-validator";

export class FindUserMessagesDto {

    @IsUUID()
    userId: string;
}