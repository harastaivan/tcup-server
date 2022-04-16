import { Row, Workbook, Worksheet, CellValue, RichText, CellRichTextValue, CellFormulaValue } from 'exceljs';
import path from 'path';

import { FILENAME } from '../constants';
import { CompetitionClassType } from '../database/models/GliderType';
import { GliderType } from '../database/models/types';

enum WorksheetName {
    CLUB = 'Klub',
    KOMBI = 'Kombi'
}

const competitionClassTypes = {
    [WorksheetName.CLUB]: CompetitionClassType.CLUB,
    [WorksheetName.KOMBI]: CompetitionClassType.KOMBI
};

const BOUNDARIES = {
    [WorksheetName.KOMBI]: {
        rows: {
            min: 4,
            max: 275
        },
        columns: {
            name: 1,
            nameSplit: ', ',
            index: 2,
            handicap: 3
        }
    },
    [WorksheetName.CLUB]: {
        rows: {
            min: 4,
            max: 191
        },
        columns: {
            name: 1,
            nameSplit: ',  ',
            index: 2,
            handicap: 3
        }
    }
};

const readSheet = async () => {
    if (!FILENAME) {
        throw new Error('🚨 No FILENAME variable provided');
    }

    const workbook = new Workbook();
    const file = path.resolve(__dirname, '..', '..', 'data', FILENAME);
    console.log(`📄 Reading ${file}`);
    return await workbook.xlsx.readFile(file);
};

const getGliderTypesFromRow = (row: Row, worksheetName: WorksheetName): GliderType[] => {
    let nameCell = row.getCell(BOUNDARIES[worksheetName].columns.name).value;
    const indexCell = String(row.getCell(BOUNDARIES[worksheetName].columns.index).value);

    const { handicap: _handicap } = BOUNDARIES[worksheetName].columns;
    const handicapCell = _handicap ? row.getCell(_handicap).value : null;

    // Random picovina
    if (String(nameCell) === '[object Object]') {
        nameCell = (nameCell as CellRichTextValue).richText.reduce((prev, cur) => prev + cur.text, '');
    }

    const names = String(nameCell)
        .split(BOUNDARIES[worksheetName].columns.nameSplit)
        .map((name) => name.trim());

    const index = Number(indexCell);
    const handicap = handicapCell
        ? (handicapCell as CellFormulaValue).result
            ? Number((handicapCell as CellFormulaValue).result)
            : Number(handicapCell)
        : undefined;

    return names.map((name) => ({
        name,
        index,
        handicap,
        competitionClassType: competitionClassTypes[worksheetName]
    }));
};

const getGliderTypes = (worksheet: Worksheet, name: WorksheetName) => {
    let gliderTypes: GliderType[] = [];

    const { min, max } = BOUNDARIES[name].rows;
    for (let row = min; row < max; row++) {
        gliderTypes = [...gliderTypes, ...getGliderTypesFromRow(worksheet.getRow(row), name)];
    }

    return gliderTypes;
};

const getGliderTypesFromWorksheet = (workbook: Workbook, name: WorksheetName) => {
    const worksheet = workbook.getWorksheet(name);
    return getGliderTypes(worksheet, name);
};

export const readGliderTypes = async () => {
    const workbook = await readSheet();

    const club = getGliderTypesFromWorksheet(workbook, WorksheetName.CLUB);
    const kombi = getGliderTypesFromWorksheet(workbook, WorksheetName.KOMBI);

    return [...club, ...kombi];
};
