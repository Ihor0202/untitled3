import {timeHelper} from "../halpers/time.helper";
import {configs} from "../config/configs";
import {tokenRepository} from "../repositories/token.repository";
import {CronJob} from "cron";

const handler = async () => {
    try {
        const { value, unit } = timeHelper.parseConfigString(
            configs.JWT_REFRESH_EXPIRATION,
        );

        const date = timeHelper.subtractByParams(value, unit);
        const deletedCount = await tokenRepository.deleteBeforeDate(date);
        console.log(`Deleted ${deletedCount} old tokens`);
    } catch (error) {
        console.error(error);
    }
};

export const removeOldTokensCronJob = new CronJob("0,20,40 * * * * *", handler);