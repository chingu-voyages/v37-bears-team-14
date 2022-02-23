import React from "react";
import { Formik } from "formik";

function ProjectSearch() {
  return (
    // <div>
    //   <Formik
    //     initialValues={{ search: "" }}
    //     onSubmit={(values, { setSubmitting }) => {
    //       setTimeout(() => {
    //         alert(JSON.stringify(values, null, 2));
    //         setSubmitting(false);
    //       }, 400);
    //     }}
    //   >
    //     {({
    //       values,
    //       errors,
    //       touched,
    //       handleChange,
    //       handleBlur,
    //       handleSubmit,
    //       isSubmitting,
    //       /* and other goodies */
    //     }) => (
    //       <form onSubmit={handleSubmit}>
    //         <div className="input-group relative flex flex-wrap justify-start w-full mb-4">
    //           <input
    //             type="search"
    //             name="search"
    //             className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
    //             onChange={handleChange}
    //             onBlur={handleBlur}
    //             value={values.search}
    //           />
    //           {errors.search && touched.search && errors.search}
    //           <button
    //             className="btn px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center"
    //             type="submit"
    //             disabled={isSubmitting}
    //             id="button-addon2"
    //           >
    //             <svg
    //               aria-hidden="true"
    //               focusable="false"
    //               data-prefix="fas"
    //               data-icon="search"
    //               className="w-4"
    //               role="img"
    //               xmlns="http://www.w3.org/2000/svg"
    //               viewBox="0 0 512 512"
    //             >
    //               <path
    //                 fill="currentColor"
    //                 d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
    //               ></path>
    //             </svg>
    //           </button>
    //         </div>
    //       </form>
    //     )}
    //   </Formik>
    // </div>

    <div className="flex items-center justify-start">
      <div className="flex border-2">
        <input
          type="text"
          className="px-4 py-2 w-full"
          placeholder="Search..."
        ></input>
        <button className="flex items-center justify-center px-4 border-l">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ProjectSearch;
