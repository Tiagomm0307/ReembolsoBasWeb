export type GridSizeType =
    | number
    | {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
    };

type Option = string | { label: string; value: string | number };

export interface ParamType {
    name: string;
    label: string;
    type: string;
    value?: unknown;
    options?: Option[];
    maxLength?: number;
    gridSize?: GridSizeType;
    disabled?: boolean;
    [key: string]: unknown;
}
