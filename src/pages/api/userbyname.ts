import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const spreadsheetId = process.env.NEXT_PUBLIC_SHEET_ID || '';
    const apiKey = process.env.API_KEY || '';
    const sheetName = 'Sheet1';

    try {
        const firstRowRange = `${sheetName}!1:1`;
        const firstRowResponse = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${firstRowRange}?key=${apiKey}`
        );

        const firstRowData = await firstRowResponse.json();
        
        const nameIndex = firstRowData.values[0].indexOf('Name');

        if (nameIndex === -1) {
            throw new Error('Column "Name" not found in the first row.');
        }

        const range = `${sheetName}!${String.fromCharCode(65 + nameIndex)}:${String.fromCharCode(65 + nameIndex)}`;
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
        );

        const data = await response.json();
        const columnValues: string[] = data.values.map((row: string[]) => row[0]);

        res.status(200).json(columnValues);
    } catch (error) {
        console.error('Error fetching column values:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
