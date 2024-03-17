"use client";

import React from "react";
import {
  QuestionMarkCircleIcon,
  ArrowUpOnSquareIcon,
  ExclamationCircleIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";
import { SyncLoader } from "react-spinners";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import classNames from "classnames";
import papa from "papaparse";
import { doCSVUpload } from "@/app/actions/student";
import Button from "@/app/components/button";
import Modal from "@/app/components/modal";
import { shallowCompareArrays } from "@/util/array";

const EXPECTED_COLUMNS = ["First Name", "Last Name", "Grade Level", "Notes"];

function ImportStudents() {
  const [helpModalOpen, setHelpModalOpen] = React.useState(false);
  const [csvParseLoading, setCsvParseLoading] = React.useState(false);
  const [csvFileParsed, setCsvFileParsed] = React.useState<{ error: boolean; errors: string[] } | undefined>(undefined);

  const handleFileInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvParseLoading(true);
      papa.parse(e.target.files[0], {
        header: true,
        complete(r) {
          const errors: string[] = [];
          if (!r.meta.fields || !shallowCompareArrays(r.meta.fields, EXPECTED_COLUMNS, false)) {
            errors.push("Unexpected column names. Please click the help icon in the header for more information");
          }
          if (r.data.some((rowData) => isNaN(parseInt((rowData as any as { [k: string]: string })["Grade Level"])))) {
            errors.push(`Grade level must be a number`);
          }

          const allErrors = [
            ...errors,
            ...r.errors.map(({ message, row }) => `${message} ${row ? `(row: ${row})` : ``}`),
          ];
          if (allErrors.length) {
            setCsvFileParsed({ error: true, errors: allErrors });
          } else {
            setCsvFileParsed({ error: false, errors: [] });
          }
          setCsvParseLoading(false);
        },
      });
    }
  }, []);

  const renderUploadButtonContents = () => {
    if (csvParseLoading) {
      return (
        <>
          <SyncLoader color="#64748b" />
          <div className="mt-7 text-slate-800">Taking a look...</div>
        </>
      );
    } else if (csvFileParsed && csvFileParsed.error) {
      return (
        <>
          <div className="flex items-center text-2xl mb-5">
            <ExclamationCircleIcon width={30} height={30} className="mr-2" />
            Oops!
          </div>
          <div className="text-xl mb-2">Looks like there&apos;s some problems with your file:</div>
          <div className="text-sm flex flex-col items-center mb-5">
            {csvFileParsed.errors.map((error) => (
              <div key={error}>{error}</div>
            ))}
          </div>
          <div className="text-md font-bold">Update your CSV then click or drag here to upload again</div>
        </>
      );
    } else if (csvFileParsed && !csvFileParsed.error) {
      return (
        <>
          <FaceSmileIcon width={30} height={30} className="mb-4" />
          <div>Everything looks good! Click upload to continue</div>
        </>
      );
    } else {
      return (
        <>
          <ArrowUpOnSquareIcon width={30} height={30} className="mb-4" />
          <div>Drag and drop a CSV file or click to open the file explorer</div>
        </>
      );
    }
  };

  return (
    <div>
      <h1 className="flex items-center gap-2">
        Import students from a CSV file{" "}
        <QuestionMarkCircleIcon
          className="cursor-pointer w-10 h-10"
          width={30}
          height={30}
          onClick={() => setHelpModalOpen(true)}
        />
      </h1>

      <section className="pt-8">
        <form action={doCSVUpload}>
          <label
            htmlFor="csv-file-input"
            className={classNames(
              "w-full flex flex-col items-center py-6 border-2 border-slate-500 border-dashed rounded-lg bg-white",
              { "cursor-pointer": !csvParseLoading },
            )}
          >
            {renderUploadButtonContents()}

            <input
              id="csv-file-input"
              name="csvFile"
              className="hidden"
              disabled={csvParseLoading}
              type="file"
              accept=".csv"
              onChange={handleFileInputChange}
            />
          </label>
          <div className="flex justify-center my-5">
            <Button flavor="primary" type="submit" text="Upload" disabled={!(csvFileParsed && !csvFileParsed.error)} />
          </div>
        </form>
      </section>

      <Modal open={helpModalOpen} close={() => setHelpModalOpen(false)}>
        <>
          <h2 className="mb-3">Importing students via CSV</h2>
          <p>
            Using this import tool, you can import multiple students at once by providing a spreadsheet of student
            records
          </p>
          <p className="mt-3">
            <span className="font-bold">Steps:</span>
            <ol className="list-decimal pl-6">
              <li>
                Create a spreadsheet in your tool of choice with the following columns: &quot;First Name&quot;,
                &quot;Last Name&quot;, &quot;Grade Level&quot;, and &quot;Notes&quot; (optional)
              </li>
              <li>Fill in as many rows as you&apos;d like with student data</li>
              <li>Export the file in CSV format (usually available in the file -&gt; export menu</li>
            </ol>
          </p>
          <p className="mt-3">We&apos;ll keep a record of all your imports which import created which student</p>
          <div className="mt-3 flex justify-end">
            <Button flavor="primary" text="Okay!" onClick={() => setHelpModalOpen(false)} />
          </div>
        </>
      </Modal>
    </div>
  );
}

export default withPageAuthRequired(ImportStudents as any, { returnTo: "/app" });
