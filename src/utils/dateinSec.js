

export default function dateinSec(date) {
 // JS date object with current date
// const today = new Date(date);

// // ⚠️ JS returns the value in miliseconds
// const mseconds = today.getTime();

// // divided to get the just seconds
// const seconds = Math.floor(mseconds / 1000);

// single liner
const dateInSecs = Math.floor(new Date(date).getTime() / 1000);

return dateInSecs;
}
