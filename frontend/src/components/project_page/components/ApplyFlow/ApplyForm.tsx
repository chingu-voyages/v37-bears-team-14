import { Field, Form, Formik } from "formik";
import { FC } from "react";
import { Project } from "../../../../shared/Interfaces";
import * as Yup from "yup";
import { CreateApplicationParams } from "../../../../shared/ApplicationInterfaces";
import ActionButton from "../../../controls/ActionButton";
import messageSuggestions from "./messageSuggestions.json";

interface ApplyFormProps {
  project: Project;
  submitApplication: (values: CreateApplicationParams) => Promise<void>;
  onCancel: () => void;
}

const ApplyForm: FC<ApplyFormProps> = ({
  project,
  submitApplication,
  onCancel,
}) => {
  const ApplyFormSchema = Yup.object().shape({
    content: Yup.string().max(4096, "Too Long!").nullable(),
    requestedRole: Yup.string().oneOf(project.settingOpenRoles).required(),
  });

  return (
    <Formik
      initialValues={
        {
          content: null,
          requestedRole: null,
        } as CreateApplicationParams
      }
      validationSchema={ApplyFormSchema}
      onSubmit={async (values: CreateApplicationParams) => {
        await submitApplication(values);
      }}
    >
      {({ touched, values, setValues, errors }) => (
        <Form>
          <div className="my-4">
            <label htmlFor="content">Role</label>
            <Field
              id="requestedRole"
              name="requestedRole"
              component="select"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option
                className="text-gray-500"
                selected
                disabled
                label="Request a role"
              />
              {project.settingOpenRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Field>

            {errors.requestedRole && (
              <div className="bg-orange-200 rounded p-2 text-sm my-2 text-slate-800">
                {errors.requestedRole}
              </div>
            )}
          </div>

          <div className="my-4">
            <label htmlFor="content">
              Message{" "}
              <span className="text-gray-400">(Markdown is supported!)</span>
            </label>
            <Field
              id="content"
              name="content"
              component="textarea"
              placeholder="Write a message to the project owner!"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {values.content === null && !touched.content && (
              <>
                <div className="text-sm font-semibold text-gray-500">
                  Suggestions
                </div>
                {messageSuggestions.map((suggestion, i) => (
                  <ActionButton
                    key={i}
                    onClick={() =>
                      setValues({
                        ...values,
                        content: suggestion,
                      })
                    }
                    additionalClassName="my-1 border-slate-400 bg-white hover:bg-slate-100 active:bg-white text-gray-600"
                  >
                    {suggestion}
                  </ActionButton>
                ))}
              </>
            )}

            {errors.content && touched.content && (
              <div className="bg-orange-200 rounded p-2 text-sm my-2 text-slate-800">
                {errors.content}
              </div>
            )}
          </div>

          <div className="my-4 flex items-center justify-between">
            <input
              type="submit"
              value="Submit Application"
              className="main-btn cursor-pointer"
            />

            <button type="button" className="main-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ApplyForm;
