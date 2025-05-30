import type { Dayjs as _Dayjs } from 'dayjs';
import type { Location as _RouterLocation } from 'history';
import type { CSSProperties } from 'react';

import type { Location } from './location';

export {};

declare global {
    type Nullable<T> = T | null | undefined;
    type RouterLocation = _RouterLocation;
    type Dayjs = _Dayjs;
    type CSS = CSSProperties;
    type PixelValue = '0' | `${number}px`;
    type Margin =
        | `${PixelValue}`
        | `${PixelValue} ${PixelValue}`
        | `${PixelValue} ${PixelValue} ${PixelValue}`
        | `${PixelValue} ${PixelValue} ${PixelValue} ${PixelValue}`;
    type Padding = Margin;

    type Room = {
        _id: string;
        name: string;
        from: Location;
        to: Location;
        time: Date;
        madeat: Date;
        settlementTotal?: number;
        maxPartLength: number;
        part: Array<User>;
    };

    type ReportResponse = { status: number };

    type Report = {
        reportedId: string;
        type: 'no-settlement' | 'no-show' | 'etc-reason';
        etcDetail: string;
        time: Date;
    };
}
