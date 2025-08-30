import CryptoJS from "crypto-js";


const SECRET_KEY = process.env.NEXT_PUBLIC_ENC_SECRET_KEY as string;
type HandleErrorFn = () => void;

// Logout Hook


// Encrypt Data
export const encryptData = (data: any, handleError?: HandleErrorFn): string | null => {
  try {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    return encryptedData;
  } catch (error) {
    if (handleError) handleError();
    return null;
  }
};

// Decrypt Data
export const decryptData = (cipherText: string, handleError?: HandleErrorFn): any | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    if (handleError) handleError();
    return null;
  }
};

// Only exclude "token"
const excludeKeys = ["token"];

// Save to localStorage
export const saveToLocalStorage = (key: string, value: any, handleError?: HandleErrorFn): void => {
 
  if (excludeKeys.includes(key)) {
    localStorage.setItem(key, value);
  } else {
    const encryptedData = encryptData(value, handleError);
    if (encryptedData) {
      localStorage.setItem(key, encryptedData);
    }
  }
};

// Get from localStorage
export const getFromLocalStorage = (key: string, handleError?: HandleErrorFn): any | null => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key);
    if (stored) {
      if (excludeKeys.includes(key)) {
        return stored;
      } else {
        return decryptData(stored, handleError);
      }
    }
  }
  return null;
};