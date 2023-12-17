export default {
	// 获取聊天时间（相差300s内的信息不会显示时间）
	getChatTime(v1: number, v2: number) {
		if (!v1 || !v2) {
			return ''
		}
		if (v1 == 0 || v2 == 0) {
			return ''
		}
		v1 = v1.toString().length < 13 ? v1 * 1000 : v1;
		v2 = v2.toString().length < 13 ? v2 * 1000 : v2;
		if (((parseInt(v1.toString()) - parseInt(v2.toString())) / 1000) > 300) {
			return this.gettime(v1);
		}
	},
	// 人性化时间格式
	gettime(shorttime: number) {
		shorttime = shorttime.toString().length < 13 ? shorttime * 1000 : shorttime;
		let now = (new Date()).getTime();
		let cha = (now - parseInt(shorttime.toString())) / 1000;

		if (cha < 43200) {
			// 当天
			return this.dateFormat(new Date(shorttime), "{A} {t}:{ii}");
		} else if (cha < 518400) {
			// 隔天 显示日期+时间
			return this.dateFormat(new Date(shorttime), "{Mon}月{DD}日 {A} {t}:{ii}");
		} else {
			// 隔年 显示完整日期+时间
			return this.dateFormat(new Date(shorttime), "{Y}-{MM}-{DD} {A} {t}:{ii}");
		}
	},

	parseNumber(num: number) {
		return num < 10 ? "0" + num : num;
	},

	dateFormat(date: Date, formatStr: string) {
		const dateObj: any = {},
			rStr = /\{([^}]+)\}/,
			mons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

		dateObj["Y"] = date.getFullYear();
		dateObj["M"] = date.getMonth() + 1;
		dateObj["MM"] = this.parseNumber(dateObj["M"]);
		dateObj["Mon"] = mons[dateObj['M'] - 1];
		dateObj["D"] = date.getDate();
		dateObj["DD"] = this.parseNumber(dateObj["D"]);
		dateObj["h"] = date.getHours();
		dateObj["hh"] = this.parseNumber(dateObj["h"]);
		dateObj["t"] = dateObj["h"] > 12 ? dateObj["h"] - 12 : dateObj["h"];
		dateObj["tt"] = this.parseNumber(dateObj["t"]);
		dateObj["A"] = dateObj["h"] > 12 ? '下午' : '上午';
		dateObj["i"] = date.getMinutes();
		dateObj["ii"] = this.parseNumber(dateObj["i"]);
		dateObj["s"] = date.getSeconds();
		dateObj["ss"] = this.parseNumber(dateObj["s"]);

		while (rStr.test(formatStr)) {
			formatStr = formatStr.replace(rStr, dateObj[RegExp.$1]);
		}
		return formatStr;
	},
	parseTime(seconds: number) {
		let hour = Math.floor(seconds / 3600);
		let minute = Math.floor((seconds - hour * 3600) / 60);
		let second = seconds - hour * 3600 - minute * 60;
		if (hour > 0) {
			return hour + "小时";
		} else if(minute > 0) {
			return minute + "分钟";
		} else if(second > 0) {
			return second + "秒";
		}
	}
}
