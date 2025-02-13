import { Button, Input, Space, Form } from 'antd';  
import { useFormik } from 'formik';  
import React from 'react';  
import * as yup from 'yup';  

const SampleForm = () => {  
  const schema = yup.object().shape({  
    project_name: yup  
      .string()  
      .required("Project Name is required")  
      .matches(/^[a-zA-Z_][a-zA-Z0-9_]*$/, 'Project name must start with a letter or underscore & can only contain letters, numbers, and underscores.')  
      .trim()  
      .notOneOf(['_', ''], 'Project name cannot be just an underscore or empty.')  
      .test('no-start-end-underscore', 'Underscore cannot be at the start or end of project name.', (value) => {  
        return value && !(value.startsWith('_') || value.endsWith('_'));  
      })  
      .test('no-spaces', 'Spaces are not allowed in project name.', (value) => {  
        return value && !/\s/.test(value);  
      }),  
    description: yup.string().required("Description is required"),  
  });  

  const formik = useFormik({  
    initialValues: {  
      project_name: "",  
      description: "",  
    },  
    validationSchema: schema,  
    validateOnChange: true,   // Validate on change  
    validateOnBlur: true,      // Validate on blur  
    onSubmit: (values) => {  
      console.log('Form values:', values);  
    },  
    enableReinitialize: true,  
  });  

  return (  
    <Form onFinish={formik.handleSubmit} className="max-w-[300px] mx-auto">  
      <Form.Item  
        label="Project Name:"  
        validateStatus={formik.touched.project_name && formik.errors.project_name ? "error" : ""}  
        help={formik.touched.project_name && formik.errors.project_name}  
      >  
        <Input  
          name="project_name"  
          placeholder="Enter Project Name"  
          value={formik.values.project_name}  
          onChange={formik.handleChange('project_name')} // Trigger change  
          onBlur={formik.handleBlur('project_name')} // Trigger blur  
        />  
      </Form.Item>  

      <Form.Item  
        label="Description:"  
        validateStatus={formik.touched.description && formik.errors.description ? "error" : ""}  
        help={formik.touched.description && formik.errors.description}  
      >  
        <Input  
          name="description"  
          placeholder="Enter Description"  
          value={formik.values.description}  
          onChange={formik.handleChange('description')} // Trigger change  
          onBlur={formik.handleBlur('description')} // Trigger blur  
        />  
      </Form.Item>  

      <Form.Item>  
        <Space>  
          <Button type="primary" htmlType="submit">  
            Submit  
          </Button>  
          <Button onClick={() => formik.resetForm()}>Cancel</Button>  
        </Space>  
      </Form.Item>  
    </Form>  
  );  
};  

export default SampleForm;