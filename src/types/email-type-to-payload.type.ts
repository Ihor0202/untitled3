import {EmailTypeEnum} from "../enums/email-type.enum";
import {PickRequired} from "./pick-required.type";
import {EmailPayloadCombined} from "./email-payload-combined.type";

export type EmailTypeToPayload = {
    [EmailTypeEnum.WELCOME]: PickRequired<EmailPayloadCombined, "name" | "actionToken">;

    [EmailTypeEnum.FORGOT_PASSWORD]: PickRequired<EmailPayloadCombined, "name" | "email" | "actionToken">;

    [EmailTypeEnum.OLD_VISIT]: PickRequired<EmailPayloadCombined, "name">;

    [EmailTypeEnum.LOGOUT]: PickRequired<EmailPayloadCombined, "name">;
}