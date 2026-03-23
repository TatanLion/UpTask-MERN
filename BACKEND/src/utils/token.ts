export const generateToken = () => {
    return Math.floor(Math.random() * 999999).toString().padStart(6, '0');
};