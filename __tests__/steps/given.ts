import Chance from "chance";
const chance = new Chance();

export const a_random_user = () => {
    const firstName = chance.first({ nationality: 'en'});
    const lastName = chance.last({ nationality: 'en'});
    const email = `${firstName}.${lastName}@example.com`;
    const password = chance.string({ length: 8 });
    const name = `${firstName} ${lastName}`;
    return { name, email, password}
}