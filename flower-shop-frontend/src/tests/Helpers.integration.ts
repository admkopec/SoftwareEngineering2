// @ts-ignore Some requirements issue
import fetch from "node-fetch";
import {getBackendURL} from "../services/user.service";

export function sleepingBackendWrapper<T>(func: () => T): Promise<T> {
    /* eslint-disable jest/no-conditional-expect */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return fetch(`${getBackendURL()}/`).catch((error: Error) => {
        expect(error.message).toMatch(/ERROR 50./);
    }).then(() => func())
    /* eslint-enable jest/no-conditional-expect */
}