import { GliderTypeModel } from '../models/GliderType';
import { GliderType, HydratedGliderType } from '../models/types';

const shouldUpdate = (oldGliderType: HydratedGliderType, newGliderType: GliderType) => {
    if (oldGliderType.index !== newGliderType.index) {
        return true;
    }

    if (!oldGliderType.handicap) {
        return Boolean(newGliderType.handicap);
    }

    return oldGliderType.handicap !== newGliderType.handicap;
};

const format = ({ name, index, handicap }: GliderType) => {
    return `'${name}', '${index}' '${handicap}'`;
};

const createGliderType = async (gliderType: GliderType) => {
    const doc = await GliderTypeModel.create(gliderType);
    console.log(`➕ Created\t${gliderType.name}`);

    return doc;
};

const updateGliderType = async (
    gliderType: HydratedGliderType,
    newGliderType: GliderType
): Promise<HydratedGliderType> => {
    if (!shouldUpdate(gliderType, newGliderType)) {
        return gliderType;
    }

    const oldGliderType = {
        name: gliderType.name,
        index: gliderType.index,
        handicap: gliderType.handicap,
        competitionClassType: gliderType.competitionClassType
    };

    gliderType.name = newGliderType.name;
    gliderType.index = newGliderType.index;
    gliderType.handicap = newGliderType.handicap;

    const doc = await gliderType.save();
    console.log(`✅ Updated\t${format(oldGliderType)}\t${format(newGliderType)}`);

    return doc;
};

export const createOrUpdateGliderType = async (gliderType: GliderType): Promise<HydratedGliderType> => {
    const existing = await GliderTypeModel.findOne({
        name: gliderType.name,
        competitionClassType: gliderType.competitionClassType
    });

    if (!existing) {
        return createGliderType(gliderType);
    }

    return updateGliderType(existing, gliderType);
};
