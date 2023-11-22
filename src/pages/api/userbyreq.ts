import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const spreadsheetId = process.env.NEXT_PUBLIC_SHEET_ID || '';
    const apiKey = process.env.API_KEY || '';
    const sheetName = 'Sheet1';
    const nameColumn = 'A';

    try {
        const range = `${sheetName}!${nameColumn}:${nameColumn}`;
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
        );

        const data = await response.json();
        const names: string[] = data.values.map((row: string[]) => row[0]);

        res.status(200).json(names);
    } catch (error) {
        console.error('Error fetching names:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}