const overflows = {
	second: 60,
	minute: 60,
	hour: 24,
	day: [
		// not a leap year
		[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		// leap year
		[31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	],
	month: 12
};

const lang = {
	MMM: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	ddd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	dd: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'],
	ll: 'MMM D YYYY',
};

function zeroPad(num) {
	return ('0' + num).slice(-2);
}

function isLeapYear(year) {
	if (year % 4) {
		return false;
	} else if (year % 100) {
		return true;
	} else {
		return year % 400 == 0;
	}
}

function absFloor(number) {
	if (number < 0) {
		return Math.ceil(number);
	} else {
		return Math.floor(number);
	}
}

function normalizeUnits(unit) {
	const normal = {
		seconds: 'second',
		second: 'second',
		minutes: 'minute',
		minute: 'minute',
		hours: 'hour',
		hour: 'hour',
		days: 'day',
		day: 'day',
		weeks: 'week',
		week: 'week',
		months: 'month',
		month: 'month',
		years: 'year',
		year: 'year',
	};
	return normal[unit];
}

/**
 * adapted from moment.js
 * @param {NumDate} a
 * @param {NumDate} b
 * @returns {number}
 */
function monthDiff(a, b) {
	// difference in months
	var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month());
	// b is in (anchor - 1 month, anchor + 1 month)
	var anchor = a.clone().add(wholeMonthDiff, 'months');
	var anchor2, adjust;

	if (b.getTime() - anchor.getTime() < 0) {
		anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
		// linear across the month
		adjust = (b.getTime() - anchor.getTime()) / (anchor.getTime() - anchor2.getTime());
	} else {
		anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
		// linear across the month
		adjust = (b.getTime() - anchor.getTime()) / (anchor2.getTime() - anchor.getTime());
	}

	return -(wholeMonthDiff + adjust);
}

class NumDate {
	constructor(num) {
		this.data = {
			year: 0,
			month: 0,
			day: 0,
			hour: 0,
			minute: 0,
			second: 0,
		};
		this.jsDate = null;
		if (num) {
			var str = String(num);
			if (str.length >= 4) {
				this.data.year = parseInt(str.substr(0, 4), 10);
				if (str.length >= 6) {
					this.data.month = parseInt(str.substr(4, 2), 10) - 1;
					if (str.length >= 8) {
						this.data.day = parseInt(str.substr(6, 2), 10);
						if (str.length >= 10) {
							this.data.hour = parseInt(str.substr(8, 2), 10);
							if (str.length >= 12) {
								this.data.minute = parseInt(str.substr(10, 2), 10);
								if (str.length >= 14) {
									this.data.second = parseInt(str.substr(12, 2), 10);
								}
							}
						}
					}
				}
			}
		}
	}

	year(val) {
		if (typeof val == 'undefined') {
			return this.data.year;
		} else {
			this.data.year = parseInt(val, 10);
			this.jsDate = null;
			return this;
		}
	}

	month(val) {
		if (typeof val == 'undefined') {
			return this.data.month;
		} else {
			this.data.month = parseInt(val, 10);
			this.jsDate = null;
			return this;
		}
	}

	date(val) {
		if (typeof val == 'undefined') {
			return this.data.day;
		} else {
			this.data.day = parseInt(val, 10);
			this.jsDate = null;
			return this;
		}
	}

	hours(val) {
		if (typeof val == 'undefined') {
			return this.data.hour;
		} else {
			this.data.hour = parseInt(val, 10);
			this.jsDate = null;
			return this;
		}
	}

	minutes(val) {
		if (typeof val == 'undefined') {
			return this.data.minute;
		} else {
			this.data.minute = parseInt(val, 10);
			this.jsDate = null;
			return this;
		}
	}

	seconds(val) {
		if (typeof val == 'undefined') {
			return this.data.second;
		} else {
			this.data.second = parseInt(val, 10);
			this.jsDate = null;
			return this;
		}
	}

	/**
	 * @returns {Date}
	 */
	toDate() {
		if (!this.jsDate) {
			this.jsDate = new Date(this.data.year, this.data.month, this.data.day, this.data.hour, this.data.minute, this.data.second);
		}
		return this.jsDate;
	}

	/**
	 * @returns {Number}
	 */
	getTime() {
		return this.toDate().getTime();
	}

	/**
	 * @returns {string}
	 */
	toString() {
		return '' + this.data.year + zeroPad(this.data.month + 1) + zeroPad(this.data.day) + zeroPad(this.data.hour) + zeroPad(this.data.minute) + zeroPad(this.data.second);
	}

	/**
	 * @returns {Number}
	 */
	valueOf() {
		return parseInt(this.toString(), 10);
	}

	/**
	 * @returns {NumDate}
	 */
	toGMT() {
		var offset = this.toDate().getTimezoneOffset();
		if (offset < 0) {
			this.subtract(Math.abs(offset), 'minutes');
		} else if (offset > 0) {
			this.add(offset, 'minutes');
		}
		return this;
	}

	/**
	 * @returns {NumDate}
	 */
	fromGMT() {
		var offset = this.toDate().getTimezoneOffset();
		if (offset < 0) {
			this.add(Math.abs(offset), 'minutes');
		} else if (offset > 0) {
			this.subtract(offset, 'minutes');
		}
		return this;
	}

	/**
	 * @param {Number} amount
	 * @param {String} unit one of minute(s)|hour(s)|day(s)|month(s)|year(s)
	 * @returns {NumDate}
	 */
	add(amount, unit) {
		unit = normalizeUnits(unit);
		// this changes from unit to unit
		var qty = amount;
		// this changes from unit to unit
		var type = unit;
		var tmp = 0;
		if (type == 'week') {
			type = 'day';
			qty *= 7;
		}
		if (type == 'second') {
			tmp = this.data.second + qty;
			if (tmp >= overflows.second) {
				this.data.second = tmp % overflows.second;
				qty = Math.floor(tmp / overflows.second);
				type = 'minute';
			} else {
				this.data.second = tmp;
			}
		}
		if (type == 'minute') {
			tmp = this.data.minute + qty;
			if (tmp >= overflows.minute) {
				this.data.minute = tmp % overflows.minute;
				qty = Math.floor(tmp / overflows.minute);
				type = 'hour';
			} else {
				this.data.minute = tmp;
			}
		}
		if (type == 'hour') {
			tmp = this.data.hour + qty;
			if (tmp >= overflows.hour) {
				this.data.hour = tmp % overflows.hour;
				qty = Math.floor(tmp / overflows.hour);
				type = 'day';
			} else {
				this.data.hour = tmp;
			}
		}
		if (type == 'day') {
			var tmpDayOverflow = overflows.day[0 + isLeapYear(this.data.year)];
			tmp = this.data.day + qty;
			if (tmp > tmpDayOverflow[this.data.month]) {
				var thisMonth = this.data.month;
				var nextMonth = thisMonth == 11 ? 0 : thisMonth + 1;
				var thisYear = this.data.year;
				var nextMonthsYear = thisMonth == 11 ? thisYear + 1 : thisYear;
				// get the day to the end of the current month
				tmp -= tmpDayOverflow[thisMonth];
				while (tmp > overflows.day[0 + isLeapYear(nextMonthsYear)][nextMonth]) {
					tmp -= overflows.day[0 + isLeapYear(nextMonthsYear)][nextMonth];
					thisMonth = nextMonth;
					thisYear = nextMonthsYear;
					nextMonth = thisMonth == 11 ? 0 : thisMonth + 1;
					nextMonthsYear = thisMonth == 11 ? thisYear + 1 : thisYear;
				}
				this.data.day = tmp;
				this.data.month = nextMonth;
				this.data.year = nextMonthsYear;
			} else {
				this.data.day = tmp;
			}
		} else {
			if (type == 'month') {
				tmp = this.data.month + qty;
				if (tmp > overflows.month) {
					this.data.month = tmp % overflows.month;
					qty = Math.floor(tmp / overflows.month);
					type = 'year';
				} else {
					this.data.month = tmp;
				}
			}
			if (type == 'year') {
				this.data.year += qty;
			}
		}
		this.jsDate = null;
		return this;
	}


	/**
	 * @param {Number} amount
	 * @param {String} unit one of minute(s)|hour(s)|day(s)|month(s)|year(s)
	 * @returns {NumDate}
	 */
	subtract(amount, unit) {
		unit = normalizeUnits(unit);
		// this changes from unit to unit
		var qty = amount;
		// this changes from unit to unit
		var type = unit;
		var tmp = 0;
		if (type == 'week') {
			type = 'day';
			qty *= 7;
		}
		if (type == 'second') {
			tmp = this.data.second - qty;
			if (tmp < 0) {
				// we use + below because tmp is negative
				this.data.second = overflows.second + tmp % overflows.second;
				qty = Math.abs(Math.floor(tmp / overflows.second));
				type = 'minute';
			} else {
				this.data.second = tmp;
			}
		}
		if (type == 'minute') {
			tmp = this.data.minute - qty;
			if (tmp < 0) {
				// we use + below because tmp is negative
				this.data.minute = overflows.minute + tmp % overflows.minute;
				qty = Math.abs(Math.floor(tmp / overflows.minute));
				type = 'hour';
			} else {
				this.data.minute = tmp;
			}
		}
		if (type == 'hour') {
			tmp = this.data.hour - qty;
			if (tmp < 0) {
				this.data.hour = overflows.hour + tmp % overflows.hour;
				qty = Math.abs(Math.floor(tmp / overflows.hour));
				type = 'day';
			} else {
				this.data.hour = tmp;
			}
		}
		if (type == 'day') {
			tmp = this.data.day - qty;
			if (tmp < 1) {
				var thisMonth = this.data.month;
				var prevMonth = thisMonth == 0 ? 11 : thisMonth - 1;
				var thisYear = this.data.year;
				var prevMonthsYear = thisMonth == 0 ? thisYear - 1 : thisYear;
				do {
					tmp += overflows.day[0 + isLeapYear(prevMonthsYear)][prevMonth];
					thisMonth = prevMonth;
					thisYear = prevMonthsYear;
					prevMonth = thisMonth == 0 ? 11 : thisMonth - 1;
					prevMonthsYear = thisMonth == 0 ? thisYear - 1 : thisYear;
				} while (-tmp >= overflows.day[0 + isLeapYear(prevMonthsYear)][prevMonth]);
				if (tmp > 0) {
					this.data.day = tmp;
					this.data.month = thisMonth;
					this.data.year = thisYear;
				} else {
					this.data.day = overflows.day[0 + isLeapYear(prevMonthsYear)][prevMonth] + tmp;
					this.data.month = prevMonth;
					this.data.year = prevMonthsYear;
				}
			} else {
				this.data.day = tmp;
			}
		} else {
			if (type == 'month') {
				tmp = this.data.month - qty;
				if (tmp < 0) {
					this.data.month = overflows.month + tmp % overflows.month;
					qty = Math.abs(Math.floor(tmp / overflows.month));
					type = 'year';
				} else {
					this.data.month = tmp;
				}
			}
			if (type == 'year') {
				this.data.year -= qty;
			}
		}
		this.jsDate = null;
		return this;
	}

	/**
	 * @todo watch out for double replacing - see the inline comment
	 * @param {String} str
	 * @returns {String}
	 */
	format(str) {
		return str
			.replace('ll', lang.ll)
			.replace('YYYY', this.data.year)
			.replace('DD', zeroPad(this.data.day))
			// D has to come before MMM because 'Dec' contains D and 'Dec' would look like '6ec'
			.replace('D', this.data.day)
			.replace('MMM', lang.MMM[this.data.month])
			.replace('MM', zeroPad(this.data.month + 1))
			.replace('ddd', lang.ddd[(new Date(this.data.year, this.data.month, this.data.day)).getDay()])
			.replace('dd', lang.dd[(new Date(this.data.year, this.data.month, this.data.day)).getDay()])
			.replace('HH', zeroPad(this.data.hour))
			.replace('H', this.data.hour)
			.replace('mm', zeroPad(this.data.minute))
			.replace('m', this.data.minute)
			.replace('ss', zeroPad(this.data.second));
	}

	/**
	 * calculates the difference in the requested unit between 2 NumDates
	 * @param {NumDate} num
	 * @param {String} units
	 * @returns {Number}
	 */
	diff(num, units) {
		units = normalizeUnits(units);
		var output;
		var target = num.clone();
		if (units == 'year' || units == 'month') {
			output = monthDiff(this, target);
			if (units === 'year') {
				output = output / 12;
			}
		} else {
			var delta = this.getTime() - target.getTime();
			output = units === 'second' ? delta / 1e3 : // 1000
					units === 'minute' ? delta / 6e4 : // 1000 * 60
					units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
					units === 'day' ? delta / 864e5 : // 1000 * 60 * 60 * 24
					units === 'week' ? delta / 6048e5 : // 1000 * 60 * 60 * 24 * 7
					delta;
		}
		return absFloor(output);
	}

	/**
	 * @param {Number} num
	 * @returns {boolean}
	 */
	isBefore(num) {
		return this.valueOf() < exports(num).valueOf();
	}

	/**
	 * @param {Number} num
	 * @returns {boolean}
	 */
	isAfter(num) {
		return this.valueOf() > exports(num).valueOf();
	}

	/**
	 * @param {Number} num
	 * @returns {boolean}
	 */
	isSame(num) {
		return this.toString() == exports(num).toString();
	}

	/**
	 * @returns {NumDate}
	 */
	clone() {
		return exports(this);
	}

	/**
	 * time ago in a human readable format. Note that this function only calculates dates in the past, not in the future.
	 * @returns {String}
	 */
	fromNow() {
		var now = exports();
		var yearDiff = now.diff(this, 'years');
		if (yearDiff > 1) {
			return yearDiff + ' years ago';
		} else if (yearDiff == 1) {
			return '1 year ago';
		} else if (yearDiff == 0) {
			var monthDiff = now.diff(this, 'months');
			if (monthDiff > 1) {
				return monthDiff + ' months ago';
			} else if (monthDiff == 1) {
				return '1 month ago';
			} else if (monthDiff == 0) {
				var dayDiff = now.diff(this, 'days');
				if (dayDiff > 1) {
					return dayDiff + ' days ago';
				} else if (dayDiff == 1) {
					return '1 day ago';
				} else if (dayDiff == 0) {
					var hourDiff = now.diff(this, 'hours');
					if (hourDiff > 1) {
						return hourDiff + ' hours ago';
					} else if (hourDiff == 1) {
						return '1 hour ago';
					} else if (hourDiff == 0) {
						var minuteDiff = now.diff(this, 'minutes');
						if (minuteDiff > 20) {
							return minuteDiff + ' minutes ago';
						} else if (minuteDiff > 1) {
							return 'a few minutes ago';
						} else if (minuteDiff == 0) {
							return 'a few seconds ago';
						}
					}
				}
			}
		}
		return '';
	}
}

/**
 * @param {Date} date
 * @param {boolean} withTime
 * @returns {NumDate}
 */
export function fromDate(date, withTime) {
	if (!date) {
		date = new Date();
	}
	var str = date.getFullYear() + zeroPad(date.getMonth() + 1) + zeroPad(date.getDate())
			+ (withTime ? zeroPad(date.getHours()) + zeroPad(date.getMinutes()) + zeroPad(date.getSeconds()) : '000000');
	return new NumDate(str);
}

/**
 * @param {Number|String|Array|NumDate} num
 * @param {boolean} withTime
 * @returns {NumDate}
 */
var exports = function(num = undefined, withTime = true) {
	if (typeof num == 'undefined') {
		return fromDate(new Date(), true);
	} else if (Array.isArray(num)) {
		var date = new NumDate();
		date.year(num[0]).month(num[1]).date(num[2]);
		if (num.length > 3) {
			date.hours(num[3]);
			if (num.length > 4) {
				date.minutes(num[4]);
				if (num.length > 5) {
					date.seconds(num[5]);
				}
			}
		}
		return date;
	} else if (typeof num == 'object' && num instanceof Date) {
		return fromDate(num, withTime);
	} else if (typeof num == 'number' && String(num).length <= 13) {
		return fromDate(new Date(num), withTime);
	}
	// this handles the case when num is a NumDate. Basically a way to clone a NumDate
	return new NumDate(num);
};


export default exports;
