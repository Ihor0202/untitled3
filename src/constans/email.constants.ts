import {EmailTypeEnum} from "../enums/email-type.enum";

export const emailConstants = {
    [EmailTypeEnum.WELCOME]: {
        subject: "Welcome to our platform",
        template: "welcome"
    },
    [EmailTypeEnum.FORGOT_PASSWORD]: {
        subject: "forgot-password",
        template: "forgot-password",
    },
    [EmailTypeEnum.OLD_VISIT]: {
        subject: "old-visit",
        template: "old-visit",
    },
    [EmailTypeEnum.LOGOUT]: {
        subject: "LOGOUT",
        template: "LOGOUT",
    },
}