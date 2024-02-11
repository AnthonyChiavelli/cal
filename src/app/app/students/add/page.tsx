import Button from "@/app/components/button";
import Multiselect from "@/app/components/multiselect";

import { prisma } from "@/db";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

async function createStudent(data: FormData) {
  "use server";
  console.log(data);
  const firstName = data.get("firstName")?.valueOf() as string;
  const lastName = data.get("lastName")?.valueOf() as string;
  const gradeLevel = parseInt(data.get("gradeLevel")?.valueOf() as string);
  const notes = data.get("notes")?.valueOf() as string;

  await prisma.student.create({ data: { firstName, lastName, gradeLevel, notes } });
  redirect("/app/students");
}

function AddStudent() {
  return (
    <div>
      <h1>Create student</h1>
      <form className="flex flex-col gap-3" action={createStudent} autoComplete="off">
        <input autoComplete="false" name="hidden" type="text" style={{ display: "none" }} />
        <div className="mt-1 space-y-8 sm:space-y-0">
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
            <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
              First Name
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <div className="flex rounded-md shadow-sm sm:max-w-md">
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  autoComplete="false"
                  data-lpignore="true"
                  className="block flex-1 border-0 bg-white py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-1 space-y-8 sm:space-y-0">
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
            <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
              Last Name
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <div className="flex rounded-md shadow-sm sm:max-w-md">
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  data-lpignore="true"
                  className="block flex-1 border-0 bg-white py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-1 space-y-8 sm:space-y-0">
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
            <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
              Grade Level
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <div className="flex rounded-md shadow-sm sm:max-w-md">
                <input
                  type="number"
                  min="1"
                  name="gradeLevel"
                  id="gradeLevel"
                  data-lpignore="true"
                  className="block flex-1 border-0 bg-white py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-1 space-y-8 sm:space-y-0">
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
            <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
              Areas of Need
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <div className="flex rounded-md shadow-sm sm:max-w-md">
                <Multiselect
                  options={[
                    { label: "good", value: "food" },
                    { label: "xgood", value: "xfood" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-1 space-y-8 sm:space-y-0">
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-2 sm:py-1">
            <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
              Notes
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <div className="flex rounded-md shadow-sm sm:max-w-md">
                <textarea
                  name="notes"
                  id="notes"
                  data-lpignore="true"
                  className="block flex-1 border-0 bg-white py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <Button style="primary" text="Add" type="submit" />
        </div>
      </form>
    </div>
  );
}

export default withPageAuthRequired(AddStudent as any, { returnTo: "/app" });
