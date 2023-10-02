"use client";
import React, { useState } from "react";
import { FaCopy, FaDownload } from "react-icons/fa";

interface Options {
  uppercase: boolean;
  numbers: boolean;
  special: boolean;
  numbersOnly: boolean;
  lettersOnly: boolean;
}

const generatePassword = (length: number, options: Options): string => {
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()_-+=<>?";

  if (options.numbersOnly)
    return Array.from(
      { length },
      () => numberChars[Math.floor(Math.random() * numberChars.length)]
    ).join("");
  if (options.lettersOnly)
    return Array.from(
      { length },
      () => lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]
    ).join("");

  let possibleChars = lowercaseChars;

  if (options.uppercase) possibleChars += uppercaseChars;
  if (options.numbers) possibleChars += numberChars;
  if (options.special) possibleChars += specialChars;

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * possibleChars.length);
    password += possibleChars[randomIndex];
  }
  return password;
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

function App() {
  const [password, setPassword] = useState("");
  const [minLength, setMinLength] = useState(8);
  const [maxLength, setMaxLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    numbers: true,
    special: true,
    numbersOnly: false,
    lettersOnly: false,
  });
  const [strength, setStrength] = useState("Weak");

  const isOtherOptionsDisabled = options.numbersOnly || options.lettersOnly;

  const downloadPassword = () => {
    const blob = new Blob([password], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "password.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const measureStrength = (password: string) => {
    if (
      password.length >= 12 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*()_\-+=<>?]/.test(password)
    ) {
      return "Very Strong";
    }
    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return "Strong";
    }
    if (password.length >= 6) {
      return "Medium";
    }
    return "Weak";
  };
  const [isAdvancedOptionsVisible, setAdvancedOptionsVisible] = useState(false);
  const toggleAdvancedOptions = () =>
    setAdvancedOptionsVisible(!isAdvancedOptionsVisible);

  const handleGeneratePassword = () => {
    const randomLength = Math.floor(
      Math.random() * (maxLength - minLength + 1) + minLength
    );

    const password = generatePassword(randomLength, options);
    setPassword(password);
    setStrength(measureStrength(password));
  };

  return (
    <div className="App flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 border-2 border-gray-300">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Password Generator
        </h1>
        <div className="flex flex-col items-start mb-4">
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={options.uppercase}
              onChange={() =>
                setOptions({ ...options, uppercase: !options.uppercase })
              }
              disabled={isOtherOptionsDisabled}
            />
            Include Uppercase
          </label>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={options.numbers}
              onChange={() =>
                setOptions({ ...options, numbers: !options.numbers })
              }
              disabled={isOtherOptionsDisabled}
            />
            Include Numbers
          </label>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              className="mr-2"
              checked={options.special}
              onChange={() =>
                setOptions({ ...options, special: !options.special })
              }
              disabled={isOtherOptionsDisabled}
            />
            Include Special Characters
          </label>
          <div className="flex flex-1 text-right">
            <button
              onClick={toggleAdvancedOptions}
              className="text-right flex items-center"
            >
              Advanced Options
              {isAdvancedOptionsVisible ? "▲" : "▼"}
            </button>
          </div>
          {isAdvancedOptionsVisible && (
            <div className="advanced-options">
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={options.numbersOnly}
                  onChange={() =>
                    setOptions({
                      ...options,
                      numbersOnly: !options.numbersOnly,
                    })
                  }
                  disabled={options.lettersOnly}
                />
                Numbers Only
              </label>
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={options.lettersOnly}
                  onChange={() =>
                    setOptions({
                      ...options,
                      lettersOnly: !options.lettersOnly,
                    })
                  }
                  disabled={options.numbersOnly}
                />
                Letters Only
              </label>
              <div className="flex flex-col">
                <label>Min Length</label>
                <input
                  className="border rounded px-1"
                  type="number"
                  value={minLength}
                  onChange={(e) => setMinLength(parseInt(e.target.value))}
                />
              </div>
              <div className="flex flex-col">
                <label>Max Length</label>
                <input
                  className="border rounded px-1"
                  type="number"
                  value={maxLength}
                  onChange={(e) => setMaxLength(parseInt(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 mb-4"
          onClick={handleGeneratePassword}
        >
          Generate Password
        </button>
        {password && (
          <div>
            <div className="flex justify-between items-center border rounded px-3">
              <input
                type="text"
                value={password}
                className="text-lg flex-1 py-2  cursor-text focus:ring-0 focus:outline-none focus:border-none"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setStrength(measureStrength(e.target.value));
                }}
              />
              <button
                onClick={() => copyToClipboard(password)}
                className="text-blue-600 hover:text-blue-800"
              >
                <FaCopy />
              </button>
            </div>
            <p>
              Strength:{" "}
              <span
                className={
                  strength === "Very Strong"
                    ? "text-green-500"
                    : strength === "Strong"
                    ? "text-yellow-500"
                    : "text-red-500"
                }
              >
                {strength}
              </span>
            </p>
          </div>
        )}

        <div className="text-right">
          <button
            className="bg-neutral-100 text-dark border border-neutral-300 px-2 py-2 rounded focus:ring focus:ring-green-200 mb-4"
            onClick={downloadPassword}
          >
            <FaDownload />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
