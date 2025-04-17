module.exports = {
    "*.{js,ts,jsx,tsx}": [
        "eslint --quiet --fix"
    ],
    "*.{ts,tsx}": [
        () => "tsc --project tsconfig.json"
    ]
};