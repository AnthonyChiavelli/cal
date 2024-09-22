import { faker } from "@faker-js/faker";
import { Student, UserSettings } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

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

export function userSettings(): UserSettings {
  return {
    id: faker.string.uuid(),
    userEmail: faker.internet.email(),
    basePrice: new Decimal(faker.number.float({ min: 10, max: 100 })),
    showInlineDayCalendarInMobileView: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
}
