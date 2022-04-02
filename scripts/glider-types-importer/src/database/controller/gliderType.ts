import { GliderTypeModel } from '../models/GliderType';
import { GliderType, HydratedGliderType } from '../models/types';

const createGliderType = async (gliderType: GliderType) => {
    const doc = await GliderTypeModel.create(gliderType);
    console.log(`➕ Created\t${gliderType.name}`);

    return doc;
};

const updateGliderType = async (
    gliderType: HydratedGliderType,
    newGliderType: GliderType
): Promise<HydratedGliderType> => {
    gliderType.name = newGliderType.name;
    gliderType.index = newGliderType.index;
    gliderType.handicap = newGliderType.handicap;

    const doc = await gliderType.save();
    console.log(`✅ Updated\t${gliderType.name}`);

    return doc;
};

export const createOrUpdateGliderType = async (gliderType: GliderType): Promise<HydratedGliderType> => {
    const existing = await GliderTypeModel.findOne({ name: gliderType.name, index: gliderType.index });

    if (!existing) {
        return createGliderType(gliderType);
    }

    return updateGliderType(existing, gliderType);
};
