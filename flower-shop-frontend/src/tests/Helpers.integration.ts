// @ts-ignore Some requirements issue
import fetch from "node-fetch";
import {getBackendURL} from "../services/user.service";

export function sleepingBackendWrapper<T>(func: () => T): Promise<T> {
    /* eslint-disable jest/no-conditional-expect */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    return fetch(`${getBackendURL()}/`).catch((error: Error) => {
        console.error(error.message)
    }).then((response: Response) => {
        if (response.ok) return func();
        expect(response.status.toString()).toMatch(/50./);
        return response;
    });
    /* eslint-enable jest/no-conditional-expect */
}