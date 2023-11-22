import { NextApiRequest, NextApiResponse } from 'next';

interface Athlete {
  [key: string]: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const spreadsheetId = process.env.NEXT_PUBLIC_SHEET_ID || '';
    const apiKey = process.env.API_KEY || '';
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1?key=${apiKey}`
    );
    const data = await response.json();

    if (data.values && data.values.length > 1) {
      const headerRow = data.values[0];
      const athletes: Athlete[] = data.values.slice(1).map((row: string[]) => {
        const athlete: Athlete = {};
        headerRow.forEach((header: string | number, index: number) => {
          athlete[header] = row[index];
        });
        return athlete;
      });

      res.status(200).json({ data: athletes });
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
