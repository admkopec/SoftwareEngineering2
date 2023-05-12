import { IS_DEV } from '../resources/constants';

export default function log(data: string | null | undefined): void {
  if (IS_DEV && data)
    // eslint-disable-next-line no-console
    console.log(data);
}
