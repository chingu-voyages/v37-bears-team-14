import { Field, Form, Formik } from "formik";
import { FC } from "react";
import * as Yup from "yup";
import { UpdateApplicationParams } from "../../../shared/ApplicationInterfaces";

interface ApplicationUpdateFormProps {
  initialContent: string;
  updateApplication: (values: UpdateApplicationParams) => Promise<void>;
  onCancel: () => void;
}

const ApplicationUpdateForm: FC<ApplicationUpdateFormProps> = ({
  initialContent,
  updateApplication,
  onCancel,
}) => {
  const ApplyFormSchema = Yup.object().shape({
    content: Yup.string().max(4096, "Too Long!").nullable(),
  });

  return (
    <Formik
      initialValues={{
        content: initialContent,
      }}
      validationSchema={ApplyFormSchema}
      onSubmit={async (values: UpdateApplicationParams) => {
        await updateApplication(values);
      }}
    >
      {({ touched, values, setValues, errors }) => (
        <Form>
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

            {errors.content && touched.content && (
              <div className="bg-orange-200 rounded p-2 text-sm my-2 text-slate-800">
                {errors.content}
              </div>
            )}
          </div>

          <div className="my-4 flex items-center justify-between">
            <input
              type="submit"
              value="Update Message"
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

export default ApplicationUpdateForm;
