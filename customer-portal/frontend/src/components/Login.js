import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const Login = ({ onLogin }) => { 
    const [loginData, setLoginData] = useState({
        accountNumber: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState(''); // State to store validation errors

    const navigate = useNavigate(); // Create a navigate instance

    // Basic regex patterns for validation
    const accountNumberPattern = /^[0-9]{5,10}$/; // Example: Account number must be 5-10 digits
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/ // At least 8 characters, at least 1 letter, 1 number, and 1 special symbol

    // Handle form input changes
    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    // Validate inputs using regex
    const validateInputs = () => {
        const { accountNumber, password } = loginData;

        if (!accountNumberPattern.test(accountNumber)) {
            setErrorMessage('Account number must be between 5 to 10 digits.');
            return false;
        }

        if (!passwordPattern.test(password)) {
            setErrorMessage('Password must be at least 8 characters long and contain both letters and numbers.');
            return false;
        }

        setErrorMessage(''); // Clear error message if validation passes
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload on form submit

        // Validate form inputs before submitting
        if (!validateInputs()) {
            return; // Stop submission if inputs are invalid
        }

        try {
            const response = await axios.post('https://localhost:4000/api/users/login', loginData); // POST request to backend
            if (response.status === 200) {
                console.log('User logged in successfully:', response.data.message);
                onLogin(); // Call onLogin to update login status in App.js

                // Redirect to payment page with success message
                navigate('/payment', { state: { successMessage: `Logged in successfully as "${loginData.accountNumber}"!` } });
            }
        } catch (error) {
            if (error.response) {
                console.error('Login error:', error.response.data); // Log error if login fails
            } else {
                console.error('Login error:', error.message);
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="accountNumber"
                    onChange={handleChange}
                    placeholder="Account Number"
                    required
                />
                <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>

            {/* Display validation error messages */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

export default Login;
