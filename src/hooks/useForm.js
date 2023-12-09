import { useState } from "react";

export default function useForm(submitHandler, initialValues, validationRules) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
  
    const resetForm = () => {
      setValues(initialValues);
      setErrors({});
    };
  
    const onChange = (e) => {
      const { name, value } = e.target;
       
      setValues(state => ({
        ...state,
        [e.target.name]: e.target.value
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    };
  
    const validateField = (name, value) => {
      const validationRule = validationRules[name];
      
      if (validationRule) {
        const error = validationRule(value);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: error,
        }));
      }
    };
  
    const onSubmit = (e) => {
      e.preventDefault();
      
      for (const key in validationRules) {
        if (validationRules.hasOwnProperty(key)) {
          validateField(key, values[key]);
        }
      }
       if (Object.values(errors).some((error) => error != "") || Object.keys(errors).length === 0) {
        return;
      }
      submitHandler(values);
    };

    const setEditCommentValue = (newValue) => {
        setValues(newValue);
    };
  
    return {
      values,
      errors,
      onChange,
      onSubmit,
      resetForm,
      setEditCommentValue
    };
  }
  