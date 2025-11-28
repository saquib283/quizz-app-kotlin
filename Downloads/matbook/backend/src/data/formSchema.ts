export const formSchema = {
    title: "Employee Onboarding",
    description: "Please fill out the details below to complete your onboarding process.",
    fields: [
        {
            id: "fullName",
            type: "text",
            label: "Full Name",
            placeholder: "John Doe",
            required: true,
            validation: {
                minLength: 2,
                maxLength: 50,
                regex: "^[a-zA-Z\\s]*$" // Only letters
            }
        },
        {
            id: "email",
            type: "text",
            label: "Email Address",
            placeholder: "john@example.com",
            required: true,
            validation: {
                regex: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$" // Basic Email Regex
            }
        },
        {
            id: "age",
            type: "number",
            label: "Age",
            required: true,
            validation: {
                min: 18,
                max: 65
            }
        },
        {
            id: "department",
            type: "select",
            label: "Department",
            options: [
                { value: "eng", label: "Engineering" },
                { value: "hr", label: "Human Resources" },
                { value: "sales", label: "Sales" }
            ],
            required: true
        },
        {
            id: "skills",
            type: "multi-select",
            label: "Core Skills",
            options: [
                { value: "react", label: "React" },
                { value: "node", label: "Node.js" },
                { value: "sql", label: "SQL" },
                { value: "python", label: "Python" }
            ],
            validation: {
                minSelected: 1,
                maxSelected: 3
            }
        },
        {
            id: "startDate",
            type: "date",
            label: "Start Date",
            required: true,
            validation: {
                minDate: "2024-01-01"
            }
        },
        {
            id: "bio",
            type: "textarea",
            label: "Short Bio",
            placeholder: "Tell us about yourself...",
            validation: {
                maxLength: 200
            }
        },
        {
            id: "remote",
            type: "switch",
            label: "Remote Work?"
        }
    ]
};