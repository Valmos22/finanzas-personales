import { Parser } from 'json2csv';

export const generateCSV = (data: any[], fields: string[]): string => {
    const parser = new Parser({ fields });
    return parser.parse(data);
};