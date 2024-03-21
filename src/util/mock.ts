import { faker } from "@faker-js/faker";
import { Student } from "@prisma/client";

export function student(): Student {
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    gradeLevel: faker.number.int({ min: 10, max: 100 }),
    notes: faker.lorem.sentence(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    ownerId: faker.string.uuid(),
    familyId: faker.string.uuid(),
  };
}
