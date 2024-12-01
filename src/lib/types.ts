export enum Unit {
    MM = 'mm',
    CM = 'cm',
    IN = 'in',
    PX = 'px'
}
// types.ts
export enum PageOrientation {
    Portrait = 'portrait',
    Landscape = 'landscape'
}

export enum PageSize {
    // A Series
    A0 = '841mm 1189mm',
    A1 = '594mm 841mm',
    A2 = '420mm 594mm',
    A3 = '297mm 420mm',
    A4 = '210mm 297mm',
    A5 = '148mm 210mm',
    A6 = '105mm 148mm',
    A7 = '74mm 105mm',
    A10 = '26mm 37mm',

    // B Series
    B4 = '250mm 353mm',
    B5 = '176mm 250mm',

    // North American
    Letter = '8.5in 11in',
    Legal = '8.5in 14in',
    Ledger = '11in 17in'
}

export enum PageMarks {
    Crop = 'crop',
    Cross = 'cross',
    Both = 'crop cross'
}

export type MarginSize =
    | `${number}${Unit}`
    | `${number}${Unit} ${number}${Unit}`
    | `${number}${Unit} ${number}${Unit} ${number}${Unit} ${number}${Unit}`;

export interface PageBreak {
    before?: 'page' | 'left' | 'right' | 'recto' | 'verso';
    after?: 'page' | 'left' | 'right' | 'recto' | 'verso';
}

export interface PageMargins {
    top?: MarginSize;
    right?: MarginSize;
    bottom?: MarginSize;
    left?: MarginSize;
    general?: MarginSize;
}

export interface PageRules {
    left?: PageMargins;
    right?: PageMargins;
    first?: PageMargins;
    blank?: PageMargins;
}

export interface PagedOptions {
    pageSize?: PageSize;
    orientation?: PageOrientation;
    margins?: PageMargins;
    pageRules?: PageRules;
    bleed?: MarginSize;
    marks?: PageMarks;
}