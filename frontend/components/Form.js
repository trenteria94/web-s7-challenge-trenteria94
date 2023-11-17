import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import axios from 'axios'

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const userSchema = yup.object().shape({
  fullName: yup.string().trim()
    .required()
    .min(3, validationErrors.fullNameTooShort).max(20, validationErrors.fullNameTooLong),
  size: yup.string()
    .required()
    .oneOf(['S', 'M', 'L'], validationErrors.sizeIncorrect),
})

const getInitialValues = () => ({
  fullName: "",
  size: "",
  toppings: ""
})

const getInitialErrors = () => ({
  fullName: "",
  size: "",
  toppings: ""
})
// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

export default function Form() {
const [formEnabled, setformEnabled] = useState(false)
const [success, setSuccess] = useState()
const [failure, setFailure] = useState()
const [values, setValues] = useState(getInitialValues())
const [error, setError] = useState(getInitialErrors())

useEffect(() => {
  userSchema.isValid(values).then(setformEnabled)
}, [values])
const onChange = evt => {
  let { value, type, name, checked } = evt.target
  value = type == 'checkbox' ? checked : value
  setValues({ ...values, [name]: value })
  yup.reach(userSchema, name).validate(value)
  .then(() => setError({...error, [name]: ""}))
  .catch((err) => setError({...error, [name]: err.errors[0]}))
}

const onSubmit = evt => {
  evt.preventDefault()
  axios.
    post('http://localhost:9009/api/order')
}
  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {success && <div className='success'>{success}</div>}
      {failure && <div className='failure'>{failure}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input value={values.fullName} onChange={onChange} name='fullName' placeholder="Type full name" id="fullName" type="text" />
        </div>
        {error.fullName && <div className='error'>{error.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select value={values.size} onChange={onChange} name='size' id="size">
            <option value="">----Choose Size----</option>
            {/* Fill out the missing options */}
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {error.size && <div className='error'>{error.size}</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {toppings.map(topping => (
          <label key={topping.topping_id}>
            <input
              name={topping.text}
              type='checkbox'
            />
            {topping.text}<br />
          </label>
        ))}
        {/*<label key="1">
          <input
            name="Pepperoni"
            type="checkbox"
          />
          Pepperoni<br />
        </label>*/}
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input disabled={!formEnabled} type="submit" />
    </form>
  )
}
