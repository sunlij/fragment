function getMonthNum(year, month) {
	switch (month) {
		case 2:
			return (new Date(`${year}/3`) - new Date(`${year}/2`))/(24*60*60*1000)
		case 1:
		case 3:
		case 5:
		case 7:
		case 8:
		case 10:
		case 12:
			return 31
		default:
			return 30
	}
}
function getCalendar ({
	weekStart = 1,
	year = new Date().getFullYear(),
	month = new Date().getMonth() + 1
} = {}) {

	if (typeof weekStart !== 'number' || typeof year !== 'number' || typeof month !== 'number') {
		throw new TypeError('入参value值必须为数字')
		return
	}
	if (weekStart < 1 || weekStart > 7 || month < 1 || month > 12 || year < 1970) {
		throw new RangeError('入参范围：1 =< weekStart =< 7, 1 =< month =< 12, year >= 1970')
		return
	}

	let dayNum = getMonthNum(year, month) // 月份天数
	let weekDay = new Date(`${year}/${month}/1`).getDay() // 月初星期
	let calendarArr = [] // 日历 月数据

	// 月数据中的上一月数据
	let diffBefor = (weekDay - weekStart + 7)%7
	if (diffBefor) {
		let preMonth = {} // 上一月
		if (month === 1) {
			preMonth.year = year - 1,
			preMonth.month = 12
		} else {
			preMonth.year = year,
			preMonth.month = month - 1
		}
		preMonth.day = getMonthNum(preMonth.year, preMonth.month)

		for (var k = 0; k < diffBefor; k++) {
			calendarArr.push({
				weekDay: (weekStart + k)%7 || 7,
				year: preMonth.year,
				month: preMonth.month,
				day: preMonth.day - diffBefor + k + 1
			})
		}
	}

	// 本月数据
	for (var i = 0; i < dayNum; i++) {
		calendarArr.push({
			weekDay: (weekDay + i)%7 || 7,
			year: year,
			month: month,
			day: i + 1
		})
	}

	// 月数据中的下一月数据
	let lastDay =  calendarArr[calendarArr.length - 1].weekDay
	let diffAfter = (weekStart - 1 + 7 - lastDay)%7
	if (diffAfter) {
		let nextMonth = {} // 下一月
		if (month === 12) {
			nextMonth.year = year + 1,
			nextMonth.month = 1
		} else {
			nextMonth.year = year,
			nextMonth.month = month + 1
		}
		nextMonth.day = 1

		for (var j = 0; j < diffAfter; j++) {
			calendarArr.push({
				weekDay: (lastDay + 1 + j)%7 || 7,
				year: nextMonth.year,
				month: nextMonth.month,
				day: nextMonth.day + j
			})
		}
	}
	// console.log(calendarArr)
	return calendarArr
}
