//[ ] Remove all comments and console logs
//[ ] Clean up CSS / CSS Classes
//[ ] Clean up UI/UX
//[x] Add handler to calculate Log Reg Prob based on Open price *** DONE ***
//[ ] Add handler / fields to add full DB entry for specific currency based on open price,
// close price, calculated MAV,
//[ ] Authentication
//[ ] Break K-Means charts into their own component
//[ ] Add button/handler for fetching log reg data
//[x] In LogRegProbFields.js -- calculate whether there is a BUY signal and
// what the logRegProb is for NEXT DATE give the OPENING PRICE provided *** DONE ***
//[ ] Different data point (open, open-open, 10-day MAV, etc) to LogRegChart.js
//[x] Change Tooltip style for all LogRegChart.js charts
//[x] Fix conditional rendering related to CrytoStore.loaded.logRegFields
// and date property of CryptoStore.logRegUsableData -- currently it will change the
// date value to a full timestamp when both the logRegChart and logRegFields are displayed
// need to handle this elegantly
//[x] Add handler/Server endpoint/DB query to POST new crypto data entry (for individual
// ticker) for AddCryptoPriceData
//[ ] Add code comments
//[ ] Good site for historical currency data: https://coinmarketcap.com/currencies/bitcoin/historical-data/
//[ ] Another good site: https://www.tradingview.com/chart/?symbol=CRYPTOCAP%3ATOTAL
//[ ] Change loading prop for KMeans component <LoadingButton />
//[ ] Add site header with nav