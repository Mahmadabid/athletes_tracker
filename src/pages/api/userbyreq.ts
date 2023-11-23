import { NextApiRequest, NextApiResponse } from 'next';

interface RowData {
    [key: string]: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const spreadsheetId = process.env.NEXT_PUBLIC_SHEET_ID || '';
    const apiKey = process.env.API_KEY || '';
    const sheetName = 'Sheet1';

    try {
        const rowNumber = parseInt(req.query.number as string, 10);

        if (isNaN(rowNumber) || rowNumber < 1) {
            return res.status(400).json({ error: 'Invalid row number provided' });
        }

        const firstRowRange = `${sheetName}!1:1`;
        const firstRowResponse = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${firstRowRange}?key=${apiKey}`
        );

        if (!firstRowResponse.ok) {
            console.error('Error fetching first row:', firstRowResponse.statusText);
            return res.status(firstRowResponse.status).json({ error: 'Error fetching first row' });
        }

        const firstRowData = await firstRowResponse.json();

        if (!firstRowData.values || firstRowData.values.length === 0) {
            return res.status(404).json({ error: 'First row not found in the sheet' });
        }

        const firstRow = firstRowData.values[0];

        const customRowRange = `${sheetName}!A${rowNumber}:Z${rowNumber}`;
        const customRowResponse = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${customRowRange}?key=${apiKey}`
        );

        if (customRowResponse.ok) {
            const customRowData = await customRowResponse.json();

            if (customRowData.values && customRowData.values.length > 0) {
                const customRow = customRowData.values[0];

                const result = firstRow.reduce((acc: RowData, key: string, index: number) => {
                    acc[key] = customRow[index] || ''; // Handle the case where the customRow value is undefined
                    return acc;
                }, {} as Record<string, string>);

                res.status(200).json({ data: result, rowNumber });
            } else {
                res.status(404).json({ error: 'Row not found' });
            }
        } else {
            console.error('Error fetching custom row:', customRowResponse.statusText);
            return res.status(customRowResponse.status).json({ error: 'Error fetching custom row' });
        }
    } catch (error) {
        console.error('Error in the try-catch block:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
