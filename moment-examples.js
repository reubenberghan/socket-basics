var moment = require('moment'),
	now = moment();
	
console.log(now.format());
console.log(now.format('X'));
console.log(now.valueOf());

var timestamp = 1450064280096,
	timestampMoment = moment.utc(timestamp);

console.log(timestampMoment.local().format('h:mm a'));

// now.subtract(1, 'year');
// 
// console.log(now.format());
// console.log(now.format('MMM Do YYYY, h:mm a'));