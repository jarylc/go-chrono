var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
(function (f) { if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
}
else if (typeof define === "function" && define.amd) {
    define([], f);
}
else {
    var g;
    if (typeof window !== "undefined") {
        g = window;
    }
    else if (typeof global !== "undefined") {
        g = global;
    }
    else if (typeof self !== "undefined") {
        g = self;
    }
    else {
        g = this;
    }
    g.chrono = f();
} })(function () {
    var define, module, exports;
    return (function () { function r(e, n, t) { function o(i, f) { if (!n[i]) {
        if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c)
                return c(i, !0);
            if (u)
                return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
        }
        var p = n[i] = { exports: {} };
        e[i][0].call(p.exports, function (r) { var n = e[i][1][r]; return o(n || r); }, p, p.exports, r, e, n, t);
    } return n[i].exports; } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)
        o(t[i]); return o; } return r; })()({ 1: [function (require, module, exports) {
                var chrono = require('chrono-node');
                function parseDate(expression, date) {
                    return chrono.parseDate(expression, date ? new Date(date) : new Date());
                }
                module.exports = parseDate;
            }, { "chrono-node": 21 }], 2: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.mergeDateTimeComponent = exports.mergeDateTimeResult = void 0;
                var types_1 = require("../types");
                var dayjs_1 = require("../utils/dayjs");
                function mergeDateTimeResult(dateResult, timeResult) {
                    var result = dateResult.clone();
                    var beginDate = dateResult.start;
                    var beginTime = timeResult.start;
                    result.start = mergeDateTimeComponent(beginDate, beginTime);
                    if (dateResult.end != null || timeResult.end != null) {
                        var endDate = dateResult.end == null ? dateResult.start : dateResult.end;
                        var endTime = timeResult.end == null ? timeResult.start : timeResult.end;
                        var endDateTime = mergeDateTimeComponent(endDate, endTime);
                        if (dateResult.end == null && endDateTime.date().getTime() < result.start.date().getTime()) {
                            var nextDayJs = endDateTime.dayjs().add(1, "day");
                            if (endDateTime.isCertain("day")) {
                                dayjs_1.assignSimilarDate(endDateTime, nextDayJs);
                            }
                            else {
                                dayjs_1.implySimilarDate(endDateTime, nextDayJs);
                            }
                        }
                        result.end = endDateTime;
                    }
                    return result;
                }
                exports.mergeDateTimeResult = mergeDateTimeResult;
                function mergeDateTimeComponent(dateComponent, timeComponent) {
                    var dateTimeComponent = dateComponent.clone();
                    if (timeComponent.isCertain("hour")) {
                        dateTimeComponent.assign("hour", timeComponent.get("hour"));
                        dateTimeComponent.assign("minute", timeComponent.get("minute"));
                        if (timeComponent.isCertain("second")) {
                            dateTimeComponent.assign("second", timeComponent.get("second"));
                            if (timeComponent.isCertain("millisecond")) {
                                dateTimeComponent.assign("millisecond", timeComponent.get("millisecond"));
                            }
                            else {
                                dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
                            }
                        }
                        else {
                            dateTimeComponent.imply("second", timeComponent.get("second"));
                            dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
                        }
                    }
                    else {
                        dateTimeComponent.imply("hour", timeComponent.get("hour"));
                        dateTimeComponent.imply("minute", timeComponent.get("minute"));
                        dateTimeComponent.imply("second", timeComponent.get("second"));
                        dateTimeComponent.imply("millisecond", timeComponent.get("millisecond"));
                    }
                    if (timeComponent.isCertain("timezoneOffset")) {
                        dateTimeComponent.assign("timezoneOffset", timeComponent.get("timezoneOffset"));
                    }
                    if (timeComponent.isCertain("meridiem")) {
                        dateTimeComponent.assign("meridiem", timeComponent.get("meridiem"));
                    }
                    else if (timeComponent.get("meridiem") != null && dateTimeComponent.get("meridiem") == null) {
                        dateTimeComponent.imply("meridiem", timeComponent.get("meridiem"));
                    }
                    if (dateTimeComponent.get("meridiem") == types_1.Meridiem.PM && dateTimeComponent.get("hour") < 12) {
                        if (timeComponent.isCertain("hour")) {
                            dateTimeComponent.assign("hour", dateTimeComponent.get("hour") + 12);
                        }
                        else {
                            dateTimeComponent.imply("hour", dateTimeComponent.get("hour") + 12);
                        }
                    }
                    dateTimeComponent.addTags(dateComponent.tags());
                    dateTimeComponent.addTags(timeComponent.tags());
                    return dateTimeComponent;
                }
                exports.mergeDateTimeComponent = mergeDateTimeComponent;
            }, { "../types": 165, "../utils/dayjs": 166 }], 3: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.findYearClosestToRef = exports.findMostLikelyADYear = void 0;
                var dayjs_1 = __importDefault(require("dayjs"));
                function findMostLikelyADYear(yearNumber) {
                    if (yearNumber < 100) {
                        if (yearNumber > 50) {
                            yearNumber = yearNumber + 1900;
                        }
                        else {
                            yearNumber = yearNumber + 2000;
                        }
                    }
                    return yearNumber;
                }
                exports.findMostLikelyADYear = findMostLikelyADYear;
                function findYearClosestToRef(refDate, day, month) {
                    var refMoment = dayjs_1.default(refDate);
                    var dateMoment = refMoment;
                    dateMoment = dateMoment.month(month - 1);
                    dateMoment = dateMoment.date(day);
                    dateMoment = dateMoment.year(refMoment.year());
                    var nextYear = dateMoment.add(1, "y");
                    var lastYear = dateMoment.add(-1, "y");
                    if (Math.abs(nextYear.diff(refMoment)) < Math.abs(dateMoment.diff(refMoment))) {
                        dateMoment = nextYear;
                    }
                    else if (Math.abs(lastYear.diff(refMoment)) < Math.abs(dateMoment.diff(refMoment))) {
                        dateMoment = lastYear;
                    }
                    return dateMoment.year();
                }
                exports.findYearClosestToRef = findYearClosestToRef;
            }, { "dayjs": 169 }], 4: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.ParsingContext = exports.Chrono = void 0;
                var results_1 = require("./results");
                var configuration_1 = __importDefault(require("./locales/en/configuration"));
                var Chrono = /** @class */ (function () {
                    function Chrono(configuration) {
                        this.defaultConfig = new configuration_1.default();
                        configuration = configuration || this.defaultConfig.createCasualConfiguration();
                        this.parsers = __spreadArray([], configuration.parsers, true);
                        this.refiners = __spreadArray([], configuration.refiners, true);
                    }
                    Chrono.prototype.clone = function () {
                        return new Chrono({
                            parsers: __spreadArray([], this.parsers, true),
                            refiners: __spreadArray([], this.refiners, true),
                        });
                    };
                    Chrono.prototype.parseDate = function (text, referenceDate, option) {
                        var results = this.parse(text, referenceDate, option);
                        return results.length > 0 ? results[0].start.date() : null;
                    };
                    Chrono.prototype.parse = function (text, referenceDate, option) {
                        var context = new ParsingContext(text, referenceDate, option);
                        var results = [];
                        this.parsers.forEach(function (parser) {
                            var parsedResults = Chrono.executeParser(context, parser);
                            results = results.concat(parsedResults);
                        });
                        results.sort(function (a, b) {
                            return a.index - b.index;
                        });
                        this.refiners.forEach(function (refiner) {
                            results = refiner.refine(context, results);
                        });
                        return results;
                    };
                    Chrono.executeParser = function (context, parser) {
                        var results = [];
                        var pattern = parser.pattern(context);
                        var originalText = context.text;
                        var remainingText = context.text;
                        var match = pattern.exec(remainingText);
                        var _loop_1 = function () {
                            var index = match.index + originalText.length - remainingText.length;
                            match.index = index;
                            var result = parser.extract(context, match);
                            if (!result) {
                                remainingText = originalText.substring(match.index + 1);
                                match = pattern.exec(remainingText);
                                return "continue";
                            }
                            var parsedResult = null;
                            if (result instanceof results_1.ParsingResult) {
                                parsedResult = result;
                            }
                            else if (result instanceof results_1.ParsingComponents) {
                                parsedResult = context.createParsingResult(match.index, match[0]);
                                parsedResult.start = result;
                            }
                            else {
                                parsedResult = context.createParsingResult(match.index, match[0], result);
                            }
                            var parsedIndex = parsedResult.index;
                            var parsedText = parsedResult.text;
                            context.debug(function () { return console.log("".concat(parser.constructor.name, " extracted (at index=").concat(parsedIndex, ") '").concat(parsedText, "'")); });
                            results.push(parsedResult);
                            remainingText = originalText.substring(parsedIndex + parsedText.length);
                            match = pattern.exec(remainingText);
                        };
                        while (match) {
                            _loop_1();
                        }
                        return results;
                    };
                    return Chrono;
                }());
                exports.Chrono = Chrono;
                var ParsingContext = /** @class */ (function () {
                    function ParsingContext(text, refDate, option) {
                        this.text = text;
                        this.reference = new results_1.ReferenceWithTimezone(refDate);
                        this.option = option !== null && option !== void 0 ? option : {};
                        this.refDate = this.reference.instant;
                    }
                    ParsingContext.prototype.createParsingComponents = function (components) {
                        if (components instanceof results_1.ParsingComponents) {
                            return components;
                        }
                        return new results_1.ParsingComponents(this.reference, components);
                    };
                    ParsingContext.prototype.createParsingResult = function (index, textOrEndIndex, startComponents, endComponents) {
                        var text = typeof textOrEndIndex === "string" ? textOrEndIndex : this.text.substring(index, textOrEndIndex);
                        var start = startComponents ? this.createParsingComponents(startComponents) : null;
                        var end = endComponents ? this.createParsingComponents(endComponents) : null;
                        return new results_1.ParsingResult(this.reference, index, text, start, end);
                    };
                    ParsingContext.prototype.debug = function (block) {
                        if (this.option.debug) {
                            if (this.option.debug instanceof Function) {
                                this.option.debug(block);
                            }
                            else {
                                var handler = this.option.debug;
                                handler.debug(block);
                            }
                        }
                    };
                    return ParsingContext;
                }());
                exports.ParsingContext = ParsingContext;
            }, { "./locales/en/configuration": 34, "./results": 163 }], 5: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.MergingRefiner = exports.Filter = void 0;
                var Filter = /** @class */ (function () {
                    function Filter() {
                    }
                    Filter.prototype.refine = function (context, results) {
                        var _this = this;
                        return results.filter(function (r) { return _this.isValid(context, r); });
                    };
                    return Filter;
                }());
                exports.Filter = Filter;
                var MergingRefiner = /** @class */ (function () {
                    function MergingRefiner() {
                    }
                    MergingRefiner.prototype.refine = function (context, results) {
                        var _this = this;
                        if (results.length < 2) {
                            return results;
                        }
                        var mergedResults = [];
                        var curResult = results[0];
                        var nextResult = null;
                        var _loop_2 = function (i) {
                            nextResult = results[i];
                            var textBetween = context.text.substring(curResult.index + curResult.text.length, nextResult.index);
                            if (!this_1.shouldMergeResults(textBetween, curResult, nextResult, context)) {
                                mergedResults.push(curResult);
                                curResult = nextResult;
                            }
                            else {
                                var left_1 = curResult;
                                var right_1 = nextResult;
                                var mergedResult_1 = this_1.mergeResults(textBetween, left_1, right_1, context);
                                context.debug(function () {
                                    console.log("".concat(_this.constructor.name, " merged ").concat(left_1, " and ").concat(right_1, " into ").concat(mergedResult_1));
                                });
                                curResult = mergedResult_1;
                            }
                        };
                        var this_1 = this;
                        for (var i = 1; i < results.length; i++) {
                            _loop_2(i);
                        }
                        if (curResult != null) {
                            mergedResults.push(curResult);
                        }
                        return mergedResults;
                    };
                    return MergingRefiner;
                }());
                exports.MergingRefiner = MergingRefiner;
            }, {}], 6: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.getBackwardDaysToWeekday = exports.getDaysForwardToWeekday = exports.getDaysToWeekdayClosest = exports.getDaysToWeekday = exports.createParsingComponentsAtWeekday = void 0;
                var types_1 = require("../../types");
                var results_1 = require("../../results");
                var timeunits_1 = require("../../utils/timeunits");
                function createParsingComponentsAtWeekday(reference, weekday, modifier) {
                    var refDate = reference.getDateWithAdjustedTimezone();
                    var daysToWeekday = getDaysToWeekday(refDate, weekday, modifier);
                    var components = new results_1.ParsingComponents(reference);
                    components = timeunits_1.addImpliedTimeUnits(components, { "day": daysToWeekday });
                    components.assign("weekday", weekday);
                    return components;
                }
                exports.createParsingComponentsAtWeekday = createParsingComponentsAtWeekday;
                function getDaysToWeekday(refDate, weekday, modifier) {
                    var refWeekday = refDate.getDay();
                    switch (modifier) {
                        case "this":
                            return getDaysForwardToWeekday(refDate, weekday);
                        case "last":
                            return getBackwardDaysToWeekday(refDate, weekday);
                        case "next":
                            if (refWeekday == types_1.Weekday.SUNDAY) {
                                return weekday == types_1.Weekday.SUNDAY ? 7 : weekday;
                            }
                            if (refWeekday == types_1.Weekday.SATURDAY) {
                                if (weekday == types_1.Weekday.SATURDAY)
                                    return 7;
                                if (weekday == types_1.Weekday.SUNDAY)
                                    return 8;
                                return 1 + weekday;
                            }
                            if (weekday < refWeekday && weekday != types_1.Weekday.SUNDAY) {
                                return getDaysForwardToWeekday(refDate, weekday);
                            }
                            else {
                                return getDaysForwardToWeekday(refDate, weekday) + 7;
                            }
                    }
                    return getDaysToWeekdayClosest(refDate, weekday);
                }
                exports.getDaysToWeekday = getDaysToWeekday;
                function getDaysToWeekdayClosest(refDate, weekday) {
                    var backward = getBackwardDaysToWeekday(refDate, weekday);
                    var forward = getDaysForwardToWeekday(refDate, weekday);
                    return forward < -backward ? forward : backward;
                }
                exports.getDaysToWeekdayClosest = getDaysToWeekdayClosest;
                function getDaysForwardToWeekday(refDate, weekday) {
                    var refWeekday = refDate.getDay();
                    var forwardCount = weekday - refWeekday;
                    if (forwardCount < 0) {
                        forwardCount += 7;
                    }
                    return forwardCount;
                }
                exports.getDaysForwardToWeekday = getDaysForwardToWeekday;
                function getBackwardDaysToWeekday(refDate, weekday) {
                    var refWeekday = refDate.getDay();
                    var backwardCount = weekday - refWeekday;
                    if (backwardCount >= 0) {
                        backwardCount -= 7;
                    }
                    return backwardCount;
                }
                exports.getBackwardDaysToWeekday = getBackwardDaysToWeekday;
            }, { "../../results": 163, "../../types": 165, "../../utils/timeunits": 168 }], 7: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.noon = exports.afternoon = exports.morning = exports.midnight = exports.yesterdayEvening = exports.evening = exports.lastNight = exports.tonight = exports.theDayAfter = exports.tomorrow = exports.theDayBefore = exports.yesterday = exports.today = exports.now = void 0;
                var results_1 = require("../results");
                var dayjs_1 = __importDefault(require("dayjs"));
                var dayjs_2 = require("../utils/dayjs");
                var types_1 = require("../types");
                function now(reference) {
                    var targetDate = dayjs_1.default(reference.instant);
                    var component = new results_1.ParsingComponents(reference, {});
                    dayjs_2.assignSimilarDate(component, targetDate);
                    dayjs_2.assignSimilarTime(component, targetDate);
                    if (reference.timezoneOffset !== null) {
                        component.assign("timezoneOffset", targetDate.utcOffset());
                    }
                    component.addTag("casualReference/now");
                    return component;
                }
                exports.now = now;
                function today(reference) {
                    var targetDate = dayjs_1.default(reference.instant);
                    var component = new results_1.ParsingComponents(reference, {});
                    dayjs_2.assignSimilarDate(component, targetDate);
                    dayjs_2.implySimilarTime(component, targetDate);
                    component.addTag("casualReference/today");
                    return component;
                }
                exports.today = today;
                function yesterday(reference) {
                    return theDayBefore(reference, 1).addTag("casualReference/yesterday");
                }
                exports.yesterday = yesterday;
                function theDayBefore(reference, numDay) {
                    return theDayAfter(reference, -numDay);
                }
                exports.theDayBefore = theDayBefore;
                function tomorrow(reference) {
                    return theDayAfter(reference, 1).addTag("casualReference/tomorrow");
                }
                exports.tomorrow = tomorrow;
                function theDayAfter(reference, nDays) {
                    var targetDate = dayjs_1.default(reference.instant);
                    var component = new results_1.ParsingComponents(reference, {});
                    targetDate = targetDate.add(nDays, "day");
                    dayjs_2.assignSimilarDate(component, targetDate);
                    dayjs_2.implySimilarTime(component, targetDate);
                    return component;
                }
                exports.theDayAfter = theDayAfter;
                function tonight(reference, implyHour) {
                    if (implyHour === void 0) { implyHour = 22; }
                    var targetDate = dayjs_1.default(reference.instant);
                    var component = new results_1.ParsingComponents(reference, {});
                    dayjs_2.assignSimilarDate(component, targetDate);
                    component.imply("hour", implyHour);
                    component.imply("meridiem", types_1.Meridiem.PM);
                    component.addTag("casualReference/tonight");
                    return component;
                }
                exports.tonight = tonight;
                function lastNight(reference, implyHour) {
                    if (implyHour === void 0) { implyHour = 0; }
                    var targetDate = dayjs_1.default(reference.instant);
                    var component = new results_1.ParsingComponents(reference, {});
                    if (targetDate.hour() < 6) {
                        targetDate = targetDate.add(-1, "day");
                    }
                    dayjs_2.assignSimilarDate(component, targetDate);
                    component.imply("hour", implyHour);
                    return component;
                }
                exports.lastNight = lastNight;
                function evening(reference, implyHour) {
                    if (implyHour === void 0) { implyHour = 20; }
                    var component = new results_1.ParsingComponents(reference, {});
                    component.imply("meridiem", types_1.Meridiem.PM);
                    component.imply("hour", implyHour);
                    component.addTag("casualReference/evening");
                    return component;
                }
                exports.evening = evening;
                function yesterdayEvening(reference, implyHour) {
                    if (implyHour === void 0) { implyHour = 20; }
                    var targetDate = dayjs_1.default(reference.instant);
                    var component = new results_1.ParsingComponents(reference, {});
                    targetDate = targetDate.add(-1, "day");
                    dayjs_2.assignSimilarDate(component, targetDate);
                    component.imply("hour", implyHour);
                    component.imply("meridiem", types_1.Meridiem.PM);
                    component.addTag("casualReference/yesterday");
                    component.addTag("casualReference/evening");
                    return component;
                }
                exports.yesterdayEvening = yesterdayEvening;
                function midnight(reference) {
                    var component = new results_1.ParsingComponents(reference, {});
                    var targetDate = dayjs_1.default(reference.instant);
                    if (targetDate.hour() > 2) {
                        dayjs_2.implyTheNextDay(component, targetDate);
                    }
                    component.assign("hour", 0);
                    component.imply("minute", 0);
                    component.imply("second", 0);
                    component.imply("millisecond", 0);
                    component.addTag("casualReference/midnight");
                    return component;
                }
                exports.midnight = midnight;
                function morning(reference, implyHour) {
                    if (implyHour === void 0) { implyHour = 6; }
                    var component = new results_1.ParsingComponents(reference, {});
                    component.imply("meridiem", types_1.Meridiem.AM);
                    component.imply("hour", implyHour);
                    component.imply("minute", 0);
                    component.imply("second", 0);
                    component.imply("millisecond", 0);
                    component.addTag("casualReference/morning");
                    return component;
                }
                exports.morning = morning;
                function afternoon(reference, implyHour) {
                    if (implyHour === void 0) { implyHour = 15; }
                    var component = new results_1.ParsingComponents(reference, {});
                    component.imply("meridiem", types_1.Meridiem.PM);
                    component.imply("hour", implyHour);
                    component.imply("minute", 0);
                    component.imply("second", 0);
                    component.imply("millisecond", 0);
                    component.addTag("casualReference/afternoon");
                    return component;
                }
                exports.afternoon = afternoon;
                function noon(reference) {
                    var component = new results_1.ParsingComponents(reference, {});
                    component.imply("meridiem", types_1.Meridiem.AM);
                    component.imply("hour", 12);
                    component.imply("minute", 0);
                    component.imply("second", 0);
                    component.imply("millisecond", 0);
                    component.addTag("casualReference/noon");
                    return component;
                }
                exports.noon = noon;
            }, { "../results": 163, "../types": 165, "../utils/dayjs": 166, "dayjs": 169 }], 8: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.AbstractParserWithWordBoundaryChecking = void 0;
                var AbstractParserWithWordBoundaryChecking = /** @class */ (function () {
                    function AbstractParserWithWordBoundaryChecking() {
                        this.cachedInnerPattern = null;
                        this.cachedPattern = null;
                    }
                    AbstractParserWithWordBoundaryChecking.prototype.innerPatternHasChange = function (context, currentInnerPattern) {
                        return this.innerPattern(context) !== currentInnerPattern;
                    };
                    AbstractParserWithWordBoundaryChecking.prototype.patternLeftBoundary = function () {
                        return "(\\W|^)";
                    };
                    AbstractParserWithWordBoundaryChecking.prototype.pattern = function (context) {
                        if (this.cachedInnerPattern) {
                            if (!this.innerPatternHasChange(context, this.cachedInnerPattern)) {
                                return this.cachedPattern;
                            }
                        }
                        this.cachedInnerPattern = this.innerPattern(context);
                        this.cachedPattern = new RegExp("".concat(this.patternLeftBoundary()).concat(this.cachedInnerPattern.source), this.cachedInnerPattern.flags);
                        return this.cachedPattern;
                    };
                    AbstractParserWithWordBoundaryChecking.prototype.extract = function (context, match) {
                        var _a;
                        var header = (_a = match[1]) !== null && _a !== void 0 ? _a : "";
                        match.index = match.index + header.length;
                        match[0] = match[0].substring(header.length);
                        for (var i = 2; i < match.length; i++) {
                            match[i - 1] = match[i];
                        }
                        return this.innerExtract(context, match);
                    };
                    return AbstractParserWithWordBoundaryChecking;
                }());
                exports.AbstractParserWithWordBoundaryChecking = AbstractParserWithWordBoundaryChecking;
            }, {}], 9: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.AbstractTimeExpressionParser = void 0;
                var types_1 = require("../../types");
                function primaryTimePattern(leftBoundary, primaryPrefix, primarySuffix, flags) {
                    return new RegExp("".concat(leftBoundary) +
                        "".concat(primaryPrefix) +
                        "(\\d{1,4})" +
                        "(?:" +
                        "(?:\\.|:|\uFF1A)" +
                        "(\\d{1,2})" +
                        "(?:" +
                        "(?::|\uFF1A)" +
                        "(\\d{2})" +
                        "(?:\\.(\\d{1,6}))?" +
                        ")?" +
                        ")?" +
                        "(?:\\s*(a\\.m\\.|p\\.m\\.|am?|pm?))?" +
                        "".concat(primarySuffix), flags);
                }
                function followingTimePatten(followingPhase, followingSuffix) {
                    return new RegExp("^(".concat(followingPhase, ")") +
                        "(\\d{1,4})" +
                        "(?:" +
                        "(?:\\.|\\:|\\\uFF1A)" +
                        "(\\d{1,2})" +
                        "(?:" +
                        "(?:\\.|\\:|\\\uFF1A)" +
                        "(\\d{1,2})(?:\\.(\\d{1,6}))?" +
                        ")?" +
                        ")?" +
                        "(?:\\s*(a\\.m\\.|p\\.m\\.|am?|pm?))?" +
                        "".concat(followingSuffix), "i");
                }
                var HOUR_GROUP = 2;
                var MINUTE_GROUP = 3;
                var SECOND_GROUP = 4;
                var MILLI_SECOND_GROUP = 5;
                var AM_PM_HOUR_GROUP = 6;
                var AbstractTimeExpressionParser = /** @class */ (function () {
                    function AbstractTimeExpressionParser(strictMode) {
                        if (strictMode === void 0) { strictMode = false; }
                        this.cachedPrimaryPrefix = null;
                        this.cachedPrimarySuffix = null;
                        this.cachedPrimaryTimePattern = null;
                        this.cachedFollowingPhase = null;
                        this.cachedFollowingSuffix = null;
                        this.cachedFollowingTimePatten = null;
                        this.strictMode = strictMode;
                    }
                    AbstractTimeExpressionParser.prototype.patternFlags = function () {
                        return "i";
                    };
                    AbstractTimeExpressionParser.prototype.primaryPatternLeftBoundary = function () {
                        return "(^|\\s|T|\\b)";
                    };
                    AbstractTimeExpressionParser.prototype.primarySuffix = function () {
                        return "(?!/)(?=\\W|$)";
                    };
                    AbstractTimeExpressionParser.prototype.followingSuffix = function () {
                        return "(?!/)(?=\\W|$)";
                    };
                    AbstractTimeExpressionParser.prototype.pattern = function (context) {
                        return this.getPrimaryTimePatternThroughCache();
                    };
                    AbstractTimeExpressionParser.prototype.extract = function (context, match) {
                        var startComponents = this.extractPrimaryTimeComponents(context, match);
                        if (!startComponents) {
                            if (match[0].match(/^\d{4}/)) {
                                match.index += 4;
                                return null;
                            }
                            match.index += match[0].length;
                            return null;
                        }
                        var index = match.index + match[1].length;
                        var text = match[0].substring(match[1].length);
                        var result = context.createParsingResult(index, text, startComponents);
                        match.index += match[0].length;
                        var remainingText = context.text.substring(match.index);
                        var followingPattern = this.getFollowingTimePatternThroughCache();
                        var followingMatch = followingPattern.exec(remainingText);
                        if (text.match(/^\d{3,4}/) && followingMatch) {
                            if (followingMatch[0].match(/^\s*([+-])\s*\d{2,4}$/)) {
                                return null;
                            }
                            if (followingMatch[0].match(/^\s*([+-])\s*\d{2}\W\d{2}/)) {
                                return null;
                            }
                        }
                        if (!followingMatch ||
                            followingMatch[0].match(/^\s*([+-])\s*\d{3,4}$/)) {
                            return this.checkAndReturnWithoutFollowingPattern(result);
                        }
                        result.end = this.extractFollowingTimeComponents(context, followingMatch, result);
                        if (result.end) {
                            result.text += followingMatch[0];
                        }
                        return this.checkAndReturnWithFollowingPattern(result);
                    };
                    AbstractTimeExpressionParser.prototype.extractPrimaryTimeComponents = function (context, match, strict) {
                        if (strict === void 0) { strict = false; }
                        var components = context.createParsingComponents();
                        var minute = 0;
                        var meridiem = null;
                        var hour = parseInt(match[HOUR_GROUP]);
                        if (hour > 100) {
                            if (this.strictMode || match[MINUTE_GROUP] != null) {
                                return null;
                            }
                            minute = hour % 100;
                            hour = Math.floor(hour / 100);
                        }
                        if (hour > 24) {
                            return null;
                        }
                        if (match[MINUTE_GROUP] != null) {
                            if (match[MINUTE_GROUP].length == 1 && !match[AM_PM_HOUR_GROUP]) {
                                return null;
                            }
                            minute = parseInt(match[MINUTE_GROUP]);
                        }
                        if (minute >= 60) {
                            return null;
                        }
                        if (hour > 12) {
                            meridiem = types_1.Meridiem.PM;
                        }
                        if (match[AM_PM_HOUR_GROUP] != null) {
                            if (hour > 12)
                                return null;
                            var ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
                            if (ampm == "a") {
                                meridiem = types_1.Meridiem.AM;
                                if (hour == 12) {
                                    hour = 0;
                                }
                            }
                            if (ampm == "p") {
                                meridiem = types_1.Meridiem.PM;
                                if (hour != 12) {
                                    hour += 12;
                                }
                            }
                        }
                        components.assign("hour", hour);
                        components.assign("minute", minute);
                        if (meridiem !== null) {
                            components.assign("meridiem", meridiem);
                        }
                        else {
                            if (hour < 12) {
                                components.imply("meridiem", types_1.Meridiem.AM);
                            }
                            else {
                                components.imply("meridiem", types_1.Meridiem.PM);
                            }
                        }
                        if (match[MILLI_SECOND_GROUP] != null) {
                            var millisecond = parseInt(match[MILLI_SECOND_GROUP].substring(0, 3));
                            if (millisecond >= 1000)
                                return null;
                            components.assign("millisecond", millisecond);
                        }
                        if (match[SECOND_GROUP] != null) {
                            var second = parseInt(match[SECOND_GROUP]);
                            if (second >= 60)
                                return null;
                            components.assign("second", second);
                        }
                        return components;
                    };
                    AbstractTimeExpressionParser.prototype.extractFollowingTimeComponents = function (context, match, result) {
                        var components = context.createParsingComponents();
                        if (match[MILLI_SECOND_GROUP] != null) {
                            var millisecond = parseInt(match[MILLI_SECOND_GROUP].substring(0, 3));
                            if (millisecond >= 1000)
                                return null;
                            components.assign("millisecond", millisecond);
                        }
                        if (match[SECOND_GROUP] != null) {
                            var second = parseInt(match[SECOND_GROUP]);
                            if (second >= 60)
                                return null;
                            components.assign("second", second);
                        }
                        var hour = parseInt(match[HOUR_GROUP]);
                        var minute = 0;
                        var meridiem = -1;
                        if (match[MINUTE_GROUP] != null) {
                            minute = parseInt(match[MINUTE_GROUP]);
                        }
                        else if (hour > 100) {
                            minute = hour % 100;
                            hour = Math.floor(hour / 100);
                        }
                        if (minute >= 60 || hour > 24) {
                            return null;
                        }
                        if (hour >= 12) {
                            meridiem = types_1.Meridiem.PM;
                        }
                        if (match[AM_PM_HOUR_GROUP] != null) {
                            if (hour > 12) {
                                return null;
                            }
                            var ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
                            if (ampm == "a") {
                                meridiem = types_1.Meridiem.AM;
                                if (hour == 12) {
                                    hour = 0;
                                    if (!components.isCertain("day")) {
                                        components.imply("day", components.get("day") + 1);
                                    }
                                }
                            }
                            if (ampm == "p") {
                                meridiem = types_1.Meridiem.PM;
                                if (hour != 12)
                                    hour += 12;
                            }
                            if (!result.start.isCertain("meridiem")) {
                                if (meridiem == types_1.Meridiem.AM) {
                                    result.start.imply("meridiem", types_1.Meridiem.AM);
                                    if (result.start.get("hour") == 12) {
                                        result.start.assign("hour", 0);
                                    }
                                }
                                else {
                                    result.start.imply("meridiem", types_1.Meridiem.PM);
                                    if (result.start.get("hour") != 12) {
                                        result.start.assign("hour", result.start.get("hour") + 12);
                                    }
                                }
                            }
                        }
                        components.assign("hour", hour);
                        components.assign("minute", minute);
                        if (meridiem >= 0) {
                            components.assign("meridiem", meridiem);
                        }
                        else {
                            var startAtPM = result.start.isCertain("meridiem") && result.start.get("hour") > 12;
                            if (startAtPM) {
                                if (result.start.get("hour") - 12 > hour) {
                                    components.imply("meridiem", types_1.Meridiem.AM);
                                }
                                else if (hour <= 12) {
                                    components.assign("hour", hour + 12);
                                    components.assign("meridiem", types_1.Meridiem.PM);
                                }
                            }
                            else if (hour > 12) {
                                components.imply("meridiem", types_1.Meridiem.PM);
                            }
                            else if (hour <= 12) {
                                components.imply("meridiem", types_1.Meridiem.AM);
                            }
                        }
                        if (components.date().getTime() < result.start.date().getTime()) {
                            components.imply("day", components.get("day") + 1);
                        }
                        return components;
                    };
                    AbstractTimeExpressionParser.prototype.checkAndReturnWithoutFollowingPattern = function (result) {
                        if (result.text.match(/^\d$/)) {
                            return null;
                        }
                        if (result.text.match(/^\d\d\d+$/)) {
                            return null;
                        }
                        if (result.text.match(/\d[apAP]$/)) {
                            return null;
                        }
                        var endingWithNumbers = result.text.match(/[^\d:.](\d[\d.]+)$/);
                        if (endingWithNumbers) {
                            var endingNumbers = endingWithNumbers[1];
                            if (this.strictMode) {
                                return null;
                            }
                            if (endingNumbers.includes(".") && !endingNumbers.match(/\d(\.\d{2})+$/)) {
                                return null;
                            }
                            var endingNumberVal = parseInt(endingNumbers);
                            if (endingNumberVal > 24) {
                                return null;
                            }
                        }
                        return result;
                    };
                    AbstractTimeExpressionParser.prototype.checkAndReturnWithFollowingPattern = function (result) {
                        if (result.text.match(/^\d+-\d+$/)) {
                            return null;
                        }
                        var endingWithNumbers = result.text.match(/[^\d:.](\d[\d.]+)\s*-\s*(\d[\d.]+)$/);
                        if (endingWithNumbers) {
                            if (this.strictMode) {
                                return null;
                            }
                            var startingNumbers = endingWithNumbers[1];
                            var endingNumbers = endingWithNumbers[2];
                            if (endingNumbers.includes(".") && !endingNumbers.match(/\d(\.\d{2})+$/)) {
                                return null;
                            }
                            var endingNumberVal = parseInt(endingNumbers);
                            var startingNumberVal = parseInt(startingNumbers);
                            if (endingNumberVal > 24 || startingNumberVal > 24) {
                                return null;
                            }
                        }
                        return result;
                    };
                    AbstractTimeExpressionParser.prototype.getPrimaryTimePatternThroughCache = function () {
                        var primaryPrefix = this.primaryPrefix();
                        var primarySuffix = this.primarySuffix();
                        if (this.cachedPrimaryPrefix === primaryPrefix && this.cachedPrimarySuffix === primarySuffix) {
                            return this.cachedPrimaryTimePattern;
                        }
                        this.cachedPrimaryTimePattern = primaryTimePattern(this.primaryPatternLeftBoundary(), primaryPrefix, primarySuffix, this.patternFlags());
                        this.cachedPrimaryPrefix = primaryPrefix;
                        this.cachedPrimarySuffix = primarySuffix;
                        return this.cachedPrimaryTimePattern;
                    };
                    AbstractTimeExpressionParser.prototype.getFollowingTimePatternThroughCache = function () {
                        var followingPhase = this.followingPhase();
                        var followingSuffix = this.followingSuffix();
                        if (this.cachedFollowingPhase === followingPhase && this.cachedFollowingSuffix === followingSuffix) {
                            return this.cachedFollowingTimePatten;
                        }
                        this.cachedFollowingTimePatten = followingTimePatten(followingPhase, followingSuffix);
                        this.cachedFollowingPhase = followingPhase;
                        this.cachedFollowingSuffix = followingSuffix;
                        return this.cachedFollowingTimePatten;
                    };
                    return AbstractTimeExpressionParser;
                }());
                exports.AbstractTimeExpressionParser = AbstractTimeExpressionParser;
            }, { "../../types": 165 }], 10: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractParserWithWordBoundary_1 = require("./AbstractParserWithWordBoundary");
                var PATTERN = new RegExp("([0-9]{4})\\-([0-9]{1,2})\\-([0-9]{1,2})" +
                    "(?:T" +
                    "([0-9]{1,2}):([0-9]{1,2})" +
                    "(?:" +
                    ":([0-9]{1,2})(?:\\.(\\d{1,4}))?" +
                    ")?" +
                    "(" +
                    "Z|([+-]\\d{2}):?(\\d{2})?" +
                    ")?" +
                    ")?" +
                    "(?=\\W|$)", "i");
                var YEAR_NUMBER_GROUP = 1;
                var MONTH_NUMBER_GROUP = 2;
                var DATE_NUMBER_GROUP = 3;
                var HOUR_NUMBER_GROUP = 4;
                var MINUTE_NUMBER_GROUP = 5;
                var SECOND_NUMBER_GROUP = 6;
                var MILLISECOND_NUMBER_GROUP = 7;
                var TZD_GROUP = 8;
                var TZD_HOUR_OFFSET_GROUP = 9;
                var TZD_MINUTE_OFFSET_GROUP = 10;
                var ISOFormatParser = /** @class */ (function (_super) {
                    __extends(ISOFormatParser, _super);
                    function ISOFormatParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ISOFormatParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    ISOFormatParser.prototype.innerExtract = function (context, match) {
                        var components = context.createParsingComponents({
                            "year": parseInt(match[YEAR_NUMBER_GROUP]),
                            "month": parseInt(match[MONTH_NUMBER_GROUP]),
                            "day": parseInt(match[DATE_NUMBER_GROUP]),
                        });
                        if (match[HOUR_NUMBER_GROUP] != null) {
                            components.assign("hour", parseInt(match[HOUR_NUMBER_GROUP]));
                            components.assign("minute", parseInt(match[MINUTE_NUMBER_GROUP]));
                            if (match[SECOND_NUMBER_GROUP] != null) {
                                components.assign("second", parseInt(match[SECOND_NUMBER_GROUP]));
                            }
                            if (match[MILLISECOND_NUMBER_GROUP] != null) {
                                components.assign("millisecond", parseInt(match[MILLISECOND_NUMBER_GROUP]));
                            }
                            if (match[TZD_GROUP] != null) {
                                var offset = 0;
                                if (match[TZD_HOUR_OFFSET_GROUP]) {
                                    var hourOffset = parseInt(match[TZD_HOUR_OFFSET_GROUP]);
                                    var minuteOffset = 0;
                                    if (match[TZD_MINUTE_OFFSET_GROUP] != null) {
                                        minuteOffset = parseInt(match[TZD_MINUTE_OFFSET_GROUP]);
                                    }
                                    offset = hourOffset * 60;
                                    if (offset < 0) {
                                        offset -= minuteOffset;
                                    }
                                    else {
                                        offset += minuteOffset;
                                    }
                                }
                                components.assign("timezoneOffset", offset);
                            }
                        }
                        return components.addTag("parser/ISOFormatParser");
                    };
                    return ISOFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ISOFormatParser;
            }, { "./AbstractParserWithWordBoundary": 8 }], 11: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var years_1 = require("../../calculation/years");
                var PATTERN = new RegExp("([^\\d]|^)" +
                    "([0-3]{0,1}[0-9]{1})[\\/\\.\\-]([0-3]{0,1}[0-9]{1})" +
                    "(?:[\\/\\.\\-]([0-9]{4}|[0-9]{2}))?" +
                    "(\\W|$)", "i");
                var OPENING_GROUP = 1;
                var ENDING_GROUP = 5;
                var FIRST_NUMBERS_GROUP = 2;
                var SECOND_NUMBERS_GROUP = 3;
                var YEAR_GROUP = 4;
                var SlashDateFormatParser = /** @class */ (function () {
                    function SlashDateFormatParser(littleEndian) {
                        this.groupNumberMonth = littleEndian ? SECOND_NUMBERS_GROUP : FIRST_NUMBERS_GROUP;
                        this.groupNumberDay = littleEndian ? FIRST_NUMBERS_GROUP : SECOND_NUMBERS_GROUP;
                    }
                    SlashDateFormatParser.prototype.pattern = function () {
                        return PATTERN;
                    };
                    SlashDateFormatParser.prototype.extract = function (context, match) {
                        var _c;
                        var index = match.index + match[OPENING_GROUP].length;
                        var indexEnd = match.index + match[0].length - match[ENDING_GROUP].length;
                        if (index > 0) {
                            var textBefore = context.text.substring(0, index);
                            if (textBefore.match("\\d/?$")) {
                                return;
                            }
                        }
                        if (indexEnd < context.text.length) {
                            var textAfter = context.text.substring(indexEnd);
                            if (textAfter.match("^/?\\d")) {
                                return;
                            }
                        }
                        var text = context.text.substring(index, indexEnd);
                        if (text.match(/^\d\.\d$/) || text.match(/^\d\.\d{1,2}\.\d{1,2}\s*$/)) {
                            return;
                        }
                        if (!match[YEAR_GROUP] && text.indexOf("/") < 0) {
                            return;
                        }
                        var result = context.createParsingResult(index, text);
                        var month = parseInt(match[this.groupNumberMonth]);
                        var day = parseInt(match[this.groupNumberDay]);
                        if (month < 1 || month > 12) {
                            if (month > 12) {
                                if (day >= 1 && day <= 12 && month <= 31) {
                                    _c = [month, day], day = _c[0], month = _c[1];
                                }
                                else {
                                    return null;
                                }
                            }
                        }
                        if (day < 1 || day > 31) {
                            return null;
                        }
                        result.start.assign("day", day);
                        result.start.assign("month", month);
                        if (match[YEAR_GROUP]) {
                            var rawYearNumber = parseInt(match[YEAR_GROUP]);
                            var year = years_1.findMostLikelyADYear(rawYearNumber);
                            result.start.assign("year", year);
                        }
                        else {
                            var year = years_1.findYearClosestToRef(context.refDate, day, month);
                            result.start.imply("year", year);
                        }
                        return result.addTag("parser/SlashDateFormatParser");
                    };
                    return SlashDateFormatParser;
                }());
                exports.default = SlashDateFormatParser;
            }, { "../../calculation/years": 3 }], 12: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var abstractRefiners_1 = require("../abstractRefiners");
                var AbstractMergeDateRangeRefiner = /** @class */ (function (_super) {
                    __extends(AbstractMergeDateRangeRefiner, _super);
                    function AbstractMergeDateRangeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    AbstractMergeDateRangeRefiner.prototype.shouldMergeResults = function (textBetween, currentResult, nextResult) {
                        return !currentResult.end && !nextResult.end && textBetween.match(this.patternBetween()) != null;
                    };
                    AbstractMergeDateRangeRefiner.prototype.mergeResults = function (textBetween, fromResult, toResult) {
                        var _c;
                        if (!fromResult.start.isOnlyWeekdayComponent() && !toResult.start.isOnlyWeekdayComponent()) {
                            toResult.start.getCertainComponents().forEach(function (key) {
                                if (!fromResult.start.isCertain(key)) {
                                    fromResult.start.imply(key, toResult.start.get(key));
                                }
                            });
                            fromResult.start.getCertainComponents().forEach(function (key) {
                                if (!toResult.start.isCertain(key)) {
                                    toResult.start.imply(key, fromResult.start.get(key));
                                }
                            });
                        }
                        if (fromResult.start.date().getTime() > toResult.start.date().getTime()) {
                            var fromMoment = fromResult.start.dayjs();
                            var toMoment = toResult.start.dayjs();
                            if (toResult.start.isOnlyWeekdayComponent() && toMoment.add(7, "days").isAfter(fromMoment)) {
                                toMoment = toMoment.add(7, "days");
                                toResult.start.imply("day", toMoment.date());
                                toResult.start.imply("month", toMoment.month() + 1);
                                toResult.start.imply("year", toMoment.year());
                            }
                            else if (fromResult.start.isOnlyWeekdayComponent() && fromMoment.add(-7, "days").isBefore(toMoment)) {
                                fromMoment = fromMoment.add(-7, "days");
                                fromResult.start.imply("day", fromMoment.date());
                                fromResult.start.imply("month", fromMoment.month() + 1);
                                fromResult.start.imply("year", fromMoment.year());
                            }
                            else if (toResult.start.isDateWithUnknownYear() && toMoment.add(1, "years").isAfter(fromMoment)) {
                                toMoment = toMoment.add(1, "years");
                                toResult.start.imply("year", toMoment.year());
                            }
                            else if (fromResult.start.isDateWithUnknownYear() && fromMoment.add(-1, "years").isBefore(toMoment)) {
                                fromMoment = fromMoment.add(-1, "years");
                                fromResult.start.imply("year", fromMoment.year());
                            }
                            else {
                                _c = [fromResult, toResult], toResult = _c[0], fromResult = _c[1];
                            }
                        }
                        var result = fromResult.clone();
                        result.start = fromResult.start;
                        result.end = toResult.start;
                        result.index = Math.min(fromResult.index, toResult.index);
                        if (fromResult.index < toResult.index) {
                            result.text = fromResult.text + textBetween + toResult.text;
                        }
                        else {
                            result.text = toResult.text + textBetween + fromResult.text;
                        }
                        return result;
                    };
                    return AbstractMergeDateRangeRefiner;
                }(abstractRefiners_1.MergingRefiner));
                exports.default = AbstractMergeDateRangeRefiner;
            }, { "../abstractRefiners": 5 }], 13: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var abstractRefiners_1 = require("../abstractRefiners");
                var mergingCalculation_1 = require("../../calculation/mergingCalculation");
                var AbstractMergeDateTimeRefiner = /** @class */ (function (_super) {
                    __extends(AbstractMergeDateTimeRefiner, _super);
                    function AbstractMergeDateTimeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    AbstractMergeDateTimeRefiner.prototype.shouldMergeResults = function (textBetween, currentResult, nextResult) {
                        return (((currentResult.start.isOnlyDate() && nextResult.start.isOnlyTime()) ||
                            (nextResult.start.isOnlyDate() && currentResult.start.isOnlyTime())) &&
                            textBetween.match(this.patternBetween()) != null);
                    };
                    AbstractMergeDateTimeRefiner.prototype.mergeResults = function (textBetween, currentResult, nextResult) {
                        var result = currentResult.start.isOnlyDate()
                            ? mergingCalculation_1.mergeDateTimeResult(currentResult, nextResult)
                            : mergingCalculation_1.mergeDateTimeResult(nextResult, currentResult);
                        result.index = currentResult.index;
                        result.text = currentResult.text + textBetween + nextResult.text;
                        return result;
                    };
                    return AbstractMergeDateTimeRefiner;
                }(abstractRefiners_1.MergingRefiner));
                exports.default = AbstractMergeDateTimeRefiner;
            }, { "../../calculation/mergingCalculation": 2, "../abstractRefiners": 5 }], 14: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var timezone_1 = require("../../timezone");
                var TIMEZONE_NAME_PATTERN = new RegExp("^\\s*,?\\s*\\(?([A-Z]{2,4})\\)?(?=\\W|$)", "i");
                var ExtractTimezoneAbbrRefiner = /** @class */ (function () {
                    function ExtractTimezoneAbbrRefiner(timezoneOverrides) {
                        this.timezoneOverrides = timezoneOverrides;
                    }
                    ExtractTimezoneAbbrRefiner.prototype.refine = function (context, results) {
                        var _this = this;
                        var _a;
                        var timezoneOverrides = (_a = context.option.timezones) !== null && _a !== void 0 ? _a : {};
                        results.forEach(function (result) {
                            var _a, _b;
                            var suffix = context.text.substring(result.index + result.text.length);
                            var match = TIMEZONE_NAME_PATTERN.exec(suffix);
                            if (!match) {
                                return;
                            }
                            var timezoneAbbr = match[1].toUpperCase();
                            var refDate = (_b = (_a = result.start.date()) !== null && _a !== void 0 ? _a : result.refDate) !== null && _b !== void 0 ? _b : new Date();
                            var tzOverrides = Object.assign(Object.assign({}, _this.timezoneOverrides), timezoneOverrides);
                            var extractedTimezoneOffset = timezone_1.toTimezoneOffset(timezoneAbbr, refDate, tzOverrides);
                            if (extractedTimezoneOffset == null) {
                                return;
                            }
                            context.debug(function () {
                                console.log("Extracting timezone: '".concat(timezoneAbbr, "' into: ").concat(extractedTimezoneOffset, " for: ").concat(result.start));
                            });
                            var currentTimezoneOffset = result.start.get("timezoneOffset");
                            if (currentTimezoneOffset !== null && extractedTimezoneOffset != currentTimezoneOffset) {
                                if (result.start.isCertain("timezoneOffset")) {
                                    return;
                                }
                                if (timezoneAbbr != match[1]) {
                                    return;
                                }
                            }
                            if (result.start.isOnlyDate()) {
                                if (timezoneAbbr != match[1]) {
                                    return;
                                }
                            }
                            result.text += match[0];
                            if (!result.start.isCertain("timezoneOffset")) {
                                result.start.assign("timezoneOffset", extractedTimezoneOffset);
                            }
                            if (result.end != null && !result.end.isCertain("timezoneOffset")) {
                                result.end.assign("timezoneOffset", extractedTimezoneOffset);
                            }
                        });
                        return results;
                    };
                    return ExtractTimezoneAbbrRefiner;
                }());
                exports.default = ExtractTimezoneAbbrRefiner;
            }, { "../../timezone": 164 }], 15: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var TIMEZONE_OFFSET_PATTERN = new RegExp("^\\s*(?:\\(?(?:GMT|UTC)\\s?)?([+-])(\\d{1,2})(?::?(\\d{2}))?\\)?", "i");
                var TIMEZONE_OFFSET_SIGN_GROUP = 1;
                var TIMEZONE_OFFSET_HOUR_OFFSET_GROUP = 2;
                var TIMEZONE_OFFSET_MINUTE_OFFSET_GROUP = 3;
                var ExtractTimezoneOffsetRefiner = /** @class */ (function () {
                    function ExtractTimezoneOffsetRefiner() {
                    }
                    ExtractTimezoneOffsetRefiner.prototype.refine = function (context, results) {
                        results.forEach(function (result) {
                            if (result.start.isCertain("timezoneOffset")) {
                                return;
                            }
                            var suffix = context.text.substring(result.index + result.text.length);
                            var match = TIMEZONE_OFFSET_PATTERN.exec(suffix);
                            if (!match) {
                                return;
                            }
                            context.debug(function () {
                                console.log("Extracting timezone: '".concat(match[0], "' into : ").concat(result));
                            });
                            var hourOffset = parseInt(match[TIMEZONE_OFFSET_HOUR_OFFSET_GROUP]);
                            var minuteOffset = parseInt(match[TIMEZONE_OFFSET_MINUTE_OFFSET_GROUP] || "0");
                            var timezoneOffset = hourOffset * 60 + minuteOffset;
                            if (timezoneOffset > 14 * 60) {
                                return;
                            }
                            if (match[TIMEZONE_OFFSET_SIGN_GROUP] === "-") {
                                timezoneOffset = -timezoneOffset;
                            }
                            if (result.end != null) {
                                result.end.assign("timezoneOffset", timezoneOffset);
                            }
                            result.start.assign("timezoneOffset", timezoneOffset);
                            result.text += match[0];
                        });
                        return results;
                    };
                    return ExtractTimezoneOffsetRefiner;
                }());
                exports.default = ExtractTimezoneOffsetRefiner;
            }, {}], 16: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var dayjs_1 = __importDefault(require("dayjs"));
                var dayjs_2 = require("../../utils/dayjs");
                var ForwardDateRefiner = /** @class */ (function () {
                    function ForwardDateRefiner() {
                    }
                    ForwardDateRefiner.prototype.refine = function (context, results) {
                        var _this = this;
                        if (!context.option.forwardDate) {
                            return results;
                        }
                        results.forEach(function (result) {
                            var refMoment = dayjs_1.default(context.refDate);
                            if (result.start.isOnlyTime() && refMoment.isAfter(result.start.dayjs())) {
                                refMoment = refMoment.add(1, "day");
                                dayjs_2.implySimilarDate(result.start, refMoment);
                                if (result.end && result.end.isOnlyTime()) {
                                    dayjs_2.implySimilarDate(result.end, refMoment);
                                    if (result.start.dayjs().isAfter(result.end.dayjs())) {
                                        refMoment = refMoment.add(1, "day");
                                        dayjs_2.implySimilarDate(result.end, refMoment);
                                    }
                                }
                                context.debug(function () {
                                    console.log("".concat(_this.constructor.name, " adjusted ").concat(result, " time result (").concat(result.start, ")"));
                                });
                            }
                            if (result.start.isOnlyWeekdayComponent() && refMoment.isAfter(result.start.dayjs())) {
                                if (refMoment.day() >= result.start.get("weekday")) {
                                    refMoment = refMoment.day(result.start.get("weekday") + 7);
                                }
                                else {
                                    refMoment = refMoment.day(result.start.get("weekday"));
                                }
                                result.start.imply("day", refMoment.date());
                                result.start.imply("month", refMoment.month() + 1);
                                result.start.imply("year", refMoment.year());
                                context.debug(function () {
                                    console.log("".concat(_this.constructor.name, " adjusted ").concat(result, " weekday (").concat(result.start, ")"));
                                });
                                if (result.end && result.end.isOnlyWeekdayComponent()) {
                                    if (refMoment.day() > result.end.get("weekday")) {
                                        refMoment = refMoment.day(result.end.get("weekday") + 7);
                                    }
                                    else {
                                        refMoment = refMoment.day(result.end.get("weekday"));
                                    }
                                    result.end.imply("day", refMoment.date());
                                    result.end.imply("month", refMoment.month() + 1);
                                    result.end.imply("year", refMoment.year());
                                    context.debug(function () {
                                        console.log("".concat(_this.constructor.name, " adjusted ").concat(result, " weekday (").concat(result.end, ")"));
                                    });
                                }
                            }
                            if (result.start.isDateWithUnknownYear() && refMoment.isAfter(result.start.dayjs())) {
                                for (var i = 0; i < 3 && refMoment.isAfter(result.start.dayjs()); i++) {
                                    result.start.imply("year", result.start.get("year") + 1);
                                    context.debug(function () {
                                        console.log("".concat(_this.constructor.name, " adjusted ").concat(result, " year (").concat(result.start, ")"));
                                    });
                                    if (result.end && !result.end.isCertain("year")) {
                                        result.end.imply("year", result.end.get("year") + 1);
                                        context.debug(function () {
                                            console.log("".concat(_this.constructor.name, " adjusted ").concat(result, " month (").concat(result.start, ")"));
                                        });
                                    }
                                }
                            }
                        });
                        return results;
                    };
                    return ForwardDateRefiner;
                }());
                exports.default = ForwardDateRefiner;
            }, { "../../utils/dayjs": 166, "dayjs": 169 }], 17: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var abstractRefiners_1 = require("../abstractRefiners");
                var MergeWeekdayComponentRefiner = /** @class */ (function (_super) {
                    __extends(MergeWeekdayComponentRefiner, _super);
                    function MergeWeekdayComponentRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    MergeWeekdayComponentRefiner.prototype.mergeResults = function (textBetween, currentResult, nextResult) {
                        var newResult = nextResult.clone();
                        newResult.index = currentResult.index;
                        newResult.text = currentResult.text + textBetween + newResult.text;
                        newResult.start.assign("weekday", currentResult.start.get("weekday"));
                        if (newResult.end) {
                            newResult.end.assign("weekday", currentResult.start.get("weekday"));
                        }
                        return newResult;
                    };
                    MergeWeekdayComponentRefiner.prototype.shouldMergeResults = function (textBetween, currentResult, nextResult) {
                        var weekdayThenNormalDate = currentResult.start.isOnlyWeekdayComponent() &&
                            !currentResult.start.isCertain("hour") &&
                            nextResult.start.isCertain("day");
                        return weekdayThenNormalDate && textBetween.match(/^,?\s*$/) != null;
                    };
                    return MergeWeekdayComponentRefiner;
                }(abstractRefiners_1.MergingRefiner));
                exports.default = MergeWeekdayComponentRefiner;
            }, { "../abstractRefiners": 5 }], 18: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var OverlapRemovalRefiner = /** @class */ (function () {
                    function OverlapRemovalRefiner() {
                    }
                    OverlapRemovalRefiner.prototype.refine = function (context, results) {
                        var _this = this;
                        if (results.length < 2) {
                            return results;
                        }
                        var filteredResults = [];
                        var prevResult = results[0];
                        var _loop_3 = function (i) {
                            var result = results[i];
                            if (result.index >= prevResult.index + prevResult.text.length) {
                                filteredResults.push(prevResult);
                                prevResult = result;
                                return "continue";
                            }
                            var kept = null;
                            var removed = null;
                            if (result.text.length > prevResult.text.length) {
                                kept = result;
                                removed = prevResult;
                            }
                            else {
                                kept = prevResult;
                                removed = result;
                            }
                            context.debug(function () {
                                console.log("".concat(_this.constructor.name, " remove ").concat(removed, " by ").concat(kept));
                            });
                            prevResult = kept;
                        };
                        for (var i = 1; i < results.length; i++) {
                            _loop_3(i);
                        }
                        if (prevResult != null) {
                            filteredResults.push(prevResult);
                        }
                        return filteredResults;
                    };
                    return OverlapRemovalRefiner;
                }());
                exports.default = OverlapRemovalRefiner;
            }, {}], 19: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var abstractRefiners_1 = require("../abstractRefiners");
                var UnlikelyFormatFilter = /** @class */ (function (_super) {
                    __extends(UnlikelyFormatFilter, _super);
                    function UnlikelyFormatFilter(strictMode) {
                        var _this = _super.call(this) || this;
                        _this.strictMode = strictMode;
                        return _this;
                    }
                    UnlikelyFormatFilter.prototype.isValid = function (context, result) {
                        if (result.text.replace(" ", "").match(/^\d*(\.\d*)?$/)) {
                            context.debug(function () {
                                console.log("Removing unlikely result '".concat(result.text, "'"));
                            });
                            return false;
                        }
                        if (!result.start.isValidDate()) {
                            context.debug(function () {
                                console.log("Removing invalid result: ".concat(result, " (").concat(result.start, ")"));
                            });
                            return false;
                        }
                        if (result.end && !result.end.isValidDate()) {
                            context.debug(function () {
                                console.log("Removing invalid result: ".concat(result, " (").concat(result.end, ")"));
                            });
                            return false;
                        }
                        if (this.strictMode) {
                            return this.isStrictModeValid(context, result);
                        }
                        return true;
                    };
                    UnlikelyFormatFilter.prototype.isStrictModeValid = function (context, result) {
                        if (result.start.isOnlyWeekdayComponent()) {
                            context.debug(function () {
                                console.log("(Strict) Removing weekday only component: ".concat(result, " (").concat(result.end, ")"));
                            });
                            return false;
                        }
                        if (result.start.isOnlyTime() && (!result.start.isCertain("hour") || !result.start.isCertain("minute"))) {
                            context.debug(function () {
                                console.log("(Strict) Removing uncertain time component: ".concat(result, " (").concat(result.end, ")"));
                            });
                            return false;
                        }
                        return true;
                    };
                    return UnlikelyFormatFilter;
                }(abstractRefiners_1.Filter));
                exports.default = UnlikelyFormatFilter;
            }, { "../abstractRefiners": 5 }], 20: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.includeCommonConfiguration = void 0;
                var ExtractTimezoneAbbrRefiner_1 = __importDefault(require("./common/refiners/ExtractTimezoneAbbrRefiner"));
                var ExtractTimezoneOffsetRefiner_1 = __importDefault(require("./common/refiners/ExtractTimezoneOffsetRefiner"));
                var OverlapRemovalRefiner_1 = __importDefault(require("./common/refiners/OverlapRemovalRefiner"));
                var ForwardDateRefiner_1 = __importDefault(require("./common/refiners/ForwardDateRefiner"));
                var UnlikelyFormatFilter_1 = __importDefault(require("./common/refiners/UnlikelyFormatFilter"));
                var ISOFormatParser_1 = __importDefault(require("./common/parsers/ISOFormatParser"));
                var MergeWeekdayComponentRefiner_1 = __importDefault(require("./common/refiners/MergeWeekdayComponentRefiner"));
                function includeCommonConfiguration(configuration, strictMode) {
                    if (strictMode === void 0) { strictMode = false; }
                    configuration.parsers.unshift(new ISOFormatParser_1.default());
                    configuration.refiners.unshift(new MergeWeekdayComponentRefiner_1.default());
                    configuration.refiners.unshift(new ExtractTimezoneOffsetRefiner_1.default());
                    configuration.refiners.unshift(new OverlapRemovalRefiner_1.default());
                    configuration.refiners.push(new ExtractTimezoneAbbrRefiner_1.default());
                    configuration.refiners.push(new OverlapRemovalRefiner_1.default());
                    configuration.refiners.push(new ForwardDateRefiner_1.default());
                    configuration.refiners.push(new UnlikelyFormatFilter_1.default(strictMode));
                    return configuration;
                }
                exports.includeCommonConfiguration = includeCommonConfiguration;
            }, { "./common/parsers/ISOFormatParser": 10, "./common/refiners/ExtractTimezoneAbbrRefiner": 14, "./common/refiners/ExtractTimezoneOffsetRefiner": 15, "./common/refiners/ForwardDateRefiner": 16, "./common/refiners/MergeWeekdayComponentRefiner": 17, "./common/refiners/OverlapRemovalRefiner": 18, "./common/refiners/UnlikelyFormatFilter": 19 }], 21: [function (require, module, exports) {
                "use strict";
                var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
                }) : (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function (o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule)
                        return mod;
                    var result = {};
                    if (mod != null)
                        for (var k in mod)
                            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                                __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.parseDate = exports.parse = exports.casual = exports.strict = exports.uk = exports.es = exports.ru = exports.zh = exports.nl = exports.pt = exports.ja = exports.fr = exports.de = exports.Weekday = exports.Meridiem = exports.ReferenceWithTimezone = exports.ParsingComponents = exports.ParsingResult = exports.Chrono = exports.en = void 0;
                var en = __importStar(require("./locales/en"));
                exports.en = en;
                var chrono_1 = require("./chrono");
                Object.defineProperty(exports, "Chrono", { enumerable: true, get: function () { return chrono_1.Chrono; } });
                var results_1 = require("./results");
                Object.defineProperty(exports, "ParsingResult", { enumerable: true, get: function () { return results_1.ParsingResult; } });
                Object.defineProperty(exports, "ParsingComponents", { enumerable: true, get: function () { return results_1.ParsingComponents; } });
                Object.defineProperty(exports, "ReferenceWithTimezone", { enumerable: true, get: function () { return results_1.ReferenceWithTimezone; } });
                var types_1 = require("./types");
                Object.defineProperty(exports, "Meridiem", { enumerable: true, get: function () { return types_1.Meridiem; } });
                Object.defineProperty(exports, "Weekday", { enumerable: true, get: function () { return types_1.Weekday; } });
                var de = __importStar(require("./locales/de"));
                exports.de = de;
                var fr = __importStar(require("./locales/fr"));
                exports.fr = fr;
                var ja = __importStar(require("./locales/ja"));
                exports.ja = ja;
                var pt = __importStar(require("./locales/pt"));
                exports.pt = pt;
                var nl = __importStar(require("./locales/nl"));
                exports.nl = nl;
                var zh = __importStar(require("./locales/zh"));
                exports.zh = zh;
                var ru = __importStar(require("./locales/ru"));
                exports.ru = ru;
                var es = __importStar(require("./locales/es"));
                exports.es = es;
                var uk = __importStar(require("./locales/uk"));
                exports.uk = uk;
                exports.strict = en.strict;
                exports.casual = en.casual;
                function parse(text, ref, option) {
                    return exports.casual.parse(text, ref, option);
                }
                exports.parse = parse;
                function parseDate(text, ref, option) {
                    return exports.casual.parseDate(text, ref, option);
                }
                exports.parseDate = parseDate;
            }, { "./chrono": 4, "./locales/de": 23, "./locales/en": 36, "./locales/es": 58, "./locales/fr": 68, "./locales/ja": 81, "./locales/nl": 86, "./locales/pt": 104, "./locales/ru": 113, "./locales/uk": 128, "./locales/zh": 162, "./results": 163, "./types": 165 }], 22: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;
                var pattern_1 = require("../../utils/pattern");
                var years_1 = require("../../calculation/years");
                exports.WEEKDAY_DICTIONARY = {
                    "sonntag": 0,
                    "so": 0,
                    "montag": 1,
                    "mo": 1,
                    "dienstag": 2,
                    "di": 2,
                    "mittwoch": 3,
                    "mi": 3,
                    "donnerstag": 4,
                    "do": 4,
                    "freitag": 5,
                    "fr": 5,
                    "samstag": 6,
                    "sa": 6,
                };
                exports.MONTH_DICTIONARY = {
                    "januar": 1,
                    "jänner": 1,
                    "janner": 1,
                    "jan": 1,
                    "jan.": 1,
                    "februar": 2,
                    "feber": 2,
                    "feb": 2,
                    "feb.": 2,
                    "märz": 3,
                    "maerz": 3,
                    "mär": 3,
                    "mär.": 3,
                    "mrz": 3,
                    "mrz.": 3,
                    "april": 4,
                    "apr": 4,
                    "apr.": 4,
                    "mai": 5,
                    "juni": 6,
                    "jun": 6,
                    "jun.": 6,
                    "juli": 7,
                    "jul": 7,
                    "jul.": 7,
                    "august": 8,
                    "aug": 8,
                    "aug.": 8,
                    "september": 9,
                    "sep": 9,
                    "sep.": 9,
                    "sept": 9,
                    "sept.": 9,
                    "oktober": 10,
                    "okt": 10,
                    "okt.": 10,
                    "november": 11,
                    "nov": 11,
                    "nov.": 11,
                    "dezember": 12,
                    "dez": 12,
                    "dez.": 12,
                };
                exports.INTEGER_WORD_DICTIONARY = {
                    "eins": 1,
                    "eine": 1,
                    "einem": 1,
                    "einen": 1,
                    "einer": 1,
                    "zwei": 2,
                    "drei": 3,
                    "vier": 4,
                    "fünf": 5,
                    "fuenf": 5,
                    "sechs": 6,
                    "sieben": 7,
                    "acht": 8,
                    "neun": 9,
                    "zehn": 10,
                    "elf": 11,
                    "zwölf": 12,
                    "zwoelf": 12,
                };
                exports.TIME_UNIT_DICTIONARY = {
                    sek: "second",
                    sekunde: "second",
                    sekunden: "second",
                    min: "minute",
                    minute: "minute",
                    minuten: "minute",
                    h: "hour",
                    std: "hour",
                    stunde: "hour",
                    stunden: "hour",
                    tag: "d",
                    tage: "d",
                    tagen: "d",
                    woche: "week",
                    wochen: "week",
                    monat: "month",
                    monate: "month",
                    monaten: "month",
                    monats: "month",
                    quartal: "quarter",
                    quartals: "quarter",
                    quartale: "quarter",
                    quartalen: "quarter",
                    a: "year",
                    j: "year",
                    jr: "year",
                    jahr: "year",
                    jahre: "year",
                    jahren: "year",
                    jahres: "year",
                };
                exports.NUMBER_PATTERN = "(?:".concat(pattern_1.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY), "|[0-9]+|[0-9]+\\.[0-9]+|halb?|halbe?|einigen?|wenigen?|mehreren?)");
                function parseNumberPattern(match) {
                    var num = match.toLowerCase();
                    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
                        return exports.INTEGER_WORD_DICTIONARY[num];
                    }
                    else if (num === "ein" || num === "einer" || num === "einem" || num === "einen" || num === "eine") {
                        return 1;
                    }
                    else if (num.match(/wenigen/)) {
                        return 2;
                    }
                    else if (num.match(/halb/) || num.match(/halben/)) {
                        return 0.5;
                    }
                    else if (num.match(/einigen/)) {
                        return 3;
                    }
                    else if (num.match(/mehreren/)) {
                        return 7;
                    }
                    return parseFloat(num);
                }
                exports.parseNumberPattern = parseNumberPattern;
                exports.YEAR_PATTERN = "(?:[0-9]{1,4}(?:\\s*[vn]\\.?\\s*(?:C(?:hr)?|(?:u\\.?|d\\.?(?:\\s*g\\.?)?)?\\s*Z)\\.?|\\s*(?:u\\.?|d\\.?(?:\\s*g\\.)?)\\s*Z\\.?)?)";
                function parseYear(match) {
                    if (/v/i.test(match)) {
                        return -parseInt(match.replace(/[^0-9]+/gi, ""));
                    }
                    if (/n/i.test(match)) {
                        return parseInt(match.replace(/[^0-9]+/gi, ""));
                    }
                    if (/z/i.test(match)) {
                        return parseInt(match.replace(/[^0-9]+/gi, ""));
                    }
                    var rawYearNumber = parseInt(match);
                    return years_1.findMostLikelyADYear(rawYearNumber);
                }
                exports.parseYear = parseYear;
                var SINGLE_TIME_UNIT_PATTERN = "(".concat(exports.NUMBER_PATTERN, ")\\s{0,5}(").concat(pattern_1.matchAnyPattern(exports.TIME_UNIT_DICTIONARY), ")\\s{0,5}");
                var SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
                exports.TIME_UNITS_PATTERN = pattern_1.repeatedTimeunitPattern("", SINGLE_TIME_UNIT_PATTERN);
                function parseTimeUnits(timeunitText) {
                    var fragments = {};
                    var remainingText = timeunitText;
                    var match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
                    while (match) {
                        collectDateTimeFragment(fragments, match);
                        remainingText = remainingText.substring(match[0].length);
                        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
                    }
                    return fragments;
                }
                exports.parseTimeUnits = parseTimeUnits;
                function collectDateTimeFragment(fragments, match) {
                    var num = parseNumberPattern(match[1]);
                    var unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
                    fragments[unit] = num;
                }
            }, { "../../calculation/years": 3, "../../utils/pattern": 167 }], 23: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = exports.Weekday = exports.Meridiem = exports.ReferenceWithTimezone = exports.ParsingComponents = exports.ParsingResult = exports.Chrono = void 0;
                var configurations_1 = require("../../configurations");
                var chrono_1 = require("../../chrono");
                Object.defineProperty(exports, "Chrono", { enumerable: true, get: function () { return chrono_1.Chrono; } });
                var results_1 = require("../../results");
                Object.defineProperty(exports, "ParsingResult", { enumerable: true, get: function () { return results_1.ParsingResult; } });
                Object.defineProperty(exports, "ParsingComponents", { enumerable: true, get: function () { return results_1.ParsingComponents; } });
                Object.defineProperty(exports, "ReferenceWithTimezone", { enumerable: true, get: function () { return results_1.ReferenceWithTimezone; } });
                var types_1 = require("../../types");
                Object.defineProperty(exports, "Meridiem", { enumerable: true, get: function () { return types_1.Meridiem; } });
                Object.defineProperty(exports, "Weekday", { enumerable: true, get: function () { return types_1.Weekday; } });
                var SlashDateFormatParser_1 = __importDefault(require("../../common/parsers/SlashDateFormatParser"));
                var ISOFormatParser_1 = __importDefault(require("../../common/parsers/ISOFormatParser"));
                var DETimeExpressionParser_1 = __importDefault(require("./parsers/DETimeExpressionParser"));
                var DEWeekdayParser_1 = __importDefault(require("./parsers/DEWeekdayParser"));
                var DESpecificTimeExpressionParser_1 = __importDefault(require("./parsers/DESpecificTimeExpressionParser"));
                var DEMergeDateRangeRefiner_1 = __importDefault(require("./refiners/DEMergeDateRangeRefiner"));
                var DEMergeDateTimeRefiner_1 = __importDefault(require("./refiners/DEMergeDateTimeRefiner"));
                var DECasualDateParser_1 = __importDefault(require("./parsers/DECasualDateParser"));
                var DECasualTimeParser_1 = __importDefault(require("./parsers/DECasualTimeParser"));
                var DEMonthNameLittleEndianParser_1 = __importDefault(require("./parsers/DEMonthNameLittleEndianParser"));
                var DETimeUnitRelativeFormatParser_1 = __importDefault(require("./parsers/DETimeUnitRelativeFormatParser"));
                var DETimeUnitWithinFormatParser_1 = __importDefault(require("./parsers/DETimeUnitWithinFormatParser"));
                exports.casual = new chrono_1.Chrono(createCasualConfiguration());
                exports.strict = new chrono_1.Chrono(createConfiguration(true));
                function parse(text, ref, option) {
                    return exports.casual.parse(text, ref, option);
                }
                exports.parse = parse;
                function parseDate(text, ref, option) {
                    return exports.casual.parseDate(text, ref, option);
                }
                exports.parseDate = parseDate;
                function createCasualConfiguration(littleEndian) {
                    if (littleEndian === void 0) { littleEndian = true; }
                    var option = createConfiguration(false, littleEndian);
                    option.parsers.unshift(new DECasualTimeParser_1.default());
                    option.parsers.unshift(new DECasualDateParser_1.default());
                    option.parsers.unshift(new DETimeUnitRelativeFormatParser_1.default());
                    return option;
                }
                exports.createCasualConfiguration = createCasualConfiguration;
                function createConfiguration(strictMode, littleEndian) {
                    if (strictMode === void 0) { strictMode = true; }
                    if (littleEndian === void 0) { littleEndian = true; }
                    return configurations_1.includeCommonConfiguration({
                        parsers: [
                            new ISOFormatParser_1.default(),
                            new SlashDateFormatParser_1.default(littleEndian),
                            new DETimeExpressionParser_1.default(),
                            new DESpecificTimeExpressionParser_1.default(),
                            new DEMonthNameLittleEndianParser_1.default(),
                            new DEWeekdayParser_1.default(),
                            new DETimeUnitWithinFormatParser_1.default(),
                        ],
                        refiners: [new DEMergeDateRangeRefiner_1.default(), new DEMergeDateTimeRefiner_1.default()],
                    }, strictMode);
                }
                exports.createConfiguration = createConfiguration;
            }, { "../../chrono": 4, "../../common/parsers/ISOFormatParser": 10, "../../common/parsers/SlashDateFormatParser": 11, "../../configurations": 20, "../../results": 163, "../../types": 165, "./parsers/DECasualDateParser": 24, "./parsers/DECasualTimeParser": 25, "./parsers/DEMonthNameLittleEndianParser": 26, "./parsers/DESpecificTimeExpressionParser": 27, "./parsers/DETimeExpressionParser": 28, "./parsers/DETimeUnitRelativeFormatParser": 29, "./parsers/DETimeUnitWithinFormatParser": 30, "./parsers/DEWeekdayParser": 31, "./refiners/DEMergeDateRangeRefiner": 32, "./refiners/DEMergeDateTimeRefiner": 33 }], 24: [function (require, module, exports) {
                "use strict";
                var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
                }) : (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function (o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule)
                        return mod;
                    var result = {};
                    if (mod != null)
                        for (var k in mod)
                            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                                __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var dayjs_1 = __importDefault(require("dayjs"));
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var dayjs_2 = require("../../../utils/dayjs");
                var DECasualTimeParser_1 = __importDefault(require("./DECasualTimeParser"));
                var references = __importStar(require("../../../common/casualReferences"));
                var PATTERN = new RegExp("(jetzt|heute|morgen|\u00FCbermorgen|uebermorgen|gestern|vorgestern|letzte\\s*nacht)" +
                    "(?:\\s*(morgen|vormittag|mittags?|nachmittag|abend|nacht|mitternacht))?" +
                    "(?=\\W|$)", "i");
                var DATE_GROUP = 1;
                var TIME_GROUP = 2;
                var DECasualDateParser = /** @class */ (function (_super) {
                    __extends(DECasualDateParser, _super);
                    function DECasualDateParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    DECasualDateParser.prototype.innerPattern = function (context) {
                        return PATTERN;
                    };
                    DECasualDateParser.prototype.innerExtract = function (context, match) {
                        var targetDate = dayjs_1.default(context.refDate);
                        var dateKeyword = (match[DATE_GROUP] || "").toLowerCase();
                        var timeKeyword = (match[TIME_GROUP] || "").toLowerCase();
                        var component = context.createParsingComponents();
                        switch (dateKeyword) {
                            case "jetzt":
                                component = references.now(context.reference);
                                break;
                            case "heute":
                                component = references.today(context.reference);
                                break;
                            case "morgen":
                                dayjs_2.assignTheNextDay(component, targetDate);
                                break;
                            case "übermorgen":
                            case "uebermorgen":
                                targetDate = targetDate.add(1, "day");
                                dayjs_2.assignTheNextDay(component, targetDate);
                                break;
                            case "gestern":
                                targetDate = targetDate.add(-1, "day");
                                dayjs_2.assignSimilarDate(component, targetDate);
                                dayjs_2.implySimilarTime(component, targetDate);
                                break;
                            case "vorgestern":
                                targetDate = targetDate.add(-2, "day");
                                dayjs_2.assignSimilarDate(component, targetDate);
                                dayjs_2.implySimilarTime(component, targetDate);
                                break;
                            default:
                                if (dateKeyword.match(/letzte\s*nacht/)) {
                                    if (targetDate.hour() > 6) {
                                        targetDate = targetDate.add(-1, "day");
                                    }
                                    dayjs_2.assignSimilarDate(component, targetDate);
                                    component.imply("hour", 0);
                                }
                                break;
                        }
                        if (timeKeyword) {
                            component = DECasualTimeParser_1.default.extractTimeComponents(component, timeKeyword);
                        }
                        return component;
                    };
                    return DECasualDateParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = DECasualDateParser;
            }, { "../../../common/casualReferences": 7, "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../utils/dayjs": 166, "./DECasualTimeParser": 25, "dayjs": 169 }], 25: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var dayjs_1 = __importDefault(require("dayjs"));
                var types_1 = require("../../../types");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var dayjs_2 = require("../../../utils/dayjs");
                var timeunits_1 = require("../../../utils/timeunits");
                var DECasualTimeParser = /** @class */ (function (_super) {
                    __extends(DECasualTimeParser, _super);
                    function DECasualTimeParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    DECasualTimeParser.prototype.innerPattern = function (context) {
                        return /(diesen)?\s*(morgen|vormittag|mittags?|nachmittag|abend|nacht|mitternacht)(?=\W|$)/i;
                    };
                    DECasualTimeParser.prototype.innerExtract = function (context, match) {
                        var targetDate = dayjs_1.default(context.refDate);
                        var timeKeywordPattern = match[2].toLowerCase();
                        var component = context.createParsingComponents();
                        dayjs_2.implySimilarTime(component, targetDate);
                        return DECasualTimeParser.extractTimeComponents(component, timeKeywordPattern);
                    };
                    DECasualTimeParser.extractTimeComponents = function (component, timeKeywordPattern) {
                        switch (timeKeywordPattern) {
                            case "morgen":
                                component.imply("hour", 6);
                                component.imply("minute", 0);
                                component.imply("second", 0);
                                component.imply("meridiem", types_1.Meridiem.AM);
                                break;
                            case "vormittag":
                                component.imply("hour", 9);
                                component.imply("minute", 0);
                                component.imply("second", 0);
                                component.imply("meridiem", types_1.Meridiem.AM);
                                break;
                            case "mittag":
                            case "mittags":
                                component.imply("hour", 12);
                                component.imply("minute", 0);
                                component.imply("second", 0);
                                component.imply("meridiem", types_1.Meridiem.AM);
                                break;
                            case "nachmittag":
                                component.imply("hour", 15);
                                component.imply("minute", 0);
                                component.imply("second", 0);
                                component.imply("meridiem", types_1.Meridiem.PM);
                                break;
                            case "abend":
                                component.imply("hour", 18);
                                component.imply("minute", 0);
                                component.imply("second", 0);
                                component.imply("meridiem", types_1.Meridiem.PM);
                                break;
                            case "nacht":
                                component.imply("hour", 22);
                                component.imply("minute", 0);
                                component.imply("second", 0);
                                component.imply("meridiem", types_1.Meridiem.PM);
                                break;
                            case "mitternacht":
                                if (component.get("hour") > 1) {
                                    component = timeunits_1.addImpliedTimeUnits(component, { "day": 1 });
                                }
                                component.imply("hour", 0);
                                component.imply("minute", 0);
                                component.imply("second", 0);
                                component.imply("meridiem", types_1.Meridiem.AM);
                                break;
                        }
                        return component;
                    };
                    return DECasualTimeParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = DECasualTimeParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../types": 165, "../../../utils/dayjs": 166, "../../../utils/timeunits": 168, "dayjs": 169 }], 26: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var years_1 = require("../../../calculation/years");
                var constants_1 = require("../constants");
                var constants_2 = require("../constants");
                var pattern_1 = require("../../../utils/pattern");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var PATTERN = new RegExp("(?:am\\s*?)?" +
                    "(?:den\\s*?)?" +
                    "([0-9]{1,2})\\." +
                    "(?:\\s*(?:bis(?:\\s*(?:am|zum))?|\\-|\\\u2013|\\s)\\s*([0-9]{1,2})\\.?)?\\s*" +
                    "(".concat(pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY), ")") +
                    "(?:(?:-|/|,?\\s*)(".concat(constants_2.YEAR_PATTERN, "(?![^\\s]\\d)))?") +
                    "(?=\\W|$)", "i");
                var DATE_GROUP = 1;
                var DATE_TO_GROUP = 2;
                var MONTH_NAME_GROUP = 3;
                var YEAR_GROUP = 4;
                var DEMonthNameLittleEndianParser = /** @class */ (function (_super) {
                    __extends(DEMonthNameLittleEndianParser, _super);
                    function DEMonthNameLittleEndianParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    DEMonthNameLittleEndianParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    DEMonthNameLittleEndianParser.prototype.innerExtract = function (context, match) {
                        var result = context.createParsingResult(match.index, match[0]);
                        var month = constants_1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
                        var day = parseInt(match[DATE_GROUP]);
                        if (day > 31) {
                            match.index = match.index + match[DATE_GROUP].length;
                            return null;
                        }
                        result.start.assign("month", month);
                        result.start.assign("day", day);
                        if (match[YEAR_GROUP]) {
                            var yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
                            result.start.assign("year", yearNumber);
                        }
                        else {
                            var year = years_1.findYearClosestToRef(context.refDate, day, month);
                            result.start.imply("year", year);
                        }
                        if (match[DATE_TO_GROUP]) {
                            var endDate = parseInt(match[DATE_TO_GROUP]);
                            result.end = result.start.clone();
                            result.end.assign("day", endDate);
                        }
                        return result;
                    };
                    return DEMonthNameLittleEndianParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = DEMonthNameLittleEndianParser;
            }, { "../../../calculation/years": 3, "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../utils/pattern": 167, "../constants": 22 }], 27: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var types_1 = require("../../../types");
                var FIRST_REG_PATTERN = new RegExp("(^|\\s|T)" +
                    "(?:(?:um|von)\\s*)?" +
                    "(\\d{1,2})(?:h|:)?" +
                    "(?:(\\d{1,2})(?:m|:)?)?" +
                    "(?:(\\d{1,2})(?:s)?)?" +
                    "(?:\\s*Uhr)?" +
                    "(?:\\s*(morgens|vormittags|nachmittags|abends|nachts|am\\s+(?:Morgen|Vormittag|Nachmittag|Abend)|in\\s+der\\s+Nacht))?" +
                    "(?=\\W|$)", "i");
                var SECOND_REG_PATTERN = new RegExp("^\\s*(\\-|\\–|\\~|\\〜|bis(?:\\s+um)?|\\?)\\s*" +
                    "(\\d{1,2})(?:h|:)?" +
                    "(?:(\\d{1,2})(?:m|:)?)?" +
                    "(?:(\\d{1,2})(?:s)?)?" +
                    "(?:\\s*Uhr)?" +
                    "(?:\\s*(morgens|vormittags|nachmittags|abends|nachts|am\\s+(?:Morgen|Vormittag|Nachmittag|Abend)|in\\s+der\\s+Nacht))?" +
                    "(?=\\W|$)", "i");
                var HOUR_GROUP = 2;
                var MINUTE_GROUP = 3;
                var SECOND_GROUP = 4;
                var AM_PM_HOUR_GROUP = 5;
                var DESpecificTimeExpressionParser = /** @class */ (function () {
                    function DESpecificTimeExpressionParser() {
                    }
                    DESpecificTimeExpressionParser.prototype.pattern = function (context) {
                        return FIRST_REG_PATTERN;
                    };
                    DESpecificTimeExpressionParser.prototype.extract = function (context, match) {
                        var result = context.createParsingResult(match.index + match[1].length, match[0].substring(match[1].length));
                        if (result.text.match(/^\d{4}$/)) {
                            match.index += match[0].length;
                            return null;
                        }
                        result.start = DESpecificTimeExpressionParser.extractTimeComponent(result.start.clone(), match);
                        if (!result.start) {
                            match.index += match[0].length;
                            return null;
                        }
                        var remainingText = context.text.substring(match.index + match[0].length);
                        var secondMatch = SECOND_REG_PATTERN.exec(remainingText);
                        if (secondMatch) {
                            result.end = DESpecificTimeExpressionParser.extractTimeComponent(result.start.clone(), secondMatch);
                            if (result.end) {
                                result.text += secondMatch[0];
                            }
                        }
                        return result;
                    };
                    DESpecificTimeExpressionParser.extractTimeComponent = function (extractingComponents, match) {
                        var hour = 0;
                        var minute = 0;
                        var meridiem = null;
                        hour = parseInt(match[HOUR_GROUP]);
                        if (match[MINUTE_GROUP] != null) {
                            minute = parseInt(match[MINUTE_GROUP]);
                        }
                        if (minute >= 60 || hour > 24) {
                            return null;
                        }
                        if (hour >= 12) {
                            meridiem = types_1.Meridiem.PM;
                        }
                        if (match[AM_PM_HOUR_GROUP] != null) {
                            if (hour > 12)
                                return null;
                            var ampm = match[AM_PM_HOUR_GROUP].toLowerCase();
                            if (ampm.match(/morgen|vormittag/)) {
                                meridiem = types_1.Meridiem.AM;
                                if (hour == 12) {
                                    hour = 0;
                                }
                            }
                            if (ampm.match(/nachmittag|abend/)) {
                                meridiem = types_1.Meridiem.PM;
                                if (hour != 12) {
                                    hour += 12;
                                }
                            }
                            if (ampm.match(/nacht/)) {
                                if (hour == 12) {
                                    meridiem = types_1.Meridiem.AM;
                                    hour = 0;
                                }
                                else if (hour < 6) {
                                    meridiem = types_1.Meridiem.AM;
                                }
                                else {
                                    meridiem = types_1.Meridiem.PM;
                                    hour += 12;
                                }
                            }
                        }
                        extractingComponents.assign("hour", hour);
                        extractingComponents.assign("minute", minute);
                        if (meridiem !== null) {
                            extractingComponents.assign("meridiem", meridiem);
                        }
                        else {
                            if (hour < 12) {
                                extractingComponents.imply("meridiem", types_1.Meridiem.AM);
                            }
                            else {
                                extractingComponents.imply("meridiem", types_1.Meridiem.PM);
                            }
                        }
                        if (match[SECOND_GROUP] != null) {
                            var second = parseInt(match[SECOND_GROUP]);
                            if (second >= 60)
                                return null;
                            extractingComponents.assign("second", second);
                        }
                        return extractingComponents;
                    };
                    return DESpecificTimeExpressionParser;
                }());
                exports.default = DESpecificTimeExpressionParser;
            }, { "../../../types": 165 }], 28: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractTimeExpressionParser_1 = require("../../../common/parsers/AbstractTimeExpressionParser");
                var DETimeExpressionParser = /** @class */ (function (_super) {
                    __extends(DETimeExpressionParser, _super);
                    function DETimeExpressionParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    DETimeExpressionParser.prototype.primaryPrefix = function () {
                        return "(?:(?:um|von)\\s*)?";
                    };
                    DETimeExpressionParser.prototype.followingPhase = function () {
                        return "\\s*(?:\\-|\\–|\\~|\\〜|bis)\\s*";
                    };
                    DETimeExpressionParser.prototype.extractPrimaryTimeComponents = function (context, match) {
                        if (match[0].match(/^\s*\d{4}\s*$/)) {
                            return null;
                        }
                        return _super.prototype.extractPrimaryTimeComponents.call(this, context, match);
                    };
                    return DETimeExpressionParser;
                }(AbstractTimeExpressionParser_1.AbstractTimeExpressionParser));
                exports.default = DETimeExpressionParser;
            }, { "../../../common/parsers/AbstractTimeExpressionParser": 9 }], 29: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var timeunits_1 = require("../../../utils/timeunits");
                var pattern_1 = require("../../../utils/pattern");
                var DETimeUnitAgoFormatParser = /** @class */ (function (_super) {
                    __extends(DETimeUnitAgoFormatParser, _super);
                    function DETimeUnitAgoFormatParser() {
                        return _super.call(this) || this;
                    }
                    DETimeUnitAgoFormatParser.prototype.innerPattern = function () {
                        return new RegExp("(?:\\s*((?:n\u00E4chste|kommende|folgende|letzte|vergangene|vorige|vor(?:her|an)gegangene)(?:s|n|m|r)?|vor|in)\\s*)?" +
                            "(".concat(constants_1.NUMBER_PATTERN, ")?") +
                            "(?:\\s*(n\u00E4chste|kommende|folgende|letzte|vergangene|vorige|vor(?:her|an)gegangene)(?:s|n|m|r)?)?" +
                            "\\s*(".concat(pattern_1.matchAnyPattern(constants_1.TIME_UNIT_DICTIONARY), ")"), "i");
                    };
                    DETimeUnitAgoFormatParser.prototype.innerExtract = function (context, match) {
                        var num = match[2] ? constants_1.parseNumberPattern(match[2]) : 1;
                        var unit = constants_1.TIME_UNIT_DICTIONARY[match[4].toLowerCase()];
                        var timeUnits = {};
                        timeUnits[unit] = num;
                        var modifier = match[1] || match[3] || "";
                        modifier = modifier.toLowerCase();
                        if (!modifier) {
                            return;
                        }
                        if (/vor/.test(modifier) || /letzte/.test(modifier) || /vergangen/.test(modifier)) {
                            timeUnits = timeunits_1.reverseTimeUnits(timeUnits);
                        }
                        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                    };
                    return DETimeUnitAgoFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = DETimeUnitAgoFormatParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../results": 163, "../../../utils/pattern": 167, "../../../utils/timeunits": 168, "../constants": 22 }], 30: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var DETimeUnitWithinFormatParser = /** @class */ (function (_super) {
                    __extends(DETimeUnitWithinFormatParser, _super);
                    function DETimeUnitWithinFormatParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    DETimeUnitWithinFormatParser.prototype.innerPattern = function () {
                        return new RegExp("(?:in|f\u00FCr|w\u00E4hrend)\\s*(".concat(constants_1.TIME_UNITS_PATTERN, ")(?=\\W|$)"), "i");
                    };
                    DETimeUnitWithinFormatParser.prototype.innerExtract = function (context, match) {
                        var timeUnits = constants_1.parseTimeUnits(match[1]);
                        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                    };
                    return DETimeUnitWithinFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = DETimeUnitWithinFormatParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../results": 163, "../constants": 22 }], 31: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var pattern_1 = require("../../../utils/pattern");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var weekdays_1 = require("../../../common/calculation/weekdays");
                var PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
                    "(?:a[mn]\\s*?)?" +
                    "(?:(diese[mn]|letzte[mn]|n(?:ä|ae)chste[mn])\\s*)?" +
                    "(".concat(pattern_1.matchAnyPattern(constants_1.WEEKDAY_DICTIONARY), ")") +
                    "(?:\\s*(?:\\,|\\)|\\）))?" +
                    "(?:\\s*(diese|letzte|n(?:ä|ae)chste)\\s*woche)?" +
                    "(?=\\W|$)", "i");
                var PREFIX_GROUP = 1;
                var SUFFIX_GROUP = 3;
                var WEEKDAY_GROUP = 2;
                var DEWeekdayParser = /** @class */ (function (_super) {
                    __extends(DEWeekdayParser, _super);
                    function DEWeekdayParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    DEWeekdayParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    DEWeekdayParser.prototype.innerExtract = function (context, match) {
                        var dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
                        var offset = constants_1.WEEKDAY_DICTIONARY[dayOfWeek];
                        var prefix = match[PREFIX_GROUP];
                        var postfix = match[SUFFIX_GROUP];
                        var modifierWord = prefix || postfix;
                        modifierWord = modifierWord || "";
                        modifierWord = modifierWord.toLowerCase();
                        var modifier = null;
                        if (modifierWord.match(/letzte/)) {
                            modifier = "last";
                        }
                        else if (modifierWord.match(/chste/)) {
                            modifier = "next";
                        }
                        else if (modifierWord.match(/diese/)) {
                            modifier = "this";
                        }
                        return weekdays_1.createParsingComponentsAtWeekday(context.reference, offset, modifier);
                    };
                    return DEWeekdayParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = DEWeekdayParser;
            }, { "../../../common/calculation/weekdays": 6, "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../utils/pattern": 167, "../constants": 22 }], 32: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractMergeDateRangeRefiner_1 = __importDefault(require("../../../common/refiners/AbstractMergeDateRangeRefiner"));
                var DEMergeDateRangeRefiner = /** @class */ (function (_super) {
                    __extends(DEMergeDateRangeRefiner, _super);
                    function DEMergeDateRangeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    DEMergeDateRangeRefiner.prototype.patternBetween = function () {
                        return /^\s*(bis(?:\s*(?:am|zum))?|-)\s*$/i;
                    };
                    return DEMergeDateRangeRefiner;
                }(AbstractMergeDateRangeRefiner_1.default));
                exports.default = DEMergeDateRangeRefiner;
            }, { "../../../common/refiners/AbstractMergeDateRangeRefiner": 12 }], 33: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractMergeDateTimeRefiner_1 = __importDefault(require("../../../common/refiners/AbstractMergeDateTimeRefiner"));
                var DEMergeDateTimeRefiner = /** @class */ (function (_super) {
                    __extends(DEMergeDateTimeRefiner, _super);
                    function DEMergeDateTimeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    DEMergeDateTimeRefiner.prototype.patternBetween = function () {
                        return new RegExp("^\\s*(T|um|am|,|-)?\\s*$");
                    };
                    return DEMergeDateTimeRefiner;
                }(AbstractMergeDateTimeRefiner_1.default));
                exports.default = DEMergeDateTimeRefiner;
            }, { "../../../common/refiners/AbstractMergeDateTimeRefiner": 13 }], 34: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var ENTimeUnitWithinFormatParser_1 = __importDefault(require("./parsers/ENTimeUnitWithinFormatParser"));
                var ENMonthNameLittleEndianParser_1 = __importDefault(require("./parsers/ENMonthNameLittleEndianParser"));
                var ENMonthNameMiddleEndianParser_1 = __importDefault(require("./parsers/ENMonthNameMiddleEndianParser"));
                var ENMonthNameParser_1 = __importDefault(require("./parsers/ENMonthNameParser"));
                var ENYearMonthDayParser_1 = __importDefault(require("./parsers/ENYearMonthDayParser"));
                var ENSlashMonthFormatParser_1 = __importDefault(require("./parsers/ENSlashMonthFormatParser"));
                var ENTimeExpressionParser_1 = __importDefault(require("./parsers/ENTimeExpressionParser"));
                var ENTimeUnitAgoFormatParser_1 = __importDefault(require("./parsers/ENTimeUnitAgoFormatParser"));
                var ENTimeUnitLaterFormatParser_1 = __importDefault(require("./parsers/ENTimeUnitLaterFormatParser"));
                var ENMergeDateRangeRefiner_1 = __importDefault(require("./refiners/ENMergeDateRangeRefiner"));
                var ENMergeDateTimeRefiner_1 = __importDefault(require("./refiners/ENMergeDateTimeRefiner"));
                var configurations_1 = require("../../configurations");
                var ENCasualDateParser_1 = __importDefault(require("./parsers/ENCasualDateParser"));
                var ENCasualTimeParser_1 = __importDefault(require("./parsers/ENCasualTimeParser"));
                var ENWeekdayParser_1 = __importDefault(require("./parsers/ENWeekdayParser"));
                var ENRelativeDateFormatParser_1 = __importDefault(require("./parsers/ENRelativeDateFormatParser"));
                var SlashDateFormatParser_1 = __importDefault(require("../../common/parsers/SlashDateFormatParser"));
                var ENTimeUnitCasualRelativeFormatParser_1 = __importDefault(require("./parsers/ENTimeUnitCasualRelativeFormatParser"));
                var ENMergeRelativeAfterDateRefiner_1 = __importDefault(require("./refiners/ENMergeRelativeAfterDateRefiner"));
                var ENMergeRelativeFollowByDateRefiner_1 = __importDefault(require("./refiners/ENMergeRelativeFollowByDateRefiner"));
                var OverlapRemovalRefiner_1 = __importDefault(require("../../common/refiners/OverlapRemovalRefiner"));
                var ENExtractYearSuffixRefiner_1 = __importDefault(require("./refiners/ENExtractYearSuffixRefiner"));
                var ENUnlikelyFormatFilter_1 = __importDefault(require("./refiners/ENUnlikelyFormatFilter"));
                var ENDefaultConfiguration = /** @class */ (function () {
                    function ENDefaultConfiguration() {
                    }
                    ENDefaultConfiguration.prototype.createCasualConfiguration = function (littleEndian) {
                        if (littleEndian === void 0) { littleEndian = false; }
                        var option = this.createConfiguration(false, littleEndian);
                        option.parsers.push(new ENCasualDateParser_1.default());
                        option.parsers.push(new ENCasualTimeParser_1.default());
                        option.parsers.push(new ENMonthNameParser_1.default());
                        option.parsers.push(new ENRelativeDateFormatParser_1.default());
                        option.parsers.push(new ENTimeUnitCasualRelativeFormatParser_1.default());
                        option.refiners.push(new ENUnlikelyFormatFilter_1.default());
                        return option;
                    };
                    ENDefaultConfiguration.prototype.createConfiguration = function (strictMode, littleEndian) {
                        if (strictMode === void 0) { strictMode = true; }
                        if (littleEndian === void 0) { littleEndian = false; }
                        var options = configurations_1.includeCommonConfiguration({
                            parsers: [
                                new SlashDateFormatParser_1.default(littleEndian),
                                new ENTimeUnitWithinFormatParser_1.default(strictMode),
                                new ENMonthNameLittleEndianParser_1.default(),
                                new ENMonthNameMiddleEndianParser_1.default(littleEndian),
                                new ENWeekdayParser_1.default(),
                                new ENSlashMonthFormatParser_1.default(),
                                new ENTimeExpressionParser_1.default(strictMode),
                                new ENTimeUnitAgoFormatParser_1.default(strictMode),
                                new ENTimeUnitLaterFormatParser_1.default(strictMode),
                            ],
                            refiners: [new ENMergeDateTimeRefiner_1.default()],
                        }, strictMode);
                        options.parsers.unshift(new ENYearMonthDayParser_1.default(strictMode));
                        options.refiners.unshift(new ENMergeRelativeFollowByDateRefiner_1.default());
                        options.refiners.unshift(new ENMergeRelativeAfterDateRefiner_1.default());
                        options.refiners.unshift(new OverlapRemovalRefiner_1.default());
                        options.refiners.push(new ENMergeDateTimeRefiner_1.default());
                        options.refiners.push(new ENExtractYearSuffixRefiner_1.default());
                        options.refiners.push(new ENMergeDateRangeRefiner_1.default());
                        return options;
                    };
                    return ENDefaultConfiguration;
                }());
                exports.default = ENDefaultConfiguration;
            }, { "../../common/parsers/SlashDateFormatParser": 11, "../../common/refiners/OverlapRemovalRefiner": 18, "../../configurations": 20, "./parsers/ENCasualDateParser": 37, "./parsers/ENCasualTimeParser": 38, "./parsers/ENMonthNameLittleEndianParser": 39, "./parsers/ENMonthNameMiddleEndianParser": 40, "./parsers/ENMonthNameParser": 41, "./parsers/ENRelativeDateFormatParser": 42, "./parsers/ENSlashMonthFormatParser": 43, "./parsers/ENTimeExpressionParser": 44, "./parsers/ENTimeUnitAgoFormatParser": 45, "./parsers/ENTimeUnitCasualRelativeFormatParser": 46, "./parsers/ENTimeUnitLaterFormatParser": 47, "./parsers/ENTimeUnitWithinFormatParser": 48, "./parsers/ENWeekdayParser": 49, "./parsers/ENYearMonthDayParser": 50, "./refiners/ENExtractYearSuffixRefiner": 51, "./refiners/ENMergeDateRangeRefiner": 52, "./refiners/ENMergeDateTimeRefiner": 53, "./refiners/ENMergeRelativeAfterDateRefiner": 54, "./refiners/ENMergeRelativeFollowByDateRefiner": 55, "./refiners/ENUnlikelyFormatFilter": 56 }], 35: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.parseTimeUnits = exports.TIME_UNITS_NO_ABBR_PATTERN = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseOrdinalNumberPattern = exports.ORDINAL_NUMBER_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.TIME_UNIT_DICTIONARY_NO_ABBR = exports.ORDINAL_WORD_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.FULL_MONTH_NAME_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;
                var pattern_1 = require("../../utils/pattern");
                var years_1 = require("../../calculation/years");
                exports.WEEKDAY_DICTIONARY = {
                    sunday: 0,
                    sun: 0,
                    "sun.": 0,
                    monday: 1,
                    mon: 1,
                    "mon.": 1,
                    tuesday: 2,
                    tue: 2,
                    "tue.": 2,
                    wednesday: 3,
                    wed: 3,
                    "wed.": 3,
                    thursday: 4,
                    thurs: 4,
                    "thurs.": 4,
                    thur: 4,
                    "thur.": 4,
                    thu: 4,
                    "thu.": 4,
                    friday: 5,
                    fri: 5,
                    "fri.": 5,
                    saturday: 6,
                    sat: 6,
                    "sat.": 6,
                };
                exports.FULL_MONTH_NAME_DICTIONARY = {
                    january: 1,
                    february: 2,
                    march: 3,
                    april: 4,
                    may: 5,
                    june: 6,
                    july: 7,
                    august: 8,
                    september: 9,
                    october: 10,
                    november: 11,
                    december: 12,
                };
                exports.MONTH_DICTIONARY = Object.assign(Object.assign({}, exports.FULL_MONTH_NAME_DICTIONARY), { jan: 1, "jan.": 1, feb: 2, "feb.": 2, mar: 3, "mar.": 3, apr: 4, "apr.": 4, jun: 6, "jun.": 6, jul: 7, "jul.": 7, aug: 8, "aug.": 8, sep: 9, "sep.": 9, sept: 9, "sept.": 9, oct: 10, "oct.": 10, nov: 11, "nov.": 11, dec: 12, "dec.": 12 });
                exports.INTEGER_WORD_DICTIONARY = {
                    one: 1,
                    two: 2,
                    three: 3,
                    four: 4,
                    five: 5,
                    six: 6,
                    seven: 7,
                    eight: 8,
                    nine: 9,
                    ten: 10,
                    eleven: 11,
                    twelve: 12,
                };
                exports.ORDINAL_WORD_DICTIONARY = {
                    first: 1,
                    second: 2,
                    third: 3,
                    fourth: 4,
                    fifth: 5,
                    sixth: 6,
                    seventh: 7,
                    eighth: 8,
                    ninth: 9,
                    tenth: 10,
                    eleventh: 11,
                    twelfth: 12,
                    thirteenth: 13,
                    fourteenth: 14,
                    fifteenth: 15,
                    sixteenth: 16,
                    seventeenth: 17,
                    eighteenth: 18,
                    nineteenth: 19,
                    twentieth: 20,
                    "twenty first": 21,
                    "twenty-first": 21,
                    "twenty second": 22,
                    "twenty-second": 22,
                    "twenty third": 23,
                    "twenty-third": 23,
                    "twenty fourth": 24,
                    "twenty-fourth": 24,
                    "twenty fifth": 25,
                    "twenty-fifth": 25,
                    "twenty sixth": 26,
                    "twenty-sixth": 26,
                    "twenty seventh": 27,
                    "twenty-seventh": 27,
                    "twenty eighth": 28,
                    "twenty-eighth": 28,
                    "twenty ninth": 29,
                    "twenty-ninth": 29,
                    "thirtieth": 30,
                    "thirty first": 31,
                    "thirty-first": 31,
                };
                exports.TIME_UNIT_DICTIONARY_NO_ABBR = {
                    second: "second",
                    seconds: "second",
                    minute: "minute",
                    minutes: "minute",
                    hour: "hour",
                    hours: "hour",
                    day: "d",
                    days: "d",
                    week: "week",
                    weeks: "week",
                    month: "month",
                    months: "month",
                    quarter: "quarter",
                    quarters: "quarter",
                    year: "year",
                    years: "year",
                };
                exports.TIME_UNIT_DICTIONARY = Object.assign({ s: "second", sec: "second", second: "second", seconds: "second", m: "minute", min: "minute", mins: "minute", minute: "minute", minutes: "minute", h: "hour", hr: "hour", hrs: "hour", hour: "hour", hours: "hour", d: "d", day: "d", days: "d", w: "w", week: "week", weeks: "week", mo: "month", mon: "month", mos: "month", month: "month", months: "month", qtr: "quarter", quarter: "quarter", quarters: "quarter", y: "year", yr: "year", year: "year", years: "year" }, exports.TIME_UNIT_DICTIONARY_NO_ABBR);
                exports.NUMBER_PATTERN = "(?:".concat(pattern_1.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY), "|[0-9]+|[0-9]+\\.[0-9]+|half(?:\\s{0,2}an?)?|an?\\b(?:\\s{0,2}few)?|few|several|the|a?\\s{0,2}couple\\s{0,2}(?:of)?)");
                function parseNumberPattern(match) {
                    var num = match.toLowerCase();
                    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
                        return exports.INTEGER_WORD_DICTIONARY[num];
                    }
                    else if (num === "a" || num === "an" || num == "the") {
                        return 1;
                    }
                    else if (num.match(/few/)) {
                        return 3;
                    }
                    else if (num.match(/half/)) {
                        return 0.5;
                    }
                    else if (num.match(/couple/)) {
                        return 2;
                    }
                    else if (num.match(/several/)) {
                        return 7;
                    }
                    return parseFloat(num);
                }
                exports.parseNumberPattern = parseNumberPattern;
                exports.ORDINAL_NUMBER_PATTERN = "(?:".concat(pattern_1.matchAnyPattern(exports.ORDINAL_WORD_DICTIONARY), "|[0-9]{1,2}(?:st|nd|rd|th)?)");
                function parseOrdinalNumberPattern(match) {
                    var num = match.toLowerCase();
                    if (exports.ORDINAL_WORD_DICTIONARY[num] !== undefined) {
                        return exports.ORDINAL_WORD_DICTIONARY[num];
                    }
                    num = num.replace(/(?:st|nd|rd|th)$/i, "");
                    return parseInt(num);
                }
                exports.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
                exports.YEAR_PATTERN = "(?:[1-9][0-9]{0,3}\\s{0,2}(?:BE|AD|BC|BCE|CE)|[1-2][0-9]{3}|[5-9][0-9]|2[0-5])";
                function parseYear(match) {
                    if (/BE/i.test(match)) {
                        match = match.replace(/BE/i, "");
                        return parseInt(match) - 543;
                    }
                    if (/BCE?/i.test(match)) {
                        match = match.replace(/BCE?/i, "");
                        return -parseInt(match);
                    }
                    if (/(AD|CE)/i.test(match)) {
                        match = match.replace(/(AD|CE)/i, "");
                        return parseInt(match);
                    }
                    var rawYearNumber = parseInt(match);
                    return years_1.findMostLikelyADYear(rawYearNumber);
                }
                exports.parseYear = parseYear;
                var SINGLE_TIME_UNIT_PATTERN = "(".concat(exports.NUMBER_PATTERN, ")\\s{0,3}(").concat(pattern_1.matchAnyPattern(exports.TIME_UNIT_DICTIONARY), ")");
                var SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
                var SINGLE_TIME_UNIT_NO_ABBR_PATTERN = "(".concat(exports.NUMBER_PATTERN, ")\\s{0,3}(").concat(pattern_1.matchAnyPattern(exports.TIME_UNIT_DICTIONARY_NO_ABBR), ")");
                var TIME_UNIT_CONNECTOR_PATTERN = "\\s{0,5},?(?:\\s*and)?\\s{0,5}";
                exports.TIME_UNITS_PATTERN = pattern_1.repeatedTimeunitPattern("(?:(?:about|around)\\s{0,3})?", SINGLE_TIME_UNIT_PATTERN, TIME_UNIT_CONNECTOR_PATTERN);
                exports.TIME_UNITS_NO_ABBR_PATTERN = pattern_1.repeatedTimeunitPattern("(?:(?:about|around)\\s{0,3})?", SINGLE_TIME_UNIT_NO_ABBR_PATTERN, TIME_UNIT_CONNECTOR_PATTERN);
                function parseTimeUnits(timeunitText) {
                    var fragments = {};
                    var remainingText = timeunitText;
                    var match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
                    while (match) {
                        collectDateTimeFragment(fragments, match);
                        remainingText = remainingText.substring(match[0].length).trim();
                        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
                    }
                    if (Object.keys(fragments).length == 0) {
                        return null;
                    }
                    return fragments;
                }
                exports.parseTimeUnits = parseTimeUnits;
                function collectDateTimeFragment(fragments, match) {
                    if (match[0].match(/^[a-zA-Z]+$/)) {
                        return;
                    }
                    var num = parseNumberPattern(match[1]);
                    var unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
                    fragments[unit] = num;
                }
            }, { "../../calculation/years": 3, "../../utils/pattern": 167 }], 36: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.parseDate = exports.parse = exports.GB = exports.strict = exports.casual = exports.configuration = exports.Weekday = exports.Meridiem = exports.ReferenceWithTimezone = exports.ParsingComponents = exports.ParsingResult = exports.Chrono = void 0;
                var chrono_1 = require("../../chrono");
                Object.defineProperty(exports, "Chrono", { enumerable: true, get: function () { return chrono_1.Chrono; } });
                var results_1 = require("../../results");
                Object.defineProperty(exports, "ParsingResult", { enumerable: true, get: function () { return results_1.ParsingResult; } });
                Object.defineProperty(exports, "ParsingComponents", { enumerable: true, get: function () { return results_1.ParsingComponents; } });
                Object.defineProperty(exports, "ReferenceWithTimezone", { enumerable: true, get: function () { return results_1.ReferenceWithTimezone; } });
                var types_1 = require("../../types");
                Object.defineProperty(exports, "Meridiem", { enumerable: true, get: function () { return types_1.Meridiem; } });
                Object.defineProperty(exports, "Weekday", { enumerable: true, get: function () { return types_1.Weekday; } });
                var configuration_1 = __importDefault(require("./configuration"));
                exports.configuration = new configuration_1.default();
                exports.casual = new chrono_1.Chrono(exports.configuration.createCasualConfiguration(false));
                exports.strict = new chrono_1.Chrono(exports.configuration.createConfiguration(true, false));
                exports.GB = new chrono_1.Chrono(exports.configuration.createCasualConfiguration(true));
                function parse(text, ref, option) {
                    return exports.casual.parse(text, ref, option);
                }
                exports.parse = parse;
                function parseDate(text, ref, option) {
                    return exports.casual.parseDate(text, ref, option);
                }
                exports.parseDate = parseDate;
            }, { "../../chrono": 4, "../../results": 163, "../../types": 165, "./configuration": 34 }], 37: [function (require, module, exports) {
                "use strict";
                var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
                }) : (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function (o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule)
                        return mod;
                    var result = {};
                    if (mod != null)
                        for (var k in mod)
                            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                                __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var dayjs_1 = __importDefault(require("dayjs"));
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var dayjs_2 = require("../../../utils/dayjs");
                var references = __importStar(require("../../../common/casualReferences"));
                var PATTERN = /(now|today|tonight|tomorrow|tmr|tmrw|yesterday|last\s*night)(?=\W|$)/i;
                var ENCasualDateParser = /** @class */ (function (_super) {
                    __extends(ENCasualDateParser, _super);
                    function ENCasualDateParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ENCasualDateParser.prototype.innerPattern = function (context) {
                        return PATTERN;
                    };
                    ENCasualDateParser.prototype.innerExtract = function (context, match) {
                        var targetDate = dayjs_1.default(context.refDate);
                        var lowerText = match[0].toLowerCase();
                        var component = context.createParsingComponents();
                        switch (lowerText) {
                            case "now":
                                component = references.now(context.reference);
                                break;
                            case "today":
                                component = references.today(context.reference);
                                break;
                            case "yesterday":
                                component = references.yesterday(context.reference);
                                break;
                            case "tomorrow":
                            case "tmr":
                            case "tmrw":
                                component = references.tomorrow(context.reference);
                                break;
                            case "tonight":
                                component = references.tonight(context.reference);
                                break;
                            default:
                                if (lowerText.match(/last\s*night/)) {
                                    if (targetDate.hour() > 6) {
                                        targetDate = targetDate.add(-1, "day");
                                    }
                                    dayjs_2.assignSimilarDate(component, targetDate);
                                    component.imply("hour", 0);
                                }
                                break;
                        }
                        component.addTag("parser/ENCasualDateParser");
                        return component;
                    };
                    return ENCasualDateParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ENCasualDateParser;
            }, { "../../../common/casualReferences": 7, "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../utils/dayjs": 166, "dayjs": 169 }], 38: [function (require, module, exports) {
                "use strict";
                var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
                }) : (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function (o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule)
                        return mod;
                    var result = {};
                    if (mod != null)
                        for (var k in mod)
                            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                                __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var casualReferences = __importStar(require("../../../common/casualReferences"));
                var PATTERN = /(?:this)?\s{0,3}(morning|afternoon|evening|night|midnight|midday|noon)(?=\W|$)/i;
                var ENCasualTimeParser = /** @class */ (function (_super) {
                    __extends(ENCasualTimeParser, _super);
                    function ENCasualTimeParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ENCasualTimeParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    ENCasualTimeParser.prototype.innerExtract = function (context, match) {
                        var component = null;
                        switch (match[1].toLowerCase()) {
                            case "afternoon":
                                component = casualReferences.afternoon(context.reference);
                                break;
                            case "evening":
                            case "night":
                                component = casualReferences.evening(context.reference);
                                break;
                            case "midnight":
                                component = casualReferences.midnight(context.reference);
                                break;
                            case "morning":
                                component = casualReferences.morning(context.reference);
                                break;
                            case "noon":
                            case "midday":
                                component = casualReferences.noon(context.reference);
                                break;
                        }
                        if (component) {
                            component.addTag("parser/ENCasualTimeParser");
                        }
                        return component;
                    };
                    return ENCasualTimeParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ENCasualTimeParser;
            }, { "../../../common/casualReferences": 7, "../../../common/parsers/AbstractParserWithWordBoundary": 8 }], 39: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var years_1 = require("../../../calculation/years");
                var constants_1 = require("../constants");
                var constants_2 = require("../constants");
                var constants_3 = require("../constants");
                var pattern_1 = require("../../../utils/pattern");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var PATTERN = new RegExp("(?:on\\s{0,3})?" +
                    "(".concat(constants_3.ORDINAL_NUMBER_PATTERN, ")") +
                    "(?:" +
                    "\\s{0,3}(?:to|\\-|\\\u2013|until|through|till)?\\s{0,3}" +
                    "(".concat(constants_3.ORDINAL_NUMBER_PATTERN, ")") +
                    ")?" +
                    "(?:-|/|\\s{0,3}(?:of)?\\s{0,3})" +
                    "(".concat(pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY), ")") +
                    "(?:" +
                    "(?:-|/|,?\\s{0,3})" +
                    "(".concat(constants_2.YEAR_PATTERN, "(?!\\w))") +
                    ")?" +
                    "(?=\\W|$)", "i");
                var DATE_GROUP = 1;
                var DATE_TO_GROUP = 2;
                var MONTH_NAME_GROUP = 3;
                var YEAR_GROUP = 4;
                var ENMonthNameLittleEndianParser = /** @class */ (function (_super) {
                    __extends(ENMonthNameLittleEndianParser, _super);
                    function ENMonthNameLittleEndianParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ENMonthNameLittleEndianParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    ENMonthNameLittleEndianParser.prototype.innerExtract = function (context, match) {
                        var result = context.createParsingResult(match.index, match[0]);
                        var month = constants_1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
                        var day = constants_3.parseOrdinalNumberPattern(match[DATE_GROUP]);
                        if (day > 31) {
                            match.index = match.index + match[DATE_GROUP].length;
                            return null;
                        }
                        result.start.assign("month", month);
                        result.start.assign("day", day);
                        if (match[YEAR_GROUP]) {
                            var yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
                            result.start.assign("year", yearNumber);
                        }
                        else {
                            var year = years_1.findYearClosestToRef(context.refDate, day, month);
                            result.start.imply("year", year);
                        }
                        if (match[DATE_TO_GROUP]) {
                            var endDate = constants_3.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
                            result.end = result.start.clone();
                            result.end.assign("day", endDate);
                        }
                        return result;
                    };
                    return ENMonthNameLittleEndianParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ENMonthNameLittleEndianParser;
            }, { "../../../calculation/years": 3, "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../utils/pattern": 167, "../constants": 35 }], 40: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var years_1 = require("../../../calculation/years");
                var constants_1 = require("../constants");
                var constants_2 = require("../constants");
                var constants_3 = require("../constants");
                var pattern_1 = require("../../../utils/pattern");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var PATTERN = new RegExp("(".concat(pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY), ")") +
                    "(?:-|/|\\s*,?\\s*)" +
                    "(".concat(constants_2.ORDINAL_NUMBER_PATTERN, ")(?!\\s*(?:am|pm))\\s*") +
                    "(?:" +
                    "(?:to|\\-)\\s*" +
                    "(".concat(constants_2.ORDINAL_NUMBER_PATTERN, ")\\s*") +
                    ")?" +
                    "(?:" +
                    "(?:-|/|\\s*,\\s*|\\s+)" +
                    "(".concat(constants_3.YEAR_PATTERN, ")") +
                    ")?" +
                    "(?=\\W|$)(?!\\:\\d)", "i");
                var MONTH_NAME_GROUP = 1;
                var DATE_GROUP = 2;
                var DATE_TO_GROUP = 3;
                var YEAR_GROUP = 4;
                var ENMonthNameMiddleEndianParser = /** @class */ (function (_super) {
                    __extends(ENMonthNameMiddleEndianParser, _super);
                    function ENMonthNameMiddleEndianParser(shouldSkipYearLikeDate) {
                        var _this = _super.call(this) || this;
                        _this.shouldSkipYearLikeDate = shouldSkipYearLikeDate;
                        return _this;
                    }
                    ENMonthNameMiddleEndianParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    ENMonthNameMiddleEndianParser.prototype.innerExtract = function (context, match) {
                        var month = constants_1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
                        var day = constants_2.parseOrdinalNumberPattern(match[DATE_GROUP]);
                        if (day > 31) {
                            return null;
                        }
                        if (this.shouldSkipYearLikeDate) {
                            if (!match[DATE_TO_GROUP] && !match[YEAR_GROUP] && match[DATE_GROUP].match(/^2[0-5]$/)) {
                                return null;
                            }
                        }
                        var components = context
                            .createParsingComponents({
                            day: day,
                            month: month,
                        })
                            .addTag("parser/ENMonthNameMiddleEndianParser");
                        if (match[YEAR_GROUP]) {
                            var year = constants_3.parseYear(match[YEAR_GROUP]);
                            components.assign("year", year);
                        }
                        else {
                            var year = years_1.findYearClosestToRef(context.refDate, day, month);
                            components.imply("year", year);
                        }
                        if (!match[DATE_TO_GROUP]) {
                            return components;
                        }
                        var endDate = constants_2.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
                        var result = context.createParsingResult(match.index, match[0]);
                        result.start = components;
                        result.end = components.clone();
                        result.end.assign("day", endDate);
                        return result;
                    };
                    return ENMonthNameMiddleEndianParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ENMonthNameMiddleEndianParser;
            }, { "../../../calculation/years": 3, "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../utils/pattern": 167, "../constants": 35 }], 41: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var years_1 = require("../../../calculation/years");
                var pattern_1 = require("../../../utils/pattern");
                var constants_2 = require("../constants");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var PATTERN = new RegExp("((?:in)\\s*)?" +
                    "(".concat(pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY), ")") +
                    "\\s*" +
                    "(?:" +
                    "(?:,|-|of)?\\s*(".concat(constants_2.YEAR_PATTERN, ")?") +
                    ")?" +
                    "(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)", "i");
                var PREFIX_GROUP = 1;
                var MONTH_NAME_GROUP = 2;
                var YEAR_GROUP = 3;
                var ENMonthNameParser = /** @class */ (function (_super) {
                    __extends(ENMonthNameParser, _super);
                    function ENMonthNameParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ENMonthNameParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    ENMonthNameParser.prototype.innerExtract = function (context, match) {
                        var monthName = match[MONTH_NAME_GROUP].toLowerCase();
                        if (match[0].length <= 3 && !constants_1.FULL_MONTH_NAME_DICTIONARY[monthName]) {
                            return null;
                        }
                        var result = context.createParsingResult(match.index + (match[PREFIX_GROUP] || "").length, match.index + match[0].length);
                        result.start.imply("day", 1);
                        result.start.addTag("parser/ENMonthNameParser");
                        var month = constants_1.MONTH_DICTIONARY[monthName];
                        result.start.assign("month", month);
                        if (match[YEAR_GROUP]) {
                            var year = constants_2.parseYear(match[YEAR_GROUP]);
                            result.start.assign("year", year);
                        }
                        else {
                            var year = years_1.findYearClosestToRef(context.refDate, 1, month);
                            result.start.imply("year", year);
                        }
                        return result;
                    };
                    return ENMonthNameParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ENMonthNameParser;
            }, { "../../../calculation/years": 3, "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../utils/pattern": 167, "../constants": 35 }], 42: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var dayjs_1 = __importDefault(require("dayjs"));
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var pattern_1 = require("../../../utils/pattern");
                var PATTERN = new RegExp("(this|last|past|next|after\\s*this)\\s*(".concat(pattern_1.matchAnyPattern(constants_1.TIME_UNIT_DICTIONARY), ")(?=\\s*)") + "(?=\\W|$)", "i");
                var MODIFIER_WORD_GROUP = 1;
                var RELATIVE_WORD_GROUP = 2;
                var ENRelativeDateFormatParser = /** @class */ (function (_super) {
                    __extends(ENRelativeDateFormatParser, _super);
                    function ENRelativeDateFormatParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ENRelativeDateFormatParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    ENRelativeDateFormatParser.prototype.innerExtract = function (context, match) {
                        var modifier = match[MODIFIER_WORD_GROUP].toLowerCase();
                        var unitWord = match[RELATIVE_WORD_GROUP].toLowerCase();
                        var timeunit = constants_1.TIME_UNIT_DICTIONARY[unitWord];
                        if (modifier == "next" || modifier.startsWith("after")) {
                            var timeUnits = {};
                            timeUnits[timeunit] = 1;
                            return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                        }
                        if (modifier == "last" || modifier == "past") {
                            var timeUnits = {};
                            timeUnits[timeunit] = -1;
                            return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                        }
                        var components = context.createParsingComponents();
                        var date = dayjs_1.default(context.reference.instant);
                        if (unitWord.match(/week/i)) {
                            date = date.add(-date.get("d"), "d");
                            components.imply("day", date.date());
                            components.imply("month", date.month() + 1);
                            components.imply("year", date.year());
                        }
                        else if (unitWord.match(/month/i)) {
                            date = date.add(-date.date() + 1, "d");
                            components.imply("day", date.date());
                            components.assign("year", date.year());
                            components.assign("month", date.month() + 1);
                        }
                        else if (unitWord.match(/year/i)) {
                            date = date.add(-date.date() + 1, "d");
                            date = date.add(-date.month(), "month");
                            components.imply("day", date.date());
                            components.imply("month", date.month() + 1);
                            components.assign("year", date.year());
                        }
                        return components;
                    };
                    return ENRelativeDateFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ENRelativeDateFormatParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../results": 163, "../../../utils/pattern": 167, "../constants": 35, "dayjs": 169 }], 43: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var PATTERN = new RegExp("([0-9]|0[1-9]|1[012])/([0-9]{4})" + "", "i");
                var MONTH_GROUP = 1;
                var YEAR_GROUP = 2;
                var ENSlashMonthFormatParser = /** @class */ (function (_super) {
                    __extends(ENSlashMonthFormatParser, _super);
                    function ENSlashMonthFormatParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ENSlashMonthFormatParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    ENSlashMonthFormatParser.prototype.innerExtract = function (context, match) {
                        var year = parseInt(match[YEAR_GROUP]);
                        var month = parseInt(match[MONTH_GROUP]);
                        return context.createParsingComponents().imply("day", 1).assign("month", month).assign("year", year);
                    };
                    return ENSlashMonthFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ENSlashMonthFormatParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8 }], 44: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var types_1 = require("../../../types");
                var AbstractTimeExpressionParser_1 = require("../../../common/parsers/AbstractTimeExpressionParser");
                var ENTimeExpressionParser = /** @class */ (function (_super) {
                    __extends(ENTimeExpressionParser, _super);
                    function ENTimeExpressionParser(strictMode) {
                        return _super.call(this, strictMode) || this;
                    }
                    ENTimeExpressionParser.prototype.followingPhase = function () {
                        return "\\s*(?:\\-|\\–|\\~|\\〜|to|until|through|till|\\?)\\s*";
                    };
                    ENTimeExpressionParser.prototype.primaryPrefix = function () {
                        return "(?:(?:at|from)\\s*)??";
                    };
                    ENTimeExpressionParser.prototype.primarySuffix = function () {
                        return "(?:\\s*(?:o\\W*clock|at\\s*night|in\\s*the\\s*(?:morning|afternoon)))?(?!/)(?=\\W|$)";
                    };
                    ENTimeExpressionParser.prototype.extractPrimaryTimeComponents = function (context, match) {
                        var components = _super.prototype.extractPrimaryTimeComponents.call(this, context, match);
                        if (!components) {
                            return components;
                        }
                        if (match[0].endsWith("night")) {
                            var hour = components.get("hour");
                            if (hour >= 6 && hour < 12) {
                                components.assign("hour", components.get("hour") + 12);
                                components.assign("meridiem", types_1.Meridiem.PM);
                            }
                            else if (hour < 6) {
                                components.assign("meridiem", types_1.Meridiem.AM);
                            }
                        }
                        if (match[0].endsWith("afternoon")) {
                            components.assign("meridiem", types_1.Meridiem.PM);
                            var hour = components.get("hour");
                            if (hour >= 0 && hour <= 6) {
                                components.assign("hour", components.get("hour") + 12);
                            }
                        }
                        if (match[0].endsWith("morning")) {
                            components.assign("meridiem", types_1.Meridiem.AM);
                            var hour = components.get("hour");
                            if (hour < 12) {
                                components.assign("hour", components.get("hour"));
                            }
                        }
                        return components.addTag("parser/ENTimeExpressionParser");
                    };
                    ENTimeExpressionParser.prototype.extractFollowingTimeComponents = function (context, match, result) {
                        var followingComponents = _super.prototype.extractFollowingTimeComponents.call(this, context, match, result);
                        if (followingComponents) {
                            followingComponents.addTag("parser/ENTimeExpressionParser");
                        }
                        return followingComponents;
                    };
                    return ENTimeExpressionParser;
                }(AbstractTimeExpressionParser_1.AbstractTimeExpressionParser));
                exports.default = ENTimeExpressionParser;
            }, { "../../../common/parsers/AbstractTimeExpressionParser": 9, "../../../types": 165 }], 45: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var timeunits_1 = require("../../../utils/timeunits");
                var PATTERN = new RegExp("(".concat(constants_1.TIME_UNITS_PATTERN, ")\\s{0,5}(?:ago|before|earlier)(?=\\W|$)"), "i");
                var STRICT_PATTERN = new RegExp("(".concat(constants_1.TIME_UNITS_NO_ABBR_PATTERN, ")\\s{0,5}(?:ago|before|earlier)(?=\\W|$)"), "i");
                var ENTimeUnitAgoFormatParser = /** @class */ (function (_super) {
                    __extends(ENTimeUnitAgoFormatParser, _super);
                    function ENTimeUnitAgoFormatParser(strictMode) {
                        var _this = _super.call(this) || this;
                        _this.strictMode = strictMode;
                        return _this;
                    }
                    ENTimeUnitAgoFormatParser.prototype.innerPattern = function () {
                        return this.strictMode ? STRICT_PATTERN : PATTERN;
                    };
                    ENTimeUnitAgoFormatParser.prototype.innerExtract = function (context, match) {
                        var timeUnits = constants_1.parseTimeUnits(match[1]);
                        if (!timeUnits) {
                            return null;
                        }
                        var outputTimeUnits = timeunits_1.reverseTimeUnits(timeUnits);
                        return results_1.ParsingComponents.createRelativeFromReference(context.reference, outputTimeUnits);
                    };
                    return ENTimeUnitAgoFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ENTimeUnitAgoFormatParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../results": 163, "../../../utils/timeunits": 168, "../constants": 35 }], 46: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var timeunits_1 = require("../../../utils/timeunits");
                var PATTERN = new RegExp("(this|last|past|next|after|\\+|-)\\s*(".concat(constants_1.TIME_UNITS_PATTERN, ")(?=\\W|$)"), "i");
                var PATTERN_NO_ABBR = new RegExp("(this|last|past|next|after|\\+|-)\\s*(".concat(constants_1.TIME_UNITS_NO_ABBR_PATTERN, ")(?=\\W|$)"), "i");
                var ENTimeUnitCasualRelativeFormatParser = /** @class */ (function (_super) {
                    __extends(ENTimeUnitCasualRelativeFormatParser, _super);
                    function ENTimeUnitCasualRelativeFormatParser(allowAbbreviations) {
                        if (allowAbbreviations === void 0) { allowAbbreviations = true; }
                        var _this = _super.call(this) || this;
                        _this.allowAbbreviations = allowAbbreviations;
                        return _this;
                    }
                    ENTimeUnitCasualRelativeFormatParser.prototype.innerPattern = function () {
                        return this.allowAbbreviations ? PATTERN : PATTERN_NO_ABBR;
                    };
                    ENTimeUnitCasualRelativeFormatParser.prototype.innerExtract = function (context, match) {
                        var prefix = match[1].toLowerCase();
                        var timeUnits = constants_1.parseTimeUnits(match[2]);
                        if (!timeUnits) {
                            return null;
                        }
                        switch (prefix) {
                            case "last":
                            case "past":
                            case "-":
                                timeUnits = timeunits_1.reverseTimeUnits(timeUnits);
                                break;
                        }
                        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                    };
                    return ENTimeUnitCasualRelativeFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ENTimeUnitCasualRelativeFormatParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../results": 163, "../../../utils/timeunits": 168, "../constants": 35 }], 47: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var PATTERN = new RegExp("(".concat(constants_1.TIME_UNITS_PATTERN, ")\\s{0,5}(?:later|after|from now|henceforth|forward|out)") + "(?=(?:\\W|$))", "i");
                var STRICT_PATTERN = new RegExp("(".concat(constants_1.TIME_UNITS_NO_ABBR_PATTERN, ")\\s{0,5}(later|after|from now)(?=\\W|$)"), "i");
                var GROUP_NUM_TIMEUNITS = 1;
                var ENTimeUnitLaterFormatParser = /** @class */ (function (_super) {
                    __extends(ENTimeUnitLaterFormatParser, _super);
                    function ENTimeUnitLaterFormatParser(strictMode) {
                        var _this = _super.call(this) || this;
                        _this.strictMode = strictMode;
                        return _this;
                    }
                    ENTimeUnitLaterFormatParser.prototype.innerPattern = function () {
                        return this.strictMode ? STRICT_PATTERN : PATTERN;
                    };
                    ENTimeUnitLaterFormatParser.prototype.innerExtract = function (context, match) {
                        var timeUnits = constants_1.parseTimeUnits(match[GROUP_NUM_TIMEUNITS]);
                        if (!timeUnits) {
                            return null;
                        }
                        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                    };
                    return ENTimeUnitLaterFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ENTimeUnitLaterFormatParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../results": 163, "../constants": 35 }], 48: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var PATTERN_WITH_OPTIONAL_PREFIX = new RegExp("(?:(?:within|in|for)\\s*)?" +
                    "(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(".concat(constants_1.TIME_UNITS_PATTERN, ")(?=\\W|$)"), "i");
                var PATTERN_WITH_PREFIX = new RegExp("(?:within|in|for)\\s*" +
                    "(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(".concat(constants_1.TIME_UNITS_PATTERN, ")(?=\\W|$)"), "i");
                var PATTERN_WITH_PREFIX_STRICT = new RegExp("(?:within|in|for)\\s*" +
                    "(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(".concat(constants_1.TIME_UNITS_NO_ABBR_PATTERN, ")(?=\\W|$)"), "i");
                var ENTimeUnitWithinFormatParser = /** @class */ (function (_super) {
                    __extends(ENTimeUnitWithinFormatParser, _super);
                    function ENTimeUnitWithinFormatParser(strictMode) {
                        var _this = _super.call(this) || this;
                        _this.strictMode = strictMode;
                        return _this;
                    }
                    ENTimeUnitWithinFormatParser.prototype.innerPattern = function (context) {
                        if (this.strictMode) {
                            return PATTERN_WITH_PREFIX_STRICT;
                        }
                        return context.option.forwardDate ? PATTERN_WITH_OPTIONAL_PREFIX : PATTERN_WITH_PREFIX;
                    };
                    ENTimeUnitWithinFormatParser.prototype.innerExtract = function (context, match) {
                        if (match[0].match(/^for\s*the\s*\w+/)) {
                            return null;
                        }
                        var timeUnits = constants_1.parseTimeUnits(match[1]);
                        if (!timeUnits) {
                            return null;
                        }
                        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                    };
                    return ENTimeUnitWithinFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ENTimeUnitWithinFormatParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../results": 163, "../constants": 35 }], 49: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var pattern_1 = require("../../../utils/pattern");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var weekdays_1 = require("../../../common/calculation/weekdays");
                var types_1 = require("../../../types");
                var PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
                    "(?:on\\s*?)?" +
                    "(?:(this|last|past|next)\\s*)?" +
                    "(".concat(pattern_1.matchAnyPattern(constants_1.WEEKDAY_DICTIONARY), "|weekend|weekday)") +
                    "(?:\\s*(?:\\,|\\)|\\）))?" +
                    "(?:\\s*(this|last|past|next)\\s*week)?" +
                    "(?=\\W|$)", "i");
                var PREFIX_GROUP = 1;
                var WEEKDAY_GROUP = 2;
                var POSTFIX_GROUP = 3;
                var ENWeekdayParser = /** @class */ (function (_super) {
                    __extends(ENWeekdayParser, _super);
                    function ENWeekdayParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ENWeekdayParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    ENWeekdayParser.prototype.innerExtract = function (context, match) {
                        var prefix = match[PREFIX_GROUP];
                        var postfix = match[POSTFIX_GROUP];
                        var modifierWord = prefix || postfix;
                        modifierWord = modifierWord || "";
                        modifierWord = modifierWord.toLowerCase();
                        var modifier = null;
                        if (modifierWord == "last" || modifierWord == "past") {
                            modifier = "last";
                        }
                        else if (modifierWord == "next") {
                            modifier = "next";
                        }
                        else if (modifierWord == "this") {
                            modifier = "this";
                        }
                        var weekday_word = match[WEEKDAY_GROUP].toLowerCase();
                        var weekday;
                        if (constants_1.WEEKDAY_DICTIONARY[weekday_word] !== undefined) {
                            weekday = constants_1.WEEKDAY_DICTIONARY[weekday_word];
                        }
                        else if (weekday_word == "weekend") {
                            weekday = modifier == "last" ? types_1.Weekday.SUNDAY : types_1.Weekday.SATURDAY;
                        }
                        else if (weekday_word == "weekday") {
                            var refWeekday = context.reference.getDateWithAdjustedTimezone().getDay();
                            if (refWeekday == types_1.Weekday.SUNDAY || refWeekday == types_1.Weekday.SATURDAY) {
                                weekday = modifier == "last" ? types_1.Weekday.FRIDAY : types_1.Weekday.MONDAY;
                            }
                            else {
                                weekday = refWeekday - 1;
                                weekday = modifier == "last" ? weekday - 1 : weekday + 1;
                                weekday = (weekday % 5) + 1;
                            }
                        }
                        else {
                            return null;
                        }
                        return weekdays_1.createParsingComponentsAtWeekday(context.reference, weekday, modifier);
                    };
                    return ENWeekdayParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ENWeekdayParser;
            }, { "../../../common/calculation/weekdays": 6, "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../types": 165, "../../../utils/pattern": 167, "../constants": 35 }], 50: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var pattern_1 = require("../../../utils/pattern");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var PATTERN = new RegExp("([0-9]{4})[-\\.\\/\\s]" +
                    "(?:(".concat(pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY), ")|([0-9]{1,2}))[-\\.\\/\\s]") +
                    "([0-9]{1,2})" +
                    "(?=\\W|$)", "i");
                var YEAR_NUMBER_GROUP = 1;
                var MONTH_NAME_GROUP = 2;
                var MONTH_NUMBER_GROUP = 3;
                var DATE_NUMBER_GROUP = 4;
                var ENYearMonthDayParser = /** @class */ (function (_super) {
                    __extends(ENYearMonthDayParser, _super);
                    function ENYearMonthDayParser(strictMonthDateOrder) {
                        var _this = _super.call(this) || this;
                        _this.strictMonthDateOrder = strictMonthDateOrder;
                        return _this;
                    }
                    ENYearMonthDayParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    ENYearMonthDayParser.prototype.innerExtract = function (context, match) {
                        var _c;
                        var year = parseInt(match[YEAR_NUMBER_GROUP]);
                        var day = parseInt(match[DATE_NUMBER_GROUP]);
                        var month = match[MONTH_NUMBER_GROUP]
                            ? parseInt(match[MONTH_NUMBER_GROUP])
                            : constants_1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
                        if (month < 1 || month > 12) {
                            if (this.strictMonthDateOrder) {
                                return null;
                            }
                            if (day >= 1 && day <= 12) {
                                _c = [day, month], month = _c[0], day = _c[1];
                            }
                        }
                        if (day < 1 || day > 31) {
                            return null;
                        }
                        return {
                            day: day,
                            month: month,
                            year: year,
                        };
                    };
                    return ENYearMonthDayParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ENYearMonthDayParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../utils/pattern": 167, "../constants": 35 }], 51: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var YEAR_SUFFIX_PATTERN = new RegExp("^\\s*(".concat(constants_1.YEAR_PATTERN, ")"), "i");
                var YEAR_GROUP = 1;
                var ENExtractYearSuffixRefiner = /** @class */ (function () {
                    function ENExtractYearSuffixRefiner() {
                    }
                    ENExtractYearSuffixRefiner.prototype.refine = function (context, results) {
                        results.forEach(function (result) {
                            if (!result.start.isDateWithUnknownYear()) {
                                return;
                            }
                            var suffix = context.text.substring(result.index + result.text.length);
                            var match = YEAR_SUFFIX_PATTERN.exec(suffix);
                            if (!match) {
                                return;
                            }
                            context.debug(function () {
                                console.log("Extracting year: '".concat(match[0], "' into : ").concat(result));
                            });
                            var year = constants_1.parseYear(match[YEAR_GROUP]);
                            if (result.end != null) {
                                result.end.assign("year", year);
                            }
                            result.start.assign("year", year);
                            result.text += match[0];
                        });
                        return results;
                    };
                    return ENExtractYearSuffixRefiner;
                }());
                exports.default = ENExtractYearSuffixRefiner;
            }, { "../constants": 35 }], 52: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractMergeDateRangeRefiner_1 = __importDefault(require("../../../common/refiners/AbstractMergeDateRangeRefiner"));
                var ENMergeDateRangeRefiner = /** @class */ (function (_super) {
                    __extends(ENMergeDateRangeRefiner, _super);
                    function ENMergeDateRangeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ENMergeDateRangeRefiner.prototype.patternBetween = function () {
                        return /^\s*(to|-|–|until|through|till)\s*$/i;
                    };
                    return ENMergeDateRangeRefiner;
                }(AbstractMergeDateRangeRefiner_1.default));
                exports.default = ENMergeDateRangeRefiner;
            }, { "../../../common/refiners/AbstractMergeDateRangeRefiner": 12 }], 53: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractMergeDateTimeRefiner_1 = __importDefault(require("../../../common/refiners/AbstractMergeDateTimeRefiner"));
                var ENMergeDateTimeRefiner = /** @class */ (function (_super) {
                    __extends(ENMergeDateTimeRefiner, _super);
                    function ENMergeDateTimeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ENMergeDateTimeRefiner.prototype.patternBetween = function () {
                        return new RegExp("^\\s*(T|at|after|before|on|of|,|-|\\.|∙|:)?\\s*$");
                    };
                    return ENMergeDateTimeRefiner;
                }(AbstractMergeDateTimeRefiner_1.default));
                exports.default = ENMergeDateTimeRefiner;
            }, { "../../../common/refiners/AbstractMergeDateTimeRefiner": 13 }], 54: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var abstractRefiners_1 = require("../../../common/abstractRefiners");
                var results_1 = require("../../../results");
                var constants_1 = require("../constants");
                var timeunits_1 = require("../../../utils/timeunits");
                function IsPositiveFollowingReference(result) {
                    return result.text.match(/^[+-]/i) != null;
                }
                function IsNegativeFollowingReference(result) {
                    return result.text.match(/^-/i) != null;
                }
                var ENMergeRelativeAfterDateRefiner = /** @class */ (function (_super) {
                    __extends(ENMergeRelativeAfterDateRefiner, _super);
                    function ENMergeRelativeAfterDateRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ENMergeRelativeAfterDateRefiner.prototype.shouldMergeResults = function (textBetween, currentResult, nextResult) {
                        if (!textBetween.match(/^\s*$/i)) {
                            return false;
                        }
                        return IsPositiveFollowingReference(nextResult) || IsNegativeFollowingReference(nextResult);
                    };
                    ENMergeRelativeAfterDateRefiner.prototype.mergeResults = function (textBetween, currentResult, nextResult, context) {
                        var timeUnits = constants_1.parseTimeUnits(nextResult.text);
                        if (IsNegativeFollowingReference(nextResult)) {
                            timeUnits = timeunits_1.reverseTimeUnits(timeUnits);
                        }
                        var components = results_1.ParsingComponents.createRelativeFromReference(new results_1.ReferenceWithTimezone(currentResult.start.date()), timeUnits);
                        return new results_1.ParsingResult(currentResult.reference, currentResult.index, "".concat(currentResult.text).concat(textBetween).concat(nextResult.text), components);
                    };
                    return ENMergeRelativeAfterDateRefiner;
                }(abstractRefiners_1.MergingRefiner));
                exports.default = ENMergeRelativeAfterDateRefiner;
            }, { "../../../common/abstractRefiners": 5, "../../../results": 163, "../../../utils/timeunits": 168, "../constants": 35 }], 55: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var abstractRefiners_1 = require("../../../common/abstractRefiners");
                var results_1 = require("../../../results");
                var constants_1 = require("../constants");
                var timeunits_1 = require("../../../utils/timeunits");
                function hasImpliedEarlierReferenceDate(result) {
                    return result.text.match(/\s+(before|from)$/i) != null;
                }
                function hasImpliedLaterReferenceDate(result) {
                    return result.text.match(/\s+(after|since)$/i) != null;
                }
                var ENMergeRelativeFollowByDateRefiner = /** @class */ (function (_super) {
                    __extends(ENMergeRelativeFollowByDateRefiner, _super);
                    function ENMergeRelativeFollowByDateRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ENMergeRelativeFollowByDateRefiner.prototype.patternBetween = function () {
                        return /^\s*$/i;
                    };
                    ENMergeRelativeFollowByDateRefiner.prototype.shouldMergeResults = function (textBetween, currentResult, nextResult) {
                        if (!textBetween.match(this.patternBetween())) {
                            return false;
                        }
                        if (!hasImpliedEarlierReferenceDate(currentResult) && !hasImpliedLaterReferenceDate(currentResult)) {
                            return false;
                        }
                        return !!nextResult.start.get("day") && !!nextResult.start.get("month") && !!nextResult.start.get("year");
                    };
                    ENMergeRelativeFollowByDateRefiner.prototype.mergeResults = function (textBetween, currentResult, nextResult) {
                        var timeUnits = constants_1.parseTimeUnits(currentResult.text);
                        if (hasImpliedEarlierReferenceDate(currentResult)) {
                            timeUnits = timeunits_1.reverseTimeUnits(timeUnits);
                        }
                        var components = results_1.ParsingComponents.createRelativeFromReference(new results_1.ReferenceWithTimezone(nextResult.start.date()), timeUnits);
                        return new results_1.ParsingResult(nextResult.reference, currentResult.index, "".concat(currentResult.text).concat(textBetween).concat(nextResult.text), components);
                    };
                    return ENMergeRelativeFollowByDateRefiner;
                }(abstractRefiners_1.MergingRefiner));
                exports.default = ENMergeRelativeFollowByDateRefiner;
            }, { "../../../common/abstractRefiners": 5, "../../../results": 163, "../../../utils/timeunits": 168, "../constants": 35 }], 56: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var abstractRefiners_1 = require("../../../common/abstractRefiners");
                var ENUnlikelyFormatFilter = /** @class */ (function (_super) {
                    __extends(ENUnlikelyFormatFilter, _super);
                    function ENUnlikelyFormatFilter() {
                        return _super.call(this) || this;
                    }
                    ENUnlikelyFormatFilter.prototype.isValid = function (context, result) {
                        var text = result.text.trim();
                        if (text === context.text.trim()) {
                            return true;
                        }
                        if (text.toLowerCase() === "may") {
                            var textBefore = context.text.substring(0, result.index).trim();
                            if (!textBefore.match(/\b(in)$/i)) {
                                context.debug(function () {
                                    console.log("Removing unlikely result: ".concat(result));
                                });
                                return false;
                            }
                        }
                        if (text.toLowerCase().endsWith("the second")) {
                            var textAfter = context.text.substring(result.index + result.text.length).trim();
                            if (textAfter.length > 0) {
                                context.debug(function () {
                                    console.log("Removing unlikely result: ".concat(result));
                                });
                            }
                            return false;
                        }
                        return true;
                    };
                    return ENUnlikelyFormatFilter;
                }(abstractRefiners_1.Filter));
                exports.default = ENUnlikelyFormatFilter;
            }, { "../../../common/abstractRefiners": 5 }], 57: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;
                var pattern_1 = require("../../utils/pattern");
                exports.WEEKDAY_DICTIONARY = {
                    "domingo": 0,
                    "dom": 0,
                    "lunes": 1,
                    "lun": 1,
                    "martes": 2,
                    "mar": 2,
                    "miércoles": 3,
                    "miercoles": 3,
                    "mié": 3,
                    "mie": 3,
                    "jueves": 4,
                    "jue": 4,
                    "viernes": 5,
                    "vie": 5,
                    "sábado": 6,
                    "sabado": 6,
                    "sáb": 6,
                    "sab": 6,
                };
                exports.MONTH_DICTIONARY = {
                    "enero": 1,
                    "ene": 1,
                    "ene.": 1,
                    "febrero": 2,
                    "feb": 2,
                    "feb.": 2,
                    "marzo": 3,
                    "mar": 3,
                    "mar.": 3,
                    "abril": 4,
                    "abr": 4,
                    "abr.": 4,
                    "mayo": 5,
                    "may": 5,
                    "may.": 5,
                    "junio": 6,
                    "jun": 6,
                    "jun.": 6,
                    "julio": 7,
                    "jul": 7,
                    "jul.": 7,
                    "agosto": 8,
                    "ago": 8,
                    "ago.": 8,
                    "septiembre": 9,
                    "setiembre": 9,
                    "sep": 9,
                    "sep.": 9,
                    "octubre": 10,
                    "oct": 10,
                    "oct.": 10,
                    "noviembre": 11,
                    "nov": 11,
                    "nov.": 11,
                    "diciembre": 12,
                    "dic": 12,
                    "dic.": 12,
                };
                exports.INTEGER_WORD_DICTIONARY = {
                    "uno": 1,
                    "dos": 2,
                    "tres": 3,
                    "cuatro": 4,
                    "cinco": 5,
                    "seis": 6,
                    "siete": 7,
                    "ocho": 8,
                    "nueve": 9,
                    "diez": 10,
                    "once": 11,
                    "doce": 12,
                    "trece": 13,
                };
                exports.TIME_UNIT_DICTIONARY = {
                    "sec": "second",
                    "segundo": "second",
                    "segundos": "second",
                    "min": "minute",
                    "mins": "minute",
                    "minuto": "minute",
                    "minutos": "minute",
                    "h": "hour",
                    "hr": "hour",
                    "hrs": "hour",
                    "hora": "hour",
                    "horas": "hour",
                    "día": "d",
                    "días": "d",
                    "semana": "week",
                    "semanas": "week",
                    "mes": "month",
                    "meses": "month",
                    "cuarto": "quarter",
                    "cuartos": "quarter",
                    "año": "year",
                    "años": "year",
                };
                exports.NUMBER_PATTERN = "(?:".concat(pattern_1.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY), "|[0-9]+|[0-9]+\\.[0-9]+|un?|uno?|una?|algunos?|unos?|demi-?)");
                function parseNumberPattern(match) {
                    var num = match.toLowerCase();
                    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
                        return exports.INTEGER_WORD_DICTIONARY[num];
                    }
                    else if (num === "un" || num === "una" || num === "uno") {
                        return 1;
                    }
                    else if (num.match(/algunos?/)) {
                        return 3;
                    }
                    else if (num.match(/unos?/)) {
                        return 3;
                    }
                    else if (num.match(/media?/)) {
                        return 0.5;
                    }
                    return parseFloat(num);
                }
                exports.parseNumberPattern = parseNumberPattern;
                exports.YEAR_PATTERN = "[0-9]{1,4}(?![^\\s]\\d)(?:\\s*[a|d]\\.?\\s*c\\.?|\\s*a\\.?\\s*d\\.?)?";
                function parseYear(match) {
                    if (match.match(/^[0-9]{1,4}$/)) {
                        var yearNumber = parseInt(match);
                        if (yearNumber < 100) {
                            if (yearNumber > 50) {
                                yearNumber = yearNumber + 1900;
                            }
                            else {
                                yearNumber = yearNumber + 2000;
                            }
                        }
                        return yearNumber;
                    }
                    if (match.match(/a\.?\s*c\.?/i)) {
                        match = match.replace(/a\.?\s*c\.?/i, "");
                        return -parseInt(match);
                    }
                    return parseInt(match);
                }
                exports.parseYear = parseYear;
                var SINGLE_TIME_UNIT_PATTERN = "(".concat(exports.NUMBER_PATTERN, ")\\s{0,5}(").concat(pattern_1.matchAnyPattern(exports.TIME_UNIT_DICTIONARY), ")\\s{0,5}");
                var SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
                exports.TIME_UNITS_PATTERN = pattern_1.repeatedTimeunitPattern("", SINGLE_TIME_UNIT_PATTERN);
                function parseTimeUnits(timeunitText) {
                    var fragments = {};
                    var remainingText = timeunitText;
                    var match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
                    while (match) {
                        collectDateTimeFragment(fragments, match);
                        remainingText = remainingText.substring(match[0].length);
                        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
                    }
                    return fragments;
                }
                exports.parseTimeUnits = parseTimeUnits;
                function collectDateTimeFragment(fragments, match) {
                    var num = parseNumberPattern(match[1]);
                    var unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
                    fragments[unit] = num;
                }
            }, { "../../utils/pattern": 167 }], 58: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = exports.Weekday = exports.Meridiem = exports.ReferenceWithTimezone = exports.ParsingComponents = exports.ParsingResult = exports.Chrono = void 0;
                var configurations_1 = require("../../configurations");
                var chrono_1 = require("../../chrono");
                Object.defineProperty(exports, "Chrono", { enumerable: true, get: function () { return chrono_1.Chrono; } });
                var results_1 = require("../../results");
                Object.defineProperty(exports, "ParsingResult", { enumerable: true, get: function () { return results_1.ParsingResult; } });
                Object.defineProperty(exports, "ParsingComponents", { enumerable: true, get: function () { return results_1.ParsingComponents; } });
                Object.defineProperty(exports, "ReferenceWithTimezone", { enumerable: true, get: function () { return results_1.ReferenceWithTimezone; } });
                var types_1 = require("../../types");
                Object.defineProperty(exports, "Meridiem", { enumerable: true, get: function () { return types_1.Meridiem; } });
                Object.defineProperty(exports, "Weekday", { enumerable: true, get: function () { return types_1.Weekday; } });
                var SlashDateFormatParser_1 = __importDefault(require("../../common/parsers/SlashDateFormatParser"));
                var ESWeekdayParser_1 = __importDefault(require("./parsers/ESWeekdayParser"));
                var ESTimeExpressionParser_1 = __importDefault(require("./parsers/ESTimeExpressionParser"));
                var ESMergeDateTimeRefiner_1 = __importDefault(require("./refiners/ESMergeDateTimeRefiner"));
                var ESMergeDateRangeRefiner_1 = __importDefault(require("./refiners/ESMergeDateRangeRefiner"));
                var ESMonthNameLittleEndianParser_1 = __importDefault(require("./parsers/ESMonthNameLittleEndianParser"));
                var ESCasualDateParser_1 = __importDefault(require("./parsers/ESCasualDateParser"));
                var ESCasualTimeParser_1 = __importDefault(require("./parsers/ESCasualTimeParser"));
                var ESTimeUnitWithinFormatParser_1 = __importDefault(require("./parsers/ESTimeUnitWithinFormatParser"));
                exports.casual = new chrono_1.Chrono(createCasualConfiguration());
                exports.strict = new chrono_1.Chrono(createConfiguration(true));
                function parse(text, ref, option) {
                    return exports.casual.parse(text, ref, option);
                }
                exports.parse = parse;
                function parseDate(text, ref, option) {
                    return exports.casual.parseDate(text, ref, option);
                }
                exports.parseDate = parseDate;
                function createCasualConfiguration(littleEndian) {
                    if (littleEndian === void 0) { littleEndian = true; }
                    var option = createConfiguration(false, littleEndian);
                    option.parsers.push(new ESCasualDateParser_1.default());
                    option.parsers.push(new ESCasualTimeParser_1.default());
                    return option;
                }
                exports.createCasualConfiguration = createCasualConfiguration;
                function createConfiguration(strictMode, littleEndian) {
                    if (strictMode === void 0) { strictMode = true; }
                    if (littleEndian === void 0) { littleEndian = true; }
                    return configurations_1.includeCommonConfiguration({
                        parsers: [
                            new SlashDateFormatParser_1.default(littleEndian),
                            new ESWeekdayParser_1.default(),
                            new ESTimeExpressionParser_1.default(),
                            new ESMonthNameLittleEndianParser_1.default(),
                            new ESTimeUnitWithinFormatParser_1.default(),
                        ],
                        refiners: [new ESMergeDateTimeRefiner_1.default(), new ESMergeDateRangeRefiner_1.default()],
                    }, strictMode);
                }
                exports.createConfiguration = createConfiguration;
            }, { "../../chrono": 4, "../../common/parsers/SlashDateFormatParser": 11, "../../configurations": 20, "../../results": 163, "../../types": 165, "./parsers/ESCasualDateParser": 59, "./parsers/ESCasualTimeParser": 60, "./parsers/ESMonthNameLittleEndianParser": 61, "./parsers/ESTimeExpressionParser": 62, "./parsers/ESTimeUnitWithinFormatParser": 63, "./parsers/ESWeekdayParser": 64, "./refiners/ESMergeDateRangeRefiner": 65, "./refiners/ESMergeDateTimeRefiner": 66 }], 59: [function (require, module, exports) {
                "use strict";
                var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
                }) : (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function (o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule)
                        return mod;
                    var result = {};
                    if (mod != null)
                        for (var k in mod)
                            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                                __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var references = __importStar(require("../../../common/casualReferences"));
                var ESCasualDateParser = /** @class */ (function (_super) {
                    __extends(ESCasualDateParser, _super);
                    function ESCasualDateParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ESCasualDateParser.prototype.innerPattern = function (context) {
                        return /(ahora|hoy|mañana|ayer)(?=\W|$)/i;
                    };
                    ESCasualDateParser.prototype.innerExtract = function (context, match) {
                        var lowerText = match[0].toLowerCase();
                        var component = context.createParsingComponents();
                        switch (lowerText) {
                            case "ahora":
                                return references.now(context.reference);
                            case "hoy":
                                return references.today(context.reference);
                            case "mañana":
                                return references.tomorrow(context.reference);
                            case "ayer":
                                return references.yesterday(context.reference);
                        }
                        return component;
                    };
                    return ESCasualDateParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ESCasualDateParser;
            }, { "../../../common/casualReferences": 7, "../../../common/parsers/AbstractParserWithWordBoundary": 8 }], 60: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var types_1 = require("../../../types");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var dayjs_1 = require("../../../utils/dayjs");
                var dayjs_2 = __importDefault(require("dayjs"));
                var ESCasualTimeParser = /** @class */ (function (_super) {
                    __extends(ESCasualTimeParser, _super);
                    function ESCasualTimeParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ESCasualTimeParser.prototype.innerPattern = function () {
                        return /(?:esta\s*)?(mañana|tarde|medianoche|mediodia|mediodía|noche)(?=\W|$)/i;
                    };
                    ESCasualTimeParser.prototype.innerExtract = function (context, match) {
                        var targetDate = dayjs_2.default(context.refDate);
                        var component = context.createParsingComponents();
                        switch (match[1].toLowerCase()) {
                            case "tarde":
                                component.imply("meridiem", types_1.Meridiem.PM);
                                component.imply("hour", 15);
                                break;
                            case "noche":
                                component.imply("meridiem", types_1.Meridiem.PM);
                                component.imply("hour", 22);
                                break;
                            case "mañana":
                                component.imply("meridiem", types_1.Meridiem.AM);
                                component.imply("hour", 6);
                                break;
                            case "medianoche":
                                dayjs_1.assignTheNextDay(component, targetDate);
                                component.imply("hour", 0);
                                component.imply("minute", 0);
                                component.imply("second", 0);
                                break;
                            case "mediodia":
                            case "mediodía":
                                component.imply("meridiem", types_1.Meridiem.AM);
                                component.imply("hour", 12);
                                break;
                        }
                        return component;
                    };
                    return ESCasualTimeParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ESCasualTimeParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../types": 165, "../../../utils/dayjs": 166, "dayjs": 169 }], 61: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var years_1 = require("../../../calculation/years");
                var constants_1 = require("../constants");
                var constants_2 = require("../constants");
                var pattern_1 = require("../../../utils/pattern");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var PATTERN = new RegExp("([0-9]{1,2})(?:\u00BA|\u00AA|\u00B0)?" +
                    "(?:\\s*(?:desde|de|\\-|\\–|ao?|\\s)\\s*([0-9]{1,2})(?:º|ª|°)?)?\\s*(?:de)?\\s*" +
                    "(?:-|/|\\s*(?:de|,)?\\s*)" +
                    "(".concat(pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY), ")") +
                    "(?:\\s*(?:de|,)?\\s*(".concat(constants_2.YEAR_PATTERN, "))?") +
                    "(?=\\W|$)", "i");
                var DATE_GROUP = 1;
                var DATE_TO_GROUP = 2;
                var MONTH_NAME_GROUP = 3;
                var YEAR_GROUP = 4;
                var ESMonthNameLittleEndianParser = /** @class */ (function (_super) {
                    __extends(ESMonthNameLittleEndianParser, _super);
                    function ESMonthNameLittleEndianParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ESMonthNameLittleEndianParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    ESMonthNameLittleEndianParser.prototype.innerExtract = function (context, match) {
                        var result = context.createParsingResult(match.index, match[0]);
                        var month = constants_1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
                        var day = parseInt(match[DATE_GROUP]);
                        if (day > 31) {
                            match.index = match.index + match[DATE_GROUP].length;
                            return null;
                        }
                        result.start.assign("month", month);
                        result.start.assign("day", day);
                        if (match[YEAR_GROUP]) {
                            var yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
                            result.start.assign("year", yearNumber);
                        }
                        else {
                            var year = years_1.findYearClosestToRef(context.refDate, day, month);
                            result.start.imply("year", year);
                        }
                        if (match[DATE_TO_GROUP]) {
                            var endDate = parseInt(match[DATE_TO_GROUP]);
                            result.end = result.start.clone();
                            result.end.assign("day", endDate);
                        }
                        return result;
                    };
                    return ESMonthNameLittleEndianParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ESMonthNameLittleEndianParser;
            }, { "../../../calculation/years": 3, "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../utils/pattern": 167, "../constants": 57 }], 62: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractTimeExpressionParser_1 = require("../../../common/parsers/AbstractTimeExpressionParser");
                var ESTimeExpressionParser = /** @class */ (function (_super) {
                    __extends(ESTimeExpressionParser, _super);
                    function ESTimeExpressionParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ESTimeExpressionParser.prototype.primaryPrefix = function () {
                        return "(?:(?:aslas|deslas|las?|al?|de|del)\\s*)?";
                    };
                    ESTimeExpressionParser.prototype.followingPhase = function () {
                        return "\\s*(?:\\-|\\–|\\~|\\〜|a(?:l)?|\\?)\\s*";
                    };
                    return ESTimeExpressionParser;
                }(AbstractTimeExpressionParser_1.AbstractTimeExpressionParser));
                exports.default = ESTimeExpressionParser;
            }, { "../../../common/parsers/AbstractTimeExpressionParser": 9 }], 63: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var ESTimeUnitWithinFormatParser = /** @class */ (function (_super) {
                    __extends(ESTimeUnitWithinFormatParser, _super);
                    function ESTimeUnitWithinFormatParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ESTimeUnitWithinFormatParser.prototype.innerPattern = function () {
                        return new RegExp("(?:en|por|durante|de|dentro de)\\s*(".concat(constants_1.TIME_UNITS_PATTERN, ")(?=\\W|$)"), "i");
                    };
                    ESTimeUnitWithinFormatParser.prototype.innerExtract = function (context, match) {
                        var timeUnits = constants_1.parseTimeUnits(match[1]);
                        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                    };
                    return ESTimeUnitWithinFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ESTimeUnitWithinFormatParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../results": 163, "../constants": 57 }], 64: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var pattern_1 = require("../../../utils/pattern");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var weekdays_1 = require("../../../common/calculation/weekdays");
                var PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
                    "(?:(este|esta|pasado|pr[oó]ximo)\\s*)?" +
                    "(".concat(pattern_1.matchAnyPattern(constants_1.WEEKDAY_DICTIONARY), ")") +
                    "(?:\\s*(?:\\,|\\)|\\）))?" +
                    "(?:\\s*(este|esta|pasado|pr[óo]ximo)\\s*semana)?" +
                    "(?=\\W|\\d|$)", "i");
                var PREFIX_GROUP = 1;
                var WEEKDAY_GROUP = 2;
                var POSTFIX_GROUP = 3;
                var ESWeekdayParser = /** @class */ (function (_super) {
                    __extends(ESWeekdayParser, _super);
                    function ESWeekdayParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ESWeekdayParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    ESWeekdayParser.prototype.innerExtract = function (context, match) {
                        var dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
                        var weekday = constants_1.WEEKDAY_DICTIONARY[dayOfWeek];
                        if (weekday === undefined) {
                            return null;
                        }
                        var prefix = match[PREFIX_GROUP];
                        var postfix = match[POSTFIX_GROUP];
                        var norm = prefix || postfix || "";
                        norm = norm.toLowerCase();
                        var modifier = null;
                        if (norm == "pasado") {
                            modifier = "this";
                        }
                        else if (norm == "próximo" || norm == "proximo") {
                            modifier = "next";
                        }
                        else if (norm == "este") {
                            modifier = "this";
                        }
                        return weekdays_1.createParsingComponentsAtWeekday(context.reference, weekday, modifier);
                    };
                    return ESWeekdayParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ESWeekdayParser;
            }, { "../../../common/calculation/weekdays": 6, "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../utils/pattern": 167, "../constants": 57 }], 65: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractMergeDateRangeRefiner_1 = __importDefault(require("../../../common/refiners/AbstractMergeDateRangeRefiner"));
                var ESMergeDateRangeRefiner = /** @class */ (function (_super) {
                    __extends(ESMergeDateRangeRefiner, _super);
                    function ESMergeDateRangeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ESMergeDateRangeRefiner.prototype.patternBetween = function () {
                        return /^\s*(?:-)\s*$/i;
                    };
                    return ESMergeDateRangeRefiner;
                }(AbstractMergeDateRangeRefiner_1.default));
                exports.default = ESMergeDateRangeRefiner;
            }, { "../../../common/refiners/AbstractMergeDateRangeRefiner": 12 }], 66: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractMergeDateTimeRefiner_1 = __importDefault(require("../../../common/refiners/AbstractMergeDateTimeRefiner"));
                var ESMergeDateTimeRefiner = /** @class */ (function (_super) {
                    __extends(ESMergeDateTimeRefiner, _super);
                    function ESMergeDateTimeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ESMergeDateTimeRefiner.prototype.patternBetween = function () {
                        return new RegExp("^\\s*(?:,|de|aslas|a)?\\s*$");
                    };
                    return ESMergeDateTimeRefiner;
                }(AbstractMergeDateTimeRefiner_1.default));
                exports.default = ESMergeDateTimeRefiner;
            }, { "../../../common/refiners/AbstractMergeDateTimeRefiner": 13 }], 67: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseOrdinalNumberPattern = exports.ORDINAL_NUMBER_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;
                var pattern_1 = require("../../utils/pattern");
                exports.WEEKDAY_DICTIONARY = {
                    "dimanche": 0,
                    "dim": 0,
                    "lundi": 1,
                    "lun": 1,
                    "mardi": 2,
                    "mar": 2,
                    "mercredi": 3,
                    "mer": 3,
                    "jeudi": 4,
                    "jeu": 4,
                    "vendredi": 5,
                    "ven": 5,
                    "samedi": 6,
                    "sam": 6,
                };
                exports.MONTH_DICTIONARY = {
                    "janvier": 1,
                    "jan": 1,
                    "jan.": 1,
                    "février": 2,
                    "fév": 2,
                    "fév.": 2,
                    "fevrier": 2,
                    "fev": 2,
                    "fev.": 2,
                    "mars": 3,
                    "mar": 3,
                    "mar.": 3,
                    "avril": 4,
                    "avr": 4,
                    "avr.": 4,
                    "mai": 5,
                    "juin": 6,
                    "jun": 6,
                    "juillet": 7,
                    "juil": 7,
                    "jul": 7,
                    "jul.": 7,
                    "août": 8,
                    "aout": 8,
                    "septembre": 9,
                    "sep": 9,
                    "sep.": 9,
                    "sept": 9,
                    "sept.": 9,
                    "octobre": 10,
                    "oct": 10,
                    "oct.": 10,
                    "novembre": 11,
                    "nov": 11,
                    "nov.": 11,
                    "décembre": 12,
                    "decembre": 12,
                    "dec": 12,
                    "dec.": 12,
                };
                exports.INTEGER_WORD_DICTIONARY = {
                    "un": 1,
                    "deux": 2,
                    "trois": 3,
                    "quatre": 4,
                    "cinq": 5,
                    "six": 6,
                    "sept": 7,
                    "huit": 8,
                    "neuf": 9,
                    "dix": 10,
                    "onze": 11,
                    "douze": 12,
                    "treize": 13,
                };
                exports.TIME_UNIT_DICTIONARY = {
                    "sec": "second",
                    "seconde": "second",
                    "secondes": "second",
                    "min": "minute",
                    "mins": "minute",
                    "minute": "minute",
                    "minutes": "minute",
                    "h": "hour",
                    "hr": "hour",
                    "hrs": "hour",
                    "heure": "hour",
                    "heures": "hour",
                    "jour": "d",
                    "jours": "d",
                    "semaine": "week",
                    "semaines": "week",
                    "mois": "month",
                    "trimestre": "quarter",
                    "trimestres": "quarter",
                    "ans": "year",
                    "année": "year",
                    "années": "year",
                };
                exports.NUMBER_PATTERN = "(?:".concat(pattern_1.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY), "|[0-9]+|[0-9]+\\.[0-9]+|une?\\b|quelques?|demi-?)");
                function parseNumberPattern(match) {
                    var num = match.toLowerCase();
                    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
                        return exports.INTEGER_WORD_DICTIONARY[num];
                    }
                    else if (num === "une" || num === "un") {
                        return 1;
                    }
                    else if (num.match(/quelques?/)) {
                        return 3;
                    }
                    else if (num.match(/demi-?/)) {
                        return 0.5;
                    }
                    return parseFloat(num);
                }
                exports.parseNumberPattern = parseNumberPattern;
                exports.ORDINAL_NUMBER_PATTERN = "(?:[0-9]{1,2}(?:er)?)";
                function parseOrdinalNumberPattern(match) {
                    var num = match.toLowerCase();
                    num = num.replace(/(?:er)$/i, "");
                    return parseInt(num);
                }
                exports.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
                exports.YEAR_PATTERN = "(?:[1-9][0-9]{0,3}\\s*(?:AC|AD|p\\.\\s*C(?:hr?)?\\.\\s*n\\.)|[1-2][0-9]{3}|[5-9][0-9])";
                function parseYear(match) {
                    if (/AC/i.test(match)) {
                        match = match.replace(/BC/i, "");
                        return -parseInt(match);
                    }
                    if (/AD/i.test(match) || /C/i.test(match)) {
                        match = match.replace(/[^\d]+/i, "");
                        return parseInt(match);
                    }
                    var yearNumber = parseInt(match);
                    if (yearNumber < 100) {
                        if (yearNumber > 50) {
                            yearNumber = yearNumber + 1900;
                        }
                        else {
                            yearNumber = yearNumber + 2000;
                        }
                    }
                    return yearNumber;
                }
                exports.parseYear = parseYear;
                var SINGLE_TIME_UNIT_PATTERN = "(".concat(exports.NUMBER_PATTERN, ")\\s{0,5}(").concat(pattern_1.matchAnyPattern(exports.TIME_UNIT_DICTIONARY), ")\\s{0,5}");
                var SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
                exports.TIME_UNITS_PATTERN = pattern_1.repeatedTimeunitPattern("", SINGLE_TIME_UNIT_PATTERN);
                function parseTimeUnits(timeunitText) {
                    var fragments = {};
                    var remainingText = timeunitText;
                    var match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
                    while (match) {
                        collectDateTimeFragment(fragments, match);
                        remainingText = remainingText.substring(match[0].length);
                        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
                    }
                    return fragments;
                }
                exports.parseTimeUnits = parseTimeUnits;
                function collectDateTimeFragment(fragments, match) {
                    var num = parseNumberPattern(match[1]);
                    var unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
                    fragments[unit] = num;
                }
            }, { "../../utils/pattern": 167 }], 68: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = exports.Weekday = exports.Meridiem = exports.ReferenceWithTimezone = exports.ParsingComponents = exports.ParsingResult = exports.Chrono = void 0;
                var configurations_1 = require("../../configurations");
                var chrono_1 = require("../../chrono");
                Object.defineProperty(exports, "Chrono", { enumerable: true, get: function () { return chrono_1.Chrono; } });
                var results_1 = require("../../results");
                Object.defineProperty(exports, "ParsingResult", { enumerable: true, get: function () { return results_1.ParsingResult; } });
                Object.defineProperty(exports, "ParsingComponents", { enumerable: true, get: function () { return results_1.ParsingComponents; } });
                Object.defineProperty(exports, "ReferenceWithTimezone", { enumerable: true, get: function () { return results_1.ReferenceWithTimezone; } });
                var types_1 = require("../../types");
                Object.defineProperty(exports, "Meridiem", { enumerable: true, get: function () { return types_1.Meridiem; } });
                Object.defineProperty(exports, "Weekday", { enumerable: true, get: function () { return types_1.Weekday; } });
                var FRCasualDateParser_1 = __importDefault(require("./parsers/FRCasualDateParser"));
                var FRCasualTimeParser_1 = __importDefault(require("./parsers/FRCasualTimeParser"));
                var SlashDateFormatParser_1 = __importDefault(require("../../common/parsers/SlashDateFormatParser"));
                var FRTimeExpressionParser_1 = __importDefault(require("./parsers/FRTimeExpressionParser"));
                var FRMergeDateTimeRefiner_1 = __importDefault(require("./refiners/FRMergeDateTimeRefiner"));
                var FRMergeDateRangeRefiner_1 = __importDefault(require("./refiners/FRMergeDateRangeRefiner"));
                var FRWeekdayParser_1 = __importDefault(require("./parsers/FRWeekdayParser"));
                var FRSpecificTimeExpressionParser_1 = __importDefault(require("./parsers/FRSpecificTimeExpressionParser"));
                var FRMonthNameLittleEndianParser_1 = __importDefault(require("./parsers/FRMonthNameLittleEndianParser"));
                var FRTimeUnitAgoFormatParser_1 = __importDefault(require("./parsers/FRTimeUnitAgoFormatParser"));
                var FRTimeUnitWithinFormatParser_1 = __importDefault(require("./parsers/FRTimeUnitWithinFormatParser"));
                var FRTimeUnitRelativeFormatParser_1 = __importDefault(require("./parsers/FRTimeUnitRelativeFormatParser"));
                exports.casual = new chrono_1.Chrono(createCasualConfiguration());
                exports.strict = new chrono_1.Chrono(createConfiguration(true));
                function parse(text, ref, option) {
                    return exports.casual.parse(text, ref, option);
                }
                exports.parse = parse;
                function parseDate(text, ref, option) {
                    return exports.casual.parseDate(text, ref, option);
                }
                exports.parseDate = parseDate;
                function createCasualConfiguration(littleEndian) {
                    if (littleEndian === void 0) { littleEndian = true; }
                    var option = createConfiguration(false, littleEndian);
                    option.parsers.unshift(new FRCasualDateParser_1.default());
                    option.parsers.unshift(new FRCasualTimeParser_1.default());
                    option.parsers.unshift(new FRTimeUnitRelativeFormatParser_1.default());
                    return option;
                }
                exports.createCasualConfiguration = createCasualConfiguration;
                function createConfiguration(strictMode, littleEndian) {
                    if (strictMode === void 0) { strictMode = true; }
                    if (littleEndian === void 0) { littleEndian = true; }
                    return configurations_1.includeCommonConfiguration({
                        parsers: [
                            new SlashDateFormatParser_1.default(littleEndian),
                            new FRMonthNameLittleEndianParser_1.default(),
                            new FRTimeExpressionParser_1.default(),
                            new FRSpecificTimeExpressionParser_1.default(),
                            new FRTimeUnitAgoFormatParser_1.default(),
                            new FRTimeUnitWithinFormatParser_1.default(),
                            new FRWeekdayParser_1.default(),
                        ],
                        refiners: [new FRMergeDateTimeRefiner_1.default(), new FRMergeDateRangeRefiner_1.default()],
                    }, strictMode);
                }
                exports.createConfiguration = createConfiguration;
            }, { "../../chrono": 4, "../../common/parsers/SlashDateFormatParser": 11, "../../configurations": 20, "../../results": 163, "../../types": 165, "./parsers/FRCasualDateParser": 69, "./parsers/FRCasualTimeParser": 70, "./parsers/FRMonthNameLittleEndianParser": 71, "./parsers/FRSpecificTimeExpressionParser": 72, "./parsers/FRTimeExpressionParser": 73, "./parsers/FRTimeUnitAgoFormatParser": 74, "./parsers/FRTimeUnitRelativeFormatParser": 75, "./parsers/FRTimeUnitWithinFormatParser": 76, "./parsers/FRWeekdayParser": 77, "./refiners/FRMergeDateRangeRefiner": 78, "./refiners/FRMergeDateTimeRefiner": 79 }], 69: [function (require, module, exports) {
                "use strict";
                var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
                }) : (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function (o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule)
                        return mod;
                    var result = {};
                    if (mod != null)
                        for (var k in mod)
                            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                                __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var dayjs_1 = __importDefault(require("dayjs"));
                var types_1 = require("../../../types");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var dayjs_2 = require("../../../utils/dayjs");
                var references = __importStar(require("../../../common/casualReferences"));
                var FRCasualDateParser = /** @class */ (function (_super) {
                    __extends(FRCasualDateParser, _super);
                    function FRCasualDateParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    FRCasualDateParser.prototype.innerPattern = function (context) {
                        return /(maintenant|aujourd'hui|demain|hier|cette\s*nuit|la\s*veille)(?=\W|$)/i;
                    };
                    FRCasualDateParser.prototype.innerExtract = function (context, match) {
                        var targetDate = dayjs_1.default(context.refDate);
                        var lowerText = match[0].toLowerCase();
                        var component = context.createParsingComponents();
                        switch (lowerText) {
                            case "maintenant":
                                return references.now(context.reference);
                            case "aujourd'hui":
                                return references.today(context.reference);
                            case "hier":
                                return references.yesterday(context.reference);
                            case "demain":
                                return references.tomorrow(context.reference);
                            default:
                                if (lowerText.match(/cette\s*nuit/)) {
                                    dayjs_2.assignSimilarDate(component, targetDate);
                                    component.imply("hour", 22);
                                    component.imply("meridiem", types_1.Meridiem.PM);
                                }
                                else if (lowerText.match(/la\s*veille/)) {
                                    targetDate = targetDate.add(-1, "day");
                                    dayjs_2.assignSimilarDate(component, targetDate);
                                    component.imply("hour", 0);
                                }
                        }
                        return component;
                    };
                    return FRCasualDateParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = FRCasualDateParser;
            }, { "../../../common/casualReferences": 7, "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../types": 165, "../../../utils/dayjs": 166, "dayjs": 169 }], 70: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var types_1 = require("../../../types");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var FRCasualTimeParser = /** @class */ (function (_super) {
                    __extends(FRCasualTimeParser, _super);
                    function FRCasualTimeParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    FRCasualTimeParser.prototype.innerPattern = function (context) {
                        return /(cet?)?\s*(matin|soir|après-midi|aprem|a midi|à minuit)(?=\W|$)/i;
                    };
                    FRCasualTimeParser.prototype.innerExtract = function (context, match) {
                        var suffixLower = match[2].toLowerCase();
                        var component = context.createParsingComponents();
                        switch (suffixLower) {
                            case "après-midi":
                            case "aprem":
                                component.imply("hour", 14);
                                component.imply("minute", 0);
                                component.imply("meridiem", types_1.Meridiem.PM);
                                break;
                            case "soir":
                                component.imply("hour", 18);
                                component.imply("minute", 0);
                                component.imply("meridiem", types_1.Meridiem.PM);
                                break;
                            case "matin":
                                component.imply("hour", 8);
                                component.imply("minute", 0);
                                component.imply("meridiem", types_1.Meridiem.AM);
                                break;
                            case "a midi":
                                component.imply("hour", 12);
                                component.imply("minute", 0);
                                component.imply("meridiem", types_1.Meridiem.AM);
                                break;
                            case "à minuit":
                                component.imply("hour", 0);
                                component.imply("meridiem", types_1.Meridiem.AM);
                                break;
                        }
                        return component;
                    };
                    return FRCasualTimeParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = FRCasualTimeParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../types": 165 }], 71: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var years_1 = require("../../../calculation/years");
                var constants_1 = require("../constants");
                var constants_2 = require("../constants");
                var constants_3 = require("../constants");
                var pattern_1 = require("../../../utils/pattern");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var PATTERN = new RegExp("(?:on\\s*?)?" +
                    "(".concat(constants_3.ORDINAL_NUMBER_PATTERN, ")") +
                    "(?:\\s*(?:au|\\-|\\\u2013|jusqu'au?|\\s)\\s*(".concat(constants_3.ORDINAL_NUMBER_PATTERN, "))?") +
                    "(?:-|/|\\s*(?:de)?\\s*)" +
                    "(".concat(pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY), ")") +
                    "(?:(?:-|/|,?\\s*)(".concat(constants_2.YEAR_PATTERN, "(?![^\\s]\\d)))?") +
                    "(?=\\W|$)", "i");
                var DATE_GROUP = 1;
                var DATE_TO_GROUP = 2;
                var MONTH_NAME_GROUP = 3;
                var YEAR_GROUP = 4;
                var FRMonthNameLittleEndianParser = /** @class */ (function (_super) {
                    __extends(FRMonthNameLittleEndianParser, _super);
                    function FRMonthNameLittleEndianParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    FRMonthNameLittleEndianParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    FRMonthNameLittleEndianParser.prototype.innerExtract = function (context, match) {
                        var result = context.createParsingResult(match.index, match[0]);
                        var month = constants_1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
                        var day = constants_3.parseOrdinalNumberPattern(match[DATE_GROUP]);
                        if (day > 31) {
                            match.index = match.index + match[DATE_GROUP].length;
                            return null;
                        }
                        result.start.assign("month", month);
                        result.start.assign("day", day);
                        if (match[YEAR_GROUP]) {
                            var yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
                            result.start.assign("year", yearNumber);
                        }
                        else {
                            var year = years_1.findYearClosestToRef(context.refDate, day, month);
                            result.start.imply("year", year);
                        }
                        if (match[DATE_TO_GROUP]) {
                            var endDate = constants_3.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
                            result.end = result.start.clone();
                            result.end.assign("day", endDate);
                        }
                        return result;
                    };
                    return FRMonthNameLittleEndianParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = FRMonthNameLittleEndianParser;
            }, { "../../../calculation/years": 3, "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../utils/pattern": 167, "../constants": 67 }], 72: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var types_1 = require("../../../types");
                var FIRST_REG_PATTERN = new RegExp("(^|\\s|T)" +
                    "(?:(?:[àa])\\s*)?" +
                    "(\\d{1,2})(?:h|:)?" +
                    "(?:(\\d{1,2})(?:m|:)?)?" +
                    "(?:(\\d{1,2})(?:s|:)?)?" +
                    "(?:\\s*(A\\.M\\.|P\\.M\\.|AM?|PM?))?" +
                    "(?=\\W|$)", "i");
                var SECOND_REG_PATTERN = new RegExp("^\\s*(\\-|\\–|\\~|\\〜|[àa]|\\?)\\s*" +
                    "(\\d{1,2})(?:h|:)?" +
                    "(?:(\\d{1,2})(?:m|:)?)?" +
                    "(?:(\\d{1,2})(?:s|:)?)?" +
                    "(?:\\s*(A\\.M\\.|P\\.M\\.|AM?|PM?))?" +
                    "(?=\\W|$)", "i");
                var HOUR_GROUP = 2;
                var MINUTE_GROUP = 3;
                var SECOND_GROUP = 4;
                var AM_PM_HOUR_GROUP = 5;
                var FRSpecificTimeExpressionParser = /** @class */ (function () {
                    function FRSpecificTimeExpressionParser() {
                    }
                    FRSpecificTimeExpressionParser.prototype.pattern = function (context) {
                        return FIRST_REG_PATTERN;
                    };
                    FRSpecificTimeExpressionParser.prototype.extract = function (context, match) {
                        var result = context.createParsingResult(match.index + match[1].length, match[0].substring(match[1].length));
                        if (result.text.match(/^\d{4}$/)) {
                            match.index += match[0].length;
                            return null;
                        }
                        result.start = FRSpecificTimeExpressionParser.extractTimeComponent(result.start.clone(), match);
                        if (!result.start) {
                            match.index += match[0].length;
                            return null;
                        }
                        var remainingText = context.text.substring(match.index + match[0].length);
                        var secondMatch = SECOND_REG_PATTERN.exec(remainingText);
                        if (secondMatch) {
                            result.end = FRSpecificTimeExpressionParser.extractTimeComponent(result.start.clone(), secondMatch);
                            if (result.end) {
                                result.text += secondMatch[0];
                            }
                        }
                        return result;
                    };
                    FRSpecificTimeExpressionParser.extractTimeComponent = function (extractingComponents, match) {
                        var hour = 0;
                        var minute = 0;
                        var meridiem = null;
                        hour = parseInt(match[HOUR_GROUP]);
                        if (match[MINUTE_GROUP] != null) {
                            minute = parseInt(match[MINUTE_GROUP]);
                        }
                        if (minute >= 60 || hour > 24) {
                            return null;
                        }
                        if (hour >= 12) {
                            meridiem = types_1.Meridiem.PM;
                        }
                        if (match[AM_PM_HOUR_GROUP] != null) {
                            if (hour > 12)
                                return null;
                            var ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
                            if (ampm == "a") {
                                meridiem = types_1.Meridiem.AM;
                                if (hour == 12) {
                                    hour = 0;
                                }
                            }
                            if (ampm == "p") {
                                meridiem = types_1.Meridiem.PM;
                                if (hour != 12) {
                                    hour += 12;
                                }
                            }
                        }
                        extractingComponents.assign("hour", hour);
                        extractingComponents.assign("minute", minute);
                        if (meridiem !== null) {
                            extractingComponents.assign("meridiem", meridiem);
                        }
                        else {
                            if (hour < 12) {
                                extractingComponents.imply("meridiem", types_1.Meridiem.AM);
                            }
                            else {
                                extractingComponents.imply("meridiem", types_1.Meridiem.PM);
                            }
                        }
                        if (match[SECOND_GROUP] != null) {
                            var second = parseInt(match[SECOND_GROUP]);
                            if (second >= 60)
                                return null;
                            extractingComponents.assign("second", second);
                        }
                        return extractingComponents;
                    };
                    return FRSpecificTimeExpressionParser;
                }());
                exports.default = FRSpecificTimeExpressionParser;
            }, { "../../../types": 165 }], 73: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractTimeExpressionParser_1 = require("../../../common/parsers/AbstractTimeExpressionParser");
                var FRTimeExpressionParser = /** @class */ (function (_super) {
                    __extends(FRTimeExpressionParser, _super);
                    function FRTimeExpressionParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    FRTimeExpressionParser.prototype.primaryPrefix = function () {
                        return "(?:(?:[àa])\\s*)?";
                    };
                    FRTimeExpressionParser.prototype.followingPhase = function () {
                        return "\\s*(?:\\-|\\–|\\~|\\〜|[àa]|\\?)\\s*";
                    };
                    FRTimeExpressionParser.prototype.extractPrimaryTimeComponents = function (context, match) {
                        if (match[0].match(/^\s*\d{4}\s*$/)) {
                            return null;
                        }
                        return _super.prototype.extractPrimaryTimeComponents.call(this, context, match);
                    };
                    return FRTimeExpressionParser;
                }(AbstractTimeExpressionParser_1.AbstractTimeExpressionParser));
                exports.default = FRTimeExpressionParser;
            }, { "../../../common/parsers/AbstractTimeExpressionParser": 9 }], 74: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var timeunits_1 = require("../../../utils/timeunits");
                var FRTimeUnitAgoFormatParser = /** @class */ (function (_super) {
                    __extends(FRTimeUnitAgoFormatParser, _super);
                    function FRTimeUnitAgoFormatParser() {
                        return _super.call(this) || this;
                    }
                    FRTimeUnitAgoFormatParser.prototype.innerPattern = function () {
                        return new RegExp("il y a\\s*(".concat(constants_1.TIME_UNITS_PATTERN, ")(?=(?:\\W|$))"), "i");
                    };
                    FRTimeUnitAgoFormatParser.prototype.innerExtract = function (context, match) {
                        var timeUnits = constants_1.parseTimeUnits(match[1]);
                        var outputTimeUnits = timeunits_1.reverseTimeUnits(timeUnits);
                        return results_1.ParsingComponents.createRelativeFromReference(context.reference, outputTimeUnits);
                    };
                    return FRTimeUnitAgoFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = FRTimeUnitAgoFormatParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../results": 163, "../../../utils/timeunits": 168, "../constants": 67 }], 75: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var timeunits_1 = require("../../../utils/timeunits");
                var pattern_1 = require("../../../utils/pattern");
                var FRTimeUnitAgoFormatParser = /** @class */ (function (_super) {
                    __extends(FRTimeUnitAgoFormatParser, _super);
                    function FRTimeUnitAgoFormatParser() {
                        return _super.call(this) || this;
                    }
                    FRTimeUnitAgoFormatParser.prototype.innerPattern = function () {
                        return new RegExp("(?:les?|la|l'|du|des?)\\s*" +
                            "(".concat(constants_1.NUMBER_PATTERN, ")?") +
                            "(?:\\s*(prochaine?s?|derni[e\u00E8]re?s?|pass[\u00E9e]e?s?|pr[\u00E9e]c[\u00E9e]dents?|suivante?s?))?" +
                            "\\s*(".concat(pattern_1.matchAnyPattern(constants_1.TIME_UNIT_DICTIONARY), ")") +
                            "(?:\\s*(prochaine?s?|derni[e\u00E8]re?s?|pass[\u00E9e]e?s?|pr[\u00E9e]c[\u00E9e]dents?|suivante?s?))?", "i");
                    };
                    FRTimeUnitAgoFormatParser.prototype.innerExtract = function (context, match) {
                        var num = match[1] ? constants_1.parseNumberPattern(match[1]) : 1;
                        var unit = constants_1.TIME_UNIT_DICTIONARY[match[3].toLowerCase()];
                        var timeUnits = {};
                        timeUnits[unit] = num;
                        var modifier = match[2] || match[4] || "";
                        modifier = modifier.toLowerCase();
                        if (!modifier) {
                            return;
                        }
                        if (/derni[eè]re?s?/.test(modifier) || /pass[ée]e?s?/.test(modifier) || /pr[ée]c[ée]dents?/.test(modifier)) {
                            timeUnits = timeunits_1.reverseTimeUnits(timeUnits);
                        }
                        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                    };
                    return FRTimeUnitAgoFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = FRTimeUnitAgoFormatParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../results": 163, "../../../utils/pattern": 167, "../../../utils/timeunits": 168, "../constants": 67 }], 76: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var FRTimeUnitWithinFormatParser = /** @class */ (function (_super) {
                    __extends(FRTimeUnitWithinFormatParser, _super);
                    function FRTimeUnitWithinFormatParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    FRTimeUnitWithinFormatParser.prototype.innerPattern = function () {
                        return new RegExp("(?:dans|en|pour|pendant|de)\\s*(".concat(constants_1.TIME_UNITS_PATTERN, ")(?=\\W|$)"), "i");
                    };
                    FRTimeUnitWithinFormatParser.prototype.innerExtract = function (context, match) {
                        var timeUnits = constants_1.parseTimeUnits(match[1]);
                        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                    };
                    return FRTimeUnitWithinFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = FRTimeUnitWithinFormatParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../results": 163, "../constants": 67 }], 77: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var pattern_1 = require("../../../utils/pattern");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var weekdays_1 = require("../../../common/calculation/weekdays");
                var PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
                    "(?:(?:ce)\\s*)?" +
                    "(".concat(pattern_1.matchAnyPattern(constants_1.WEEKDAY_DICTIONARY), ")") +
                    "(?:\\s*(?:\\,|\\)|\\）))?" +
                    "(?:\\s*(dernier|prochain)\\s*)?" +
                    "(?=\\W|\\d|$)", "i");
                var WEEKDAY_GROUP = 1;
                var POSTFIX_GROUP = 2;
                var FRWeekdayParser = /** @class */ (function (_super) {
                    __extends(FRWeekdayParser, _super);
                    function FRWeekdayParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    FRWeekdayParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    FRWeekdayParser.prototype.innerExtract = function (context, match) {
                        var dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
                        var weekday = constants_1.WEEKDAY_DICTIONARY[dayOfWeek];
                        if (weekday === undefined) {
                            return null;
                        }
                        var suffix = match[POSTFIX_GROUP];
                        suffix = suffix || "";
                        suffix = suffix.toLowerCase();
                        var modifier = null;
                        if (suffix == "dernier") {
                            modifier = "last";
                        }
                        else if (suffix == "prochain") {
                            modifier = "next";
                        }
                        return weekdays_1.createParsingComponentsAtWeekday(context.reference, weekday, modifier);
                    };
                    return FRWeekdayParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = FRWeekdayParser;
            }, { "../../../common/calculation/weekdays": 6, "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../utils/pattern": 167, "../constants": 67 }], 78: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractMergeDateRangeRefiner_1 = __importDefault(require("../../../common/refiners/AbstractMergeDateRangeRefiner"));
                var FRMergeDateRangeRefiner = /** @class */ (function (_super) {
                    __extends(FRMergeDateRangeRefiner, _super);
                    function FRMergeDateRangeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    FRMergeDateRangeRefiner.prototype.patternBetween = function () {
                        return /^\s*(à|a|au|-)\s*$/i;
                    };
                    return FRMergeDateRangeRefiner;
                }(AbstractMergeDateRangeRefiner_1.default));
                exports.default = FRMergeDateRangeRefiner;
            }, { "../../../common/refiners/AbstractMergeDateRangeRefiner": 12 }], 79: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractMergeDateTimeRefiner_1 = __importDefault(require("../../../common/refiners/AbstractMergeDateTimeRefiner"));
                var FRMergeDateTimeRefiner = /** @class */ (function (_super) {
                    __extends(FRMergeDateTimeRefiner, _super);
                    function FRMergeDateTimeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    FRMergeDateTimeRefiner.prototype.patternBetween = function () {
                        return new RegExp("^\\s*(T|à|a|au|vers|de|,|-)?\\s*$");
                    };
                    return FRMergeDateTimeRefiner;
                }(AbstractMergeDateTimeRefiner_1.default));
                exports.default = FRMergeDateTimeRefiner;
            }, { "../../../common/refiners/AbstractMergeDateTimeRefiner": 13 }], 80: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.toHankaku = void 0;
                function toHankaku(text) {
                    return String(text)
                        .replace(/\u2019/g, "\u0027")
                        .replace(/\u201D/g, "\u0022")
                        .replace(/\u3000/g, "\u0020")
                        .replace(/\uFFE5/g, "\u00A5")
                        .replace(/[\uFF01\uFF03-\uFF06\uFF08\uFF09\uFF0C-\uFF19\uFF1C-\uFF1F\uFF21-\uFF3B\uFF3D\uFF3F\uFF41-\uFF5B\uFF5D\uFF5E]/g, alphaNum);
                }
                exports.toHankaku = toHankaku;
                function alphaNum(token) {
                    return String.fromCharCode(token.charCodeAt(0) - 65248);
                }
            }, {}], 81: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = exports.Weekday = exports.Meridiem = exports.ReferenceWithTimezone = exports.ParsingComponents = exports.ParsingResult = exports.Chrono = void 0;
                var JPStandardParser_1 = __importDefault(require("./parsers/JPStandardParser"));
                var JPMergeDateRangeRefiner_1 = __importDefault(require("./refiners/JPMergeDateRangeRefiner"));
                var JPCasualDateParser_1 = __importDefault(require("./parsers/JPCasualDateParser"));
                var chrono_1 = require("../../chrono");
                Object.defineProperty(exports, "Chrono", { enumerable: true, get: function () { return chrono_1.Chrono; } });
                var results_1 = require("../../results");
                Object.defineProperty(exports, "ParsingResult", { enumerable: true, get: function () { return results_1.ParsingResult; } });
                Object.defineProperty(exports, "ParsingComponents", { enumerable: true, get: function () { return results_1.ParsingComponents; } });
                Object.defineProperty(exports, "ReferenceWithTimezone", { enumerable: true, get: function () { return results_1.ReferenceWithTimezone; } });
                var types_1 = require("../../types");
                Object.defineProperty(exports, "Meridiem", { enumerable: true, get: function () { return types_1.Meridiem; } });
                Object.defineProperty(exports, "Weekday", { enumerable: true, get: function () { return types_1.Weekday; } });
                exports.casual = new chrono_1.Chrono(createCasualConfiguration());
                exports.strict = new chrono_1.Chrono(createConfiguration());
                function parse(text, ref, option) {
                    return exports.casual.parse(text, ref, option);
                }
                exports.parse = parse;
                function parseDate(text, ref, option) {
                    return exports.casual.parseDate(text, ref, option);
                }
                exports.parseDate = parseDate;
                function createCasualConfiguration() {
                    var option = createConfiguration();
                    option.parsers.unshift(new JPCasualDateParser_1.default());
                    return option;
                }
                exports.createCasualConfiguration = createCasualConfiguration;
                function createConfiguration() {
                    return {
                        parsers: [new JPStandardParser_1.default()],
                        refiners: [new JPMergeDateRangeRefiner_1.default()],
                    };
                }
                exports.createConfiguration = createConfiguration;
            }, { "../../chrono": 4, "../../results": 163, "../../types": 165, "./parsers/JPCasualDateParser": 82, "./parsers/JPStandardParser": 83, "./refiners/JPMergeDateRangeRefiner": 84 }], 82: [function (require, module, exports) {
                "use strict";
                var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
                }) : (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function (o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule)
                        return mod;
                    var result = {};
                    if (mod != null)
                        for (var k in mod)
                            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                                __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var dayjs_1 = __importDefault(require("dayjs"));
                var types_1 = require("../../../types");
                var references = __importStar(require("../../../common/casualReferences"));
                var PATTERN = /今日|きょう|当日|とうじつ|昨日|きのう|明日|あした|今夜|こんや|今夕|こんゆう|今晩|こんばん|今朝|けさ/i;
                function normalizeTextToKanji(text) {
                    switch (text) {
                        case "きょう":
                            return "今日";
                        case "とうじつ":
                            return "当日";
                        case "きのう":
                            return "昨日";
                        case "あした":
                            return "明日";
                        case "こんや":
                            return "今夜";
                        case "こんゆう":
                            return "今夕";
                        case "こんばん":
                            return "今晩";
                        case "けさ":
                            return "今朝";
                        default:
                            return text;
                    }
                }
                var JPCasualDateParser = /** @class */ (function () {
                    function JPCasualDateParser() {
                    }
                    JPCasualDateParser.prototype.pattern = function () {
                        return PATTERN;
                    };
                    JPCasualDateParser.prototype.extract = function (context, match) {
                        var text = normalizeTextToKanji(match[0]);
                        var date = dayjs_1.default(context.refDate);
                        var components = context.createParsingComponents();
                        switch (text) {
                            case "昨日":
                                return references.yesterday(context.reference);
                            case "明日":
                                return references.tomorrow(context.reference);
                            case "今日":
                            case "当日":
                                return references.today(context.reference);
                        }
                        if (text == "今夜" || text == "今夕" || text == "今晩") {
                            components.imply("hour", 22);
                            components.assign("meridiem", types_1.Meridiem.PM);
                        }
                        else if (text.match("今朝")) {
                            components.imply("hour", 6);
                            components.assign("meridiem", types_1.Meridiem.AM);
                        }
                        components.assign("day", date.date());
                        components.assign("month", date.month() + 1);
                        components.assign("year", date.year());
                        return components;
                    };
                    return JPCasualDateParser;
                }());
                exports.default = JPCasualDateParser;
            }, { "../../../common/casualReferences": 7, "../../../types": 165, "dayjs": 169 }], 83: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var years_1 = require("../../../calculation/years");
                var dayjs_1 = __importDefault(require("dayjs"));
                var PATTERN = /(?:(?:([同今本])|((昭和|平成|令和)?([0-9０-９]{1,4}|元)))年\s*)?([0-9０-９]{1,2})月\s*([0-9０-９]{1,2})日/i;
                var SPECIAL_YEAR_GROUP = 1;
                var TYPICAL_YEAR_GROUP = 2;
                var ERA_GROUP = 3;
                var YEAR_NUMBER_GROUP = 4;
                var MONTH_GROUP = 5;
                var DAY_GROUP = 6;
                var JPStandardParser = /** @class */ (function () {
                    function JPStandardParser() {
                    }
                    JPStandardParser.prototype.pattern = function () {
                        return PATTERN;
                    };
                    JPStandardParser.prototype.extract = function (context, match) {
                        var month = parseInt(constants_1.toHankaku(match[MONTH_GROUP]));
                        var day = parseInt(constants_1.toHankaku(match[DAY_GROUP]));
                        var components = context.createParsingComponents({
                            day: day,
                            month: month,
                        });
                        if (match[SPECIAL_YEAR_GROUP] && match[SPECIAL_YEAR_GROUP].match("同|今|本")) {
                            var moment = dayjs_1.default(context.refDate);
                            components.assign("year", moment.year());
                        }
                        if (match[TYPICAL_YEAR_GROUP]) {
                            var yearNumText = match[YEAR_NUMBER_GROUP];
                            var year = yearNumText == "元" ? 1 : parseInt(constants_1.toHankaku(yearNumText));
                            if (match[ERA_GROUP] == "令和") {
                                year += 2018;
                            }
                            else if (match[ERA_GROUP] == "平成") {
                                year += 1988;
                            }
                            else if (match[ERA_GROUP] == "昭和") {
                                year += 1925;
                            }
                            components.assign("year", year);
                        }
                        else {
                            var year = years_1.findYearClosestToRef(context.refDate, day, month);
                            components.imply("year", year);
                        }
                        return components;
                    };
                    return JPStandardParser;
                }());
                exports.default = JPStandardParser;
            }, { "../../../calculation/years": 3, "../constants": 80, "dayjs": 169 }], 84: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractMergeDateRangeRefiner_1 = __importDefault(require("../../../common/refiners/AbstractMergeDateRangeRefiner"));
                var JPMergeDateRangeRefiner = /** @class */ (function (_super) {
                    __extends(JPMergeDateRangeRefiner, _super);
                    function JPMergeDateRangeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    JPMergeDateRangeRefiner.prototype.patternBetween = function () {
                        return /^\s*(から|ー|-)\s*$/i;
                    };
                    return JPMergeDateRangeRefiner;
                }(AbstractMergeDateRangeRefiner_1.default));
                exports.default = JPMergeDateRangeRefiner;
            }, { "../../../common/refiners/AbstractMergeDateRangeRefiner": 12 }], 85: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseOrdinalNumberPattern = exports.ORDINAL_NUMBER_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.ORDINAL_WORD_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;
                var pattern_1 = require("../../utils/pattern");
                var years_1 = require("../../calculation/years");
                exports.WEEKDAY_DICTIONARY = {
                    zondag: 0,
                    zon: 0,
                    "zon.": 0,
                    zo: 0,
                    "zo.": 0,
                    maandag: 1,
                    ma: 1,
                    "ma.": 1,
                    dinsdag: 2,
                    din: 2,
                    "din.": 2,
                    di: 2,
                    "di.": 2,
                    woensdag: 3,
                    woe: 3,
                    "woe.": 3,
                    wo: 3,
                    "wo.": 3,
                    donderdag: 4,
                    dond: 4,
                    "dond.": 4,
                    do: 4,
                    "do.": 4,
                    vrijdag: 5,
                    vrij: 5,
                    "vrij.": 5,
                    vr: 5,
                    "vr.": 5,
                    zaterdag: 6,
                    zat: 6,
                    "zat.": 6,
                    "za": 6,
                    "za.": 6,
                };
                exports.MONTH_DICTIONARY = {
                    januari: 1,
                    jan: 1,
                    "jan.": 1,
                    februari: 2,
                    feb: 2,
                    "feb.": 2,
                    maart: 3,
                    mar: 3,
                    "mar.": 3,
                    mrt: 3,
                    "mrt.": 3,
                    april: 4,
                    apr: 4,
                    "apr.": 4,
                    mei: 5,
                    juni: 6,
                    jun: 6,
                    "jun.": 6,
                    juli: 7,
                    jul: 7,
                    "jul.": 7,
                    augustus: 8,
                    aug: 8,
                    "aug.": 8,
                    september: 9,
                    sep: 9,
                    "sep.": 9,
                    sept: 9,
                    "sept.": 9,
                    oktober: 10,
                    okt: 10,
                    "okt.": 10,
                    november: 11,
                    nov: 11,
                    "nov.": 11,
                    december: 12,
                    dec: 12,
                    "dec.": 12,
                };
                exports.INTEGER_WORD_DICTIONARY = {
                    een: 1,
                    twee: 2,
                    drie: 3,
                    vier: 4,
                    vijf: 5,
                    zes: 6,
                    zeven: 7,
                    acht: 8,
                    negen: 9,
                    tien: 10,
                    elf: 11,
                    twaalf: 12,
                };
                exports.ORDINAL_WORD_DICTIONARY = {
                    eerste: 1,
                    tweede: 2,
                    derde: 3,
                    vierde: 4,
                    vijfde: 5,
                    zesde: 6,
                    zevende: 7,
                    achtste: 8,
                    negende: 9,
                    tiende: 10,
                    elfde: 11,
                    twaalfde: 12,
                    dertiende: 13,
                    veertiende: 14,
                    vijftiende: 15,
                    zestiende: 16,
                    zeventiende: 17,
                    achttiende: 18,
                    negentiende: 19,
                    twintigste: 20,
                    "eenentwintigste": 21,
                    "tweeëntwintigste": 22,
                    "drieentwintigste": 23,
                    "vierentwintigste": 24,
                    "vijfentwintigste": 25,
                    "zesentwintigste": 26,
                    "zevenentwintigste": 27,
                    "achtentwintig": 28,
                    "negenentwintig": 29,
                    "dertigste": 30,
                    "eenendertigste": 31,
                };
                exports.TIME_UNIT_DICTIONARY = {
                    sec: "second",
                    second: "second",
                    seconden: "second",
                    min: "minute",
                    mins: "minute",
                    minute: "minute",
                    minuut: "minute",
                    minuten: "minute",
                    minuutje: "minute",
                    h: "hour",
                    hr: "hour",
                    hrs: "hour",
                    uur: "hour",
                    u: "hour",
                    uren: "hour",
                    dag: "d",
                    dagen: "d",
                    week: "week",
                    weken: "week",
                    maand: "month",
                    maanden: "month",
                    jaar: "year",
                    jr: "year",
                    jaren: "year",
                };
                exports.NUMBER_PATTERN = "(?:".concat(pattern_1.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY), "|[0-9]+|[0-9]+[\\.,][0-9]+|halve?|half|paar)");
                function parseNumberPattern(match) {
                    var num = match.toLowerCase();
                    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
                        return exports.INTEGER_WORD_DICTIONARY[num];
                    }
                    else if (num === "paar") {
                        return 2;
                    }
                    else if (num === "half" || num.match(/halve?/)) {
                        return 0.5;
                    }
                    return parseFloat(num.replace(",", "."));
                }
                exports.parseNumberPattern = parseNumberPattern;
                exports.ORDINAL_NUMBER_PATTERN = "(?:".concat(pattern_1.matchAnyPattern(exports.ORDINAL_WORD_DICTIONARY), "|[0-9]{1,2}(?:ste|de)?)");
                function parseOrdinalNumberPattern(match) {
                    var num = match.toLowerCase();
                    if (exports.ORDINAL_WORD_DICTIONARY[num] !== undefined) {
                        return exports.ORDINAL_WORD_DICTIONARY[num];
                    }
                    num = num.replace(/(?:ste|de)$/i, "");
                    return parseInt(num);
                }
                exports.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
                exports.YEAR_PATTERN = "(?:[1-9][0-9]{0,3}\\s*(?:voor Christus|na Christus)|[1-2][0-9]{3}|[5-9][0-9])";
                function parseYear(match) {
                    if (/voor Christus/i.test(match)) {
                        match = match.replace(/voor Christus/i, "");
                        return -parseInt(match);
                    }
                    if (/na Christus/i.test(match)) {
                        match = match.replace(/na Christus/i, "");
                        return parseInt(match);
                    }
                    var rawYearNumber = parseInt(match);
                    return years_1.findMostLikelyADYear(rawYearNumber);
                }
                exports.parseYear = parseYear;
                var SINGLE_TIME_UNIT_PATTERN = "(".concat(exports.NUMBER_PATTERN, ")\\s{0,5}(").concat(pattern_1.matchAnyPattern(exports.TIME_UNIT_DICTIONARY), ")\\s{0,5}");
                var SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
                exports.TIME_UNITS_PATTERN = pattern_1.repeatedTimeunitPattern("(?:(?:binnen|in)\\s*)?", SINGLE_TIME_UNIT_PATTERN);
                function parseTimeUnits(timeunitText) {
                    var fragments = {};
                    var remainingText = timeunitText;
                    var match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
                    while (match) {
                        collectDateTimeFragment(fragments, match);
                        remainingText = remainingText.substring(match[0].length);
                        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
                    }
                    return fragments;
                }
                exports.parseTimeUnits = parseTimeUnits;
                function collectDateTimeFragment(fragments, match) {
                    var num = parseNumberPattern(match[1]);
                    var unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
                    fragments[unit] = num;
                }
            }, { "../../calculation/years": 3, "../../utils/pattern": 167 }], 86: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = exports.Weekday = exports.Meridiem = exports.ReferenceWithTimezone = exports.ParsingComponents = exports.ParsingResult = exports.Chrono = void 0;
                var configurations_1 = require("../../configurations");
                var chrono_1 = require("../../chrono");
                Object.defineProperty(exports, "Chrono", { enumerable: true, get: function () { return chrono_1.Chrono; } });
                var results_1 = require("../../results");
                Object.defineProperty(exports, "ParsingResult", { enumerable: true, get: function () { return results_1.ParsingResult; } });
                Object.defineProperty(exports, "ParsingComponents", { enumerable: true, get: function () { return results_1.ParsingComponents; } });
                Object.defineProperty(exports, "ReferenceWithTimezone", { enumerable: true, get: function () { return results_1.ReferenceWithTimezone; } });
                var types_1 = require("../../types");
                Object.defineProperty(exports, "Meridiem", { enumerable: true, get: function () { return types_1.Meridiem; } });
                Object.defineProperty(exports, "Weekday", { enumerable: true, get: function () { return types_1.Weekday; } });
                var NLMergeDateRangeRefiner_1 = __importDefault(require("./refiners/NLMergeDateRangeRefiner"));
                var NLMergeDateTimeRefiner_1 = __importDefault(require("./refiners/NLMergeDateTimeRefiner"));
                var NLCasualDateParser_1 = __importDefault(require("./parsers/NLCasualDateParser"));
                var NLCasualTimeParser_1 = __importDefault(require("./parsers/NLCasualTimeParser"));
                var SlashDateFormatParser_1 = __importDefault(require("../../common/parsers/SlashDateFormatParser"));
                var NLTimeUnitWithinFormatParser_1 = __importDefault(require("./parsers/NLTimeUnitWithinFormatParser"));
                var NLWeekdayParser_1 = __importDefault(require("./parsers/NLWeekdayParser"));
                var NLMonthNameMiddleEndianParser_1 = __importDefault(require("./parsers/NLMonthNameMiddleEndianParser"));
                var NLMonthNameParser_1 = __importDefault(require("./parsers/NLMonthNameParser"));
                var NLSlashMonthFormatParser_1 = __importDefault(require("./parsers/NLSlashMonthFormatParser"));
                var NLTimeExpressionParser_1 = __importDefault(require("./parsers/NLTimeExpressionParser"));
                var NLCasualYearMonthDayParser_1 = __importDefault(require("./parsers/NLCasualYearMonthDayParser"));
                var NLCasualDateTimeParser_1 = __importDefault(require("./parsers/NLCasualDateTimeParser"));
                var NLTimeUnitCasualRelativeFormatParser_1 = __importDefault(require("./parsers/NLTimeUnitCasualRelativeFormatParser"));
                var NLRelativeDateFormatParser_1 = __importDefault(require("./parsers/NLRelativeDateFormatParser"));
                var NLTimeUnitAgoFormatParser_1 = __importDefault(require("./parsers/NLTimeUnitAgoFormatParser"));
                var NLTimeUnitLaterFormatParser_1 = __importDefault(require("./parsers/NLTimeUnitLaterFormatParser"));
                exports.casual = new chrono_1.Chrono(createCasualConfiguration());
                exports.strict = new chrono_1.Chrono(createConfiguration(true));
                function parse(text, ref, option) {
                    return exports.casual.parse(text, ref, option);
                }
                exports.parse = parse;
                function parseDate(text, ref, option) {
                    return exports.casual.parseDate(text, ref, option);
                }
                exports.parseDate = parseDate;
                function createCasualConfiguration(littleEndian) {
                    if (littleEndian === void 0) { littleEndian = true; }
                    var option = createConfiguration(false, littleEndian);
                    option.parsers.unshift(new NLCasualDateParser_1.default());
                    option.parsers.unshift(new NLCasualTimeParser_1.default());
                    option.parsers.unshift(new NLCasualDateTimeParser_1.default());
                    option.parsers.unshift(new NLMonthNameParser_1.default());
                    option.parsers.unshift(new NLRelativeDateFormatParser_1.default());
                    option.parsers.unshift(new NLTimeUnitCasualRelativeFormatParser_1.default());
                    return option;
                }
                exports.createCasualConfiguration = createCasualConfiguration;
                function createConfiguration(strictMode, littleEndian) {
                    if (strictMode === void 0) { strictMode = true; }
                    if (littleEndian === void 0) { littleEndian = true; }
                    return configurations_1.includeCommonConfiguration({
                        parsers: [
                            new SlashDateFormatParser_1.default(littleEndian),
                            new NLTimeUnitWithinFormatParser_1.default(),
                            new NLMonthNameMiddleEndianParser_1.default(),
                            new NLMonthNameParser_1.default(),
                            new NLWeekdayParser_1.default(),
                            new NLCasualYearMonthDayParser_1.default(),
                            new NLSlashMonthFormatParser_1.default(),
                            new NLTimeExpressionParser_1.default(strictMode),
                            new NLTimeUnitAgoFormatParser_1.default(strictMode),
                            new NLTimeUnitLaterFormatParser_1.default(strictMode),
                        ],
                        refiners: [new NLMergeDateTimeRefiner_1.default(), new NLMergeDateRangeRefiner_1.default()],
                    }, strictMode);
                }
                exports.createConfiguration = createConfiguration;
            }, { "../../chrono": 4, "../../common/parsers/SlashDateFormatParser": 11, "../../configurations": 20, "../../results": 163, "../../types": 165, "./parsers/NLCasualDateParser": 87, "./parsers/NLCasualDateTimeParser": 88, "./parsers/NLCasualTimeParser": 89, "./parsers/NLCasualYearMonthDayParser": 90, "./parsers/NLMonthNameMiddleEndianParser": 91, "./parsers/NLMonthNameParser": 92, "./parsers/NLRelativeDateFormatParser": 93, "./parsers/NLSlashMonthFormatParser": 94, "./parsers/NLTimeExpressionParser": 95, "./parsers/NLTimeUnitAgoFormatParser": 96, "./parsers/NLTimeUnitCasualRelativeFormatParser": 97, "./parsers/NLTimeUnitLaterFormatParser": 98, "./parsers/NLTimeUnitWithinFormatParser": 99, "./parsers/NLWeekdayParser": 100, "./refiners/NLMergeDateRangeRefiner": 101, "./refiners/NLMergeDateTimeRefiner": 102 }], 87: [function (require, module, exports) {
                "use strict";
                var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
                }) : (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function (o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule)
                        return mod;
                    var result = {};
                    if (mod != null)
                        for (var k in mod)
                            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                                __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var references = __importStar(require("../../../common/casualReferences"));
                var NLCasualDateParser = /** @class */ (function (_super) {
                    __extends(NLCasualDateParser, _super);
                    function NLCasualDateParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    NLCasualDateParser.prototype.innerPattern = function (context) {
                        return /(nu|vandaag|morgen|morgend|gisteren)(?=\W|$)/i;
                    };
                    NLCasualDateParser.prototype.innerExtract = function (context, match) {
                        var lowerText = match[0].toLowerCase();
                        var component = context.createParsingComponents();
                        switch (lowerText) {
                            case "nu":
                                return references.now(context.reference);
                            case "vandaag":
                                return references.today(context.reference);
                            case "morgen":
                            case "morgend":
                                return references.tomorrow(context.reference);
                            case "gisteren":
                                return references.yesterday(context.reference);
                        }
                        return component;
                    };
                    return NLCasualDateParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = NLCasualDateParser;
            }, { "../../../common/casualReferences": 7, "../../../common/parsers/AbstractParserWithWordBoundary": 8 }], 88: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var types_1 = require("../../../types");
                var dayjs_1 = require("../../../utils/dayjs");
                var dayjs_2 = __importDefault(require("dayjs"));
                var DATE_GROUP = 1;
                var TIME_OF_DAY_GROUP = 2;
                var NLCasualDateTimeParser = /** @class */ (function (_super) {
                    __extends(NLCasualDateTimeParser, _super);
                    function NLCasualDateTimeParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    NLCasualDateTimeParser.prototype.innerPattern = function (context) {
                        return /(gisteren|morgen|van)(ochtend|middag|namiddag|avond|nacht)(?=\W|$)/i;
                    };
                    NLCasualDateTimeParser.prototype.innerExtract = function (context, match) {
                        var dateText = match[DATE_GROUP].toLowerCase();
                        var timeText = match[TIME_OF_DAY_GROUP].toLowerCase();
                        var component = context.createParsingComponents();
                        var targetDate = dayjs_2.default(context.refDate);
                        switch (dateText) {
                            case "gisteren":
                                dayjs_1.assignSimilarDate(component, targetDate.add(-1, "day"));
                                break;
                            case "van":
                                dayjs_1.assignSimilarDate(component, targetDate);
                                break;
                            case "morgen":
                                dayjs_1.assignTheNextDay(component, targetDate);
                                break;
                        }
                        switch (timeText) {
                            case "ochtend":
                                component.imply("meridiem", types_1.Meridiem.AM);
                                component.imply("hour", 6);
                                break;
                            case "middag":
                                component.imply("meridiem", types_1.Meridiem.AM);
                                component.imply("hour", 12);
                                break;
                            case "namiddag":
                                component.imply("meridiem", types_1.Meridiem.PM);
                                component.imply("hour", 15);
                                break;
                            case "avond":
                                component.imply("meridiem", types_1.Meridiem.PM);
                                component.imply("hour", 20);
                                break;
                        }
                        return component;
                    };
                    return NLCasualDateTimeParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = NLCasualDateTimeParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../types": 165, "../../../utils/dayjs": 166, "dayjs": 169 }], 89: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var types_1 = require("../../../types");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var dayjs_1 = __importDefault(require("dayjs"));
                var dayjs_2 = require("../../../utils/dayjs");
                var DAY_GROUP = 1;
                var MOMENT_GROUP = 2;
                var NLCasualTimeParser = /** @class */ (function (_super) {
                    __extends(NLCasualTimeParser, _super);
                    function NLCasualTimeParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    NLCasualTimeParser.prototype.innerPattern = function () {
                        return /(deze)?\s*(namiddag|avond|middernacht|ochtend|middag|'s middags|'s avonds|'s ochtends)(?=\W|$)/i;
                    };
                    NLCasualTimeParser.prototype.innerExtract = function (context, match) {
                        var targetDate = dayjs_1.default(context.refDate);
                        var component = context.createParsingComponents();
                        if (match[DAY_GROUP] === "deze") {
                            component.assign("day", context.refDate.getDate());
                            component.assign("month", context.refDate.getMonth() + 1);
                            component.assign("year", context.refDate.getFullYear());
                        }
                        switch (match[MOMENT_GROUP].toLowerCase()) {
                            case "namiddag":
                            case "'s namiddags":
                                component.imply("meridiem", types_1.Meridiem.PM);
                                component.imply("hour", 15);
                                break;
                            case "avond":
                            case "'s avonds'":
                                component.imply("meridiem", types_1.Meridiem.PM);
                                component.imply("hour", 20);
                                break;
                            case "middernacht":
                                dayjs_2.assignTheNextDay(component, targetDate);
                                component.imply("hour", 0);
                                component.imply("minute", 0);
                                component.imply("second", 0);
                                break;
                            case "ochtend":
                            case "'s ochtends":
                                component.imply("meridiem", types_1.Meridiem.AM);
                                component.imply("hour", 6);
                                break;
                            case "middag":
                            case "'s middags":
                                component.imply("meridiem", types_1.Meridiem.AM);
                                component.imply("hour", 12);
                                break;
                        }
                        return component;
                    };
                    return NLCasualTimeParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = NLCasualTimeParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../types": 165, "../../../utils/dayjs": 166, "dayjs": 169 }], 90: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var pattern_1 = require("../../../utils/pattern");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var PATTERN = new RegExp("([0-9]{4})[\\.\\/\\s]" +
                    "(?:(".concat(pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY), ")|([0-9]{1,2}))[\\.\\/\\s]") +
                    "([0-9]{1,2})" +
                    "(?=\\W|$)", "i");
                var YEAR_NUMBER_GROUP = 1;
                var MONTH_NAME_GROUP = 2;
                var MONTH_NUMBER_GROUP = 3;
                var DATE_NUMBER_GROUP = 4;
                var NLCasualYearMonthDayParser = /** @class */ (function (_super) {
                    __extends(NLCasualYearMonthDayParser, _super);
                    function NLCasualYearMonthDayParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    NLCasualYearMonthDayParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    NLCasualYearMonthDayParser.prototype.innerExtract = function (context, match) {
                        var month = match[MONTH_NUMBER_GROUP]
                            ? parseInt(match[MONTH_NUMBER_GROUP])
                            : constants_1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
                        if (month < 1 || month > 12) {
                            return null;
                        }
                        var year = parseInt(match[YEAR_NUMBER_GROUP]);
                        var day = parseInt(match[DATE_NUMBER_GROUP]);
                        return {
                            day: day,
                            month: month,
                            year: year,
                        };
                    };
                    return NLCasualYearMonthDayParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = NLCasualYearMonthDayParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../utils/pattern": 167, "../constants": 85 }], 91: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var years_1 = require("../../../calculation/years");
                var constants_1 = require("../constants");
                var constants_2 = require("../constants");
                var constants_3 = require("../constants");
                var pattern_1 = require("../../../utils/pattern");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var PATTERN = new RegExp("(?:on\\s*?)?" +
                    "(".concat(constants_2.ORDINAL_NUMBER_PATTERN, ")") +
                    "(?:\\s*" +
                    "(?:tot|\\-|\\–|until|through|till|\\s)\\s*" +
                    "(".concat(constants_2.ORDINAL_NUMBER_PATTERN, ")") +
                    ")?" +
                    "(?:-|/|\\s*(?:of)?\\s*)" +
                    "(" +
                    pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY) +
                    ")" +
                    "(?:" +
                    "(?:-|/|,?\\s*)" +
                    "(".concat(constants_3.YEAR_PATTERN, "(?![^\\s]\\d))") +
                    ")?" +
                    "(?=\\W|$)", "i");
                var MONTH_NAME_GROUP = 3;
                var DATE_GROUP = 1;
                var DATE_TO_GROUP = 2;
                var YEAR_GROUP = 4;
                var NLMonthNameMiddleEndianParser = /** @class */ (function (_super) {
                    __extends(NLMonthNameMiddleEndianParser, _super);
                    function NLMonthNameMiddleEndianParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    NLMonthNameMiddleEndianParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    NLMonthNameMiddleEndianParser.prototype.innerExtract = function (context, match) {
                        var month = constants_1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
                        var day = constants_2.parseOrdinalNumberPattern(match[DATE_GROUP]);
                        if (day > 31) {
                            match.index = match.index + match[DATE_GROUP].length;
                            return null;
                        }
                        var components = context.createParsingComponents({
                            day: day,
                            month: month,
                        });
                        if (match[YEAR_GROUP]) {
                            var year = constants_3.parseYear(match[YEAR_GROUP]);
                            components.assign("year", year);
                        }
                        else {
                            var year = years_1.findYearClosestToRef(context.refDate, day, month);
                            components.imply("year", year);
                        }
                        if (!match[DATE_TO_GROUP]) {
                            return components;
                        }
                        var endDate = constants_2.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
                        var result = context.createParsingResult(match.index, match[0]);
                        result.start = components;
                        result.end = components.clone();
                        result.end.assign("day", endDate);
                        return result;
                    };
                    return NLMonthNameMiddleEndianParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = NLMonthNameMiddleEndianParser;
            }, { "../../../calculation/years": 3, "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../utils/pattern": 167, "../constants": 85 }], 92: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var years_1 = require("../../../calculation/years");
                var pattern_1 = require("../../../utils/pattern");
                var constants_2 = require("../constants");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var PATTERN = new RegExp("(".concat(pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY), ")") +
                    "\\s*" +
                    "(?:" +
                    "[,-]?\\s*(".concat(constants_2.YEAR_PATTERN, ")?") +
                    ")?" +
                    "(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)", "i");
                var MONTH_NAME_GROUP = 1;
                var YEAR_GROUP = 2;
                var NLMonthNameParser = /** @class */ (function (_super) {
                    __extends(NLMonthNameParser, _super);
                    function NLMonthNameParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    NLMonthNameParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    NLMonthNameParser.prototype.innerExtract = function (context, match) {
                        var components = context.createParsingComponents();
                        components.imply("day", 1);
                        var monthName = match[MONTH_NAME_GROUP];
                        var month = constants_1.MONTH_DICTIONARY[monthName.toLowerCase()];
                        components.assign("month", month);
                        if (match[YEAR_GROUP]) {
                            var year = constants_2.parseYear(match[YEAR_GROUP]);
                            components.assign("year", year);
                        }
                        else {
                            var year = years_1.findYearClosestToRef(context.refDate, 1, month);
                            components.imply("year", year);
                        }
                        return components;
                    };
                    return NLMonthNameParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = NLMonthNameParser;
            }, { "../../../calculation/years": 3, "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../utils/pattern": 167, "../constants": 85 }], 93: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var dayjs_1 = __importDefault(require("dayjs"));
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var pattern_1 = require("../../../utils/pattern");
                var PATTERN = new RegExp("(dit|deze|(?:aan)?komend|volgend|afgelopen|vorig)e?\\s*(".concat(pattern_1.matchAnyPattern(constants_1.TIME_UNIT_DICTIONARY), ")(?=\\s*)") +
                    "(?=\\W|$)", "i");
                var MODIFIER_WORD_GROUP = 1;
                var RELATIVE_WORD_GROUP = 2;
                var NLRelativeDateFormatParser = /** @class */ (function (_super) {
                    __extends(NLRelativeDateFormatParser, _super);
                    function NLRelativeDateFormatParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    NLRelativeDateFormatParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    NLRelativeDateFormatParser.prototype.innerExtract = function (context, match) {
                        var modifier = match[MODIFIER_WORD_GROUP].toLowerCase();
                        var unitWord = match[RELATIVE_WORD_GROUP].toLowerCase();
                        var timeunit = constants_1.TIME_UNIT_DICTIONARY[unitWord];
                        if (modifier == "volgend" || modifier == "komend" || modifier == "aankomend") {
                            var timeUnits = {};
                            timeUnits[timeunit] = 1;
                            return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                        }
                        if (modifier == "afgelopen" || modifier == "vorig") {
                            var timeUnits = {};
                            timeUnits[timeunit] = -1;
                            return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                        }
                        var components = context.createParsingComponents();
                        var date = dayjs_1.default(context.reference.instant);
                        if (unitWord.match(/week/i)) {
                            date = date.add(-date.get("d"), "d");
                            components.imply("day", date.date());
                            components.imply("month", date.month() + 1);
                            components.imply("year", date.year());
                        }
                        else if (unitWord.match(/maand/i)) {
                            date = date.add(-date.date() + 1, "d");
                            components.imply("day", date.date());
                            components.assign("year", date.year());
                            components.assign("month", date.month() + 1);
                        }
                        else if (unitWord.match(/jaar/i)) {
                            date = date.add(-date.date() + 1, "d");
                            date = date.add(-date.month(), "month");
                            components.imply("day", date.date());
                            components.imply("month", date.month() + 1);
                            components.assign("year", date.year());
                        }
                        return components;
                    };
                    return NLRelativeDateFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = NLRelativeDateFormatParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../results": 163, "../../../utils/pattern": 167, "../constants": 85, "dayjs": 169 }], 94: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var PATTERN = new RegExp("([0-9]|0[1-9]|1[012])/([0-9]{4})" + "", "i");
                var MONTH_GROUP = 1;
                var YEAR_GROUP = 2;
                var NLSlashMonthFormatParser = /** @class */ (function (_super) {
                    __extends(NLSlashMonthFormatParser, _super);
                    function NLSlashMonthFormatParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    NLSlashMonthFormatParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    NLSlashMonthFormatParser.prototype.innerExtract = function (context, match) {
                        var year = parseInt(match[YEAR_GROUP]);
                        var month = parseInt(match[MONTH_GROUP]);
                        return context.createParsingComponents().imply("day", 1).assign("month", month).assign("year", year);
                    };
                    return NLSlashMonthFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = NLSlashMonthFormatParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8 }], 95: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractTimeExpressionParser_1 = require("../../../common/parsers/AbstractTimeExpressionParser");
                var NLTimeExpressionParser = /** @class */ (function (_super) {
                    __extends(NLTimeExpressionParser, _super);
                    function NLTimeExpressionParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    NLTimeExpressionParser.prototype.primaryPrefix = function () {
                        return "(?:(?:om)\\s*)?";
                    };
                    NLTimeExpressionParser.prototype.followingPhase = function () {
                        return "\\s*(?:\\-|\\–|\\~|\\〜|om|\\?)\\s*";
                    };
                    NLTimeExpressionParser.prototype.primarySuffix = function () {
                        return "(?:\\s*(?:uur))?(?!/)(?=\\W|$)";
                    };
                    NLTimeExpressionParser.prototype.extractPrimaryTimeComponents = function (context, match) {
                        if (match[0].match(/^\s*\d{4}\s*$/)) {
                            return null;
                        }
                        return _super.prototype.extractPrimaryTimeComponents.call(this, context, match);
                    };
                    return NLTimeExpressionParser;
                }(AbstractTimeExpressionParser_1.AbstractTimeExpressionParser));
                exports.default = NLTimeExpressionParser;
            }, { "../../../common/parsers/AbstractTimeExpressionParser": 9 }], 96: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var timeunits_1 = require("../../../utils/timeunits");
                var PATTERN = new RegExp("" + "(" + constants_1.TIME_UNITS_PATTERN + ")" + "(?:geleden|voor|eerder)(?=(?:\\W|$))", "i");
                var STRICT_PATTERN = new RegExp("" + "(" + constants_1.TIME_UNITS_PATTERN + ")" + "geleden(?=(?:\\W|$))", "i");
                var NLTimeUnitAgoFormatParser = /** @class */ (function (_super) {
                    __extends(NLTimeUnitAgoFormatParser, _super);
                    function NLTimeUnitAgoFormatParser(strictMode) {
                        var _this = _super.call(this) || this;
                        _this.strictMode = strictMode;
                        return _this;
                    }
                    NLTimeUnitAgoFormatParser.prototype.innerPattern = function () {
                        return this.strictMode ? STRICT_PATTERN : PATTERN;
                    };
                    NLTimeUnitAgoFormatParser.prototype.innerExtract = function (context, match) {
                        var timeUnits = constants_1.parseTimeUnits(match[1]);
                        var outputTimeUnits = timeunits_1.reverseTimeUnits(timeUnits);
                        return results_1.ParsingComponents.createRelativeFromReference(context.reference, outputTimeUnits);
                    };
                    return NLTimeUnitAgoFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = NLTimeUnitAgoFormatParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../results": 163, "../../../utils/timeunits": 168, "../constants": 85 }], 97: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var timeunits_1 = require("../../../utils/timeunits");
                var PATTERN = new RegExp("(dit|deze|vorig|afgelopen|(?:aan)?komend|over|\\+|-)e?\\s*(".concat(constants_1.TIME_UNITS_PATTERN, ")(?=\\W|$)"), "i");
                var PREFIX_WORD_GROUP = 1;
                var TIME_UNIT_WORD_GROUP = 2;
                var NLTimeUnitCasualRelativeFormatParser = /** @class */ (function (_super) {
                    __extends(NLTimeUnitCasualRelativeFormatParser, _super);
                    function NLTimeUnitCasualRelativeFormatParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    NLTimeUnitCasualRelativeFormatParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    NLTimeUnitCasualRelativeFormatParser.prototype.innerExtract = function (context, match) {
                        var prefix = match[PREFIX_WORD_GROUP].toLowerCase();
                        var timeUnits = constants_1.parseTimeUnits(match[TIME_UNIT_WORD_GROUP]);
                        switch (prefix) {
                            case "vorig":
                            case "afgelopen":
                            case "-":
                                timeUnits = timeunits_1.reverseTimeUnits(timeUnits);
                                break;
                        }
                        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                    };
                    return NLTimeUnitCasualRelativeFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = NLTimeUnitCasualRelativeFormatParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../results": 163, "../../../utils/timeunits": 168, "../constants": 85 }], 98: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var PATTERN = new RegExp("" + "(" + constants_1.TIME_UNITS_PATTERN + ")" + "(later|na|vanaf nu|voortaan|vooruit|uit)" + "(?=(?:\\W|$))", "i");
                var STRICT_PATTERN = new RegExp("" + "(" + constants_1.TIME_UNITS_PATTERN + ")" + "(later|vanaf nu)" + "(?=(?:\\W|$))", "i");
                var GROUP_NUM_TIMEUNITS = 1;
                var NLTimeUnitLaterFormatParser = /** @class */ (function (_super) {
                    __extends(NLTimeUnitLaterFormatParser, _super);
                    function NLTimeUnitLaterFormatParser(strictMode) {
                        var _this = _super.call(this) || this;
                        _this.strictMode = strictMode;
                        return _this;
                    }
                    NLTimeUnitLaterFormatParser.prototype.innerPattern = function () {
                        return this.strictMode ? STRICT_PATTERN : PATTERN;
                    };
                    NLTimeUnitLaterFormatParser.prototype.innerExtract = function (context, match) {
                        var fragments = constants_1.parseTimeUnits(match[GROUP_NUM_TIMEUNITS]);
                        return results_1.ParsingComponents.createRelativeFromReference(context.reference, fragments);
                    };
                    return NLTimeUnitLaterFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = NLTimeUnitLaterFormatParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../results": 163, "../constants": 85 }], 99: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var NLTimeUnitWithinFormatParser = /** @class */ (function (_super) {
                    __extends(NLTimeUnitWithinFormatParser, _super);
                    function NLTimeUnitWithinFormatParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    NLTimeUnitWithinFormatParser.prototype.innerPattern = function () {
                        return new RegExp("(?:binnen|in|binnen de|voor)\\s*" + "(" + constants_1.TIME_UNITS_PATTERN + ")" + "(?=\\W|$)", "i");
                    };
                    NLTimeUnitWithinFormatParser.prototype.innerExtract = function (context, match) {
                        var timeUnits = constants_1.parseTimeUnits(match[1]);
                        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                    };
                    return NLTimeUnitWithinFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = NLTimeUnitWithinFormatParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../results": 163, "../constants": 85 }], 100: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../../nl/constants");
                var pattern_1 = require("../../../utils/pattern");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var weekdays_1 = require("../../../common/calculation/weekdays");
                var PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
                    "(?:op\\s*?)?" +
                    "(?:(deze|vorige|volgende)\\s*(?:week\\s*)?)?" +
                    "(".concat(pattern_1.matchAnyPattern(constants_1.WEEKDAY_DICTIONARY), ")") +
                    "(?=\\W|$)", "i");
                var PREFIX_GROUP = 1;
                var WEEKDAY_GROUP = 2;
                var POSTFIX_GROUP = 3;
                var NLWeekdayParser = /** @class */ (function (_super) {
                    __extends(NLWeekdayParser, _super);
                    function NLWeekdayParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    NLWeekdayParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    NLWeekdayParser.prototype.innerExtract = function (context, match) {
                        var dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
                        var weekday = constants_1.WEEKDAY_DICTIONARY[dayOfWeek];
                        var prefix = match[PREFIX_GROUP];
                        var postfix = match[POSTFIX_GROUP];
                        var modifierWord = prefix || postfix;
                        modifierWord = modifierWord || "";
                        modifierWord = modifierWord.toLowerCase();
                        var modifier = null;
                        if (modifierWord == "vorige") {
                            modifier = "last";
                        }
                        else if (modifierWord == "volgende") {
                            modifier = "next";
                        }
                        else if (modifierWord == "deze") {
                            modifier = "this";
                        }
                        return weekdays_1.createParsingComponentsAtWeekday(context.reference, weekday, modifier);
                    };
                    return NLWeekdayParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = NLWeekdayParser;
            }, { "../../../common/calculation/weekdays": 6, "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../utils/pattern": 167, "../../nl/constants": 85 }], 101: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractMergeDateRangeRefiner_1 = __importDefault(require("../../../common/refiners/AbstractMergeDateRangeRefiner"));
                var NLMergeDateRangeRefiner = /** @class */ (function (_super) {
                    __extends(NLMergeDateRangeRefiner, _super);
                    function NLMergeDateRangeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    NLMergeDateRangeRefiner.prototype.patternBetween = function () {
                        return /^\s*(tot|-)\s*$/i;
                    };
                    return NLMergeDateRangeRefiner;
                }(AbstractMergeDateRangeRefiner_1.default));
                exports.default = NLMergeDateRangeRefiner;
            }, { "../../../common/refiners/AbstractMergeDateRangeRefiner": 12 }], 102: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractMergeDateTimeRefiner_1 = __importDefault(require("../../../common/refiners/AbstractMergeDateTimeRefiner"));
                var NLMergeDateTimeRefiner = /** @class */ (function (_super) {
                    __extends(NLMergeDateTimeRefiner, _super);
                    function NLMergeDateTimeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    NLMergeDateTimeRefiner.prototype.patternBetween = function () {
                        return new RegExp("^\\s*(om|na|voor|in de|,|-)?\\s*$");
                    };
                    return NLMergeDateTimeRefiner;
                }(AbstractMergeDateTimeRefiner_1.default));
                exports.default = NLMergeDateTimeRefiner;
            }, { "../../../common/refiners/AbstractMergeDateTimeRefiner": 13 }], 103: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.parseYear = exports.YEAR_PATTERN = exports.MONTH_DICTIONARY = exports.WEEKDAY_DICTIONARY = void 0;
                exports.WEEKDAY_DICTIONARY = {
                    "domingo": 0,
                    "dom": 0,
                    "segunda": 1,
                    "segunda-feira": 1,
                    "seg": 1,
                    "terça": 2,
                    "terça-feira": 2,
                    "ter": 2,
                    "quarta": 3,
                    "quarta-feira": 3,
                    "qua": 3,
                    "quinta": 4,
                    "quinta-feira": 4,
                    "qui": 4,
                    "sexta": 5,
                    "sexta-feira": 5,
                    "sex": 5,
                    "sábado": 6,
                    "sabado": 6,
                    "sab": 6,
                };
                exports.MONTH_DICTIONARY = {
                    "janeiro": 1,
                    "jan": 1,
                    "jan.": 1,
                    "fevereiro": 2,
                    "fev": 2,
                    "fev.": 2,
                    "março": 3,
                    "mar": 3,
                    "mar.": 3,
                    "abril": 4,
                    "abr": 4,
                    "abr.": 4,
                    "maio": 5,
                    "mai": 5,
                    "mai.": 5,
                    "junho": 6,
                    "jun": 6,
                    "jun.": 6,
                    "julho": 7,
                    "jul": 7,
                    "jul.": 7,
                    "agosto": 8,
                    "ago": 8,
                    "ago.": 8,
                    "setembro": 9,
                    "set": 9,
                    "set.": 9,
                    "outubro": 10,
                    "out": 10,
                    "out.": 10,
                    "novembro": 11,
                    "nov": 11,
                    "nov.": 11,
                    "dezembro": 12,
                    "dez": 12,
                    "dez.": 12,
                };
                exports.YEAR_PATTERN = "[0-9]{1,4}(?![^\\s]\\d)(?:\\s*[a|d]\\.?\\s*c\\.?|\\s*a\\.?\\s*d\\.?)?";
                function parseYear(match) {
                    if (match.match(/^[0-9]{1,4}$/)) {
                        var yearNumber = parseInt(match);
                        if (yearNumber < 100) {
                            if (yearNumber > 50) {
                                yearNumber = yearNumber + 1900;
                            }
                            else {
                                yearNumber = yearNumber + 2000;
                            }
                        }
                        return yearNumber;
                    }
                    if (match.match(/a\.?\s*c\.?/i)) {
                        match = match.replace(/a\.?\s*c\.?/i, "");
                        return -parseInt(match);
                    }
                    return parseInt(match);
                }
                exports.parseYear = parseYear;
            }, {}], 104: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = exports.Weekday = exports.Meridiem = exports.ReferenceWithTimezone = exports.ParsingComponents = exports.ParsingResult = exports.Chrono = void 0;
                var configurations_1 = require("../../configurations");
                var chrono_1 = require("../../chrono");
                Object.defineProperty(exports, "Chrono", { enumerable: true, get: function () { return chrono_1.Chrono; } });
                var results_1 = require("../../results");
                Object.defineProperty(exports, "ParsingResult", { enumerable: true, get: function () { return results_1.ParsingResult; } });
                Object.defineProperty(exports, "ParsingComponents", { enumerable: true, get: function () { return results_1.ParsingComponents; } });
                Object.defineProperty(exports, "ReferenceWithTimezone", { enumerable: true, get: function () { return results_1.ReferenceWithTimezone; } });
                var types_1 = require("../../types");
                Object.defineProperty(exports, "Meridiem", { enumerable: true, get: function () { return types_1.Meridiem; } });
                Object.defineProperty(exports, "Weekday", { enumerable: true, get: function () { return types_1.Weekday; } });
                var SlashDateFormatParser_1 = __importDefault(require("../../common/parsers/SlashDateFormatParser"));
                var PTWeekdayParser_1 = __importDefault(require("./parsers/PTWeekdayParser"));
                var PTTimeExpressionParser_1 = __importDefault(require("./parsers/PTTimeExpressionParser"));
                var PTMergeDateTimeRefiner_1 = __importDefault(require("./refiners/PTMergeDateTimeRefiner"));
                var PTMergeDateRangeRefiner_1 = __importDefault(require("./refiners/PTMergeDateRangeRefiner"));
                var PTMonthNameLittleEndianParser_1 = __importDefault(require("./parsers/PTMonthNameLittleEndianParser"));
                var PTCasualDateParser_1 = __importDefault(require("./parsers/PTCasualDateParser"));
                var PTCasualTimeParser_1 = __importDefault(require("./parsers/PTCasualTimeParser"));
                exports.casual = new chrono_1.Chrono(createCasualConfiguration());
                exports.strict = new chrono_1.Chrono(createConfiguration(true));
                function parse(text, ref, option) {
                    return exports.casual.parse(text, ref, option);
                }
                exports.parse = parse;
                function parseDate(text, ref, option) {
                    return exports.casual.parseDate(text, ref, option);
                }
                exports.parseDate = parseDate;
                function createCasualConfiguration(littleEndian) {
                    if (littleEndian === void 0) { littleEndian = true; }
                    var option = createConfiguration(false, littleEndian);
                    option.parsers.push(new PTCasualDateParser_1.default());
                    option.parsers.push(new PTCasualTimeParser_1.default());
                    return option;
                }
                exports.createCasualConfiguration = createCasualConfiguration;
                function createConfiguration(strictMode, littleEndian) {
                    if (strictMode === void 0) { strictMode = true; }
                    if (littleEndian === void 0) { littleEndian = true; }
                    return configurations_1.includeCommonConfiguration({
                        parsers: [
                            new SlashDateFormatParser_1.default(littleEndian),
                            new PTWeekdayParser_1.default(),
                            new PTTimeExpressionParser_1.default(),
                            new PTMonthNameLittleEndianParser_1.default(),
                        ],
                        refiners: [new PTMergeDateTimeRefiner_1.default(), new PTMergeDateRangeRefiner_1.default()],
                    }, strictMode);
                }
                exports.createConfiguration = createConfiguration;
            }, { "../../chrono": 4, "../../common/parsers/SlashDateFormatParser": 11, "../../configurations": 20, "../../results": 163, "../../types": 165, "./parsers/PTCasualDateParser": 105, "./parsers/PTCasualTimeParser": 106, "./parsers/PTMonthNameLittleEndianParser": 107, "./parsers/PTTimeExpressionParser": 108, "./parsers/PTWeekdayParser": 109, "./refiners/PTMergeDateRangeRefiner": 110, "./refiners/PTMergeDateTimeRefiner": 111 }], 105: [function (require, module, exports) {
                "use strict";
                var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
                }) : (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function (o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule)
                        return mod;
                    var result = {};
                    if (mod != null)
                        for (var k in mod)
                            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                                __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var references = __importStar(require("../../../common/casualReferences"));
                var PTCasualDateParser = /** @class */ (function (_super) {
                    __extends(PTCasualDateParser, _super);
                    function PTCasualDateParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    PTCasualDateParser.prototype.innerPattern = function (context) {
                        return /(agora|hoje|amanha|amanhã|ontem)(?=\W|$)/i;
                    };
                    PTCasualDateParser.prototype.innerExtract = function (context, match) {
                        var lowerText = match[0].toLowerCase();
                        var component = context.createParsingComponents();
                        switch (lowerText) {
                            case "agora":
                                return references.now(context.reference);
                            case "hoje":
                                return references.today(context.reference);
                            case "amanha":
                            case "amanhã":
                                return references.tomorrow(context.reference);
                            case "ontem":
                                return references.yesterday(context.reference);
                        }
                        return component;
                    };
                    return PTCasualDateParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = PTCasualDateParser;
            }, { "../../../common/casualReferences": 7, "../../../common/parsers/AbstractParserWithWordBoundary": 8 }], 106: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var types_1 = require("../../../types");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var dayjs_1 = require("../../../utils/dayjs");
                var dayjs_2 = __importDefault(require("dayjs"));
                var PTCasualTimeParser = /** @class */ (function (_super) {
                    __extends(PTCasualTimeParser, _super);
                    function PTCasualTimeParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    PTCasualTimeParser.prototype.innerPattern = function () {
                        return /(?:esta\s*)?(manha|manhã|tarde|meia-noite|meio-dia|noite)(?=\W|$)/i;
                    };
                    PTCasualTimeParser.prototype.innerExtract = function (context, match) {
                        var targetDate = dayjs_2.default(context.refDate);
                        var component = context.createParsingComponents();
                        switch (match[1].toLowerCase()) {
                            case "tarde":
                                component.imply("meridiem", types_1.Meridiem.PM);
                                component.imply("hour", 15);
                                break;
                            case "noite":
                                component.imply("meridiem", types_1.Meridiem.PM);
                                component.imply("hour", 22);
                                break;
                            case "manha":
                            case "manhã":
                                component.imply("meridiem", types_1.Meridiem.AM);
                                component.imply("hour", 6);
                                break;
                            case "meia-noite":
                                dayjs_1.assignTheNextDay(component, targetDate);
                                component.imply("hour", 0);
                                component.imply("minute", 0);
                                component.imply("second", 0);
                                break;
                            case "meio-dia":
                                component.imply("meridiem", types_1.Meridiem.AM);
                                component.imply("hour", 12);
                                break;
                        }
                        return component;
                    };
                    return PTCasualTimeParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = PTCasualTimeParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../types": 165, "../../../utils/dayjs": 166, "dayjs": 169 }], 107: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var years_1 = require("../../../calculation/years");
                var constants_1 = require("../constants");
                var constants_2 = require("../constants");
                var pattern_1 = require("../../../utils/pattern");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var PATTERN = new RegExp("([0-9]{1,2})(?:\u00BA|\u00AA|\u00B0)?" +
                    "(?:\\s*(?:desde|de|\\-|\\–|ao?|\\s)\\s*([0-9]{1,2})(?:º|ª|°)?)?\\s*(?:de)?\\s*" +
                    "(?:-|/|\\s*(?:de|,)?\\s*)" +
                    "(".concat(pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY), ")") +
                    "(?:\\s*(?:de|,)?\\s*(".concat(constants_2.YEAR_PATTERN, "))?") +
                    "(?=\\W|$)", "i");
                var DATE_GROUP = 1;
                var DATE_TO_GROUP = 2;
                var MONTH_NAME_GROUP = 3;
                var YEAR_GROUP = 4;
                var PTMonthNameLittleEndianParser = /** @class */ (function (_super) {
                    __extends(PTMonthNameLittleEndianParser, _super);
                    function PTMonthNameLittleEndianParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    PTMonthNameLittleEndianParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    PTMonthNameLittleEndianParser.prototype.innerExtract = function (context, match) {
                        var result = context.createParsingResult(match.index, match[0]);
                        var month = constants_1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
                        var day = parseInt(match[DATE_GROUP]);
                        if (day > 31) {
                            match.index = match.index + match[DATE_GROUP].length;
                            return null;
                        }
                        result.start.assign("month", month);
                        result.start.assign("day", day);
                        if (match[YEAR_GROUP]) {
                            var yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
                            result.start.assign("year", yearNumber);
                        }
                        else {
                            var year = years_1.findYearClosestToRef(context.refDate, day, month);
                            result.start.imply("year", year);
                        }
                        if (match[DATE_TO_GROUP]) {
                            var endDate = parseInt(match[DATE_TO_GROUP]);
                            result.end = result.start.clone();
                            result.end.assign("day", endDate);
                        }
                        return result;
                    };
                    return PTMonthNameLittleEndianParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = PTMonthNameLittleEndianParser;
            }, { "../../../calculation/years": 3, "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../utils/pattern": 167, "../constants": 103 }], 108: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractTimeExpressionParser_1 = require("../../../common/parsers/AbstractTimeExpressionParser");
                var PTTimeExpressionParser = /** @class */ (function (_super) {
                    __extends(PTTimeExpressionParser, _super);
                    function PTTimeExpressionParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    PTTimeExpressionParser.prototype.primaryPrefix = function () {
                        return "(?:(?:ao?|às?|das|da|de|do)\\s*)?";
                    };
                    PTTimeExpressionParser.prototype.followingPhase = function () {
                        return "\\s*(?:\\-|\\–|\\~|\\〜|a(?:o)?|\\?)\\s*";
                    };
                    return PTTimeExpressionParser;
                }(AbstractTimeExpressionParser_1.AbstractTimeExpressionParser));
                exports.default = PTTimeExpressionParser;
            }, { "../../../common/parsers/AbstractTimeExpressionParser": 9 }], 109: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var pattern_1 = require("../../../utils/pattern");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var weekdays_1 = require("../../../common/calculation/weekdays");
                var PATTERN = new RegExp("(?:(?:\\,|\\(|\\（)\\s*)?" +
                    "(?:(este|esta|passado|pr[oó]ximo)\\s*)?" +
                    "(".concat(pattern_1.matchAnyPattern(constants_1.WEEKDAY_DICTIONARY), ")") +
                    "(?:\\s*(?:\\,|\\)|\\）))?" +
                    "(?:\\s*(este|esta|passado|pr[óo]ximo)\\s*semana)?" +
                    "(?=\\W|\\d|$)", "i");
                var PREFIX_GROUP = 1;
                var WEEKDAY_GROUP = 2;
                var POSTFIX_GROUP = 3;
                var PTWeekdayParser = /** @class */ (function (_super) {
                    __extends(PTWeekdayParser, _super);
                    function PTWeekdayParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    PTWeekdayParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    PTWeekdayParser.prototype.innerExtract = function (context, match) {
                        var dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
                        var weekday = constants_1.WEEKDAY_DICTIONARY[dayOfWeek];
                        if (weekday === undefined) {
                            return null;
                        }
                        var prefix = match[PREFIX_GROUP];
                        var postfix = match[POSTFIX_GROUP];
                        var norm = prefix || postfix || "";
                        norm = norm.toLowerCase();
                        var modifier = null;
                        if (norm == "passado") {
                            modifier = "this";
                        }
                        else if (norm == "próximo" || norm == "proximo") {
                            modifier = "next";
                        }
                        else if (norm == "este") {
                            modifier = "this";
                        }
                        return weekdays_1.createParsingComponentsAtWeekday(context.reference, weekday, modifier);
                    };
                    return PTWeekdayParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = PTWeekdayParser;
            }, { "../../../common/calculation/weekdays": 6, "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../utils/pattern": 167, "../constants": 103 }], 110: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractMergeDateRangeRefiner_1 = __importDefault(require("../../../common/refiners/AbstractMergeDateRangeRefiner"));
                var PTMergeDateRangeRefiner = /** @class */ (function (_super) {
                    __extends(PTMergeDateRangeRefiner, _super);
                    function PTMergeDateRangeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    PTMergeDateRangeRefiner.prototype.patternBetween = function () {
                        return /^\s*(?:-)\s*$/i;
                    };
                    return PTMergeDateRangeRefiner;
                }(AbstractMergeDateRangeRefiner_1.default));
                exports.default = PTMergeDateRangeRefiner;
            }, { "../../../common/refiners/AbstractMergeDateRangeRefiner": 12 }], 111: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractMergeDateTimeRefiner_1 = __importDefault(require("../../../common/refiners/AbstractMergeDateTimeRefiner"));
                var PTMergeDateTimeRefiner = /** @class */ (function (_super) {
                    __extends(PTMergeDateTimeRefiner, _super);
                    function PTMergeDateTimeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    PTMergeDateTimeRefiner.prototype.patternBetween = function () {
                        return new RegExp("^\\s*(?:,|à)?\\s*$");
                    };
                    return PTMergeDateTimeRefiner;
                }(AbstractMergeDateTimeRefiner_1.default));
                exports.default = PTMergeDateTimeRefiner;
            }, { "../../../common/refiners/AbstractMergeDateTimeRefiner": 13 }], 112: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYear = exports.YEAR_PATTERN = exports.parseOrdinalNumberPattern = exports.ORDINAL_NUMBER_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.ORDINAL_WORD_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.FULL_MONTH_NAME_DICTIONARY = exports.WEEKDAY_DICTIONARY = exports.REGEX_PARTS = void 0;
                var pattern_1 = require("../../utils/pattern");
                var years_1 = require("../../calculation/years");
                exports.REGEX_PARTS = {
                    leftBoundary: "([^\\p{L}\\p{N}_]|^)",
                    rightBoundary: "(?=[^\\p{L}\\p{N}_]|$)",
                    flags: "iu",
                };
                exports.WEEKDAY_DICTIONARY = {
                    воскресенье: 0,
                    воскресенья: 0,
                    вск: 0,
                    "вск.": 0,
                    понедельник: 1,
                    понедельника: 1,
                    пн: 1,
                    "пн.": 1,
                    вторник: 2,
                    вторника: 2,
                    вт: 2,
                    "вт.": 2,
                    среда: 3,
                    среды: 3,
                    среду: 3,
                    ср: 3,
                    "ср.": 3,
                    четверг: 4,
                    четверга: 4,
                    чт: 4,
                    "чт.": 4,
                    пятница: 5,
                    пятницу: 5,
                    пятницы: 5,
                    пт: 5,
                    "пт.": 5,
                    суббота: 6,
                    субботу: 6,
                    субботы: 6,
                    сб: 6,
                    "сб.": 6,
                };
                exports.FULL_MONTH_NAME_DICTIONARY = {
                    январь: 1,
                    января: 1,
                    январе: 1,
                    февраль: 2,
                    февраля: 2,
                    феврале: 2,
                    март: 3,
                    марта: 3,
                    марте: 3,
                    апрель: 4,
                    апреля: 4,
                    апреле: 4,
                    май: 5,
                    мая: 5,
                    мае: 5,
                    июнь: 6,
                    июня: 6,
                    июне: 6,
                    июль: 7,
                    июля: 7,
                    июле: 7,
                    август: 8,
                    августа: 8,
                    августе: 8,
                    сентябрь: 9,
                    сентября: 9,
                    сентябре: 9,
                    октябрь: 10,
                    октября: 10,
                    октябре: 10,
                    ноябрь: 11,
                    ноября: 11,
                    ноябре: 11,
                    декабрь: 12,
                    декабря: 12,
                    декабре: 12,
                };
                exports.MONTH_DICTIONARY = Object.assign(Object.assign({}, exports.FULL_MONTH_NAME_DICTIONARY), { янв: 1, "янв.": 1, фев: 2, "фев.": 2, мар: 3, "мар.": 3, апр: 4, "апр.": 4, авг: 8, "авг.": 8, сен: 9, "сен.": 9, окт: 10, "окт.": 10, ноя: 11, "ноя.": 11, дек: 12, "дек.": 12 });
                exports.INTEGER_WORD_DICTIONARY = {
                    один: 1,
                    одна: 1,
                    одной: 1,
                    одну: 1,
                    две: 2,
                    два: 2,
                    двух: 2,
                    три: 3,
                    трех: 3,
                    трёх: 3,
                    четыре: 4,
                    четырех: 4,
                    четырёх: 4,
                    пять: 5,
                    пяти: 5,
                    шесть: 6,
                    шести: 6,
                    семь: 7,
                    семи: 7,
                    восемь: 8,
                    восьми: 8,
                    девять: 9,
                    девяти: 9,
                    десять: 10,
                    десяти: 10,
                    одиннадцать: 11,
                    одиннадцати: 11,
                    двенадцать: 12,
                    двенадцати: 12,
                };
                exports.ORDINAL_WORD_DICTIONARY = {
                    первое: 1,
                    первого: 1,
                    второе: 2,
                    второго: 2,
                    третье: 3,
                    третьего: 3,
                    четвертое: 4,
                    четвертого: 4,
                    пятое: 5,
                    пятого: 5,
                    шестое: 6,
                    шестого: 6,
                    седьмое: 7,
                    седьмого: 7,
                    восьмое: 8,
                    восьмого: 8,
                    девятое: 9,
                    девятого: 9,
                    десятое: 10,
                    десятого: 10,
                    одиннадцатое: 11,
                    одиннадцатого: 11,
                    двенадцатое: 12,
                    двенадцатого: 12,
                    тринадцатое: 13,
                    тринадцатого: 13,
                    четырнадцатое: 14,
                    четырнадцатого: 14,
                    пятнадцатое: 15,
                    пятнадцатого: 15,
                    шестнадцатое: 16,
                    шестнадцатого: 16,
                    семнадцатое: 17,
                    семнадцатого: 17,
                    восемнадцатое: 18,
                    восемнадцатого: 18,
                    девятнадцатое: 19,
                    девятнадцатого: 19,
                    двадцатое: 20,
                    двадцатого: 20,
                    "двадцать первое": 21,
                    "двадцать первого": 21,
                    "двадцать второе": 22,
                    "двадцать второго": 22,
                    "двадцать третье": 23,
                    "двадцать третьего": 23,
                    "двадцать четвертое": 24,
                    "двадцать четвертого": 24,
                    "двадцать пятое": 25,
                    "двадцать пятого": 25,
                    "двадцать шестое": 26,
                    "двадцать шестого": 26,
                    "двадцать седьмое": 27,
                    "двадцать седьмого": 27,
                    "двадцать восьмое": 28,
                    "двадцать восьмого": 28,
                    "двадцать девятое": 29,
                    "двадцать девятого": 29,
                    "тридцатое": 30,
                    "тридцатого": 30,
                    "тридцать первое": 31,
                    "тридцать первого": 31,
                };
                exports.TIME_UNIT_DICTIONARY = {
                    сек: "second",
                    секунда: "second",
                    секунд: "second",
                    секунды: "second",
                    секунду: "second",
                    секундочка: "second",
                    секундочки: "second",
                    секундочек: "second",
                    секундочку: "second",
                    мин: "minute",
                    минута: "minute",
                    минут: "minute",
                    минуты: "minute",
                    минуту: "minute",
                    минуток: "minute",
                    минутки: "minute",
                    минутку: "minute",
                    минуточек: "minute",
                    минуточки: "minute",
                    минуточку: "minute",
                    час: "hour",
                    часов: "hour",
                    часа: "hour",
                    часу: "hour",
                    часиков: "hour",
                    часика: "hour",
                    часике: "hour",
                    часик: "hour",
                    день: "d",
                    дня: "d",
                    дней: "d",
                    суток: "d",
                    сутки: "d",
                    неделя: "week",
                    неделе: "week",
                    недели: "week",
                    неделю: "week",
                    недель: "week",
                    недельке: "week",
                    недельки: "week",
                    неделек: "week",
                    месяц: "month",
                    месяце: "month",
                    месяцев: "month",
                    месяца: "month",
                    квартал: "quarter",
                    квартале: "quarter",
                    кварталов: "quarter",
                    год: "year",
                    года: "year",
                    году: "year",
                    годов: "year",
                    лет: "year",
                    годик: "year",
                    годика: "year",
                    годиков: "year",
                };
                exports.NUMBER_PATTERN = "(?:".concat(pattern_1.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY), "|[0-9]+|[0-9]+\\.[0-9]+|\u043F\u043E\u043B|\u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E|\u043F\u0430\u0440(?:\u044B|\u0443)|\\s{0,3})");
                function parseNumberPattern(match) {
                    var num = match.toLowerCase();
                    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
                        return exports.INTEGER_WORD_DICTIONARY[num];
                    }
                    if (num.match(/несколько/)) {
                        return 3;
                    }
                    else if (num.match(/пол/)) {
                        return 0.5;
                    }
                    else if (num.match(/пар/)) {
                        return 2;
                    }
                    else if (num === "") {
                        return 1;
                    }
                    return parseFloat(num);
                }
                exports.parseNumberPattern = parseNumberPattern;
                exports.ORDINAL_NUMBER_PATTERN = "(?:".concat(pattern_1.matchAnyPattern(exports.ORDINAL_WORD_DICTIONARY), "|[0-9]{1,2}(?:\u0433\u043E|\u043E\u0433\u043E|\u0435|\u043E\u0435)?)");
                function parseOrdinalNumberPattern(match) {
                    var num = match.toLowerCase();
                    if (exports.ORDINAL_WORD_DICTIONARY[num] !== undefined) {
                        return exports.ORDINAL_WORD_DICTIONARY[num];
                    }
                    return parseInt(num);
                }
                exports.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
                var year = "(?:\\s+(?:году|года|год|г|г.))?";
                exports.YEAR_PATTERN = "(?:[1-9][0-9]{0,3}".concat(year, "\\s*(?:\u043D.\u044D.|\u0434\u043E \u043D.\u044D.|\u043D. \u044D.|\u0434\u043E \u043D. \u044D.)|[1-2][0-9]{3}").concat(year, "|[5-9][0-9]").concat(year, ")");
                function parseYear(match) {
                    if (/(год|года|г|г.)/i.test(match)) {
                        match = match.replace(/(год|года|г|г.)/i, "");
                    }
                    if (/(до н.э.|до н. э.)/i.test(match)) {
                        match = match.replace(/(до н.э.|до н. э.)/i, "");
                        return -parseInt(match);
                    }
                    if (/(н. э.|н.э.)/i.test(match)) {
                        match = match.replace(/(н. э.|н.э.)/i, "");
                        return parseInt(match);
                    }
                    var rawYearNumber = parseInt(match);
                    return years_1.findMostLikelyADYear(rawYearNumber);
                }
                exports.parseYear = parseYear;
                var SINGLE_TIME_UNIT_PATTERN = "(".concat(exports.NUMBER_PATTERN, ")\\s{0,3}(").concat(pattern_1.matchAnyPattern(exports.TIME_UNIT_DICTIONARY), ")");
                var SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
                exports.TIME_UNITS_PATTERN = pattern_1.repeatedTimeunitPattern("(?:(?:\u043E\u043A\u043E\u043B\u043E|\u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E)\\s{0,3})?", SINGLE_TIME_UNIT_PATTERN);
                function parseTimeUnits(timeunitText) {
                    var fragments = {};
                    var remainingText = timeunitText;
                    var match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
                    while (match) {
                        collectDateTimeFragment(fragments, match);
                        remainingText = remainingText.substring(match[0].length).trim();
                        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
                    }
                    return fragments;
                }
                exports.parseTimeUnits = parseTimeUnits;
                function collectDateTimeFragment(fragments, match) {
                    var num = parseNumberPattern(match[1]);
                    var unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
                    fragments[unit] = num;
                }
            }, { "../../calculation/years": 3, "../../utils/pattern": 167 }], 113: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = exports.Weekday = exports.Meridiem = exports.ReferenceWithTimezone = exports.ParsingComponents = exports.ParsingResult = exports.Chrono = void 0;
                var RUTimeUnitWithinFormatParser_1 = __importDefault(require("./parsers/RUTimeUnitWithinFormatParser"));
                var RUMonthNameLittleEndianParser_1 = __importDefault(require("./parsers/RUMonthNameLittleEndianParser"));
                var RUMonthNameParser_1 = __importDefault(require("./parsers/RUMonthNameParser"));
                var RUTimeExpressionParser_1 = __importDefault(require("./parsers/RUTimeExpressionParser"));
                var RUTimeUnitAgoFormatParser_1 = __importDefault(require("./parsers/RUTimeUnitAgoFormatParser"));
                var RUMergeDateRangeRefiner_1 = __importDefault(require("./refiners/RUMergeDateRangeRefiner"));
                var RUMergeDateTimeRefiner_1 = __importDefault(require("./refiners/RUMergeDateTimeRefiner"));
                var configurations_1 = require("../../configurations");
                var RUCasualDateParser_1 = __importDefault(require("./parsers/RUCasualDateParser"));
                var RUCasualTimeParser_1 = __importDefault(require("./parsers/RUCasualTimeParser"));
                var RUWeekdayParser_1 = __importDefault(require("./parsers/RUWeekdayParser"));
                var RURelativeDateFormatParser_1 = __importDefault(require("./parsers/RURelativeDateFormatParser"));
                var chrono_1 = require("../../chrono");
                Object.defineProperty(exports, "Chrono", { enumerable: true, get: function () { return chrono_1.Chrono; } });
                var results_1 = require("../../results");
                Object.defineProperty(exports, "ParsingResult", { enumerable: true, get: function () { return results_1.ParsingResult; } });
                Object.defineProperty(exports, "ParsingComponents", { enumerable: true, get: function () { return results_1.ParsingComponents; } });
                Object.defineProperty(exports, "ReferenceWithTimezone", { enumerable: true, get: function () { return results_1.ReferenceWithTimezone; } });
                var types_1 = require("../../types");
                Object.defineProperty(exports, "Meridiem", { enumerable: true, get: function () { return types_1.Meridiem; } });
                Object.defineProperty(exports, "Weekday", { enumerable: true, get: function () { return types_1.Weekday; } });
                var SlashDateFormatParser_1 = __importDefault(require("../../common/parsers/SlashDateFormatParser"));
                var RUTimeUnitCasualRelativeFormatParser_1 = __importDefault(require("./parsers/RUTimeUnitCasualRelativeFormatParser"));
                exports.casual = new chrono_1.Chrono(createCasualConfiguration());
                exports.strict = new chrono_1.Chrono(createConfiguration(true));
                function parse(text, ref, option) {
                    return exports.casual.parse(text, ref, option);
                }
                exports.parse = parse;
                function parseDate(text, ref, option) {
                    return exports.casual.parseDate(text, ref, option);
                }
                exports.parseDate = parseDate;
                function createCasualConfiguration() {
                    var option = createConfiguration(false);
                    option.parsers.unshift(new RUCasualDateParser_1.default());
                    option.parsers.unshift(new RUCasualTimeParser_1.default());
                    option.parsers.unshift(new RUMonthNameParser_1.default());
                    option.parsers.unshift(new RURelativeDateFormatParser_1.default());
                    option.parsers.unshift(new RUTimeUnitCasualRelativeFormatParser_1.default());
                    return option;
                }
                exports.createCasualConfiguration = createCasualConfiguration;
                function createConfiguration(strictMode) {
                    if (strictMode === void 0) { strictMode = true; }
                    return configurations_1.includeCommonConfiguration({
                        parsers: [
                            new SlashDateFormatParser_1.default(true),
                            new RUTimeUnitWithinFormatParser_1.default(),
                            new RUMonthNameLittleEndianParser_1.default(),
                            new RUWeekdayParser_1.default(),
                            new RUTimeExpressionParser_1.default(strictMode),
                            new RUTimeUnitAgoFormatParser_1.default(),
                        ],
                        refiners: [new RUMergeDateTimeRefiner_1.default(), new RUMergeDateRangeRefiner_1.default()],
                    }, strictMode);
                }
                exports.createConfiguration = createConfiguration;
            }, { "../../chrono": 4, "../../common/parsers/SlashDateFormatParser": 11, "../../configurations": 20, "../../results": 163, "../../types": 165, "./parsers/RUCasualDateParser": 115, "./parsers/RUCasualTimeParser": 116, "./parsers/RUMonthNameLittleEndianParser": 117, "./parsers/RUMonthNameParser": 118, "./parsers/RURelativeDateFormatParser": 119, "./parsers/RUTimeExpressionParser": 120, "./parsers/RUTimeUnitAgoFormatParser": 121, "./parsers/RUTimeUnitCasualRelativeFormatParser": 122, "./parsers/RUTimeUnitWithinFormatParser": 123, "./parsers/RUWeekdayParser": 124, "./refiners/RUMergeDateRangeRefiner": 125, "./refiners/RUMergeDateTimeRefiner": 126 }], 114: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.AbstractParserWithLeftRightBoundaryChecking = exports.AbstractParserWithLeftBoundaryChecking = void 0;
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var constants_1 = require("../constants");
                var AbstractParserWithLeftBoundaryChecking = /** @class */ (function (_super) {
                    __extends(AbstractParserWithLeftBoundaryChecking, _super);
                    function AbstractParserWithLeftBoundaryChecking() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    AbstractParserWithLeftBoundaryChecking.prototype.patternLeftBoundary = function () {
                        return constants_1.REGEX_PARTS.leftBoundary;
                    };
                    AbstractParserWithLeftBoundaryChecking.prototype.innerPattern = function (context) {
                        return new RegExp(this.innerPatternString(context), constants_1.REGEX_PARTS.flags);
                    };
                    AbstractParserWithLeftBoundaryChecking.prototype.innerPatternHasChange = function (context, currentInnerPattern) {
                        return false;
                    };
                    return AbstractParserWithLeftBoundaryChecking;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.AbstractParserWithLeftBoundaryChecking = AbstractParserWithLeftBoundaryChecking;
                var AbstractParserWithLeftRightBoundaryChecking = /** @class */ (function (_super) {
                    __extends(AbstractParserWithLeftRightBoundaryChecking, _super);
                    function AbstractParserWithLeftRightBoundaryChecking() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    AbstractParserWithLeftRightBoundaryChecking.prototype.innerPattern = function (context) {
                        return new RegExp("".concat(this.innerPatternString(context)).concat(constants_1.REGEX_PARTS.rightBoundary), constants_1.REGEX_PARTS.flags);
                    };
                    return AbstractParserWithLeftRightBoundaryChecking;
                }(AbstractParserWithLeftBoundaryChecking));
                exports.AbstractParserWithLeftRightBoundaryChecking = AbstractParserWithLeftRightBoundaryChecking;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../constants": 112 }], 115: [function (require, module, exports) {
                "use strict";
                var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
                }) : (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function (o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule)
                        return mod;
                    var result = {};
                    if (mod != null)
                        for (var k in mod)
                            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                                __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var references = __importStar(require("../../../common/casualReferences"));
                var AbstractParserWithWordBoundaryChecking_1 = require("./AbstractParserWithWordBoundaryChecking");
                var RUCasualDateParser = /** @class */ (function (_super) {
                    __extends(RUCasualDateParser, _super);
                    function RUCasualDateParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    RUCasualDateParser.prototype.innerPatternString = function (context) {
                        return "(?:\u0441|\u0441\u043E)?\\s*(\u0441\u0435\u0433\u043E\u0434\u043D\u044F|\u0432\u0447\u0435\u0440\u0430|\u0437\u0430\u0432\u0442\u0440\u0430|\u043F\u043E\u0441\u043B\u0435\u0437\u0430\u0432\u0442\u0440\u0430|\u043F\u043E\u0441\u043B\u0435\u043F\u043E\u0441\u043B\u0435\u0437\u0430\u0432\u0442\u0440\u0430|\u043F\u043E\u0437\u0430\u043F\u043E\u0437\u0430\u0432\u0447\u0435\u0440\u0430|\u043F\u043E\u0437\u0430\u0432\u0447\u0435\u0440\u0430)";
                    };
                    RUCasualDateParser.prototype.innerExtract = function (context, match) {
                        var lowerText = match[1].toLowerCase();
                        var component = context.createParsingComponents();
                        switch (lowerText) {
                            case "сегодня":
                                return references.today(context.reference);
                            case "вчера":
                                return references.yesterday(context.reference);
                            case "завтра":
                                return references.tomorrow(context.reference);
                            case "послезавтра":
                                return references.theDayAfter(context.reference, 2);
                            case "послепослезавтра":
                                return references.theDayAfter(context.reference, 3);
                            case "позавчера":
                                return references.theDayBefore(context.reference, 2);
                            case "позапозавчера":
                                return references.theDayBefore(context.reference, 3);
                        }
                        return component;
                    };
                    return RUCasualDateParser;
                }(AbstractParserWithWordBoundaryChecking_1.AbstractParserWithLeftRightBoundaryChecking));
                exports.default = RUCasualDateParser;
            }, { "../../../common/casualReferences": 7, "./AbstractParserWithWordBoundaryChecking": 114 }], 116: [function (require, module, exports) {
                "use strict";
                var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
                }) : (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function (o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule)
                        return mod;
                    var result = {};
                    if (mod != null)
                        for (var k in mod)
                            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                                __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var references = __importStar(require("../../../common/casualReferences"));
                var dayjs_1 = require("../../../utils/dayjs");
                var dayjs_2 = __importDefault(require("dayjs"));
                var AbstractParserWithWordBoundaryChecking_1 = require("./AbstractParserWithWordBoundaryChecking");
                var RUCasualTimeParser = /** @class */ (function (_super) {
                    __extends(RUCasualTimeParser, _super);
                    function RUCasualTimeParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    RUCasualTimeParser.prototype.innerPatternString = function (context) {
                        return "(\u0441\u0435\u0439\u0447\u0430\u0441|\u043F\u0440\u043E\u0448\u043B\u044B\u043C\\s*\u0432\u0435\u0447\u0435\u0440\u043E\u043C|\u043F\u0440\u043E\u0448\u043B\u043E\u0439\\s*\u043D\u043E\u0447\u044C\u044E|\u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439\\s*\u043D\u043E\u0447\u044C\u044E|\u0441\u0435\u0433\u043E\u0434\u043D\u044F\\s*\u043D\u043E\u0447\u044C\u044E|\u044D\u0442\u043E\u0439\\s*\u043D\u043E\u0447\u044C\u044E|\u043D\u043E\u0447\u044C\u044E|\u044D\u0442\u0438\u043C \u0443\u0442\u0440\u043E\u043C|\u0443\u0442\u0440\u043E\u043C|\u0443\u0442\u0440\u0430|\u0432\\s*\u043F\u043E\u043B\u0434\u0435\u043D\u044C|\u0432\u0435\u0447\u0435\u0440\u043E\u043C|\u0432\u0435\u0447\u0435\u0440\u0430|\u0432\\s*\u043F\u043E\u043B\u043D\u043E\u0447\u044C)";
                    };
                    RUCasualTimeParser.prototype.innerExtract = function (context, match) {
                        var targetDate = dayjs_2.default(context.refDate);
                        var lowerText = match[0].toLowerCase();
                        var component = context.createParsingComponents();
                        if (lowerText === "сейчас") {
                            return references.now(context.reference);
                        }
                        if (lowerText === "вечером" || lowerText === "вечера") {
                            return references.evening(context.reference);
                        }
                        if (lowerText.endsWith("утром") || lowerText.endsWith("утра")) {
                            return references.morning(context.reference);
                        }
                        if (lowerText.match(/в\s*полдень/)) {
                            return references.noon(context.reference);
                        }
                        if (lowerText.match(/прошлой\s*ночью/)) {
                            return references.lastNight(context.reference);
                        }
                        if (lowerText.match(/прошлым\s*вечером/)) {
                            return references.yesterdayEvening(context.reference);
                        }
                        if (lowerText.match(/следующей\s*ночью/)) {
                            var daysToAdd = targetDate.hour() < 22 ? 1 : 2;
                            targetDate = targetDate.add(daysToAdd, "day");
                            dayjs_1.assignSimilarDate(component, targetDate);
                            component.imply("hour", 0);
                        }
                        if (lowerText.match(/в\s*полночь/) || lowerText.endsWith("ночью")) {
                            return references.midnight(context.reference);
                        }
                        return component;
                    };
                    return RUCasualTimeParser;
                }(AbstractParserWithWordBoundaryChecking_1.AbstractParserWithLeftRightBoundaryChecking));
                exports.default = RUCasualTimeParser;
            }, { "../../../common/casualReferences": 7, "../../../utils/dayjs": 166, "./AbstractParserWithWordBoundaryChecking": 114, "dayjs": 169 }], 117: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var years_1 = require("../../../calculation/years");
                var constants_1 = require("../constants");
                var constants_2 = require("../constants");
                var constants_3 = require("../constants");
                var pattern_1 = require("../../../utils/pattern");
                var AbstractParserWithWordBoundaryChecking_1 = require("./AbstractParserWithWordBoundaryChecking");
                var DATE_GROUP = 1;
                var DATE_TO_GROUP = 2;
                var MONTH_NAME_GROUP = 3;
                var YEAR_GROUP = 4;
                var RUMonthNameLittleEndianParser = /** @class */ (function (_super) {
                    __extends(RUMonthNameLittleEndianParser, _super);
                    function RUMonthNameLittleEndianParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    RUMonthNameLittleEndianParser.prototype.innerPatternString = function (context) {
                        return "(?:\u0441)?\\s*(".concat(constants_3.ORDINAL_NUMBER_PATTERN, ")") +
                            "(?:" +
                            "\\s{0,3}(?:\u043F\u043E|-|\u2013|\u0434\u043E)?\\s{0,3}" +
                            "(".concat(constants_3.ORDINAL_NUMBER_PATTERN, ")") +
                            ")?" +
                            "(?:-|\\/|\\s{0,3}(?:of)?\\s{0,3})" +
                            "(".concat(pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY), ")") +
                            "(?:" +
                            "(?:-|\\/|,?\\s{0,3})" +
                            "(".concat(constants_2.YEAR_PATTERN, "(?![^\\s]\\d))") +
                            ")?";
                    };
                    RUMonthNameLittleEndianParser.prototype.innerExtract = function (context, match) {
                        var result = context.createParsingResult(match.index, match[0]);
                        var month = constants_1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
                        var day = constants_3.parseOrdinalNumberPattern(match[DATE_GROUP]);
                        if (day > 31) {
                            match.index = match.index + match[DATE_GROUP].length;
                            return null;
                        }
                        result.start.assign("month", month);
                        result.start.assign("day", day);
                        if (match[YEAR_GROUP]) {
                            var yearNumber = constants_2.parseYear(match[YEAR_GROUP]);
                            result.start.assign("year", yearNumber);
                        }
                        else {
                            var year = years_1.findYearClosestToRef(context.refDate, day, month);
                            result.start.imply("year", year);
                        }
                        if (match[DATE_TO_GROUP]) {
                            var endDate = constants_3.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
                            result.end = result.start.clone();
                            result.end.assign("day", endDate);
                        }
                        return result;
                    };
                    return RUMonthNameLittleEndianParser;
                }(AbstractParserWithWordBoundaryChecking_1.AbstractParserWithLeftRightBoundaryChecking));
                exports.default = RUMonthNameLittleEndianParser;
            }, { "../../../calculation/years": 3, "../../../utils/pattern": 167, "../constants": 112, "./AbstractParserWithWordBoundaryChecking": 114 }], 118: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var years_1 = require("../../../calculation/years");
                var pattern_1 = require("../../../utils/pattern");
                var constants_2 = require("../constants");
                var AbstractParserWithWordBoundaryChecking_1 = require("./AbstractParserWithWordBoundaryChecking");
                var MONTH_NAME_GROUP = 2;
                var YEAR_GROUP = 3;
                var RUMonthNameParser = /** @class */ (function (_super) {
                    __extends(RUMonthNameParser, _super);
                    function RUMonthNameParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    RUMonthNameParser.prototype.innerPatternString = function (context) {
                        return ("((?:\u0432)\\s*)?" +
                            "(".concat(pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY), ")") +
                            "\\s*" +
                            "(?:" +
                            "[,-]?\\s*(".concat(constants_2.YEAR_PATTERN, ")?") +
                            ")?" +
                            "(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)");
                    };
                    RUMonthNameParser.prototype.innerExtract = function (context, match) {
                        var monthName = match[MONTH_NAME_GROUP].toLowerCase();
                        if (match[0].length <= 3 && !constants_1.FULL_MONTH_NAME_DICTIONARY[monthName]) {
                            return null;
                        }
                        var result = context.createParsingResult(match.index, match.index + match[0].length);
                        result.start.imply("day", 1);
                        var month = constants_1.MONTH_DICTIONARY[monthName];
                        result.start.assign("month", month);
                        if (match[YEAR_GROUP]) {
                            var year = constants_2.parseYear(match[YEAR_GROUP]);
                            result.start.assign("year", year);
                        }
                        else {
                            var year = years_1.findYearClosestToRef(context.refDate, 1, month);
                            result.start.imply("year", year);
                        }
                        return result;
                    };
                    return RUMonthNameParser;
                }(AbstractParserWithWordBoundaryChecking_1.AbstractParserWithLeftBoundaryChecking));
                exports.default = RUMonthNameParser;
            }, { "../../../calculation/years": 3, "../../../utils/pattern": 167, "../constants": 112, "./AbstractParserWithWordBoundaryChecking": 114 }], 119: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var dayjs_1 = __importDefault(require("dayjs"));
                var pattern_1 = require("../../../utils/pattern");
                var AbstractParserWithWordBoundaryChecking_1 = require("./AbstractParserWithWordBoundaryChecking");
                var MODIFIER_WORD_GROUP = 1;
                var RELATIVE_WORD_GROUP = 2;
                var RURelativeDateFormatParser = /** @class */ (function (_super) {
                    __extends(RURelativeDateFormatParser, _super);
                    function RURelativeDateFormatParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    RURelativeDateFormatParser.prototype.innerPatternString = function (context) {
                        return "(\u0432 \u043F\u0440\u043E\u0448\u043B\u043E\u043C|\u043D\u0430 \u043F\u0440\u043E\u0448\u043B\u043E\u0439|\u043D\u0430 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439|\u0432 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u043C|\u043D\u0430 \u044D\u0442\u043E\u0439|\u0432 \u044D\u0442\u043E\u043C)\\s*(".concat(pattern_1.matchAnyPattern(constants_1.TIME_UNIT_DICTIONARY), ")");
                    };
                    RURelativeDateFormatParser.prototype.innerExtract = function (context, match) {
                        var modifier = match[MODIFIER_WORD_GROUP].toLowerCase();
                        var unitWord = match[RELATIVE_WORD_GROUP].toLowerCase();
                        var timeunit = constants_1.TIME_UNIT_DICTIONARY[unitWord];
                        if (modifier == "на следующей" || modifier == "в следующем") {
                            var timeUnits = {};
                            timeUnits[timeunit] = 1;
                            return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                        }
                        if (modifier == "в прошлом" || modifier == "на прошлой") {
                            var timeUnits = {};
                            timeUnits[timeunit] = -1;
                            return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                        }
                        var components = context.createParsingComponents();
                        var date = dayjs_1.default(context.reference.instant);
                        if (timeunit.match(/week/i)) {
                            date = date.add(-date.get("d"), "d");
                            components.imply("day", date.date());
                            components.imply("month", date.month() + 1);
                            components.imply("year", date.year());
                        }
                        else if (timeunit.match(/month/i)) {
                            date = date.add(-date.date() + 1, "d");
                            components.imply("day", date.date());
                            components.assign("year", date.year());
                            components.assign("month", date.month() + 1);
                        }
                        else if (timeunit.match(/year/i)) {
                            date = date.add(-date.date() + 1, "d");
                            date = date.add(-date.month(), "month");
                            components.imply("day", date.date());
                            components.imply("month", date.month() + 1);
                            components.assign("year", date.year());
                        }
                        return components;
                    };
                    return RURelativeDateFormatParser;
                }(AbstractParserWithWordBoundaryChecking_1.AbstractParserWithLeftRightBoundaryChecking));
                exports.default = RURelativeDateFormatParser;
            }, { "../../../results": 163, "../../../utils/pattern": 167, "../constants": 112, "./AbstractParserWithWordBoundaryChecking": 114, "dayjs": 169 }], 120: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var types_1 = require("../../../types");
                var AbstractTimeExpressionParser_1 = require("../../../common/parsers/AbstractTimeExpressionParser");
                var constants_1 = require("../constants");
                var RUTimeExpressionParser = /** @class */ (function (_super) {
                    __extends(RUTimeExpressionParser, _super);
                    function RUTimeExpressionParser(strictMode) {
                        return _super.call(this, strictMode) || this;
                    }
                    RUTimeExpressionParser.prototype.patternFlags = function () {
                        return constants_1.REGEX_PARTS.flags;
                    };
                    RUTimeExpressionParser.prototype.primaryPatternLeftBoundary = function () {
                        return "(^|\\s|T|(?:[^\\p{L}\\p{N}_]))";
                    };
                    RUTimeExpressionParser.prototype.followingPhase = function () {
                        return "\\s*(?:\\-|\\\u2013|\\~|\\\u301C|\u0434\u043E|\u0438|\u043F\u043E|\\?)\\s*";
                    };
                    RUTimeExpressionParser.prototype.primaryPrefix = function () {
                        return "(?:(?:\u0432|\u0441)\\s*)??";
                    };
                    RUTimeExpressionParser.prototype.primarySuffix = function () {
                        return "(?:\\s*(?:\u0443\u0442\u0440\u0430|\u0432\u0435\u0447\u0435\u0440\u0430|\u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u043B\u0443\u0434\u043D\u044F))?(?!\\/)".concat(constants_1.REGEX_PARTS.rightBoundary);
                    };
                    RUTimeExpressionParser.prototype.extractPrimaryTimeComponents = function (context, match) {
                        var components = _super.prototype.extractPrimaryTimeComponents.call(this, context, match);
                        if (components) {
                            if (match[0].endsWith("вечера")) {
                                var hour = components.get("hour");
                                if (hour >= 6 && hour < 12) {
                                    components.assign("hour", components.get("hour") + 12);
                                    components.assign("meridiem", types_1.Meridiem.PM);
                                }
                                else if (hour < 6) {
                                    components.assign("meridiem", types_1.Meridiem.AM);
                                }
                            }
                            if (match[0].endsWith("после полудня")) {
                                components.assign("meridiem", types_1.Meridiem.PM);
                                var hour = components.get("hour");
                                if (hour >= 0 && hour <= 6) {
                                    components.assign("hour", components.get("hour") + 12);
                                }
                            }
                            if (match[0].endsWith("утра")) {
                                components.assign("meridiem", types_1.Meridiem.AM);
                                var hour = components.get("hour");
                                if (hour < 12) {
                                    components.assign("hour", components.get("hour"));
                                }
                            }
                        }
                        return components;
                    };
                    return RUTimeExpressionParser;
                }(AbstractTimeExpressionParser_1.AbstractTimeExpressionParser));
                exports.default = RUTimeExpressionParser;
            }, { "../../../common/parsers/AbstractTimeExpressionParser": 9, "../../../types": 165, "../constants": 112 }], 121: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var timeunits_1 = require("../../../utils/timeunits");
                var AbstractParserWithWordBoundaryChecking_1 = require("./AbstractParserWithWordBoundaryChecking");
                var RUTimeUnitAgoFormatParser = /** @class */ (function (_super) {
                    __extends(RUTimeUnitAgoFormatParser, _super);
                    function RUTimeUnitAgoFormatParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    RUTimeUnitAgoFormatParser.prototype.innerPatternString = function (context) {
                        return "(".concat(constants_1.TIME_UNITS_PATTERN, ")\\s{0,5}\u043D\u0430\u0437\u0430\u0434(?=(?:\\W|$))");
                    };
                    RUTimeUnitAgoFormatParser.prototype.innerExtract = function (context, match) {
                        var timeUnits = constants_1.parseTimeUnits(match[1]);
                        var outputTimeUnits = timeunits_1.reverseTimeUnits(timeUnits);
                        return results_1.ParsingComponents.createRelativeFromReference(context.reference, outputTimeUnits);
                    };
                    return RUTimeUnitAgoFormatParser;
                }(AbstractParserWithWordBoundaryChecking_1.AbstractParserWithLeftBoundaryChecking));
                exports.default = RUTimeUnitAgoFormatParser;
            }, { "../../../results": 163, "../../../utils/timeunits": 168, "../constants": 112, "./AbstractParserWithWordBoundaryChecking": 114 }], 122: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var timeunits_1 = require("../../../utils/timeunits");
                var AbstractParserWithWordBoundaryChecking_1 = require("./AbstractParserWithWordBoundaryChecking");
                var RUTimeUnitCasualRelativeFormatParser = /** @class */ (function (_super) {
                    __extends(RUTimeUnitCasualRelativeFormatParser, _super);
                    function RUTimeUnitCasualRelativeFormatParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    RUTimeUnitCasualRelativeFormatParser.prototype.innerPatternString = function (context) {
                        return "(\u044D\u0442\u0438|\u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435|\u043F\u0440\u043E\u0448\u043B\u044B\u0435|\u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0435|\u043F\u043E\u0441\u043B\u0435|\u0441\u043F\u0443\u0441\u0442\u044F|\u0447\u0435\u0440\u0435\u0437|\\+|-)\\s*(".concat(constants_1.TIME_UNITS_PATTERN, ")");
                    };
                    RUTimeUnitCasualRelativeFormatParser.prototype.innerExtract = function (context, match) {
                        var prefix = match[1].toLowerCase();
                        var timeUnits = constants_1.parseTimeUnits(match[2]);
                        switch (prefix) {
                            case "последние":
                            case "прошлые":
                            case "-":
                                timeUnits = timeunits_1.reverseTimeUnits(timeUnits);
                                break;
                        }
                        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                    };
                    return RUTimeUnitCasualRelativeFormatParser;
                }(AbstractParserWithWordBoundaryChecking_1.AbstractParserWithLeftRightBoundaryChecking));
                exports.default = RUTimeUnitCasualRelativeFormatParser;
            }, { "../../../results": 163, "../../../utils/timeunits": 168, "../constants": 112, "./AbstractParserWithWordBoundaryChecking": 114 }], 123: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var PATTERN = "(?:(?:\u043E\u043A\u043E\u043B\u043E|\u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E)\\s*(?:~\\s*)?)?(".concat(constants_1.TIME_UNITS_PATTERN, ")").concat(constants_1.REGEX_PARTS.rightBoundary);
                var RUTimeUnitWithinFormatParser = /** @class */ (function (_super) {
                    __extends(RUTimeUnitWithinFormatParser, _super);
                    function RUTimeUnitWithinFormatParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    RUTimeUnitWithinFormatParser.prototype.patternLeftBoundary = function () {
                        return constants_1.REGEX_PARTS.leftBoundary;
                    };
                    RUTimeUnitWithinFormatParser.prototype.innerPattern = function (context) {
                        return context.option.forwardDate
                            ? new RegExp(PATTERN, constants_1.REGEX_PARTS.flags)
                            : new RegExp("(?:\u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435|\u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0438)\\s*".concat(PATTERN), constants_1.REGEX_PARTS.flags);
                    };
                    RUTimeUnitWithinFormatParser.prototype.innerExtract = function (context, match) {
                        var timeUnits = constants_1.parseTimeUnits(match[1]);
                        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                    };
                    return RUTimeUnitWithinFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = RUTimeUnitWithinFormatParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../results": 163, "../constants": 112 }], 124: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var pattern_1 = require("../../../utils/pattern");
                var weekdays_1 = require("../../../common/calculation/weekdays");
                var AbstractParserWithWordBoundaryChecking_1 = require("./AbstractParserWithWordBoundaryChecking");
                var PREFIX_GROUP = 1;
                var WEEKDAY_GROUP = 2;
                var POSTFIX_GROUP = 3;
                var RUWeekdayParser = /** @class */ (function (_super) {
                    __extends(RUWeekdayParser, _super);
                    function RUWeekdayParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    RUWeekdayParser.prototype.innerPatternString = function (context) {
                        return ("(?:(?:,|\\(|\uFF08)\\s*)?" +
                            "(?:\u0432\\s*?)?" +
                            "(?:(\u044D\u0442\u0443|\u044D\u0442\u043E\u0442|\u043F\u0440\u043E\u0448\u043B\u044B\u0439|\u043F\u0440\u043E\u0448\u043B\u0443\u044E|\u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439|\u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0443\u044E|\u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0433\u043E)\\s*)?" +
                            "(".concat(pattern_1.matchAnyPattern(constants_1.WEEKDAY_DICTIONARY), ")") +
                            "(?:\\s*(?:,|\\)|\uFF09))?" +
                            "(?:\\s*\u043D\u0430\\s*(\u044D\u0442\u043E\u0439|\u043F\u0440\u043E\u0448\u043B\u043E\u0439|\u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439)\\s*\u043D\u0435\u0434\u0435\u043B\u0435)?");
                    };
                    RUWeekdayParser.prototype.innerExtract = function (context, match) {
                        var dayOfWeek = match[WEEKDAY_GROUP].toLowerCase();
                        var weekday = constants_1.WEEKDAY_DICTIONARY[dayOfWeek];
                        var prefix = match[PREFIX_GROUP];
                        var postfix = match[POSTFIX_GROUP];
                        var modifierWord = prefix || postfix;
                        modifierWord = modifierWord || "";
                        modifierWord = modifierWord.toLowerCase();
                        var modifier = null;
                        if (modifierWord == "прошлый" || modifierWord == "прошлую" || modifierWord == "прошлой") {
                            modifier = "last";
                        }
                        else if (modifierWord == "следующий" ||
                            modifierWord == "следующую" ||
                            modifierWord == "следующей" ||
                            modifierWord == "следующего") {
                            modifier = "next";
                        }
                        else if (modifierWord == "этот" || modifierWord == "эту" || modifierWord == "этой") {
                            modifier = "this";
                        }
                        return weekdays_1.createParsingComponentsAtWeekday(context.reference, weekday, modifier);
                    };
                    return RUWeekdayParser;
                }(AbstractParserWithWordBoundaryChecking_1.AbstractParserWithLeftRightBoundaryChecking));
                exports.default = RUWeekdayParser;
            }, { "../../../common/calculation/weekdays": 6, "../../../utils/pattern": 167, "../constants": 112, "./AbstractParserWithWordBoundaryChecking": 114 }], 125: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractMergeDateRangeRefiner_1 = __importDefault(require("../../../common/refiners/AbstractMergeDateRangeRefiner"));
                var RUMergeDateRangeRefiner = /** @class */ (function (_super) {
                    __extends(RUMergeDateRangeRefiner, _super);
                    function RUMergeDateRangeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    RUMergeDateRangeRefiner.prototype.patternBetween = function () {
                        return /^\s*(и до|и по|до|по|-)\s*$/i;
                    };
                    return RUMergeDateRangeRefiner;
                }(AbstractMergeDateRangeRefiner_1.default));
                exports.default = RUMergeDateRangeRefiner;
            }, { "../../../common/refiners/AbstractMergeDateRangeRefiner": 12 }], 126: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractMergeDateTimeRefiner_1 = __importDefault(require("../../../common/refiners/AbstractMergeDateTimeRefiner"));
                var RUMergeDateTimeRefiner = /** @class */ (function (_super) {
                    __extends(RUMergeDateTimeRefiner, _super);
                    function RUMergeDateTimeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    RUMergeDateTimeRefiner.prototype.patternBetween = function () {
                        return new RegExp("^\\s*(T|\u0432|,|-)?\\s*$");
                    };
                    return RUMergeDateTimeRefiner;
                }(AbstractMergeDateTimeRefiner_1.default));
                exports.default = RUMergeDateTimeRefiner;
            }, { "../../../common/refiners/AbstractMergeDateTimeRefiner": 13 }], 127: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.parseTimeUnits = exports.TIME_UNITS_PATTERN = exports.parseYearPattern = exports.YEAR_PATTERN = exports.parseOrdinalNumberPattern = exports.ORDINAL_NUMBER_PATTERN = exports.parseNumberPattern = exports.NUMBER_PATTERN = exports.TIME_UNIT_DICTIONARY = exports.ORDINAL_WORD_DICTIONARY = exports.INTEGER_WORD_DICTIONARY = exports.MONTH_DICTIONARY = exports.FULL_MONTH_NAME_DICTIONARY = exports.WEEKDAY_DICTIONARY = exports.REGEX_PARTS = void 0;
                var pattern_1 = require("../../utils/pattern");
                var years_1 = require("../../calculation/years");
                exports.REGEX_PARTS = {
                    leftBoundary: "([^\\p{L}\\p{N}_]|^)",
                    rightBoundary: "(?=[^\\p{L}\\p{N}_]|$)",
                    flags: "iu",
                };
                exports.WEEKDAY_DICTIONARY = {
                    "неділя": 0,
                    "неділі": 0,
                    "неділю": 0,
                    "нд": 0,
                    "нд.": 0,
                    "понеділок": 1,
                    "понеділка": 1,
                    "пн": 1,
                    "пн.": 1,
                    "вівторок": 2,
                    "вівторка": 2,
                    "вт": 2,
                    "вт.": 2,
                    "середа": 3,
                    "середи": 3,
                    "середу": 3,
                    "ср": 3,
                    "ср.": 3,
                    "четвер": 4,
                    "четверга": 4,
                    "четвергу": 4,
                    "чт": 4,
                    "чт.": 4,
                    "п'ятниця": 5,
                    "п'ятниці": 5,
                    "п'ятницю": 5,
                    "пт": 5,
                    "пт.": 5,
                    "субота": 6,
                    "суботи": 6,
                    "суботу": 6,
                    "сб": 6,
                    "сб.": 6,
                };
                exports.FULL_MONTH_NAME_DICTIONARY = {
                    "січень": 1,
                    "січня": 1,
                    "січні": 1,
                    "лютий": 2,
                    "лютого": 2,
                    "лютому": 2,
                    "березень": 3,
                    "березня": 3,
                    "березні": 3,
                    "квітень": 4,
                    "квітня": 4,
                    "квітні": 4,
                    "травень": 5,
                    "травня": 5,
                    "травні": 5,
                    "червень": 6,
                    "червня": 6,
                    "червні": 6,
                    "липень": 7,
                    "липня": 7,
                    "липні": 7,
                    "серпень": 8,
                    "серпня": 8,
                    "серпні": 8,
                    "вересень": 9,
                    "вересня": 9,
                    "вересні": 9,
                    "жовтень": 10,
                    "жовтня": 10,
                    "жовтні": 10,
                    "листопад": 11,
                    "листопада": 11,
                    "листопаду": 11,
                    "грудень": 12,
                    "грудня": 12,
                    "грудні": 12,
                };
                exports.MONTH_DICTIONARY = Object.assign(Object.assign({}, exports.FULL_MONTH_NAME_DICTIONARY), { "січ": 1, "січ.": 1, "лют": 2, "лют.": 2, "бер": 3, "бер.": 3, "квіт": 4, "квіт.": 4, "трав": 5, "трав.": 5, "черв": 6, "черв.": 6, "лип": 7, "лип.": 7, "серп": 8, "серп.": 8, "сер": 8, "cер.": 8, "вер": 9, "вер.": 9, "верес": 9, "верес.": 9, "жовт": 10, "жовт.": 10, "листоп": 11, "листоп.": 11, "груд": 12, "груд.": 12 });
                exports.INTEGER_WORD_DICTIONARY = {
                    "один": 1,
                    "одна": 1,
                    "одної": 1,
                    "одну": 1,
                    "дві": 2,
                    "два": 2,
                    "двох": 2,
                    "три": 3,
                    "трьох": 3,
                    "чотири": 4,
                    "чотирьох": 4,
                    "п'ять": 5,
                    "п'яти": 5,
                    "шість": 6,
                    "шести": 6,
                    "сім": 7,
                    "семи": 7,
                    "вісім": 8,
                    "восьми": 8,
                    "дев'ять": 9,
                    "дев'яти": 9,
                    "десять": 10,
                    "десяти": 10,
                    "одинадцять": 11,
                    "одинадцяти": 11,
                    "дванадцять": 12,
                    "дванадцяти": 12,
                };
                exports.ORDINAL_WORD_DICTIONARY = {
                    "перше": 1,
                    "першого": 1,
                    "друге": 2,
                    "другого": 2,
                    "третє": 3,
                    "третього": 3,
                    "четверте": 4,
                    "четвертого": 4,
                    "п'яте": 5,
                    "п'ятого": 5,
                    "шосте": 6,
                    "шостого": 6,
                    "сьоме": 7,
                    "сьомого": 7,
                    "восьме": 8,
                    "восьмого": 8,
                    "дев'яте": 9,
                    "дев'ятого": 9,
                    "десяте": 10,
                    "десятого": 10,
                    "одинадцяте": 11,
                    "одинадцятого": 11,
                    "дванадцяте": 12,
                    "дванадцятого": 12,
                    "тринадцяте": 13,
                    "тринадцятого": 13,
                    "чотирнадцяте": 14,
                    "чотинрнадцятого": 14,
                    "п'ятнадцяте": 15,
                    "п'ятнадцятого": 15,
                    "шістнадцяте": 16,
                    "шістнадцятого": 16,
                    "сімнадцяте": 17,
                    "сімнадцятого": 17,
                    "вісімнадцяте": 18,
                    "вісімнадцятого": 18,
                    "дев'ятнадцяте": 19,
                    "дев'ятнадцятого": 19,
                    "двадцяте": 20,
                    "двадцятого": 20,
                    "двадцять перше": 21,
                    "двадцять першого": 21,
                    "двадцять друге": 22,
                    "двадцять другого": 22,
                    "двадцять третє": 23,
                    "двадцять третього": 23,
                    "двадцять четверте": 24,
                    "двадцять четвертого": 24,
                    "двадцять п'яте": 25,
                    "двадцять п'ятого": 25,
                    "двадцять шосте": 26,
                    "двадцять шостого": 26,
                    "двадцять сьоме": 27,
                    "двадцять сьомого": 27,
                    "двадцять восьме": 28,
                    "двадцять восьмого": 28,
                    "двадцять дев'яте": 29,
                    "двадцять дев'ятого": 29,
                    "тридцяте": 30,
                    "тридцятого": 30,
                    "тридцять перше": 31,
                    "тридцять першого": 31,
                };
                exports.TIME_UNIT_DICTIONARY = {
                    сек: "second",
                    секунда: "second",
                    секунд: "second",
                    секунди: "second",
                    секунду: "second",
                    секундочок: "second",
                    секундочки: "second",
                    секундочку: "second",
                    хв: "minute",
                    хвилина: "minute",
                    хвилин: "minute",
                    хвилини: "minute",
                    хвилину: "minute",
                    хвилинок: "minute",
                    хвилинки: "minute",
                    хвилинку: "minute",
                    хвилиночок: "minute",
                    хвилиночки: "minute",
                    хвилиночку: "minute",
                    год: "hour",
                    година: "hour",
                    годин: "hour",
                    години: "hour",
                    годину: "hour",
                    годинка: "hour",
                    годинок: "hour",
                    годинки: "hour",
                    годинку: "hour",
                    день: "d",
                    дня: "d",
                    днів: "d",
                    дні: "d",
                    доба: "d",
                    добу: "d",
                    тиждень: "week",
                    тижню: "week",
                    тижня: "week",
                    тижні: "week",
                    тижнів: "week",
                    місяць: "month",
                    місяців: "month",
                    місяці: "month",
                    місяця: "month",
                    квартал: "quarter",
                    кварталу: "quarter",
                    квартала: "quarter",
                    кварталів: "quarter",
                    кварталі: "quarter",
                    рік: "year",
                    року: "year",
                    році: "year",
                    років: "year",
                    роки: "year",
                };
                exports.NUMBER_PATTERN = "(?:".concat(pattern_1.matchAnyPattern(exports.INTEGER_WORD_DICTIONARY), "|[0-9]+|[0-9]+\\.[0-9]+|\u043F\u0456\u0432|\u0434\u0435\u043A\u0456\u043B\u044C\u043A\u0430|\u043F\u0430\u0440(?:\u0443)|\\s{0,3})");
                function parseNumberPattern(match) {
                    var num = match.toLowerCase();
                    if (exports.INTEGER_WORD_DICTIONARY[num] !== undefined) {
                        return exports.INTEGER_WORD_DICTIONARY[num];
                    }
                    if (num.match(/декілька/)) {
                        return 2;
                    }
                    else if (num.match(/пів/)) {
                        return 0.5;
                    }
                    else if (num.match(/пар/)) {
                        return 2;
                    }
                    else if (num === "") {
                        return 1;
                    }
                    return parseFloat(num);
                }
                exports.parseNumberPattern = parseNumberPattern;
                exports.ORDINAL_NUMBER_PATTERN = "(?:".concat(pattern_1.matchAnyPattern(exports.ORDINAL_WORD_DICTIONARY), "|[0-9]{1,2}(?:\u0433\u043E|\u043E\u0433\u043E|\u0435)?)");
                function parseOrdinalNumberPattern(match) {
                    var num = match.toLowerCase();
                    if (exports.ORDINAL_WORD_DICTIONARY[num] !== undefined) {
                        return exports.ORDINAL_WORD_DICTIONARY[num];
                    }
                    return parseInt(num);
                }
                exports.parseOrdinalNumberPattern = parseOrdinalNumberPattern;
                var year = "(?:\\s+(?:року|рік|р|р.))?";
                exports.YEAR_PATTERN = "(?:[1-9][0-9]{0,3}".concat(year, "\\s*(?:\u043D.\u0435.|\u0434\u043E \u043D.\u0435.|\u043D. \u0435.|\u0434\u043E \u043D. \u0435.)|[1-2][0-9]{3}").concat(year, "|[5-9][0-9]").concat(year, ")");
                function parseYearPattern(match) {
                    if (/(рік|року|р|р.)/i.test(match)) {
                        match = match.replace(/(рік|року|р|р.)/i, "");
                    }
                    if (/(до н.е.|до н. е.)/i.test(match)) {
                        match = match.replace(/(до н.е.|до н. е.)/i, "");
                        return -parseInt(match);
                    }
                    if (/(н. е.|н.е.)/i.test(match)) {
                        match = match.replace(/(н. е.|н.е.)/i, "");
                        return parseInt(match);
                    }
                    var rawYearNumber = parseInt(match);
                    return years_1.findMostLikelyADYear(rawYearNumber);
                }
                exports.parseYearPattern = parseYearPattern;
                var SINGLE_TIME_UNIT_PATTERN = "(".concat(exports.NUMBER_PATTERN, ")\\s{0,3}(").concat(pattern_1.matchAnyPattern(exports.TIME_UNIT_DICTIONARY), ")");
                var SINGLE_TIME_UNIT_REGEX = new RegExp(SINGLE_TIME_UNIT_PATTERN, "i");
                exports.TIME_UNITS_PATTERN = pattern_1.repeatedTimeunitPattern("(?:(?:\u0431\u043B\u0438\u0437\u044C\u043A\u043E|\u043F\u0440\u0438\u0431\u043B\u0438\u0437\u043D\u043E)\\s{0,3})?", SINGLE_TIME_UNIT_PATTERN);
                function parseTimeUnits(timeunitText) {
                    var fragments = {};
                    var remainingText = timeunitText;
                    var match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
                    while (match) {
                        collectDateTimeFragment(fragments, match);
                        remainingText = remainingText.substring(match[0].length).trim();
                        match = SINGLE_TIME_UNIT_REGEX.exec(remainingText);
                    }
                    return fragments;
                }
                exports.parseTimeUnits = parseTimeUnits;
                function collectDateTimeFragment(fragments, match) {
                    var num = parseNumberPattern(match[1]);
                    var unit = exports.TIME_UNIT_DICTIONARY[match[2].toLowerCase()];
                    fragments[unit] = num;
                }
            }, { "../../calculation/years": 3, "../../utils/pattern": 167 }], 128: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.parseDate = exports.parse = exports.createConfiguration = exports.createCasualConfiguration = exports.strict = exports.casual = exports.Weekday = exports.Meridiem = exports.ReferenceWithTimezone = exports.ParsingComponents = exports.ParsingResult = exports.Chrono = void 0;
                var UKTimeUnitWithinFormatParser_1 = __importDefault(require("./parsers/UKTimeUnitWithinFormatParser"));
                var UKMonthNameLittleEndianParser_1 = __importDefault(require("./parsers/UKMonthNameLittleEndianParser"));
                var UKMonthNameParser_1 = __importDefault(require("./parsers/UKMonthNameParser"));
                var UKTimeExpressionParser_1 = __importDefault(require("./parsers/UKTimeExpressionParser"));
                var UKTimeUnitAgoFormatParser_1 = __importDefault(require("./parsers/UKTimeUnitAgoFormatParser"));
                var UKMergeDateRangeRefiner_1 = __importDefault(require("./refiners/UKMergeDateRangeRefiner"));
                var UKMergeDateTimeRefiner_1 = __importDefault(require("./refiners/UKMergeDateTimeRefiner"));
                var configurations_1 = require("../../configurations");
                var UKCasualDateParser_1 = __importDefault(require("./parsers/UKCasualDateParser"));
                var UKCasualTimeParser_1 = __importDefault(require("./parsers/UKCasualTimeParser"));
                var UKWeekdayParser_1 = __importDefault(require("./parsers/UKWeekdayParser"));
                var UKRelativeDateFormatParser_1 = __importDefault(require("./parsers/UKRelativeDateFormatParser"));
                var chrono_1 = require("../../chrono");
                Object.defineProperty(exports, "Chrono", { enumerable: true, get: function () { return chrono_1.Chrono; } });
                var results_1 = require("../../results");
                Object.defineProperty(exports, "ParsingResult", { enumerable: true, get: function () { return results_1.ParsingResult; } });
                Object.defineProperty(exports, "ParsingComponents", { enumerable: true, get: function () { return results_1.ParsingComponents; } });
                Object.defineProperty(exports, "ReferenceWithTimezone", { enumerable: true, get: function () { return results_1.ReferenceWithTimezone; } });
                var types_1 = require("../../types");
                Object.defineProperty(exports, "Meridiem", { enumerable: true, get: function () { return types_1.Meridiem; } });
                Object.defineProperty(exports, "Weekday", { enumerable: true, get: function () { return types_1.Weekday; } });
                var SlashDateFormatParser_1 = __importDefault(require("../../common/parsers/SlashDateFormatParser"));
                var UKTimeUnitCasualRelativeFormatParser_1 = __importDefault(require("./parsers/UKTimeUnitCasualRelativeFormatParser"));
                var ISOFormatParser_1 = __importDefault(require("../../common/parsers/ISOFormatParser"));
                exports.casual = new chrono_1.Chrono(createCasualConfiguration());
                exports.strict = new chrono_1.Chrono(createConfiguration(true));
                function createCasualConfiguration() {
                    var option = createConfiguration(false);
                    option.parsers.unshift(new UKCasualDateParser_1.default());
                    option.parsers.unshift(new UKCasualTimeParser_1.default());
                    option.parsers.unshift(new UKMonthNameParser_1.default());
                    option.parsers.unshift(new UKRelativeDateFormatParser_1.default());
                    option.parsers.unshift(new UKTimeUnitCasualRelativeFormatParser_1.default());
                    return option;
                }
                exports.createCasualConfiguration = createCasualConfiguration;
                function createConfiguration(strictMode) {
                    return configurations_1.includeCommonConfiguration({
                        parsers: [
                            new ISOFormatParser_1.default(),
                            new SlashDateFormatParser_1.default(true),
                            new UKTimeUnitWithinFormatParser_1.default(),
                            new UKMonthNameLittleEndianParser_1.default(),
                            new UKWeekdayParser_1.default(),
                            new UKTimeExpressionParser_1.default(strictMode),
                            new UKTimeUnitAgoFormatParser_1.default(),
                        ],
                        refiners: [new UKMergeDateTimeRefiner_1.default(), new UKMergeDateRangeRefiner_1.default()],
                    }, strictMode);
                }
                exports.createConfiguration = createConfiguration;
                function parse(text, ref, option) {
                    return exports.casual.parse(text, ref, option);
                }
                exports.parse = parse;
                function parseDate(text, ref, option) {
                    return exports.casual.parseDate(text, ref, option);
                }
                exports.parseDate = parseDate;
            }, { "../../chrono": 4, "../../common/parsers/ISOFormatParser": 10, "../../common/parsers/SlashDateFormatParser": 11, "../../configurations": 20, "../../results": 163, "../../types": 165, "./parsers/UKCasualDateParser": 130, "./parsers/UKCasualTimeParser": 131, "./parsers/UKMonthNameLittleEndianParser": 132, "./parsers/UKMonthNameParser": 133, "./parsers/UKRelativeDateFormatParser": 134, "./parsers/UKTimeExpressionParser": 135, "./parsers/UKTimeUnitAgoFormatParser": 136, "./parsers/UKTimeUnitCasualRelativeFormatParser": 137, "./parsers/UKTimeUnitWithinFormatParser": 138, "./parsers/UKWeekdayParser": 139, "./refiners/UKMergeDateRangeRefiner": 140, "./refiners/UKMergeDateTimeRefiner": 141 }], 129: [function (require, module, exports) {
                arguments[4][114][0].apply(exports, arguments);
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../constants": 127, "dup": 114 }], 130: [function (require, module, exports) {
                "use strict";
                var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
                }) : (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function (o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule)
                        return mod;
                    var result = {};
                    if (mod != null)
                        for (var k in mod)
                            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                                __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var references = __importStar(require("../../../common/casualReferences"));
                var AbstractParserWithWordBoundaryChecking_1 = require("./AbstractParserWithWordBoundaryChecking");
                var UKCasualDateParser = /** @class */ (function (_super) {
                    __extends(UKCasualDateParser, _super);
                    function UKCasualDateParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    UKCasualDateParser.prototype.innerPatternString = function (context) {
                        return "(?:\u0437|\u0456\u0437|\u0432\u0456\u0434)?\\s*(\u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456|\u0432\u0447\u043E\u0440\u0430|\u0437\u0430\u0432\u0442\u0440\u0430|\u043F\u0456\u0441\u043B\u044F\u0437\u0430\u0432\u0442\u0440\u0430|\u043F\u0456\u0441\u043B\u044F\u043F\u0456\u0441\u043B\u044F\u0437\u0430\u0432\u0442\u0440\u0430|\u043F\u043E\u0437\u0430\u043F\u043E\u0437\u0430\u0432\u0447\u043E\u0440\u0430|\u043F\u043E\u0437\u0430\u0432\u0447\u043E\u0440\u0430)";
                    };
                    UKCasualDateParser.prototype.innerExtract = function (context, match) {
                        var lowerText = match[1].toLowerCase();
                        var component = context.createParsingComponents();
                        switch (lowerText) {
                            case "сьогодні":
                                return references.today(context.reference);
                            case "вчора":
                                return references.yesterday(context.reference);
                            case "завтра":
                                return references.tomorrow(context.reference);
                            case "післязавтра":
                                return references.theDayAfter(context.reference, 2);
                            case "післяпіслязавтра":
                                return references.theDayAfter(context.reference, 3);
                            case "позавчора":
                                return references.theDayBefore(context.reference, 2);
                            case "позапозавчора":
                                return references.theDayBefore(context.reference, 3);
                        }
                        return component;
                    };
                    return UKCasualDateParser;
                }(AbstractParserWithWordBoundaryChecking_1.AbstractParserWithLeftRightBoundaryChecking));
                exports.default = UKCasualDateParser;
            }, { "../../../common/casualReferences": 7, "./AbstractParserWithWordBoundaryChecking": 129 }], 131: [function (require, module, exports) {
                "use strict";
                var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
                }) : (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function (o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule)
                        return mod;
                    var result = {};
                    if (mod != null)
                        for (var k in mod)
                            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                                __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var references = __importStar(require("../../../common/casualReferences"));
                var dayjs_1 = require("../../../utils/dayjs");
                var dayjs_2 = __importDefault(require("dayjs"));
                var AbstractParserWithWordBoundaryChecking_1 = require("./AbstractParserWithWordBoundaryChecking");
                var UKCasualTimeParser = /** @class */ (function (_super) {
                    __extends(UKCasualTimeParser, _super);
                    function UKCasualTimeParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    UKCasualTimeParser.prototype.innerPatternString = function (context) {
                        return "(\u0437\u0430\u0440\u0430\u0437|\u043C\u0438\u043D\u0443\u043B\u043E\u0433\u043E\\s*\u0432\u0435\u0447\u043E\u0440\u0430|\u043C\u0438\u043D\u0443\u043B\u043E\u0457\\s*\u043D\u043E\u0447\u0456|\u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u0457\\s*\u043D\u043E\u0447\u0456|\u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456\\s*\u0432\u043D\u043E\u0447\u0456|\u0446\u0456\u0454\u0457\\s*\u043D\u043E\u0447\u0456|\u0446\u044C\u043E\u0433\u043E \u0440\u0430\u043D\u043A\u0443|\u0432\u0440\u0430\u043D\u0446\u0456|\u0440\u0430\u043D\u043A\u0443|\u0437\u0440\u0430\u043D\u043A\u0443|\u043E\u043F\u0456\u0432\u0434\u043D\u0456|\u0432\u0432\u0435\u0447\u0435\u0440\u0456|\u0432\u0435\u0447\u043E\u0440\u0430|\u043E\u043F\u0456\u0432\u043D\u043E\u0447\u0456|\u0432\u043D\u043E\u0447\u0456)";
                    };
                    UKCasualTimeParser.prototype.innerExtract = function (context, match) {
                        var targetDate = dayjs_2.default(context.reference.instant);
                        var lowerText = match[0].toLowerCase();
                        var component = context.createParsingComponents();
                        if (lowerText === "зараз") {
                            return references.now(context.reference);
                        }
                        if (lowerText === "ввечері" || lowerText === "вечора") {
                            return references.evening(context.reference);
                        }
                        if (lowerText.endsWith("вранці") || lowerText.endsWith("ранку") || lowerText.endsWith("зранку")) {
                            return references.morning(context.reference);
                        }
                        if (lowerText.endsWith("опівдні")) {
                            return references.noon(context.reference);
                        }
                        if (lowerText.match(/минулої\s*ночі/)) {
                            return references.lastNight(context.reference);
                        }
                        if (lowerText.match(/минулого\s*вечора/)) {
                            return references.yesterdayEvening(context.reference);
                        }
                        if (lowerText.match(/наступної\s*ночі/)) {
                            var daysToAdd = targetDate.hour() < 22 ? 1 : 2;
                            targetDate = targetDate.add(daysToAdd, "day");
                            dayjs_1.assignSimilarDate(component, targetDate);
                            component.imply("hour", 1);
                        }
                        if (lowerText.match(/цієї\s*ночі/)) {
                            return references.midnight(context.reference);
                        }
                        if (lowerText.endsWith("опівночі") || lowerText.endsWith("вночі")) {
                            return references.midnight(context.reference);
                        }
                        return component;
                    };
                    return UKCasualTimeParser;
                }(AbstractParserWithWordBoundaryChecking_1.AbstractParserWithLeftRightBoundaryChecking));
                exports.default = UKCasualTimeParser;
            }, { "../../../common/casualReferences": 7, "../../../utils/dayjs": 166, "./AbstractParserWithWordBoundaryChecking": 129, "dayjs": 169 }], 132: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var years_1 = require("../../../calculation/years");
                var constants_1 = require("../constants");
                var constants_2 = require("../constants");
                var constants_3 = require("../constants");
                var pattern_1 = require("../../../utils/pattern");
                var AbstractParserWithWordBoundaryChecking_1 = require("./AbstractParserWithWordBoundaryChecking");
                var DATE_GROUP = 1;
                var DATE_TO_GROUP = 2;
                var MONTH_NAME_GROUP = 3;
                var YEAR_GROUP = 4;
                var UKMonthNameLittleEndianParser = /** @class */ (function (_super) {
                    __extends(UKMonthNameLittleEndianParser, _super);
                    function UKMonthNameLittleEndianParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    UKMonthNameLittleEndianParser.prototype.innerPatternString = function (context) {
                        return ("(?:\u0437|\u0456\u0437)?\\s*(".concat(constants_3.ORDINAL_NUMBER_PATTERN, ")") +
                            "(?:" +
                            "\\s{0,3}(?:\u043F\u043E|-|\u2013|\u0434\u043E)?\\s{0,3}" +
                            "(".concat(constants_3.ORDINAL_NUMBER_PATTERN, ")") +
                            ")?" +
                            "(?:-|\\/|\\s{0,3}(?:of)?\\s{0,3})" +
                            "(".concat(pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY), ")") +
                            "(?:" +
                            "(?:-|\\/|,?\\s{0,3})" +
                            "(".concat(constants_2.YEAR_PATTERN, "(?![^\\s]\\d))") +
                            ")?");
                    };
                    UKMonthNameLittleEndianParser.prototype.innerExtract = function (context, match) {
                        var result = context.createParsingResult(match.index, match[0]);
                        var month = constants_1.MONTH_DICTIONARY[match[MONTH_NAME_GROUP].toLowerCase()];
                        var day = constants_3.parseOrdinalNumberPattern(match[DATE_GROUP]);
                        if (day > 31) {
                            match.index = match.index + match[DATE_GROUP].length;
                            return null;
                        }
                        result.start.assign("month", month);
                        result.start.assign("day", day);
                        if (match[YEAR_GROUP]) {
                            var yearNumber = constants_2.parseYearPattern(match[YEAR_GROUP]);
                            result.start.assign("year", yearNumber);
                        }
                        else {
                            var year = years_1.findYearClosestToRef(context.reference.instant, day, month);
                            result.start.imply("year", year);
                        }
                        if (match[DATE_TO_GROUP]) {
                            var endDate = constants_3.parseOrdinalNumberPattern(match[DATE_TO_GROUP]);
                            result.end = result.start.clone();
                            result.end.assign("day", endDate);
                        }
                        return result;
                    };
                    return UKMonthNameLittleEndianParser;
                }(AbstractParserWithWordBoundaryChecking_1.AbstractParserWithLeftRightBoundaryChecking));
                exports.default = UKMonthNameLittleEndianParser;
            }, { "../../../calculation/years": 3, "../../../utils/pattern": 167, "../constants": 127, "./AbstractParserWithWordBoundaryChecking": 129 }], 133: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var years_1 = require("../../../calculation/years");
                var pattern_1 = require("../../../utils/pattern");
                var constants_2 = require("../constants");
                var AbstractParserWithWordBoundaryChecking_1 = require("./AbstractParserWithWordBoundaryChecking");
                var MONTH_NAME_GROUP = 2;
                var YEAR_GROUP = 3;
                var UkMonthNameParser = /** @class */ (function (_super) {
                    __extends(UkMonthNameParser, _super);
                    function UkMonthNameParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    UkMonthNameParser.prototype.innerPatternString = function (context) {
                        return ("((?:\u0432|\u0443)\\s*)?" +
                            "(".concat(pattern_1.matchAnyPattern(constants_1.MONTH_DICTIONARY), ")") +
                            "\\s*" +
                            "(?:" +
                            "[,-]?\\s*(".concat(constants_2.YEAR_PATTERN, ")?") +
                            ")?" +
                            "(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)");
                    };
                    UkMonthNameParser.prototype.innerExtract = function (context, match) {
                        var monthName = match[MONTH_NAME_GROUP].toLowerCase();
                        if (match[0].length <= 3 && !constants_1.FULL_MONTH_NAME_DICTIONARY[monthName]) {
                            return null;
                        }
                        var result = context.createParsingResult(match.index, match.index + match[0].length);
                        result.start.imply("day", 1);
                        var month = constants_1.MONTH_DICTIONARY[monthName];
                        result.start.assign("month", month);
                        if (match[YEAR_GROUP]) {
                            var year = constants_2.parseYearPattern(match[YEAR_GROUP]);
                            result.start.assign("year", year);
                        }
                        else {
                            var year = years_1.findYearClosestToRef(context.reference.instant, 1, month);
                            result.start.imply("year", year);
                        }
                        return result;
                    };
                    return UkMonthNameParser;
                }(AbstractParserWithWordBoundaryChecking_1.AbstractParserWithLeftBoundaryChecking));
                exports.default = UkMonthNameParser;
            }, { "../../../calculation/years": 3, "../../../utils/pattern": 167, "../constants": 127, "./AbstractParserWithWordBoundaryChecking": 129 }], 134: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var dayjs_1 = __importDefault(require("dayjs"));
                var pattern_1 = require("../../../utils/pattern");
                var AbstractParserWithWordBoundaryChecking_1 = require("./AbstractParserWithWordBoundaryChecking");
                var MODIFIER_WORD_GROUP = 1;
                var RELATIVE_WORD_GROUP = 2;
                var UKRelativeDateFormatParser = /** @class */ (function (_super) {
                    __extends(UKRelativeDateFormatParser, _super);
                    function UKRelativeDateFormatParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    UKRelativeDateFormatParser.prototype.innerPatternString = function (context) {
                        return ("(\u0432 \u043C\u0438\u043D\u0443\u043B\u043E\u043C\u0443|\u0443 \u043C\u0438\u043D\u0443\u043B\u043E\u043C\u0443|\u043D\u0430 \u043C\u0438\u043D\u0443\u043B\u043E\u043C\u0443|\u043C\u0438\u043D\u0443\u043B\u043E\u0433\u043E|\u043D\u0430 \u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u043C\u0443|\u0432 \u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u043C\u0443|\u0443 \u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u043C\u0443|\u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u0433\u043E|\u043D\u0430 \u0446\u044C\u043E\u043C\u0443|\u0432 \u0446\u044C\u043E\u043C\u0443|\u0443 \u0446\u044C\u043E\u043C\u0443|\u0446\u044C\u043E\u0433\u043E)\\s*" +
                            "(".concat(pattern_1.matchAnyPattern(constants_1.TIME_UNIT_DICTIONARY), ")(?=\\s*)"));
                    };
                    UKRelativeDateFormatParser.prototype.innerExtract = function (context, match) {
                        var modifier = match[MODIFIER_WORD_GROUP].toLowerCase();
                        var unitWord = match[RELATIVE_WORD_GROUP].toLowerCase();
                        var timeunit = constants_1.TIME_UNIT_DICTIONARY[unitWord];
                        if (modifier == "на наступному" ||
                            modifier == "в наступному" ||
                            modifier == "у наступному" ||
                            modifier == "наступного") {
                            var timeUnits = {};
                            timeUnits[timeunit] = 1;
                            return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                        }
                        if (modifier == "на минулому" ||
                            modifier == "в минулому" ||
                            modifier == "у минулому" ||
                            modifier == "минулого") {
                            var timeUnits = {};
                            timeUnits[timeunit] = -1;
                            return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                        }
                        var components = context.createParsingComponents();
                        var date = dayjs_1.default(context.reference.instant);
                        if (timeunit.match(/week/i)) {
                            date = date.add(-date.get("d"), "d");
                            components.imply("day", date.date());
                            components.imply("month", date.month() + 1);
                            components.imply("year", date.year());
                        }
                        else if (timeunit.match(/month/i)) {
                            date = date.add(-date.date() + 1, "d");
                            components.imply("day", date.date());
                            components.assign("year", date.year());
                            components.assign("month", date.month() + 1);
                        }
                        else if (timeunit.match(/year/i)) {
                            date = date.add(-date.date() + 1, "d");
                            date = date.add(-date.month(), "month");
                            components.imply("day", date.date());
                            components.imply("month", date.month() + 1);
                            components.assign("year", date.year());
                        }
                        return components;
                    };
                    return UKRelativeDateFormatParser;
                }(AbstractParserWithWordBoundaryChecking_1.AbstractParserWithLeftRightBoundaryChecking));
                exports.default = UKRelativeDateFormatParser;
            }, { "../../../results": 163, "../../../utils/pattern": 167, "../constants": 127, "./AbstractParserWithWordBoundaryChecking": 129, "dayjs": 169 }], 135: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var types_1 = require("../../../types");
                var AbstractTimeExpressionParser_1 = require("../../../common/parsers/AbstractTimeExpressionParser");
                var constants_1 = require("../constants");
                var UKTimeExpressionParser = /** @class */ (function (_super) {
                    __extends(UKTimeExpressionParser, _super);
                    function UKTimeExpressionParser(strictMode) {
                        return _super.call(this, strictMode) || this;
                    }
                    UKTimeExpressionParser.prototype.patternFlags = function () {
                        return constants_1.REGEX_PARTS.flags;
                    };
                    UKTimeExpressionParser.prototype.primaryPatternLeftBoundary = function () {
                        return "(^|\\s|T|(?:[^\\p{L}\\p{N}_]))";
                    };
                    UKTimeExpressionParser.prototype.followingPhase = function () {
                        return "\\s*(?:\\-|\\\u2013|\\~|\\\u301C|\u0434\u043E|\u0456|\u043F\u043E|\\?)\\s*";
                    };
                    UKTimeExpressionParser.prototype.primaryPrefix = function () {
                        return "(?:(?:\u0432|\u0443|\u043E|\u043E\u0431|\u0437|\u0456\u0437|\u0432\u0456\u0434)\\s*)??";
                    };
                    UKTimeExpressionParser.prototype.primarySuffix = function () {
                        return "(?:\\s*(?:\u0440\u0430\u043D\u043A\u0443|\u0432\u0435\u0447\u043E\u0440\u0430|\u043F\u043E \u043E\u0431\u0456\u0434\u0456|\u043F\u0456\u0441\u043B\u044F \u043E\u0431\u0456\u0434\u0443))?(?!\\/)".concat(constants_1.REGEX_PARTS.rightBoundary);
                    };
                    UKTimeExpressionParser.prototype.extractPrimaryTimeComponents = function (context, match) {
                        var components = _super.prototype.extractPrimaryTimeComponents.call(this, context, match);
                        if (components) {
                            if (match[0].endsWith("вечора")) {
                                var hour = components.get("hour");
                                if (hour >= 6 && hour < 12) {
                                    components.assign("hour", components.get("hour") + 12);
                                    components.assign("meridiem", types_1.Meridiem.PM);
                                }
                                else if (hour < 6) {
                                    components.assign("meridiem", types_1.Meridiem.AM);
                                }
                            }
                            if (match[0].endsWith("по обіді") || match[0].endsWith("після обіду")) {
                                components.assign("meridiem", types_1.Meridiem.PM);
                                var hour = components.get("hour");
                                if (hour >= 0 && hour <= 6) {
                                    components.assign("hour", components.get("hour") + 12);
                                }
                            }
                            if (match[0].endsWith("ранку")) {
                                components.assign("meridiem", types_1.Meridiem.AM);
                                var hour = components.get("hour");
                                if (hour < 12) {
                                    components.assign("hour", components.get("hour"));
                                }
                            }
                        }
                        return components;
                    };
                    return UKTimeExpressionParser;
                }(AbstractTimeExpressionParser_1.AbstractTimeExpressionParser));
                exports.default = UKTimeExpressionParser;
            }, { "../../../common/parsers/AbstractTimeExpressionParser": 9, "../../../types": 165, "../constants": 127 }], 136: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var timeunits_1 = require("../../../utils/timeunits");
                var AbstractParserWithWordBoundaryChecking_1 = require("./AbstractParserWithWordBoundaryChecking");
                var UKTimeUnitAgoFormatParser = /** @class */ (function (_super) {
                    __extends(UKTimeUnitAgoFormatParser, _super);
                    function UKTimeUnitAgoFormatParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    UKTimeUnitAgoFormatParser.prototype.innerPatternString = function (context) {
                        return "(".concat(constants_1.TIME_UNITS_PATTERN, ")\\s{0,5}\u0442\u043E\u043C\u0443(?=(?:\\W|$))");
                    };
                    UKTimeUnitAgoFormatParser.prototype.innerExtract = function (context, match) {
                        var timeUnits = constants_1.parseTimeUnits(match[1]);
                        var outputTimeUnits = timeunits_1.reverseTimeUnits(timeUnits);
                        return results_1.ParsingComponents.createRelativeFromReference(context.reference, outputTimeUnits);
                    };
                    return UKTimeUnitAgoFormatParser;
                }(AbstractParserWithWordBoundaryChecking_1.AbstractParserWithLeftBoundaryChecking));
                exports.default = UKTimeUnitAgoFormatParser;
            }, { "../../../results": 163, "../../../utils/timeunits": 168, "../constants": 127, "./AbstractParserWithWordBoundaryChecking": 129 }], 137: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var timeunits_1 = require("../../../utils/timeunits");
                var AbstractParserWithWordBoundaryChecking_1 = require("./AbstractParserWithWordBoundaryChecking");
                var UKTimeUnitCasualRelativeFormatParser = /** @class */ (function (_super) {
                    __extends(UKTimeUnitCasualRelativeFormatParser, _super);
                    function UKTimeUnitCasualRelativeFormatParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    UKTimeUnitCasualRelativeFormatParser.prototype.innerPatternString = function (context) {
                        return "(\u0446\u0456|\u043E\u0441\u0442\u0430\u043D\u043D\u0456|\u043C\u0438\u043D\u0443\u043B\u0456|\u043C\u0430\u0439\u0431\u0443\u0442\u043D\u0456|\u043D\u0430\u0441\u0442\u0443\u043F\u043D\u0456|\u043F\u0456\u0441\u043B\u044F|\u0447\u0435\u0440\u0435\u0437|\\+|-)\\s*(".concat(constants_1.TIME_UNITS_PATTERN, ")");
                    };
                    UKTimeUnitCasualRelativeFormatParser.prototype.innerExtract = function (context, match) {
                        var prefix = match[1].toLowerCase();
                        var timeUnits = constants_1.parseTimeUnits(match[3]);
                        switch (prefix) {
                            case "останні":
                            case "минулі":
                            case "-":
                                timeUnits = timeunits_1.reverseTimeUnits(timeUnits);
                                break;
                        }
                        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                    };
                    return UKTimeUnitCasualRelativeFormatParser;
                }(AbstractParserWithWordBoundaryChecking_1.AbstractParserWithLeftRightBoundaryChecking));
                exports.default = UKTimeUnitCasualRelativeFormatParser;
            }, { "../../../results": 163, "../../../utils/timeunits": 168, "../constants": 127, "./AbstractParserWithWordBoundaryChecking": 129 }], 138: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var results_1 = require("../../../results");
                var AbstractParserWithWordBoundary_1 = require("../../../common/parsers/AbstractParserWithWordBoundary");
                var PATTERN = "(?:(?:\u043F\u0440\u0438\u0431\u043B\u0438\u0437\u043D\u043E|\u043E\u0440\u0456\u0454\u043D\u0442\u043E\u0432\u043D\u043E)\\s*(?:~\\s*)?)?(".concat(constants_1.TIME_UNITS_PATTERN, ")").concat(constants_1.REGEX_PARTS.rightBoundary);
                var UKTimeUnitWithinFormatParser = /** @class */ (function (_super) {
                    __extends(UKTimeUnitWithinFormatParser, _super);
                    function UKTimeUnitWithinFormatParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    UKTimeUnitWithinFormatParser.prototype.patternLeftBoundary = function () {
                        return constants_1.REGEX_PARTS.leftBoundary;
                    };
                    UKTimeUnitWithinFormatParser.prototype.innerPattern = function (context) {
                        return context.option.forwardDate
                            ? new RegExp(PATTERN, "i")
                            : new RegExp("(?:\u043F\u0440\u043E\u0442\u044F\u0433\u043E\u043C|\u043D\u0430 \u043F\u0440\u043E\u0442\u044F\u0437\u0456|\u043F\u0440\u043E\u0442\u044F\u0433\u043E\u043C|\u0443\u043F\u0440\u043E\u0434\u043E\u0432\u0436|\u0432\u043F\u0440\u043E\u0434\u043E\u0432\u0436)\\s*".concat(PATTERN), constants_1.REGEX_PARTS.flags);
                    };
                    UKTimeUnitWithinFormatParser.prototype.innerExtract = function (context, match) {
                        var timeUnits = constants_1.parseTimeUnits(match[1]);
                        return results_1.ParsingComponents.createRelativeFromReference(context.reference, timeUnits);
                    };
                    return UKTimeUnitWithinFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = UKTimeUnitWithinFormatParser;
            }, { "../../../common/parsers/AbstractParserWithWordBoundary": 8, "../../../results": 163, "../constants": 127 }], 139: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var constants_1 = require("../constants");
                var pattern_1 = require("../../../utils/pattern");
                var weekdays_1 = require("../../../common/calculation/weekdays");
                var AbstractParserWithWordBoundaryChecking_1 = require("./AbstractParserWithWordBoundaryChecking");
                var PREFIX_GROUP = 1;
                var WEEKDAY_GROUP = 2;
                var POSTFIX_GROUP = 3;
                var UKWeekdayParser = /** @class */ (function (_super) {
                    __extends(UKWeekdayParser, _super);
                    function UKWeekdayParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    UKWeekdayParser.prototype.innerPatternString = function (context) {
                        return ("(?:(?:,|\\(|\uFF08)\\s*)?" +
                            "(?:\u0432\\s*?)?" +
                            "(?:\u0443\\s*?)?" +
                            "(?:(\u0446\u0435\u0439|\u043C\u0438\u043D\u0443\u043B\u043E\u0433\u043E|\u043C\u0438\u043D\u0443\u043B\u0438\u0439|\u043F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u0456\u0439|\u043F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u044C\u043E\u0433\u043E|\u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u0433\u043E|\u043D\u0430\u0441\u0442\u0443\u043F\u043D\u0438\u0439|\u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u043C\u0443)\\s*)?" +
                            "(".concat(pattern_1.matchAnyPattern(constants_1.WEEKDAY_DICTIONARY), ")") +
                            "(?:\\s*(?:,|\\)|\uFF09))?" +
                            "(?:\\s*(\u043D\u0430|\u0443|\u0432)\\s*(\u0446\u044C\u043E\u043C\u0443|\u043C\u0438\u043D\u0443\u043B\u043E\u043C\u0443|\u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u043C\u0443)\\s*\u0442\u0438\u0436\u043D\u0456)?");
                    };
                    UKWeekdayParser.prototype.innerExtract = function (context, match) {
                        var dayOfWeek = match[WEEKDAY_GROUP].toLocaleLowerCase();
                        var weekday = constants_1.WEEKDAY_DICTIONARY[dayOfWeek];
                        var prefix = match[PREFIX_GROUP];
                        var postfix = match[POSTFIX_GROUP];
                        var modifierWord = prefix || postfix;
                        modifierWord = modifierWord || "";
                        modifierWord = modifierWord.toLocaleLowerCase();
                        var modifier = null;
                        if (modifierWord == "минулого" ||
                            modifierWord == "минулий" ||
                            modifierWord == "попередній" ||
                            modifierWord == "попереднього") {
                            modifier = "last";
                        }
                        else if (modifierWord == "наступного" || modifierWord == "наступний") {
                            modifier = "next";
                        }
                        else if (modifierWord == "цей" || modifierWord == "цього" || modifierWord == "цьому") {
                            modifier = "this";
                        }
                        return weekdays_1.createParsingComponentsAtWeekday(context.reference, weekday, modifier);
                    };
                    return UKWeekdayParser;
                }(AbstractParserWithWordBoundaryChecking_1.AbstractParserWithLeftRightBoundaryChecking));
                exports.default = UKWeekdayParser;
            }, { "../../../common/calculation/weekdays": 6, "../../../utils/pattern": 167, "../constants": 127, "./AbstractParserWithWordBoundaryChecking": 129 }], 140: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractMergeDateRangeRefiner_1 = __importDefault(require("../../../common/refiners/AbstractMergeDateRangeRefiner"));
                var UKMergeDateRangeRefiner = /** @class */ (function (_super) {
                    __extends(UKMergeDateRangeRefiner, _super);
                    function UKMergeDateRangeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    UKMergeDateRangeRefiner.prototype.patternBetween = function () {
                        return /^\s*(і до|і по|до|по|-)\s*$/i;
                    };
                    return UKMergeDateRangeRefiner;
                }(AbstractMergeDateRangeRefiner_1.default));
                exports.default = UKMergeDateRangeRefiner;
            }, { "../../../common/refiners/AbstractMergeDateRangeRefiner": 12 }], 141: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractMergeDateTimeRefiner_1 = __importDefault(require("../../../common/refiners/AbstractMergeDateTimeRefiner"));
                var UKMergeDateTimeRefiner = /** @class */ (function (_super) {
                    __extends(UKMergeDateTimeRefiner, _super);
                    function UKMergeDateTimeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    UKMergeDateTimeRefiner.prototype.patternBetween = function () {
                        return new RegExp("^\\s*(T|\u0432|\u0443|\u043E|,|-)?\\s*$");
                    };
                    return UKMergeDateTimeRefiner;
                }(AbstractMergeDateTimeRefiner_1.default));
                exports.default = UKMergeDateTimeRefiner;
            }, { "../../../common/refiners/AbstractMergeDateTimeRefiner": 13 }], 142: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.zhStringToYear = exports.zhStringToNumber = exports.WEEKDAY_OFFSET = exports.NUMBER = void 0;
                exports.NUMBER = {
                    "零": 0,
                    "〇": 0,
                    "一": 1,
                    "二": 2,
                    "两": 2,
                    "三": 3,
                    "四": 4,
                    "五": 5,
                    "六": 6,
                    "七": 7,
                    "八": 8,
                    "九": 9,
                    "十": 10,
                };
                exports.WEEKDAY_OFFSET = {
                    "天": 0,
                    "日": 0,
                    "一": 1,
                    "二": 2,
                    "三": 3,
                    "四": 4,
                    "五": 5,
                    "六": 6,
                };
                function zhStringToNumber(text) {
                    var number = 0;
                    for (var i = 0; i < text.length; i++) {
                        var char = text[i];
                        if (char === "十") {
                            number = number === 0 ? exports.NUMBER[char] : number * exports.NUMBER[char];
                        }
                        else {
                            number += exports.NUMBER[char];
                        }
                    }
                    return number;
                }
                exports.zhStringToNumber = zhStringToNumber;
                function zhStringToYear(text) {
                    var string = "";
                    for (var i = 0; i < text.length; i++) {
                        var char = text[i];
                        string = string + exports.NUMBER[char];
                    }
                    return parseInt(string);
                }
                exports.zhStringToYear = zhStringToYear;
            }, {}], 143: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = exports.hans = exports.Weekday = exports.Meridiem = exports.ReferenceWithTimezone = exports.ParsingComponents = exports.ParsingResult = exports.Chrono = void 0;
                var ExtractTimezoneOffsetRefiner_1 = __importDefault(require("../../../common/refiners/ExtractTimezoneOffsetRefiner"));
                var configurations_1 = require("../../../configurations");
                var chrono_1 = require("../../../chrono");
                Object.defineProperty(exports, "Chrono", { enumerable: true, get: function () { return chrono_1.Chrono; } });
                var results_1 = require("../../../results");
                Object.defineProperty(exports, "ParsingResult", { enumerable: true, get: function () { return results_1.ParsingResult; } });
                Object.defineProperty(exports, "ParsingComponents", { enumerable: true, get: function () { return results_1.ParsingComponents; } });
                Object.defineProperty(exports, "ReferenceWithTimezone", { enumerable: true, get: function () { return results_1.ReferenceWithTimezone; } });
                var types_1 = require("../../../types");
                Object.defineProperty(exports, "Meridiem", { enumerable: true, get: function () { return types_1.Meridiem; } });
                Object.defineProperty(exports, "Weekday", { enumerable: true, get: function () { return types_1.Weekday; } });
                var ZHHansCasualDateParser_1 = __importDefault(require("./parsers/ZHHansCasualDateParser"));
                var ZHHansDateParser_1 = __importDefault(require("./parsers/ZHHansDateParser"));
                var ZHHansDeadlineFormatParser_1 = __importDefault(require("./parsers/ZHHansDeadlineFormatParser"));
                var ZHHansRelationWeekdayParser_1 = __importDefault(require("./parsers/ZHHansRelationWeekdayParser"));
                var ZHHansTimeExpressionParser_1 = __importDefault(require("./parsers/ZHHansTimeExpressionParser"));
                var ZHHansWeekdayParser_1 = __importDefault(require("./parsers/ZHHansWeekdayParser"));
                var ZHHansMergeDateRangeRefiner_1 = __importDefault(require("./refiners/ZHHansMergeDateRangeRefiner"));
                var ZHHansMergeDateTimeRefiner_1 = __importDefault(require("./refiners/ZHHansMergeDateTimeRefiner"));
                exports.hans = new chrono_1.Chrono(createCasualConfiguration());
                exports.casual = new chrono_1.Chrono(createCasualConfiguration());
                exports.strict = new chrono_1.Chrono(createConfiguration());
                function parse(text, ref, option) {
                    return exports.casual.parse(text, ref, option);
                }
                exports.parse = parse;
                function parseDate(text, ref, option) {
                    return exports.casual.parseDate(text, ref, option);
                }
                exports.parseDate = parseDate;
                function createCasualConfiguration() {
                    var option = createConfiguration();
                    option.parsers.unshift(new ZHHansCasualDateParser_1.default());
                    return option;
                }
                exports.createCasualConfiguration = createCasualConfiguration;
                function createConfiguration() {
                    var configuration = configurations_1.includeCommonConfiguration({
                        parsers: [
                            new ZHHansDateParser_1.default(),
                            new ZHHansRelationWeekdayParser_1.default(),
                            new ZHHansWeekdayParser_1.default(),
                            new ZHHansTimeExpressionParser_1.default(),
                            new ZHHansDeadlineFormatParser_1.default(),
                        ],
                        refiners: [new ZHHansMergeDateRangeRefiner_1.default(), new ZHHansMergeDateTimeRefiner_1.default()],
                    });
                    configuration.refiners = configuration.refiners.filter(function (refiner) { return !(refiner instanceof ExtractTimezoneOffsetRefiner_1.default); });
                    return configuration;
                }
                exports.createConfiguration = createConfiguration;
            }, { "../../../chrono": 4, "../../../common/refiners/ExtractTimezoneOffsetRefiner": 15, "../../../configurations": 20, "../../../results": 163, "../../../types": 165, "./parsers/ZHHansCasualDateParser": 144, "./parsers/ZHHansDateParser": 145, "./parsers/ZHHansDeadlineFormatParser": 146, "./parsers/ZHHansRelationWeekdayParser": 147, "./parsers/ZHHansTimeExpressionParser": 148, "./parsers/ZHHansWeekdayParser": 149, "./refiners/ZHHansMergeDateRangeRefiner": 150, "./refiners/ZHHansMergeDateTimeRefiner": 151 }], 144: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var dayjs_1 = __importDefault(require("dayjs"));
                var AbstractParserWithWordBoundary_1 = require("../../../../common/parsers/AbstractParserWithWordBoundary");
                var NOW_GROUP = 1;
                var DAY_GROUP_1 = 2;
                var TIME_GROUP_1 = 3;
                var TIME_GROUP_2 = 4;
                var DAY_GROUP_3 = 5;
                var TIME_GROUP_3 = 6;
                var ZHHansCasualDateParser = /** @class */ (function (_super) {
                    __extends(ZHHansCasualDateParser, _super);
                    function ZHHansCasualDateParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ZHHansCasualDateParser.prototype.innerPattern = function (context) {
                        return new RegExp("(现在|立(?:刻|即)|即刻)|" +
                            "(今|明|前|大前|后|大后|昨)(早|晚)|" +
                            "(上(?:午)|早(?:上)|下(?:午)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨))|" +
                            "(今|明|前|大前|后|大后|昨)(?:日|天)" +
                            "(?:[\\s|,|，]*)" +
                            "(?:(上(?:午)|早(?:上)|下(?:午)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨)))?", "i");
                    };
                    ZHHansCasualDateParser.prototype.innerExtract = function (context, match) {
                        var index = match.index;
                        var result = context.createParsingResult(index, match[0]);
                        var refMoment = dayjs_1.default(context.refDate);
                        var startMoment = refMoment;
                        if (match[NOW_GROUP]) {
                            result.start.imply("hour", refMoment.hour());
                            result.start.imply("minute", refMoment.minute());
                            result.start.imply("second", refMoment.second());
                            result.start.imply("millisecond", refMoment.millisecond());
                        }
                        else if (match[DAY_GROUP_1]) {
                            var day1 = match[DAY_GROUP_1];
                            var time1 = match[TIME_GROUP_1];
                            if (day1 == "明") {
                                if (refMoment.hour() > 1) {
                                    startMoment = startMoment.add(1, "day");
                                }
                            }
                            else if (day1 == "昨") {
                                startMoment = startMoment.add(-1, "day");
                            }
                            else if (day1 == "前") {
                                startMoment = startMoment.add(-2, "day");
                            }
                            else if (day1 == "大前") {
                                startMoment = startMoment.add(-3, "day");
                            }
                            else if (day1 == "后") {
                                startMoment = startMoment.add(2, "day");
                            }
                            else if (day1 == "大后") {
                                startMoment = startMoment.add(3, "day");
                            }
                            if (time1 == "早") {
                                result.start.imply("hour", 6);
                            }
                            else if (time1 == "晚") {
                                result.start.imply("hour", 22);
                                result.start.imply("meridiem", 1);
                            }
                        }
                        else if (match[TIME_GROUP_2]) {
                            var timeString2 = match[TIME_GROUP_2];
                            var time2 = timeString2[0];
                            if (time2 == "早" || time2 == "上") {
                                result.start.imply("hour", 6);
                            }
                            else if (time2 == "下") {
                                result.start.imply("hour", 15);
                                result.start.imply("meridiem", 1);
                            }
                            else if (time2 == "中") {
                                result.start.imply("hour", 12);
                                result.start.imply("meridiem", 1);
                            }
                            else if (time2 == "夜" || time2 == "晚") {
                                result.start.imply("hour", 22);
                                result.start.imply("meridiem", 1);
                            }
                            else if (time2 == "凌") {
                                result.start.imply("hour", 0);
                            }
                        }
                        else if (match[DAY_GROUP_3]) {
                            var day3 = match[DAY_GROUP_3];
                            if (day3 == "明") {
                                if (refMoment.hour() > 1) {
                                    startMoment = startMoment.add(1, "day");
                                }
                            }
                            else if (day3 == "昨") {
                                startMoment = startMoment.add(-1, "day");
                            }
                            else if (day3 == "前") {
                                startMoment = startMoment.add(-2, "day");
                            }
                            else if (day3 == "大前") {
                                startMoment = startMoment.add(-3, "day");
                            }
                            else if (day3 == "后") {
                                startMoment = startMoment.add(2, "day");
                            }
                            else if (day3 == "大后") {
                                startMoment = startMoment.add(3, "day");
                            }
                            var timeString3 = match[TIME_GROUP_3];
                            if (timeString3) {
                                var time3 = timeString3[0];
                                if (time3 == "早" || time3 == "上") {
                                    result.start.imply("hour", 6);
                                }
                                else if (time3 == "下") {
                                    result.start.imply("hour", 15);
                                    result.start.imply("meridiem", 1);
                                }
                                else if (time3 == "中") {
                                    result.start.imply("hour", 12);
                                    result.start.imply("meridiem", 1);
                                }
                                else if (time3 == "夜" || time3 == "晚") {
                                    result.start.imply("hour", 22);
                                    result.start.imply("meridiem", 1);
                                }
                                else if (time3 == "凌") {
                                    result.start.imply("hour", 0);
                                }
                            }
                        }
                        result.start.assign("day", startMoment.date());
                        result.start.assign("month", startMoment.month() + 1);
                        result.start.assign("year", startMoment.year());
                        return result;
                    };
                    return ZHHansCasualDateParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ZHHansCasualDateParser;
            }, { "../../../../common/parsers/AbstractParserWithWordBoundary": 8, "dayjs": 169 }], 145: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var dayjs_1 = __importDefault(require("dayjs"));
                var AbstractParserWithWordBoundary_1 = require("../../../../common/parsers/AbstractParserWithWordBoundary");
                var constants_1 = require("../constants");
                var YEAR_GROUP = 1;
                var MONTH_GROUP = 2;
                var DAY_GROUP = 3;
                var ZHHansDateParser = /** @class */ (function (_super) {
                    __extends(ZHHansDateParser, _super);
                    function ZHHansDateParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ZHHansDateParser.prototype.innerPattern = function () {
                        return new RegExp("(" +
                            "\\d{2,4}|" +
                            "[" +
                            Object.keys(constants_1.NUMBER).join("") +
                            "]{4}|" +
                            "[" +
                            Object.keys(constants_1.NUMBER).join("") +
                            "]{2}" +
                            ")?" +
                            "(?:\\s*)" +
                            "(?:年)?" +
                            "(?:[\\s|,|，]*)" +
                            "(" +
                            "\\d{1,2}|" +
                            "[" +
                            Object.keys(constants_1.NUMBER).join("") +
                            "]{1,3}" +
                            ")" +
                            "(?:\\s*)" +
                            "(?:月)" +
                            "(?:\\s*)" +
                            "(" +
                            "\\d{1,2}|" +
                            "[" +
                            Object.keys(constants_1.NUMBER).join("") +
                            "]{1,3}" +
                            ")?" +
                            "(?:\\s*)" +
                            "(?:日|号)?");
                    };
                    ZHHansDateParser.prototype.innerExtract = function (context, match) {
                        var startMoment = dayjs_1.default(context.refDate);
                        var result = context.createParsingResult(match.index, match[0]);
                        var month = parseInt(match[MONTH_GROUP]);
                        if (isNaN(month))
                            month = constants_1.zhStringToNumber(match[MONTH_GROUP]);
                        result.start.assign("month", month);
                        if (match[DAY_GROUP]) {
                            var day = parseInt(match[DAY_GROUP]);
                            if (isNaN(day))
                                day = constants_1.zhStringToNumber(match[DAY_GROUP]);
                            result.start.assign("day", day);
                        }
                        else {
                            result.start.imply("day", startMoment.date());
                        }
                        if (match[YEAR_GROUP]) {
                            var year = parseInt(match[YEAR_GROUP]);
                            if (isNaN(year))
                                year = constants_1.zhStringToYear(match[YEAR_GROUP]);
                            result.start.assign("year", year);
                        }
                        else {
                            result.start.imply("year", startMoment.year());
                        }
                        return result;
                    };
                    return ZHHansDateParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ZHHansDateParser;
            }, { "../../../../common/parsers/AbstractParserWithWordBoundary": 8, "../constants": 142, "dayjs": 169 }], 146: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var dayjs_1 = __importDefault(require("dayjs"));
                var AbstractParserWithWordBoundary_1 = require("../../../../common/parsers/AbstractParserWithWordBoundary");
                var constants_1 = require("../constants");
                var PATTERN = new RegExp("(\\d+|[" +
                    Object.keys(constants_1.NUMBER).join("") +
                    "]+|半|几)(?:\\s*)" +
                    "(?:个)?" +
                    "(秒(?:钟)?|分钟|小时|钟|日|天|星期|礼拜|月|年)" +
                    "(?:(?:之|过)?后|(?:之)?内)", "i");
                var NUMBER_GROUP = 1;
                var UNIT_GROUP = 2;
                var ZHHansDeadlineFormatParser = /** @class */ (function (_super) {
                    __extends(ZHHansDeadlineFormatParser, _super);
                    function ZHHansDeadlineFormatParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ZHHansDeadlineFormatParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    ZHHansDeadlineFormatParser.prototype.innerExtract = function (context, match) {
                        var result = context.createParsingResult(match.index, match[0]);
                        var number = parseInt(match[NUMBER_GROUP]);
                        if (isNaN(number)) {
                            number = constants_1.zhStringToNumber(match[NUMBER_GROUP]);
                        }
                        if (isNaN(number)) {
                            var string = match[NUMBER_GROUP];
                            if (string === "几") {
                                number = 3;
                            }
                            else if (string === "半") {
                                number = 0.5;
                            }
                            else {
                                return null;
                            }
                        }
                        var date = dayjs_1.default(context.refDate);
                        var unit = match[UNIT_GROUP];
                        var unitAbbr = unit[0];
                        if (unitAbbr.match(/[日天星礼月年]/)) {
                            if (unitAbbr == "日" || unitAbbr == "天") {
                                date = date.add(number, "d");
                            }
                            else if (unitAbbr == "星" || unitAbbr == "礼") {
                                date = date.add(number * 7, "d");
                            }
                            else if (unitAbbr == "月") {
                                date = date.add(number, "month");
                            }
                            else if (unitAbbr == "年") {
                                date = date.add(number, "year");
                            }
                            result.start.assign("year", date.year());
                            result.start.assign("month", date.month() + 1);
                            result.start.assign("day", date.date());
                            return result;
                        }
                        if (unitAbbr == "秒") {
                            date = date.add(number, "second");
                        }
                        else if (unitAbbr == "分") {
                            date = date.add(number, "minute");
                        }
                        else if (unitAbbr == "小" || unitAbbr == "钟") {
                            date = date.add(number, "hour");
                        }
                        result.start.imply("year", date.year());
                        result.start.imply("month", date.month() + 1);
                        result.start.imply("day", date.date());
                        result.start.assign("hour", date.hour());
                        result.start.assign("minute", date.minute());
                        result.start.assign("second", date.second());
                        return result;
                    };
                    return ZHHansDeadlineFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ZHHansDeadlineFormatParser;
            }, { "../../../../common/parsers/AbstractParserWithWordBoundary": 8, "../constants": 142, "dayjs": 169 }], 147: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var dayjs_1 = __importDefault(require("dayjs"));
                var AbstractParserWithWordBoundary_1 = require("../../../../common/parsers/AbstractParserWithWordBoundary");
                var constants_1 = require("../constants");
                var PATTERN = new RegExp("(?<prefix>上|下|这)(?:个)?(?:星期|礼拜|周)(?<weekday>" + Object.keys(constants_1.WEEKDAY_OFFSET).join("|") + ")");
                var ZHHansRelationWeekdayParser = /** @class */ (function (_super) {
                    __extends(ZHHansRelationWeekdayParser, _super);
                    function ZHHansRelationWeekdayParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ZHHansRelationWeekdayParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    ZHHansRelationWeekdayParser.prototype.innerExtract = function (context, match) {
                        var result = context.createParsingResult(match.index, match[0]);
                        var dayOfWeek = match.groups.weekday;
                        var offset = constants_1.WEEKDAY_OFFSET[dayOfWeek];
                        if (offset === undefined)
                            return null;
                        var modifier = null;
                        var prefix = match.groups.prefix;
                        if (prefix == "上") {
                            modifier = "last";
                        }
                        else if (prefix == "下") {
                            modifier = "next";
                        }
                        else if (prefix == "这") {
                            modifier = "this";
                        }
                        var startMoment = dayjs_1.default(context.refDate);
                        var startMomentFixed = false;
                        var refOffset = startMoment.day();
                        if (modifier == "last" || modifier == "past") {
                            startMoment = startMoment.day(offset - 7);
                            startMomentFixed = true;
                        }
                        else if (modifier == "next") {
                            startMoment = startMoment.day(offset + 7);
                            startMomentFixed = true;
                        }
                        else if (modifier == "this") {
                            startMoment = startMoment.day(offset);
                        }
                        else {
                            if (Math.abs(offset - 7 - refOffset) < Math.abs(offset - refOffset)) {
                                startMoment = startMoment.day(offset - 7);
                            }
                            else if (Math.abs(offset + 7 - refOffset) < Math.abs(offset - refOffset)) {
                                startMoment = startMoment.day(offset + 7);
                            }
                            else {
                                startMoment = startMoment.day(offset);
                            }
                        }
                        result.start.assign("weekday", offset);
                        if (startMomentFixed) {
                            result.start.assign("day", startMoment.date());
                            result.start.assign("month", startMoment.month() + 1);
                            result.start.assign("year", startMoment.year());
                        }
                        else {
                            result.start.imply("day", startMoment.date());
                            result.start.imply("month", startMoment.month() + 1);
                            result.start.imply("year", startMoment.year());
                        }
                        return result;
                    };
                    return ZHHansRelationWeekdayParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ZHHansRelationWeekdayParser;
            }, { "../../../../common/parsers/AbstractParserWithWordBoundary": 8, "../constants": 142, "dayjs": 169 }], 148: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var dayjs_1 = __importDefault(require("dayjs"));
                var AbstractParserWithWordBoundary_1 = require("../../../../common/parsers/AbstractParserWithWordBoundary");
                var constants_1 = require("../constants");
                var FIRST_REG_PATTERN = new RegExp("(?:从|自)?" +
                    "(?:" +
                    "(今|明|前|大前|后|大后|昨)(早|朝|晚)|" +
                    "(上(?:午)|早(?:上)|下(?:午)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨))|" +
                    "(今|明|前|大前|后|大后|昨)(?:日|天)" +
                    "(?:[\\s,，]*)" +
                    "(?:(上(?:午)|早(?:上)|下(?:午)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨)))?" +
                    ")?" +
                    "(?:[\\s,，]*)" +
                    "(?:(\\d+|[" +
                    Object.keys(constants_1.NUMBER).join("") +
                    "]+)(?:\\s*)(?:点|时|:|：)" +
                    "(?:\\s*)" +
                    "(\\d+|半|正|整|[" +
                    Object.keys(constants_1.NUMBER).join("") +
                    "]+)?(?:\\s*)(?:分|:|：)?" +
                    "(?:\\s*)" +
                    "(\\d+|[" +
                    Object.keys(constants_1.NUMBER).join("") +
                    "]+)?(?:\\s*)(?:秒)?)" +
                    "(?:\\s*(A.M.|P.M.|AM?|PM?))?", "i");
                var SECOND_REG_PATTERN = new RegExp("(?:^\\s*(?:到|至|\\-|\\–|\\~|\\〜)\\s*)" +
                    "(?:" +
                    "(今|明|前|大前|后|大后|昨)(早|朝|晚)|" +
                    "(上(?:午)|早(?:上)|下(?:午)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨))|" +
                    "(今|明|前|大前|后|大后|昨)(?:日|天)" +
                    "(?:[\\s,，]*)" +
                    "(?:(上(?:午)|早(?:上)|下(?:午)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨)))?" +
                    ")?" +
                    "(?:[\\s,，]*)" +
                    "(?:(\\d+|[" +
                    Object.keys(constants_1.NUMBER).join("") +
                    "]+)(?:\\s*)(?:点|时|:|：)" +
                    "(?:\\s*)" +
                    "(\\d+|半|正|整|[" +
                    Object.keys(constants_1.NUMBER).join("") +
                    "]+)?(?:\\s*)(?:分|:|：)?" +
                    "(?:\\s*)" +
                    "(\\d+|[" +
                    Object.keys(constants_1.NUMBER).join("") +
                    "]+)?(?:\\s*)(?:秒)?)" +
                    "(?:\\s*(A.M.|P.M.|AM?|PM?))?", "i");
                var DAY_GROUP_1 = 1;
                var ZH_AM_PM_HOUR_GROUP_1 = 2;
                var ZH_AM_PM_HOUR_GROUP_2 = 3;
                var DAY_GROUP_3 = 4;
                var ZH_AM_PM_HOUR_GROUP_3 = 5;
                var HOUR_GROUP = 6;
                var MINUTE_GROUP = 7;
                var SECOND_GROUP = 8;
                var AM_PM_HOUR_GROUP = 9;
                var ZHHansTimeExpressionParser = /** @class */ (function (_super) {
                    __extends(ZHHansTimeExpressionParser, _super);
                    function ZHHansTimeExpressionParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ZHHansTimeExpressionParser.prototype.innerPattern = function () {
                        return FIRST_REG_PATTERN;
                    };
                    ZHHansTimeExpressionParser.prototype.innerExtract = function (context, match) {
                        if (match.index > 0 && context.text[match.index - 1].match(/\w/)) {
                            return null;
                        }
                        var refMoment = dayjs_1.default(context.refDate);
                        var result = context.createParsingResult(match.index, match[0]);
                        var startMoment = refMoment.clone();
                        if (match[DAY_GROUP_1]) {
                            var day1 = match[DAY_GROUP_1];
                            if (day1 == "明") {
                                if (refMoment.hour() > 1) {
                                    startMoment = startMoment.add(1, "day");
                                }
                            }
                            else if (day1 == "昨") {
                                startMoment = startMoment.add(-1, "day");
                            }
                            else if (day1 == "前") {
                                startMoment = startMoment.add(-2, "day");
                            }
                            else if (day1 == "大前") {
                                startMoment = startMoment.add(-3, "day");
                            }
                            else if (day1 == "后") {
                                startMoment = startMoment.add(2, "day");
                            }
                            else if (day1 == "大后") {
                                startMoment = startMoment.add(3, "day");
                            }
                            result.start.assign("day", startMoment.date());
                            result.start.assign("month", startMoment.month() + 1);
                            result.start.assign("year", startMoment.year());
                        }
                        else if (match[DAY_GROUP_3]) {
                            var day3 = match[DAY_GROUP_3];
                            if (day3 == "明") {
                                startMoment = startMoment.add(1, "day");
                            }
                            else if (day3 == "昨") {
                                startMoment = startMoment.add(-1, "day");
                            }
                            else if (day3 == "前") {
                                startMoment = startMoment.add(-2, "day");
                            }
                            else if (day3 == "大前") {
                                startMoment = startMoment.add(-3, "day");
                            }
                            else if (day3 == "后") {
                                startMoment = startMoment.add(2, "day");
                            }
                            else if (day3 == "大后") {
                                startMoment = startMoment.add(3, "day");
                            }
                            result.start.assign("day", startMoment.date());
                            result.start.assign("month", startMoment.month() + 1);
                            result.start.assign("year", startMoment.year());
                        }
                        else {
                            result.start.imply("day", startMoment.date());
                            result.start.imply("month", startMoment.month() + 1);
                            result.start.imply("year", startMoment.year());
                        }
                        var hour = 0;
                        var minute = 0;
                        var meridiem = -1;
                        if (match[SECOND_GROUP]) {
                            var second = parseInt(match[SECOND_GROUP]);
                            if (isNaN(second)) {
                                second = constants_1.zhStringToNumber(match[SECOND_GROUP]);
                            }
                            if (second >= 60)
                                return null;
                            result.start.assign("second", second);
                        }
                        hour = parseInt(match[HOUR_GROUP]);
                        if (isNaN(hour)) {
                            hour = constants_1.zhStringToNumber(match[HOUR_GROUP]);
                        }
                        if (match[MINUTE_GROUP]) {
                            if (match[MINUTE_GROUP] == "半") {
                                minute = 30;
                            }
                            else if (match[MINUTE_GROUP] == "正" || match[MINUTE_GROUP] == "整") {
                                minute = 0;
                            }
                            else {
                                minute = parseInt(match[MINUTE_GROUP]);
                                if (isNaN(minute)) {
                                    minute = constants_1.zhStringToNumber(match[MINUTE_GROUP]);
                                }
                            }
                        }
                        else if (hour > 100) {
                            minute = hour % 100;
                            hour = Math.floor(hour / 100);
                        }
                        if (minute >= 60) {
                            return null;
                        }
                        if (hour > 24) {
                            return null;
                        }
                        if (hour >= 12) {
                            meridiem = 1;
                        }
                        if (match[AM_PM_HOUR_GROUP]) {
                            if (hour > 12)
                                return null;
                            var ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
                            if (ampm == "a") {
                                meridiem = 0;
                                if (hour == 12)
                                    hour = 0;
                            }
                            if (ampm == "p") {
                                meridiem = 1;
                                if (hour != 12)
                                    hour += 12;
                            }
                        }
                        else if (match[ZH_AM_PM_HOUR_GROUP_1]) {
                            var zhAMPMString1 = match[ZH_AM_PM_HOUR_GROUP_1];
                            var zhAMPM1 = zhAMPMString1[0];
                            if (zhAMPM1 == "早") {
                                meridiem = 0;
                                if (hour == 12)
                                    hour = 0;
                            }
                            else if (zhAMPM1 == "晚") {
                                meridiem = 1;
                                if (hour != 12)
                                    hour += 12;
                            }
                        }
                        else if (match[ZH_AM_PM_HOUR_GROUP_2]) {
                            var zhAMPMString2 = match[ZH_AM_PM_HOUR_GROUP_2];
                            var zhAMPM2 = zhAMPMString2[0];
                            if (zhAMPM2 == "上" || zhAMPM2 == "早" || zhAMPM2 == "凌") {
                                meridiem = 0;
                                if (hour == 12)
                                    hour = 0;
                            }
                            else if (zhAMPM2 == "下" || zhAMPM2 == "晚") {
                                meridiem = 1;
                                if (hour != 12)
                                    hour += 12;
                            }
                        }
                        else if (match[ZH_AM_PM_HOUR_GROUP_3]) {
                            var zhAMPMString3 = match[ZH_AM_PM_HOUR_GROUP_3];
                            var zhAMPM3 = zhAMPMString3[0];
                            if (zhAMPM3 == "上" || zhAMPM3 == "早" || zhAMPM3 == "凌") {
                                meridiem = 0;
                                if (hour == 12)
                                    hour = 0;
                            }
                            else if (zhAMPM3 == "下" || zhAMPM3 == "晚") {
                                meridiem = 1;
                                if (hour != 12)
                                    hour += 12;
                            }
                        }
                        result.start.assign("hour", hour);
                        result.start.assign("minute", minute);
                        if (meridiem >= 0) {
                            result.start.assign("meridiem", meridiem);
                        }
                        else {
                            if (hour < 12) {
                                result.start.imply("meridiem", 0);
                            }
                            else {
                                result.start.imply("meridiem", 1);
                            }
                        }
                        match = SECOND_REG_PATTERN.exec(context.text.substring(result.index + result.text.length));
                        if (!match) {
                            if (result.text.match(/^\d+$/)) {
                                return null;
                            }
                            return result;
                        }
                        var endMoment = startMoment.clone();
                        result.end = context.createParsingComponents();
                        if (match[DAY_GROUP_1]) {
                            var day1 = match[DAY_GROUP_1];
                            if (day1 == "明") {
                                if (refMoment.hour() > 1) {
                                    endMoment = endMoment.add(1, "day");
                                }
                            }
                            else if (day1 == "昨") {
                                endMoment = endMoment.add(-1, "day");
                            }
                            else if (day1 == "前") {
                                endMoment = endMoment.add(-2, "day");
                            }
                            else if (day1 == "大前") {
                                endMoment = endMoment.add(-3, "day");
                            }
                            else if (day1 == "后") {
                                endMoment = endMoment.add(2, "day");
                            }
                            else if (day1 == "大后") {
                                endMoment = endMoment.add(3, "day");
                            }
                            result.end.assign("day", endMoment.date());
                            result.end.assign("month", endMoment.month() + 1);
                            result.end.assign("year", endMoment.year());
                        }
                        else if (match[DAY_GROUP_3]) {
                            var day3 = match[DAY_GROUP_3];
                            if (day3 == "明") {
                                endMoment = endMoment.add(1, "day");
                            }
                            else if (day3 == "昨") {
                                endMoment = endMoment.add(-1, "day");
                            }
                            else if (day3 == "前") {
                                endMoment = endMoment.add(-2, "day");
                            }
                            else if (day3 == "大前") {
                                endMoment = endMoment.add(-3, "day");
                            }
                            else if (day3 == "后") {
                                endMoment = endMoment.add(2, "day");
                            }
                            else if (day3 == "大后") {
                                endMoment = endMoment.add(3, "day");
                            }
                            result.end.assign("day", endMoment.date());
                            result.end.assign("month", endMoment.month() + 1);
                            result.end.assign("year", endMoment.year());
                        }
                        else {
                            result.end.imply("day", endMoment.date());
                            result.end.imply("month", endMoment.month() + 1);
                            result.end.imply("year", endMoment.year());
                        }
                        hour = 0;
                        minute = 0;
                        meridiem = -1;
                        if (match[SECOND_GROUP]) {
                            var second = parseInt(match[SECOND_GROUP]);
                            if (isNaN(second)) {
                                second = constants_1.zhStringToNumber(match[SECOND_GROUP]);
                            }
                            if (second >= 60)
                                return null;
                            result.end.assign("second", second);
                        }
                        hour = parseInt(match[HOUR_GROUP]);
                        if (isNaN(hour)) {
                            hour = constants_1.zhStringToNumber(match[HOUR_GROUP]);
                        }
                        if (match[MINUTE_GROUP]) {
                            if (match[MINUTE_GROUP] == "半") {
                                minute = 30;
                            }
                            else if (match[MINUTE_GROUP] == "正" || match[MINUTE_GROUP] == "整") {
                                minute = 0;
                            }
                            else {
                                minute = parseInt(match[MINUTE_GROUP]);
                                if (isNaN(minute)) {
                                    minute = constants_1.zhStringToNumber(match[MINUTE_GROUP]);
                                }
                            }
                        }
                        else if (hour > 100) {
                            minute = hour % 100;
                            hour = Math.floor(hour / 100);
                        }
                        if (minute >= 60) {
                            return null;
                        }
                        if (hour > 24) {
                            return null;
                        }
                        if (hour >= 12) {
                            meridiem = 1;
                        }
                        if (match[AM_PM_HOUR_GROUP]) {
                            if (hour > 12)
                                return null;
                            var ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
                            if (ampm == "a") {
                                meridiem = 0;
                                if (hour == 12)
                                    hour = 0;
                            }
                            if (ampm == "p") {
                                meridiem = 1;
                                if (hour != 12)
                                    hour += 12;
                            }
                            if (!result.start.isCertain("meridiem")) {
                                if (meridiem == 0) {
                                    result.start.imply("meridiem", 0);
                                    if (result.start.get("hour") == 12) {
                                        result.start.assign("hour", 0);
                                    }
                                }
                                else {
                                    result.start.imply("meridiem", 1);
                                    if (result.start.get("hour") != 12) {
                                        result.start.assign("hour", result.start.get("hour") + 12);
                                    }
                                }
                            }
                        }
                        else if (match[ZH_AM_PM_HOUR_GROUP_1]) {
                            var zhAMPMString1 = match[ZH_AM_PM_HOUR_GROUP_1];
                            var zhAMPM1 = zhAMPMString1[0];
                            if (zhAMPM1 == "早") {
                                meridiem = 0;
                                if (hour == 12)
                                    hour = 0;
                            }
                            else if (zhAMPM1 == "晚") {
                                meridiem = 1;
                                if (hour != 12)
                                    hour += 12;
                            }
                        }
                        else if (match[ZH_AM_PM_HOUR_GROUP_2]) {
                            var zhAMPMString2 = match[ZH_AM_PM_HOUR_GROUP_2];
                            var zhAMPM2 = zhAMPMString2[0];
                            if (zhAMPM2 == "上" || zhAMPM2 == "早" || zhAMPM2 == "凌") {
                                meridiem = 0;
                                if (hour == 12)
                                    hour = 0;
                            }
                            else if (zhAMPM2 == "下" || zhAMPM2 == "晚") {
                                meridiem = 1;
                                if (hour != 12)
                                    hour += 12;
                            }
                        }
                        else if (match[ZH_AM_PM_HOUR_GROUP_3]) {
                            var zhAMPMString3 = match[ZH_AM_PM_HOUR_GROUP_3];
                            var zhAMPM3 = zhAMPMString3[0];
                            if (zhAMPM3 == "上" || zhAMPM3 == "早" || zhAMPM3 == "凌") {
                                meridiem = 0;
                                if (hour == 12)
                                    hour = 0;
                            }
                            else if (zhAMPM3 == "下" || zhAMPM3 == "晚") {
                                meridiem = 1;
                                if (hour != 12)
                                    hour += 12;
                            }
                        }
                        result.text = result.text + match[0];
                        result.end.assign("hour", hour);
                        result.end.assign("minute", minute);
                        if (meridiem >= 0) {
                            result.end.assign("meridiem", meridiem);
                        }
                        else {
                            var startAtPM = result.start.isCertain("meridiem") && result.start.get("meridiem") == 1;
                            if (startAtPM && result.start.get("hour") > hour) {
                                result.end.imply("meridiem", 0);
                            }
                            else if (hour > 12) {
                                result.end.imply("meridiem", 1);
                            }
                        }
                        if (result.end.date().getTime() < result.start.date().getTime()) {
                            result.end.imply("day", result.end.get("day") + 1);
                        }
                        return result;
                    };
                    return ZHHansTimeExpressionParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ZHHansTimeExpressionParser;
            }, { "../../../../common/parsers/AbstractParserWithWordBoundary": 8, "../constants": 142, "dayjs": 169 }], 149: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var dayjs_1 = __importDefault(require("dayjs"));
                var AbstractParserWithWordBoundary_1 = require("../../../../common/parsers/AbstractParserWithWordBoundary");
                var constants_1 = require("../constants");
                var PATTERN = new RegExp("(?:星期|礼拜|周)(?<weekday>" + Object.keys(constants_1.WEEKDAY_OFFSET).join("|") + ")");
                var ZHHansWeekdayParser = /** @class */ (function (_super) {
                    __extends(ZHHansWeekdayParser, _super);
                    function ZHHansWeekdayParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ZHHansWeekdayParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    ZHHansWeekdayParser.prototype.innerExtract = function (context, match) {
                        var result = context.createParsingResult(match.index, match[0]);
                        var dayOfWeek = match.groups.weekday;
                        var offset = constants_1.WEEKDAY_OFFSET[dayOfWeek];
                        if (offset === undefined)
                            return null;
                        var startMoment = dayjs_1.default(context.refDate);
                        var startMomentFixed = false;
                        var refOffset = startMoment.day();
                        if (Math.abs(offset - 7 - refOffset) < Math.abs(offset - refOffset)) {
                            startMoment = startMoment.day(offset - 7);
                        }
                        else if (Math.abs(offset + 7 - refOffset) < Math.abs(offset - refOffset)) {
                            startMoment = startMoment.day(offset + 7);
                        }
                        else {
                            startMoment = startMoment.day(offset);
                        }
                        result.start.assign("weekday", offset);
                        if (startMomentFixed) {
                            result.start.assign("day", startMoment.date());
                            result.start.assign("month", startMoment.month() + 1);
                            result.start.assign("year", startMoment.year());
                        }
                        else {
                            result.start.imply("day", startMoment.date());
                            result.start.imply("month", startMoment.month() + 1);
                            result.start.imply("year", startMoment.year());
                        }
                        return result;
                    };
                    return ZHHansWeekdayParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ZHHansWeekdayParser;
            }, { "../../../../common/parsers/AbstractParserWithWordBoundary": 8, "../constants": 142, "dayjs": 169 }], 150: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractMergeDateRangeRefiner_1 = __importDefault(require("../../../../common/refiners/AbstractMergeDateRangeRefiner"));
                var ZHHansMergeDateRangeRefiner = /** @class */ (function (_super) {
                    __extends(ZHHansMergeDateRangeRefiner, _super);
                    function ZHHansMergeDateRangeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ZHHansMergeDateRangeRefiner.prototype.patternBetween = function () {
                        return /^\s*(至|到|-|~|～|－|ー)\s*$/i;
                    };
                    return ZHHansMergeDateRangeRefiner;
                }(AbstractMergeDateRangeRefiner_1.default));
                exports.default = ZHHansMergeDateRangeRefiner;
            }, { "../../../../common/refiners/AbstractMergeDateRangeRefiner": 12 }], 151: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractMergeDateTimeRefiner_1 = __importDefault(require("../../../../common/refiners/AbstractMergeDateTimeRefiner"));
                var ZHHansMergeDateTimeRefiner = /** @class */ (function (_super) {
                    __extends(ZHHansMergeDateTimeRefiner, _super);
                    function ZHHansMergeDateTimeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ZHHansMergeDateTimeRefiner.prototype.patternBetween = function () {
                        return /^\s*$/i;
                    };
                    return ZHHansMergeDateTimeRefiner;
                }(AbstractMergeDateTimeRefiner_1.default));
                exports.default = ZHHansMergeDateTimeRefiner;
            }, { "../../../../common/refiners/AbstractMergeDateTimeRefiner": 13 }], 152: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.zhStringToYear = exports.zhStringToNumber = exports.WEEKDAY_OFFSET = exports.NUMBER = void 0;
                exports.NUMBER = {
                    "零": 0,
                    "一": 1,
                    "二": 2,
                    "兩": 2,
                    "三": 3,
                    "四": 4,
                    "五": 5,
                    "六": 6,
                    "七": 7,
                    "八": 8,
                    "九": 9,
                    "十": 10,
                    "廿": 20,
                    "卅": 30,
                };
                exports.WEEKDAY_OFFSET = {
                    "天": 0,
                    "日": 0,
                    "一": 1,
                    "二": 2,
                    "三": 3,
                    "四": 4,
                    "五": 5,
                    "六": 6,
                };
                function zhStringToNumber(text) {
                    var number = 0;
                    for (var i = 0; i < text.length; i++) {
                        var char = text[i];
                        if (char === "十") {
                            number = number === 0 ? exports.NUMBER[char] : number * exports.NUMBER[char];
                        }
                        else {
                            number += exports.NUMBER[char];
                        }
                    }
                    return number;
                }
                exports.zhStringToNumber = zhStringToNumber;
                function zhStringToYear(text) {
                    var string = "";
                    for (var i = 0; i < text.length; i++) {
                        var char = text[i];
                        string = string + exports.NUMBER[char];
                    }
                    return parseInt(string);
                }
                exports.zhStringToYear = zhStringToYear;
            }, {}], 153: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = exports.hant = exports.Weekday = exports.Meridiem = exports.ReferenceWithTimezone = exports.ParsingComponents = exports.ParsingResult = exports.Chrono = void 0;
                var ExtractTimezoneOffsetRefiner_1 = __importDefault(require("../../../common/refiners/ExtractTimezoneOffsetRefiner"));
                var configurations_1 = require("../../../configurations");
                var chrono_1 = require("../../../chrono");
                Object.defineProperty(exports, "Chrono", { enumerable: true, get: function () { return chrono_1.Chrono; } });
                var results_1 = require("../../../results");
                Object.defineProperty(exports, "ParsingResult", { enumerable: true, get: function () { return results_1.ParsingResult; } });
                Object.defineProperty(exports, "ParsingComponents", { enumerable: true, get: function () { return results_1.ParsingComponents; } });
                Object.defineProperty(exports, "ReferenceWithTimezone", { enumerable: true, get: function () { return results_1.ReferenceWithTimezone; } });
                var types_1 = require("../../../types");
                Object.defineProperty(exports, "Meridiem", { enumerable: true, get: function () { return types_1.Meridiem; } });
                Object.defineProperty(exports, "Weekday", { enumerable: true, get: function () { return types_1.Weekday; } });
                var ZHHantCasualDateParser_1 = __importDefault(require("./parsers/ZHHantCasualDateParser"));
                var ZHHantDateParser_1 = __importDefault(require("./parsers/ZHHantDateParser"));
                var ZHHantDeadlineFormatParser_1 = __importDefault(require("./parsers/ZHHantDeadlineFormatParser"));
                var ZHHantRelationWeekdayParser_1 = __importDefault(require("./parsers/ZHHantRelationWeekdayParser"));
                var ZHHantTimeExpressionParser_1 = __importDefault(require("./parsers/ZHHantTimeExpressionParser"));
                var ZHHantWeekdayParser_1 = __importDefault(require("./parsers/ZHHantWeekdayParser"));
                var ZHHantMergeDateRangeRefiner_1 = __importDefault(require("./refiners/ZHHantMergeDateRangeRefiner"));
                var ZHHantMergeDateTimeRefiner_1 = __importDefault(require("./refiners/ZHHantMergeDateTimeRefiner"));
                exports.hant = new chrono_1.Chrono(createCasualConfiguration());
                exports.casual = new chrono_1.Chrono(createCasualConfiguration());
                exports.strict = new chrono_1.Chrono(createConfiguration());
                function parse(text, ref, option) {
                    return exports.casual.parse(text, ref, option);
                }
                exports.parse = parse;
                function parseDate(text, ref, option) {
                    return exports.casual.parseDate(text, ref, option);
                }
                exports.parseDate = parseDate;
                function createCasualConfiguration() {
                    var option = createConfiguration();
                    option.parsers.unshift(new ZHHantCasualDateParser_1.default());
                    return option;
                }
                exports.createCasualConfiguration = createCasualConfiguration;
                function createConfiguration() {
                    var configuration = configurations_1.includeCommonConfiguration({
                        parsers: [
                            new ZHHantDateParser_1.default(),
                            new ZHHantRelationWeekdayParser_1.default(),
                            new ZHHantWeekdayParser_1.default(),
                            new ZHHantTimeExpressionParser_1.default(),
                            new ZHHantDeadlineFormatParser_1.default(),
                        ],
                        refiners: [new ZHHantMergeDateRangeRefiner_1.default(), new ZHHantMergeDateTimeRefiner_1.default()],
                    });
                    configuration.refiners = configuration.refiners.filter(function (refiner) { return !(refiner instanceof ExtractTimezoneOffsetRefiner_1.default); });
                    return configuration;
                }
                exports.createConfiguration = createConfiguration;
            }, { "../../../chrono": 4, "../../../common/refiners/ExtractTimezoneOffsetRefiner": 15, "../../../configurations": 20, "../../../results": 163, "../../../types": 165, "./parsers/ZHHantCasualDateParser": 154, "./parsers/ZHHantDateParser": 155, "./parsers/ZHHantDeadlineFormatParser": 156, "./parsers/ZHHantRelationWeekdayParser": 157, "./parsers/ZHHantTimeExpressionParser": 158, "./parsers/ZHHantWeekdayParser": 159, "./refiners/ZHHantMergeDateRangeRefiner": 160, "./refiners/ZHHantMergeDateTimeRefiner": 161 }], 154: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var dayjs_1 = __importDefault(require("dayjs"));
                var AbstractParserWithWordBoundary_1 = require("../../../../common/parsers/AbstractParserWithWordBoundary");
                var NOW_GROUP = 1;
                var DAY_GROUP_1 = 2;
                var TIME_GROUP_1 = 3;
                var TIME_GROUP_2 = 4;
                var DAY_GROUP_3 = 5;
                var TIME_GROUP_3 = 6;
                var ZHHantCasualDateParser = /** @class */ (function (_super) {
                    __extends(ZHHantCasualDateParser, _super);
                    function ZHHantCasualDateParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ZHHantCasualDateParser.prototype.innerPattern = function (context) {
                        return new RegExp("(而家|立(?:刻|即)|即刻)|" +
                            "(今|明|前|大前|後|大後|聽|昨|尋|琴)(早|朝|晚)|" +
                            "(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨))|" +
                            "(今|明|前|大前|後|大後|聽|昨|尋|琴)(?:日|天)" +
                            "(?:[\\s|,|，]*)" +
                            "(?:(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨)))?", "i");
                    };
                    ZHHantCasualDateParser.prototype.innerExtract = function (context, match) {
                        var index = match.index;
                        var result = context.createParsingResult(index, match[0]);
                        var refMoment = dayjs_1.default(context.refDate);
                        var startMoment = refMoment;
                        if (match[NOW_GROUP]) {
                            result.start.imply("hour", refMoment.hour());
                            result.start.imply("minute", refMoment.minute());
                            result.start.imply("second", refMoment.second());
                            result.start.imply("millisecond", refMoment.millisecond());
                        }
                        else if (match[DAY_GROUP_1]) {
                            var day1 = match[DAY_GROUP_1];
                            var time1 = match[TIME_GROUP_1];
                            if (day1 == "明" || day1 == "聽") {
                                if (refMoment.hour() > 1) {
                                    startMoment = startMoment.add(1, "day");
                                }
                            }
                            else if (day1 == "昨" || day1 == "尋" || day1 == "琴") {
                                startMoment = startMoment.add(-1, "day");
                            }
                            else if (day1 == "前") {
                                startMoment = startMoment.add(-2, "day");
                            }
                            else if (day1 == "大前") {
                                startMoment = startMoment.add(-3, "day");
                            }
                            else if (day1 == "後") {
                                startMoment = startMoment.add(2, "day");
                            }
                            else if (day1 == "大後") {
                                startMoment = startMoment.add(3, "day");
                            }
                            if (time1 == "早" || time1 == "朝") {
                                result.start.imply("hour", 6);
                            }
                            else if (time1 == "晚") {
                                result.start.imply("hour", 22);
                                result.start.imply("meridiem", 1);
                            }
                        }
                        else if (match[TIME_GROUP_2]) {
                            var timeString2 = match[TIME_GROUP_2];
                            var time2 = timeString2[0];
                            if (time2 == "早" || time2 == "朝" || time2 == "上") {
                                result.start.imply("hour", 6);
                            }
                            else if (time2 == "下" || time2 == "晏") {
                                result.start.imply("hour", 15);
                                result.start.imply("meridiem", 1);
                            }
                            else if (time2 == "中") {
                                result.start.imply("hour", 12);
                                result.start.imply("meridiem", 1);
                            }
                            else if (time2 == "夜" || time2 == "晚") {
                                result.start.imply("hour", 22);
                                result.start.imply("meridiem", 1);
                            }
                            else if (time2 == "凌") {
                                result.start.imply("hour", 0);
                            }
                        }
                        else if (match[DAY_GROUP_3]) {
                            var day3 = match[DAY_GROUP_3];
                            if (day3 == "明" || day3 == "聽") {
                                if (refMoment.hour() > 1) {
                                    startMoment = startMoment.add(1, "day");
                                }
                            }
                            else if (day3 == "昨" || day3 == "尋" || day3 == "琴") {
                                startMoment = startMoment.add(-1, "day");
                            }
                            else if (day3 == "前") {
                                startMoment = startMoment.add(-2, "day");
                            }
                            else if (day3 == "大前") {
                                startMoment = startMoment.add(-3, "day");
                            }
                            else if (day3 == "後") {
                                startMoment = startMoment.add(2, "day");
                            }
                            else if (day3 == "大後") {
                                startMoment = startMoment.add(3, "day");
                            }
                            var timeString3 = match[TIME_GROUP_3];
                            if (timeString3) {
                                var time3 = timeString3[0];
                                if (time3 == "早" || time3 == "朝" || time3 == "上") {
                                    result.start.imply("hour", 6);
                                }
                                else if (time3 == "下" || time3 == "晏") {
                                    result.start.imply("hour", 15);
                                    result.start.imply("meridiem", 1);
                                }
                                else if (time3 == "中") {
                                    result.start.imply("hour", 12);
                                    result.start.imply("meridiem", 1);
                                }
                                else if (time3 == "夜" || time3 == "晚") {
                                    result.start.imply("hour", 22);
                                    result.start.imply("meridiem", 1);
                                }
                                else if (time3 == "凌") {
                                    result.start.imply("hour", 0);
                                }
                            }
                        }
                        result.start.assign("day", startMoment.date());
                        result.start.assign("month", startMoment.month() + 1);
                        result.start.assign("year", startMoment.year());
                        return result;
                    };
                    return ZHHantCasualDateParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ZHHantCasualDateParser;
            }, { "../../../../common/parsers/AbstractParserWithWordBoundary": 8, "dayjs": 169 }], 155: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var dayjs_1 = __importDefault(require("dayjs"));
                var AbstractParserWithWordBoundary_1 = require("../../../../common/parsers/AbstractParserWithWordBoundary");
                var constants_1 = require("../constants");
                var YEAR_GROUP = 1;
                var MONTH_GROUP = 2;
                var DAY_GROUP = 3;
                var ZHHantDateParser = /** @class */ (function (_super) {
                    __extends(ZHHantDateParser, _super);
                    function ZHHantDateParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ZHHantDateParser.prototype.innerPattern = function () {
                        return new RegExp("(" +
                            "\\d{2,4}|" +
                            "[" + Object.keys(constants_1.NUMBER).join("") + "]{4}|" +
                            "[" + Object.keys(constants_1.NUMBER).join("") + "]{2}" +
                            ")?" +
                            "(?:\\s*)" +
                            "(?:年)?" +
                            "(?:[\\s|,|，]*)" +
                            "(" +
                            "\\d{1,2}|" +
                            "[" + Object.keys(constants_1.NUMBER).join("") + "]{1,2}" +
                            ")" +
                            "(?:\\s*)" +
                            "(?:月)" +
                            "(?:\\s*)" +
                            "(" +
                            "\\d{1,2}|" +
                            "[" + Object.keys(constants_1.NUMBER).join("") + "]{1,2}" +
                            ")?" +
                            "(?:\\s*)" +
                            "(?:日|號)?");
                    };
                    ZHHantDateParser.prototype.innerExtract = function (context, match) {
                        var startMoment = dayjs_1.default(context.refDate);
                        var result = context.createParsingResult(match.index, match[0]);
                        var month = parseInt(match[MONTH_GROUP]);
                        if (isNaN(month))
                            month = constants_1.zhStringToNumber(match[MONTH_GROUP]);
                        result.start.assign("month", month);
                        if (match[DAY_GROUP]) {
                            var day = parseInt(match[DAY_GROUP]);
                            if (isNaN(day))
                                day = constants_1.zhStringToNumber(match[DAY_GROUP]);
                            result.start.assign("day", day);
                        }
                        else {
                            result.start.imply("day", startMoment.date());
                        }
                        if (match[YEAR_GROUP]) {
                            var year = parseInt(match[YEAR_GROUP]);
                            if (isNaN(year))
                                year = constants_1.zhStringToYear(match[YEAR_GROUP]);
                            result.start.assign("year", year);
                        }
                        else {
                            result.start.imply("year", startMoment.year());
                        }
                        return result;
                    };
                    return ZHHantDateParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ZHHantDateParser;
            }, { "../../../../common/parsers/AbstractParserWithWordBoundary": 8, "../constants": 152, "dayjs": 169 }], 156: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var dayjs_1 = __importDefault(require("dayjs"));
                var AbstractParserWithWordBoundary_1 = require("../../../../common/parsers/AbstractParserWithWordBoundary");
                var constants_1 = require("../constants");
                var PATTERN = new RegExp("(\\d+|[" +
                    Object.keys(constants_1.NUMBER).join("") +
                    "]+|半|幾)(?:\\s*)" +
                    "(?:個)?" +
                    "(秒(?:鐘)?|分鐘|小時|鐘|日|天|星期|禮拜|月|年)" +
                    "(?:(?:之|過)?後|(?:之)?內)", "i");
                var NUMBER_GROUP = 1;
                var UNIT_GROUP = 2;
                var ZHHantDeadlineFormatParser = /** @class */ (function (_super) {
                    __extends(ZHHantDeadlineFormatParser, _super);
                    function ZHHantDeadlineFormatParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ZHHantDeadlineFormatParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    ZHHantDeadlineFormatParser.prototype.innerExtract = function (context, match) {
                        var result = context.createParsingResult(match.index, match[0]);
                        var number = parseInt(match[NUMBER_GROUP]);
                        if (isNaN(number)) {
                            number = constants_1.zhStringToNumber(match[NUMBER_GROUP]);
                        }
                        if (isNaN(number)) {
                            var string = match[NUMBER_GROUP];
                            if (string === "幾") {
                                number = 3;
                            }
                            else if (string === "半") {
                                number = 0.5;
                            }
                            else {
                                return null;
                            }
                        }
                        var date = dayjs_1.default(context.refDate);
                        var unit = match[UNIT_GROUP];
                        var unitAbbr = unit[0];
                        if (unitAbbr.match(/[日天星禮月年]/)) {
                            if (unitAbbr == "日" || unitAbbr == "天") {
                                date = date.add(number, "d");
                            }
                            else if (unitAbbr == "星" || unitAbbr == "禮") {
                                date = date.add(number * 7, "d");
                            }
                            else if (unitAbbr == "月") {
                                date = date.add(number, "month");
                            }
                            else if (unitAbbr == "年") {
                                date = date.add(number, "year");
                            }
                            result.start.assign("year", date.year());
                            result.start.assign("month", date.month() + 1);
                            result.start.assign("day", date.date());
                            return result;
                        }
                        if (unitAbbr == "秒") {
                            date = date.add(number, "second");
                        }
                        else if (unitAbbr == "分") {
                            date = date.add(number, "minute");
                        }
                        else if (unitAbbr == "小" || unitAbbr == "鐘") {
                            date = date.add(number, "hour");
                        }
                        result.start.imply("year", date.year());
                        result.start.imply("month", date.month() + 1);
                        result.start.imply("day", date.date());
                        result.start.assign("hour", date.hour());
                        result.start.assign("minute", date.minute());
                        result.start.assign("second", date.second());
                        return result;
                    };
                    return ZHHantDeadlineFormatParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ZHHantDeadlineFormatParser;
            }, { "../../../../common/parsers/AbstractParserWithWordBoundary": 8, "../constants": 152, "dayjs": 169 }], 157: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var dayjs_1 = __importDefault(require("dayjs"));
                var AbstractParserWithWordBoundary_1 = require("../../../../common/parsers/AbstractParserWithWordBoundary");
                var constants_1 = require("../constants");
                var PATTERN = new RegExp("(?<prefix>上|今|下|這|呢)(?:個)?(?:星期|禮拜|週)(?<weekday>" + Object.keys(constants_1.WEEKDAY_OFFSET).join("|") + ")");
                var ZHHantRelationWeekdayParser = /** @class */ (function (_super) {
                    __extends(ZHHantRelationWeekdayParser, _super);
                    function ZHHantRelationWeekdayParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ZHHantRelationWeekdayParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    ZHHantRelationWeekdayParser.prototype.innerExtract = function (context, match) {
                        var result = context.createParsingResult(match.index, match[0]);
                        var dayOfWeek = match.groups.weekday;
                        var offset = constants_1.WEEKDAY_OFFSET[dayOfWeek];
                        if (offset === undefined)
                            return null;
                        var modifier = null;
                        var prefix = match.groups.prefix;
                        if (prefix == "上") {
                            modifier = "last";
                        }
                        else if (prefix == "下") {
                            modifier = "next";
                        }
                        else if (prefix == "今" || prefix == "這" || prefix == "呢") {
                            modifier = "this";
                        }
                        var startMoment = dayjs_1.default(context.refDate);
                        var startMomentFixed = false;
                        var refOffset = startMoment.day();
                        if (modifier == "last" || modifier == "past") {
                            startMoment = startMoment.day(offset - 7);
                            startMomentFixed = true;
                        }
                        else if (modifier == "next") {
                            startMoment = startMoment.day(offset + 7);
                            startMomentFixed = true;
                        }
                        else if (modifier == "this") {
                            startMoment = startMoment.day(offset);
                        }
                        else {
                            if (Math.abs(offset - 7 - refOffset) < Math.abs(offset - refOffset)) {
                                startMoment = startMoment.day(offset - 7);
                            }
                            else if (Math.abs(offset + 7 - refOffset) < Math.abs(offset - refOffset)) {
                                startMoment = startMoment.day(offset + 7);
                            }
                            else {
                                startMoment = startMoment.day(offset);
                            }
                        }
                        result.start.assign("weekday", offset);
                        if (startMomentFixed) {
                            result.start.assign("day", startMoment.date());
                            result.start.assign("month", startMoment.month() + 1);
                            result.start.assign("year", startMoment.year());
                        }
                        else {
                            result.start.imply("day", startMoment.date());
                            result.start.imply("month", startMoment.month() + 1);
                            result.start.imply("year", startMoment.year());
                        }
                        return result;
                    };
                    return ZHHantRelationWeekdayParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ZHHantRelationWeekdayParser;
            }, { "../../../../common/parsers/AbstractParserWithWordBoundary": 8, "../constants": 152, "dayjs": 169 }], 158: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var dayjs_1 = __importDefault(require("dayjs"));
                var AbstractParserWithWordBoundary_1 = require("../../../../common/parsers/AbstractParserWithWordBoundary");
                var constants_1 = require("../constants");
                var FIRST_REG_PATTERN = new RegExp("(?:由|從|自)?" +
                    "(?:" +
                    "(今|明|前|大前|後|大後|聽|昨|尋|琴)(早|朝|晚)|" +
                    "(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨))|" +
                    "(今|明|前|大前|後|大後|聽|昨|尋|琴)(?:日|天)" +
                    "(?:[\\s,，]*)" +
                    "(?:(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨)))?" +
                    ")?" +
                    "(?:[\\s,，]*)" +
                    "(?:(\\d+|[" +
                    Object.keys(constants_1.NUMBER).join("") +
                    "]+)(?:\\s*)(?:點|時|:|：)" +
                    "(?:\\s*)" +
                    "(\\d+|半|正|整|[" +
                    Object.keys(constants_1.NUMBER).join("") +
                    "]+)?(?:\\s*)(?:分|:|：)?" +
                    "(?:\\s*)" +
                    "(\\d+|[" +
                    Object.keys(constants_1.NUMBER).join("") +
                    "]+)?(?:\\s*)(?:秒)?)" +
                    "(?:\\s*(A.M.|P.M.|AM?|PM?))?", "i");
                var SECOND_REG_PATTERN = new RegExp("(?:^\\s*(?:到|至|\\-|\\–|\\~|\\〜)\\s*)" +
                    "(?:" +
                    "(今|明|前|大前|後|大後|聽|昨|尋|琴)(早|朝|晚)|" +
                    "(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨))|" +
                    "(今|明|前|大前|後|大後|聽|昨|尋|琴)(?:日|天)" +
                    "(?:[\\s,，]*)" +
                    "(?:(上(?:午|晝)|朝(?:早)|早(?:上)|下(?:午|晝)|晏(?:晝)|晚(?:上)|夜(?:晚)?|中(?:午)|凌(?:晨)))?" +
                    ")?" +
                    "(?:[\\s,，]*)" +
                    "(?:(\\d+|[" +
                    Object.keys(constants_1.NUMBER).join("") +
                    "]+)(?:\\s*)(?:點|時|:|：)" +
                    "(?:\\s*)" +
                    "(\\d+|半|正|整|[" +
                    Object.keys(constants_1.NUMBER).join("") +
                    "]+)?(?:\\s*)(?:分|:|：)?" +
                    "(?:\\s*)" +
                    "(\\d+|[" +
                    Object.keys(constants_1.NUMBER).join("") +
                    "]+)?(?:\\s*)(?:秒)?)" +
                    "(?:\\s*(A.M.|P.M.|AM?|PM?))?", "i");
                var DAY_GROUP_1 = 1;
                var ZH_AM_PM_HOUR_GROUP_1 = 2;
                var ZH_AM_PM_HOUR_GROUP_2 = 3;
                var DAY_GROUP_3 = 4;
                var ZH_AM_PM_HOUR_GROUP_3 = 5;
                var HOUR_GROUP = 6;
                var MINUTE_GROUP = 7;
                var SECOND_GROUP = 8;
                var AM_PM_HOUR_GROUP = 9;
                var ZHHantTimeExpressionParser = /** @class */ (function (_super) {
                    __extends(ZHHantTimeExpressionParser, _super);
                    function ZHHantTimeExpressionParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ZHHantTimeExpressionParser.prototype.innerPattern = function () {
                        return FIRST_REG_PATTERN;
                    };
                    ZHHantTimeExpressionParser.prototype.innerExtract = function (context, match) {
                        if (match.index > 0 && context.text[match.index - 1].match(/\w/)) {
                            return null;
                        }
                        var refMoment = dayjs_1.default(context.refDate);
                        var result = context.createParsingResult(match.index, match[0]);
                        var startMoment = refMoment.clone();
                        if (match[DAY_GROUP_1]) {
                            var day1 = match[DAY_GROUP_1];
                            if (day1 == "明" || day1 == "聽") {
                                if (refMoment.hour() > 1) {
                                    startMoment = startMoment.add(1, "day");
                                }
                            }
                            else if (day1 == "昨" || day1 == "尋" || day1 == "琴") {
                                startMoment = startMoment.add(-1, "day");
                            }
                            else if (day1 == "前") {
                                startMoment = startMoment.add(-2, "day");
                            }
                            else if (day1 == "大前") {
                                startMoment = startMoment.add(-3, "day");
                            }
                            else if (day1 == "後") {
                                startMoment = startMoment.add(2, "day");
                            }
                            else if (day1 == "大後") {
                                startMoment = startMoment.add(3, "day");
                            }
                            result.start.assign("day", startMoment.date());
                            result.start.assign("month", startMoment.month() + 1);
                            result.start.assign("year", startMoment.year());
                        }
                        else if (match[DAY_GROUP_3]) {
                            var day3 = match[DAY_GROUP_3];
                            if (day3 == "明" || day3 == "聽") {
                                startMoment = startMoment.add(1, "day");
                            }
                            else if (day3 == "昨" || day3 == "尋" || day3 == "琴") {
                                startMoment = startMoment.add(-1, "day");
                            }
                            else if (day3 == "前") {
                                startMoment = startMoment.add(-2, "day");
                            }
                            else if (day3 == "大前") {
                                startMoment = startMoment.add(-3, "day");
                            }
                            else if (day3 == "後") {
                                startMoment = startMoment.add(2, "day");
                            }
                            else if (day3 == "大後") {
                                startMoment = startMoment.add(3, "day");
                            }
                            result.start.assign("day", startMoment.date());
                            result.start.assign("month", startMoment.month() + 1);
                            result.start.assign("year", startMoment.year());
                        }
                        else {
                            result.start.imply("day", startMoment.date());
                            result.start.imply("month", startMoment.month() + 1);
                            result.start.imply("year", startMoment.year());
                        }
                        var hour = 0;
                        var minute = 0;
                        var meridiem = -1;
                        if (match[SECOND_GROUP]) {
                            var second = parseInt(match[SECOND_GROUP]);
                            if (isNaN(second)) {
                                second = constants_1.zhStringToNumber(match[SECOND_GROUP]);
                            }
                            if (second >= 60)
                                return null;
                            result.start.assign("second", second);
                        }
                        hour = parseInt(match[HOUR_GROUP]);
                        if (isNaN(hour)) {
                            hour = constants_1.zhStringToNumber(match[HOUR_GROUP]);
                        }
                        if (match[MINUTE_GROUP]) {
                            if (match[MINUTE_GROUP] == "半") {
                                minute = 30;
                            }
                            else if (match[MINUTE_GROUP] == "正" || match[MINUTE_GROUP] == "整") {
                                minute = 0;
                            }
                            else {
                                minute = parseInt(match[MINUTE_GROUP]);
                                if (isNaN(minute)) {
                                    minute = constants_1.zhStringToNumber(match[MINUTE_GROUP]);
                                }
                            }
                        }
                        else if (hour > 100) {
                            minute = hour % 100;
                            hour = Math.floor(hour / 100);
                        }
                        if (minute >= 60) {
                            return null;
                        }
                        if (hour > 24) {
                            return null;
                        }
                        if (hour >= 12) {
                            meridiem = 1;
                        }
                        if (match[AM_PM_HOUR_GROUP]) {
                            if (hour > 12)
                                return null;
                            var ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
                            if (ampm == "a") {
                                meridiem = 0;
                                if (hour == 12)
                                    hour = 0;
                            }
                            if (ampm == "p") {
                                meridiem = 1;
                                if (hour != 12)
                                    hour += 12;
                            }
                        }
                        else if (match[ZH_AM_PM_HOUR_GROUP_1]) {
                            var zhAMPMString1 = match[ZH_AM_PM_HOUR_GROUP_1];
                            var zhAMPM1 = zhAMPMString1[0];
                            if (zhAMPM1 == "朝" || zhAMPM1 == "早") {
                                meridiem = 0;
                                if (hour == 12)
                                    hour = 0;
                            }
                            else if (zhAMPM1 == "晚") {
                                meridiem = 1;
                                if (hour != 12)
                                    hour += 12;
                            }
                        }
                        else if (match[ZH_AM_PM_HOUR_GROUP_2]) {
                            var zhAMPMString2 = match[ZH_AM_PM_HOUR_GROUP_2];
                            var zhAMPM2 = zhAMPMString2[0];
                            if (zhAMPM2 == "上" || zhAMPM2 == "朝" || zhAMPM2 == "早" || zhAMPM2 == "凌") {
                                meridiem = 0;
                                if (hour == 12)
                                    hour = 0;
                            }
                            else if (zhAMPM2 == "下" || zhAMPM2 == "晏" || zhAMPM2 == "晚") {
                                meridiem = 1;
                                if (hour != 12)
                                    hour += 12;
                            }
                        }
                        else if (match[ZH_AM_PM_HOUR_GROUP_3]) {
                            var zhAMPMString3 = match[ZH_AM_PM_HOUR_GROUP_3];
                            var zhAMPM3 = zhAMPMString3[0];
                            if (zhAMPM3 == "上" || zhAMPM3 == "朝" || zhAMPM3 == "早" || zhAMPM3 == "凌") {
                                meridiem = 0;
                                if (hour == 12)
                                    hour = 0;
                            }
                            else if (zhAMPM3 == "下" || zhAMPM3 == "晏" || zhAMPM3 == "晚") {
                                meridiem = 1;
                                if (hour != 12)
                                    hour += 12;
                            }
                        }
                        result.start.assign("hour", hour);
                        result.start.assign("minute", minute);
                        if (meridiem >= 0) {
                            result.start.assign("meridiem", meridiem);
                        }
                        else {
                            if (hour < 12) {
                                result.start.imply("meridiem", 0);
                            }
                            else {
                                result.start.imply("meridiem", 1);
                            }
                        }
                        match = SECOND_REG_PATTERN.exec(context.text.substring(result.index + result.text.length));
                        if (!match) {
                            if (result.text.match(/^\d+$/)) {
                                return null;
                            }
                            return result;
                        }
                        var endMoment = startMoment.clone();
                        result.end = context.createParsingComponents();
                        if (match[DAY_GROUP_1]) {
                            var day1 = match[DAY_GROUP_1];
                            if (day1 == "明" || day1 == "聽") {
                                if (refMoment.hour() > 1) {
                                    endMoment = endMoment.add(1, "day");
                                }
                            }
                            else if (day1 == "昨" || day1 == "尋" || day1 == "琴") {
                                endMoment = endMoment.add(-1, "day");
                            }
                            else if (day1 == "前") {
                                endMoment = endMoment.add(-2, "day");
                            }
                            else if (day1 == "大前") {
                                endMoment = endMoment.add(-3, "day");
                            }
                            else if (day1 == "後") {
                                endMoment = endMoment.add(2, "day");
                            }
                            else if (day1 == "大後") {
                                endMoment = endMoment.add(3, "day");
                            }
                            result.end.assign("day", endMoment.date());
                            result.end.assign("month", endMoment.month() + 1);
                            result.end.assign("year", endMoment.year());
                        }
                        else if (match[DAY_GROUP_3]) {
                            var day3 = match[DAY_GROUP_3];
                            if (day3 == "明" || day3 == "聽") {
                                endMoment = endMoment.add(1, "day");
                            }
                            else if (day3 == "昨" || day3 == "尋" || day3 == "琴") {
                                endMoment = endMoment.add(-1, "day");
                            }
                            else if (day3 == "前") {
                                endMoment = endMoment.add(-2, "day");
                            }
                            else if (day3 == "大前") {
                                endMoment = endMoment.add(-3, "day");
                            }
                            else if (day3 == "後") {
                                endMoment = endMoment.add(2, "day");
                            }
                            else if (day3 == "大後") {
                                endMoment = endMoment.add(3, "day");
                            }
                            result.end.assign("day", endMoment.date());
                            result.end.assign("month", endMoment.month() + 1);
                            result.end.assign("year", endMoment.year());
                        }
                        else {
                            result.end.imply("day", endMoment.date());
                            result.end.imply("month", endMoment.month() + 1);
                            result.end.imply("year", endMoment.year());
                        }
                        hour = 0;
                        minute = 0;
                        meridiem = -1;
                        if (match[SECOND_GROUP]) {
                            var second = parseInt(match[SECOND_GROUP]);
                            if (isNaN(second)) {
                                second = constants_1.zhStringToNumber(match[SECOND_GROUP]);
                            }
                            if (second >= 60)
                                return null;
                            result.end.assign("second", second);
                        }
                        hour = parseInt(match[HOUR_GROUP]);
                        if (isNaN(hour)) {
                            hour = constants_1.zhStringToNumber(match[HOUR_GROUP]);
                        }
                        if (match[MINUTE_GROUP]) {
                            if (match[MINUTE_GROUP] == "半") {
                                minute = 30;
                            }
                            else if (match[MINUTE_GROUP] == "正" || match[MINUTE_GROUP] == "整") {
                                minute = 0;
                            }
                            else {
                                minute = parseInt(match[MINUTE_GROUP]);
                                if (isNaN(minute)) {
                                    minute = constants_1.zhStringToNumber(match[MINUTE_GROUP]);
                                }
                            }
                        }
                        else if (hour > 100) {
                            minute = hour % 100;
                            hour = Math.floor(hour / 100);
                        }
                        if (minute >= 60) {
                            return null;
                        }
                        if (hour > 24) {
                            return null;
                        }
                        if (hour >= 12) {
                            meridiem = 1;
                        }
                        if (match[AM_PM_HOUR_GROUP]) {
                            if (hour > 12)
                                return null;
                            var ampm = match[AM_PM_HOUR_GROUP][0].toLowerCase();
                            if (ampm == "a") {
                                meridiem = 0;
                                if (hour == 12)
                                    hour = 0;
                            }
                            if (ampm == "p") {
                                meridiem = 1;
                                if (hour != 12)
                                    hour += 12;
                            }
                            if (!result.start.isCertain("meridiem")) {
                                if (meridiem == 0) {
                                    result.start.imply("meridiem", 0);
                                    if (result.start.get("hour") == 12) {
                                        result.start.assign("hour", 0);
                                    }
                                }
                                else {
                                    result.start.imply("meridiem", 1);
                                    if (result.start.get("hour") != 12) {
                                        result.start.assign("hour", result.start.get("hour") + 12);
                                    }
                                }
                            }
                        }
                        else if (match[ZH_AM_PM_HOUR_GROUP_1]) {
                            var zhAMPMString1 = match[ZH_AM_PM_HOUR_GROUP_1];
                            var zhAMPM1 = zhAMPMString1[0];
                            if (zhAMPM1 == "朝" || zhAMPM1 == "早") {
                                meridiem = 0;
                                if (hour == 12)
                                    hour = 0;
                            }
                            else if (zhAMPM1 == "晚") {
                                meridiem = 1;
                                if (hour != 12)
                                    hour += 12;
                            }
                        }
                        else if (match[ZH_AM_PM_HOUR_GROUP_2]) {
                            var zhAMPMString2 = match[ZH_AM_PM_HOUR_GROUP_2];
                            var zhAMPM2 = zhAMPMString2[0];
                            if (zhAMPM2 == "上" || zhAMPM2 == "朝" || zhAMPM2 == "早" || zhAMPM2 == "凌") {
                                meridiem = 0;
                                if (hour == 12)
                                    hour = 0;
                            }
                            else if (zhAMPM2 == "下" || zhAMPM2 == "晏" || zhAMPM2 == "晚") {
                                meridiem = 1;
                                if (hour != 12)
                                    hour += 12;
                            }
                        }
                        else if (match[ZH_AM_PM_HOUR_GROUP_3]) {
                            var zhAMPMString3 = match[ZH_AM_PM_HOUR_GROUP_3];
                            var zhAMPM3 = zhAMPMString3[0];
                            if (zhAMPM3 == "上" || zhAMPM3 == "朝" || zhAMPM3 == "早" || zhAMPM3 == "凌") {
                                meridiem = 0;
                                if (hour == 12)
                                    hour = 0;
                            }
                            else if (zhAMPM3 == "下" || zhAMPM3 == "晏" || zhAMPM3 == "晚") {
                                meridiem = 1;
                                if (hour != 12)
                                    hour += 12;
                            }
                        }
                        result.text = result.text + match[0];
                        result.end.assign("hour", hour);
                        result.end.assign("minute", minute);
                        if (meridiem >= 0) {
                            result.end.assign("meridiem", meridiem);
                        }
                        else {
                            var startAtPM = result.start.isCertain("meridiem") && result.start.get("meridiem") == 1;
                            if (startAtPM && result.start.get("hour") > hour) {
                                result.end.imply("meridiem", 0);
                            }
                            else if (hour > 12) {
                                result.end.imply("meridiem", 1);
                            }
                        }
                        if (result.end.date().getTime() < result.start.date().getTime()) {
                            result.end.imply("day", result.end.get("day") + 1);
                        }
                        return result;
                    };
                    return ZHHantTimeExpressionParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ZHHantTimeExpressionParser;
            }, { "../../../../common/parsers/AbstractParserWithWordBoundary": 8, "../constants": 152, "dayjs": 169 }], 159: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var dayjs_1 = __importDefault(require("dayjs"));
                var AbstractParserWithWordBoundary_1 = require("../../../../common/parsers/AbstractParserWithWordBoundary");
                var constants_1 = require("../constants");
                var PATTERN = new RegExp("(?:星期|禮拜|週)(?<weekday>" + Object.keys(constants_1.WEEKDAY_OFFSET).join("|") + ")");
                var ZHHantWeekdayParser = /** @class */ (function (_super) {
                    __extends(ZHHantWeekdayParser, _super);
                    function ZHHantWeekdayParser() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ZHHantWeekdayParser.prototype.innerPattern = function () {
                        return PATTERN;
                    };
                    ZHHantWeekdayParser.prototype.innerExtract = function (context, match) {
                        var result = context.createParsingResult(match.index, match[0]);
                        var dayOfWeek = match.groups.weekday;
                        var offset = constants_1.WEEKDAY_OFFSET[dayOfWeek];
                        if (offset === undefined)
                            return null;
                        var startMoment = dayjs_1.default(context.refDate);
                        var startMomentFixed = false;
                        var refOffset = startMoment.day();
                        if (Math.abs(offset - 7 - refOffset) < Math.abs(offset - refOffset)) {
                            startMoment = startMoment.day(offset - 7);
                        }
                        else if (Math.abs(offset + 7 - refOffset) < Math.abs(offset - refOffset)) {
                            startMoment = startMoment.day(offset + 7);
                        }
                        else {
                            startMoment = startMoment.day(offset);
                        }
                        result.start.assign("weekday", offset);
                        if (startMomentFixed) {
                            result.start.assign("day", startMoment.date());
                            result.start.assign("month", startMoment.month() + 1);
                            result.start.assign("year", startMoment.year());
                        }
                        else {
                            result.start.imply("day", startMoment.date());
                            result.start.imply("month", startMoment.month() + 1);
                            result.start.imply("year", startMoment.year());
                        }
                        return result;
                    };
                    return ZHHantWeekdayParser;
                }(AbstractParserWithWordBoundary_1.AbstractParserWithWordBoundaryChecking));
                exports.default = ZHHantWeekdayParser;
            }, { "../../../../common/parsers/AbstractParserWithWordBoundary": 8, "../constants": 152, "dayjs": 169 }], 160: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractMergeDateRangeRefiner_1 = __importDefault(require("../../../../common/refiners/AbstractMergeDateRangeRefiner"));
                var ZHHantMergeDateRangeRefiner = /** @class */ (function (_super) {
                    __extends(ZHHantMergeDateRangeRefiner, _super);
                    function ZHHantMergeDateRangeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ZHHantMergeDateRangeRefiner.prototype.patternBetween = function () {
                        return /^\s*(至|到|\-|\~|～|－|ー)\s*$/i;
                    };
                    return ZHHantMergeDateRangeRefiner;
                }(AbstractMergeDateRangeRefiner_1.default));
                exports.default = ZHHantMergeDateRangeRefiner;
            }, { "../../../../common/refiners/AbstractMergeDateRangeRefiner": 12 }], 161: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                var AbstractMergeDateTimeRefiner_1 = __importDefault(require("../../../../common/refiners/AbstractMergeDateTimeRefiner"));
                var ZHHantMergeDateTimeRefiner = /** @class */ (function (_super) {
                    __extends(ZHHantMergeDateTimeRefiner, _super);
                    function ZHHantMergeDateTimeRefiner() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ZHHantMergeDateTimeRefiner.prototype.patternBetween = function () {
                        return /^\s*$/i;
                    };
                    return ZHHantMergeDateTimeRefiner;
                }(AbstractMergeDateTimeRefiner_1.default));
                exports.default = ZHHantMergeDateTimeRefiner;
            }, { "../../../../common/refiners/AbstractMergeDateTimeRefiner": 13 }], 162: [function (require, module, exports) {
                "use strict";
                var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
                }) : (function (o, m, k, k2) {
                    if (k2 === undefined)
                        k2 = k;
                    o[k2] = m[k];
                }));
                var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
                    Object.defineProperty(o, "default", { enumerable: true, value: v });
                }) : function (o, v) {
                    o["default"] = v;
                });
                var __importStar = (this && this.__importStar) || function (mod) {
                    if (mod && mod.__esModule)
                        return mod;
                    var result = {};
                    if (mod != null)
                        for (var k in mod)
                            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                                __createBinding(result, mod, k);
                    __setModuleDefault(result, mod);
                    return result;
                };
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.createConfiguration = exports.createCasualConfiguration = exports.parseDate = exports.parse = exports.strict = exports.casual = exports.Weekday = exports.Meridiem = exports.ReferenceWithTimezone = exports.ParsingComponents = exports.ParsingResult = exports.Chrono = exports.hans = exports.hant = void 0;
                var configurations_1 = require("../../configurations");
                var chrono_1 = require("../../chrono");
                Object.defineProperty(exports, "Chrono", { enumerable: true, get: function () { return chrono_1.Chrono; } });
                var results_1 = require("../../results");
                Object.defineProperty(exports, "ParsingResult", { enumerable: true, get: function () { return results_1.ParsingResult; } });
                Object.defineProperty(exports, "ParsingComponents", { enumerable: true, get: function () { return results_1.ParsingComponents; } });
                Object.defineProperty(exports, "ReferenceWithTimezone", { enumerable: true, get: function () { return results_1.ReferenceWithTimezone; } });
                var types_1 = require("../../types");
                Object.defineProperty(exports, "Meridiem", { enumerable: true, get: function () { return types_1.Meridiem; } });
                Object.defineProperty(exports, "Weekday", { enumerable: true, get: function () { return types_1.Weekday; } });
                var ExtractTimezoneOffsetRefiner_1 = __importDefault(require("../../common/refiners/ExtractTimezoneOffsetRefiner"));
                var ZHHansDateParser_1 = __importDefault(require("./hans/parsers/ZHHansDateParser"));
                var ZHHansDeadlineFormatParser_1 = __importDefault(require("./hans/parsers/ZHHansDeadlineFormatParser"));
                var ZHHansRelationWeekdayParser_1 = __importDefault(require("./hans/parsers/ZHHansRelationWeekdayParser"));
                var ZHHansTimeExpressionParser_1 = __importDefault(require("./hans/parsers/ZHHansTimeExpressionParser"));
                var ZHHansWeekdayParser_1 = __importDefault(require("./hans/parsers/ZHHansWeekdayParser"));
                var ZHHantCasualDateParser_1 = __importDefault(require("./hant/parsers/ZHHantCasualDateParser"));
                var ZHHantDateParser_1 = __importDefault(require("./hant/parsers/ZHHantDateParser"));
                var ZHHantDeadlineFormatParser_1 = __importDefault(require("./hant/parsers/ZHHantDeadlineFormatParser"));
                var ZHHantRelationWeekdayParser_1 = __importDefault(require("./hant/parsers/ZHHantRelationWeekdayParser"));
                var ZHHantTimeExpressionParser_1 = __importDefault(require("./hant/parsers/ZHHantTimeExpressionParser"));
                var ZHHantWeekdayParser_1 = __importDefault(require("./hant/parsers/ZHHantWeekdayParser"));
                var ZHHantMergeDateRangeRefiner_1 = __importDefault(require("./hant/refiners/ZHHantMergeDateRangeRefiner"));
                var ZHHantMergeDateTimeRefiner_1 = __importDefault(require("./hant/refiners/ZHHantMergeDateTimeRefiner"));
                exports.hant = __importStar(require("./hant"));
                exports.hans = __importStar(require("./hans"));
                exports.casual = new chrono_1.Chrono(createCasualConfiguration());
                exports.strict = new chrono_1.Chrono(createConfiguration());
                function parse(text, ref, option) {
                    return exports.casual.parse(text, ref, option);
                }
                exports.parse = parse;
                function parseDate(text, ref, option) {
                    return exports.casual.parseDate(text, ref, option);
                }
                exports.parseDate = parseDate;
                function createCasualConfiguration() {
                    var option = createConfiguration();
                    option.parsers.unshift(new ZHHantCasualDateParser_1.default());
                    return option;
                }
                exports.createCasualConfiguration = createCasualConfiguration;
                function createConfiguration() {
                    var configuration = configurations_1.includeCommonConfiguration({
                        parsers: [
                            new ZHHantDateParser_1.default(),
                            new ZHHansDateParser_1.default(),
                            new ZHHantRelationWeekdayParser_1.default(),
                            new ZHHansRelationWeekdayParser_1.default(),
                            new ZHHantWeekdayParser_1.default(),
                            new ZHHansWeekdayParser_1.default(),
                            new ZHHantTimeExpressionParser_1.default(),
                            new ZHHansTimeExpressionParser_1.default(),
                            new ZHHantDeadlineFormatParser_1.default(),
                            new ZHHansDeadlineFormatParser_1.default(),
                        ],
                        refiners: [new ZHHantMergeDateRangeRefiner_1.default(), new ZHHantMergeDateTimeRefiner_1.default()],
                    });
                    configuration.refiners = configuration.refiners.filter(function (refiner) { return !(refiner instanceof ExtractTimezoneOffsetRefiner_1.default); });
                    return configuration;
                }
                exports.createConfiguration = createConfiguration;
            }, { "../../chrono": 4, "../../common/refiners/ExtractTimezoneOffsetRefiner": 15, "../../configurations": 20, "../../results": 163, "../../types": 165, "./hans": 143, "./hans/parsers/ZHHansDateParser": 145, "./hans/parsers/ZHHansDeadlineFormatParser": 146, "./hans/parsers/ZHHansRelationWeekdayParser": 147, "./hans/parsers/ZHHansTimeExpressionParser": 148, "./hans/parsers/ZHHansWeekdayParser": 149, "./hant": 153, "./hant/parsers/ZHHantCasualDateParser": 154, "./hant/parsers/ZHHantDateParser": 155, "./hant/parsers/ZHHantDeadlineFormatParser": 156, "./hant/parsers/ZHHantRelationWeekdayParser": 157, "./hant/parsers/ZHHantTimeExpressionParser": 158, "./hant/parsers/ZHHantWeekdayParser": 159, "./hant/refiners/ZHHantMergeDateRangeRefiner": 160, "./hant/refiners/ZHHantMergeDateTimeRefiner": 161 }], 163: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.ParsingResult = exports.ParsingComponents = exports.ReferenceWithTimezone = void 0;
                var quarterOfYear_1 = __importDefault(require("dayjs/plugin/quarterOfYear"));
                var dayjs_1 = __importDefault(require("dayjs"));
                var dayjs_2 = require("./utils/dayjs");
                var timezone_1 = require("./timezone");
                dayjs_1.default.extend(quarterOfYear_1.default);
                var ReferenceWithTimezone = /** @class */ (function () {
                    function ReferenceWithTimezone(input) {
                        var _a;
                        input = input !== null && input !== void 0 ? input : new Date();
                        if (input instanceof Date) {
                            this.instant = input;
                        }
                        else {
                            this.instant = (_a = input.instant) !== null && _a !== void 0 ? _a : new Date();
                            this.timezoneOffset = timezone_1.toTimezoneOffset(input.timezone, this.instant);
                        }
                    }
                    ReferenceWithTimezone.prototype.getDateWithAdjustedTimezone = function () {
                        return new Date(this.instant.getTime() + this.getSystemTimezoneAdjustmentMinute(this.instant) * 60000);
                    };
                    ReferenceWithTimezone.prototype.getSystemTimezoneAdjustmentMinute = function (date, overrideTimezoneOffset) {
                        var _a;
                        if (!date || date.getTime() < 0) {
                            date = new Date();
                        }
                        var currentTimezoneOffset = -date.getTimezoneOffset();
                        var targetTimezoneOffset = (_a = overrideTimezoneOffset !== null && overrideTimezoneOffset !== void 0 ? overrideTimezoneOffset : this.timezoneOffset) !== null && _a !== void 0 ? _a : currentTimezoneOffset;
                        return currentTimezoneOffset - targetTimezoneOffset;
                    };
                    return ReferenceWithTimezone;
                }());
                exports.ReferenceWithTimezone = ReferenceWithTimezone;
                var ParsingComponents = /** @class */ (function () {
                    function ParsingComponents(reference, knownComponents) {
                        this._tags = new Set();
                        this.reference = reference;
                        this.knownValues = {};
                        this.impliedValues = {};
                        if (knownComponents) {
                            for (var key in knownComponents) {
                                this.knownValues[key] = knownComponents[key];
                            }
                        }
                        var refDayJs = dayjs_1.default(reference.instant);
                        this.imply("day", refDayJs.date());
                        this.imply("month", refDayJs.month() + 1);
                        this.imply("year", refDayJs.year());
                        this.imply("hour", 12);
                        this.imply("minute", 0);
                        this.imply("second", 0);
                        this.imply("millisecond", 0);
                    }
                    ParsingComponents.prototype.get = function (component) {
                        if (component in this.knownValues) {
                            return this.knownValues[component];
                        }
                        if (component in this.impliedValues) {
                            return this.impliedValues[component];
                        }
                        return null;
                    };
                    ParsingComponents.prototype.isCertain = function (component) {
                        return component in this.knownValues;
                    };
                    ParsingComponents.prototype.getCertainComponents = function () {
                        return Object.keys(this.knownValues);
                    };
                    ParsingComponents.prototype.imply = function (component, value) {
                        if (component in this.knownValues) {
                            return this;
                        }
                        this.impliedValues[component] = value;
                        return this;
                    };
                    ParsingComponents.prototype.assign = function (component, value) {
                        this.knownValues[component] = value;
                        delete this.impliedValues[component];
                        return this;
                    };
                    ParsingComponents.prototype.delete = function (component) {
                        delete this.knownValues[component];
                        delete this.impliedValues[component];
                    };
                    ParsingComponents.prototype.clone = function () {
                        var component = new ParsingComponents(this.reference);
                        component.knownValues = {};
                        component.impliedValues = {};
                        for (var key in this.knownValues) {
                            component.knownValues[key] = this.knownValues[key];
                        }
                        for (var key in this.impliedValues) {
                            component.impliedValues[key] = this.impliedValues[key];
                        }
                        return component;
                    };
                    ParsingComponents.prototype.isOnlyDate = function () {
                        return !this.isCertain("hour") && !this.isCertain("minute") && !this.isCertain("second");
                    };
                    ParsingComponents.prototype.isOnlyTime = function () {
                        return (!this.isCertain("weekday") && !this.isCertain("day") && !this.isCertain("month") && !this.isCertain("year"));
                    };
                    ParsingComponents.prototype.isOnlyWeekdayComponent = function () {
                        return this.isCertain("weekday") && !this.isCertain("day") && !this.isCertain("month");
                    };
                    ParsingComponents.prototype.isDateWithUnknownYear = function () {
                        return this.isCertain("month") && !this.isCertain("year");
                    };
                    ParsingComponents.prototype.isValidDate = function () {
                        var date = this.dateWithoutTimezoneAdjustment();
                        if (date.getFullYear() !== this.get("year"))
                            return false;
                        if (date.getMonth() !== this.get("month") - 1)
                            return false;
                        if (date.getDate() !== this.get("day"))
                            return false;
                        if (this.get("hour") != null && date.getHours() != this.get("hour"))
                            return false;
                        if (this.get("minute") != null && date.getMinutes() != this.get("minute"))
                            return false;
                        return true;
                    };
                    ParsingComponents.prototype.toString = function () {
                        return "[ParsingComponents {\n            tags: ".concat(JSON.stringify(Array.from(this._tags).sort()), ", \n            knownValues: ").concat(JSON.stringify(this.knownValues), ", \n            impliedValues: ").concat(JSON.stringify(this.impliedValues), "}, \n            reference: ").concat(JSON.stringify(this.reference), "]");
                    };
                    ParsingComponents.prototype.dayjs = function () {
                        return dayjs_1.default(this.date());
                    };
                    ParsingComponents.prototype.date = function () {
                        var date = this.dateWithoutTimezoneAdjustment();
                        var timezoneAdjustment = this.reference.getSystemTimezoneAdjustmentMinute(date, this.get("timezoneOffset"));
                        return new Date(date.getTime() + timezoneAdjustment * 60000);
                    };
                    ParsingComponents.prototype.addTag = function (tag) {
                        this._tags.add(tag);
                        return this;
                    };
                    ParsingComponents.prototype.addTags = function (tags) {
                        for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
                            var tag = tags_1[_i];
                            this._tags.add(tag);
                        }
                        return this;
                    };
                    ParsingComponents.prototype.tags = function () {
                        return new Set(this._tags);
                    };
                    ParsingComponents.prototype.dateWithoutTimezoneAdjustment = function () {
                        var date = new Date(this.get("year"), this.get("month") - 1, this.get("day"), this.get("hour"), this.get("minute"), this.get("second"), this.get("millisecond"));
                        date.setFullYear(this.get("year"));
                        return date;
                    };
                    ParsingComponents.createRelativeFromReference = function (reference, fragments) {
                        var date = dayjs_1.default(reference.instant);
                        for (var key in fragments) {
                            date = date.add(fragments[key], key);
                        }
                        var components = new ParsingComponents(reference);
                        components.addTag("result/relativeDate");
                        if (fragments["hour"] || fragments["minute"] || fragments["second"]) {
                            components.addTag("result/relativeDateAndTime");
                            dayjs_2.assignSimilarTime(components, date);
                            dayjs_2.assignSimilarDate(components, date);
                            if (reference.timezoneOffset !== null) {
                                components.assign("timezoneOffset", -reference.instant.getTimezoneOffset());
                            }
                        }
                        else {
                            dayjs_2.implySimilarTime(components, date);
                            if (reference.timezoneOffset !== null) {
                                components.imply("timezoneOffset", -reference.instant.getTimezoneOffset());
                            }
                            if (fragments["d"]) {
                                components.assign("day", date.date());
                                components.assign("month", date.month() + 1);
                                components.assign("year", date.year());
                            }
                            else if (fragments["week"]) {
                                components.assign("day", date.date());
                                components.assign("month", date.month() + 1);
                                components.assign("year", date.year());
                                components.imply("weekday", date.day());
                            }
                            else {
                                components.imply("day", date.date());
                                if (fragments["month"]) {
                                    components.assign("month", date.month() + 1);
                                    components.assign("year", date.year());
                                }
                                else {
                                    components.imply("month", date.month() + 1);
                                    if (fragments["year"]) {
                                        components.assign("year", date.year());
                                    }
                                    else {
                                        components.imply("year", date.year());
                                    }
                                }
                            }
                        }
                        return components;
                    };
                    return ParsingComponents;
                }());
                exports.ParsingComponents = ParsingComponents;
                var ParsingResult = /** @class */ (function () {
                    function ParsingResult(reference, index, text, start, end) {
                        this.reference = reference;
                        this.refDate = reference.instant;
                        this.index = index;
                        this.text = text;
                        this.start = start || new ParsingComponents(reference);
                        this.end = end;
                    }
                    ParsingResult.prototype.clone = function () {
                        var result = new ParsingResult(this.reference, this.index, this.text);
                        result.start = this.start ? this.start.clone() : null;
                        result.end = this.end ? this.end.clone() : null;
                        return result;
                    };
                    ParsingResult.prototype.date = function () {
                        return this.start.date();
                    };
                    ParsingResult.prototype.addTag = function (tag) {
                        this.start.addTag(tag);
                        if (this.end) {
                            this.end.addTag(tag);
                        }
                        return this;
                    };
                    ParsingResult.prototype.addTags = function (tags) {
                        this.start.addTags(tags);
                        if (this.end) {
                            this.end.addTags(tags);
                        }
                        return this;
                    };
                    ParsingResult.prototype.tags = function () {
                        var combinedTags = new Set(this.start.tags());
                        if (this.end) {
                            for (var _i = 0, _c = this.end.tags(); _i < _c.length; _i++) {
                                var tag = _c[_i];
                                combinedTags.add(tag);
                            }
                        }
                        return combinedTags;
                    };
                    ParsingResult.prototype.toString = function () {
                        var tags = Array.from(this.tags()).sort();
                        return "[ParsingResult {index: ".concat(this.index, ", text: '").concat(this.text, "', tags: ").concat(JSON.stringify(tags), " ...}]");
                    };
                    return ParsingResult;
                }());
                exports.ParsingResult = ParsingResult;
            }, { "./timezone": 164, "./utils/dayjs": 166, "dayjs": 169, "dayjs/plugin/quarterOfYear": 170 }], 164: [function (require, module, exports) {
                "use strict";
                var __importDefault = (this && this.__importDefault) || function (mod) {
                    return (mod && mod.__esModule) ? mod : { "default": mod };
                };
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.toTimezoneOffset = exports.getLastWeekdayOfMonth = exports.getNthWeekdayOfMonth = exports.TIMEZONE_ABBR_MAP = void 0;
                var dayjs_1 = __importDefault(require("dayjs"));
                var types_1 = require("./types");
                exports.TIMEZONE_ABBR_MAP = {
                    ACDT: 630,
                    ACST: 570,
                    ADT: -180,
                    AEDT: 660,
                    AEST: 600,
                    AFT: 270,
                    AKDT: -480,
                    AKST: -540,
                    ALMT: 360,
                    AMST: -180,
                    AMT: -240,
                    ANAST: 720,
                    ANAT: 720,
                    AQTT: 300,
                    ART: -180,
                    AST: -240,
                    AWDT: 540,
                    AWST: 480,
                    AZOST: 0,
                    AZOT: -60,
                    AZST: 300,
                    AZT: 240,
                    BNT: 480,
                    BOT: -240,
                    BRST: -120,
                    BRT: -180,
                    BST: 60,
                    BTT: 360,
                    CAST: 480,
                    CAT: 120,
                    CCT: 390,
                    CDT: -300,
                    CEST: 120,
                    CET: {
                        timezoneOffsetDuringDst: 2 * 60,
                        timezoneOffsetNonDst: 60,
                        dstStart: function (year) { return getLastWeekdayOfMonth(year, types_1.Month.MARCH, types_1.Weekday.SUNDAY, 2); },
                        dstEnd: function (year) { return getLastWeekdayOfMonth(year, types_1.Month.OCTOBER, types_1.Weekday.SUNDAY, 3); },
                    },
                    CHADT: 825,
                    CHAST: 765,
                    CKT: -600,
                    CLST: -180,
                    CLT: -240,
                    COT: -300,
                    CST: -360,
                    CT: {
                        timezoneOffsetDuringDst: -5 * 60,
                        timezoneOffsetNonDst: -6 * 60,
                        dstStart: function (year) { return getNthWeekdayOfMonth(year, types_1.Month.MARCH, types_1.Weekday.SUNDAY, 2, 2); },
                        dstEnd: function (year) { return getNthWeekdayOfMonth(year, types_1.Month.NOVEMBER, types_1.Weekday.SUNDAY, 1, 2); },
                    },
                    CVT: -60,
                    CXT: 420,
                    ChST: 600,
                    DAVT: 420,
                    EASST: -300,
                    EAST: -360,
                    EAT: 180,
                    ECT: -300,
                    EDT: -240,
                    EEST: 180,
                    EET: 120,
                    EGST: 0,
                    EGT: -60,
                    EST: -300,
                    ET: {
                        timezoneOffsetDuringDst: -4 * 60,
                        timezoneOffsetNonDst: -5 * 60,
                        dstStart: function (year) { return getNthWeekdayOfMonth(year, types_1.Month.MARCH, types_1.Weekday.SUNDAY, 2, 2); },
                        dstEnd: function (year) { return getNthWeekdayOfMonth(year, types_1.Month.NOVEMBER, types_1.Weekday.SUNDAY, 1, 2); },
                    },
                    FJST: 780,
                    FJT: 720,
                    FKST: -180,
                    FKT: -240,
                    FNT: -120,
                    GALT: -360,
                    GAMT: -540,
                    GET: 240,
                    GFT: -180,
                    GILT: 720,
                    GMT: 0,
                    GST: 240,
                    GYT: -240,
                    HAA: -180,
                    HAC: -300,
                    HADT: -540,
                    HAE: -240,
                    HAP: -420,
                    HAR: -360,
                    HAST: -600,
                    HAT: -90,
                    HAY: -480,
                    HKT: 480,
                    HLV: -210,
                    HNA: -240,
                    HNC: -360,
                    HNE: -300,
                    HNP: -480,
                    HNR: -420,
                    HNT: -150,
                    HNY: -540,
                    HOVT: 420,
                    ICT: 420,
                    IDT: 180,
                    IOT: 360,
                    IRDT: 270,
                    IRKST: 540,
                    IRKT: 540,
                    IRST: 210,
                    IST: 330,
                    JST: 540,
                    KGT: 360,
                    KRAST: 480,
                    KRAT: 480,
                    KST: 540,
                    KUYT: 240,
                    LHDT: 660,
                    LHST: 630,
                    LINT: 840,
                    MAGST: 720,
                    MAGT: 720,
                    MART: -510,
                    MAWT: 300,
                    MDT: -360,
                    MESZ: 120,
                    MEZ: 60,
                    MHT: 720,
                    MMT: 390,
                    MSD: 240,
                    MSK: 180,
                    MST: -420,
                    MT: {
                        timezoneOffsetDuringDst: -6 * 60,
                        timezoneOffsetNonDst: -7 * 60,
                        dstStart: function (year) { return getNthWeekdayOfMonth(year, types_1.Month.MARCH, types_1.Weekday.SUNDAY, 2, 2); },
                        dstEnd: function (year) { return getNthWeekdayOfMonth(year, types_1.Month.NOVEMBER, types_1.Weekday.SUNDAY, 1, 2); },
                    },
                    MUT: 240,
                    MVT: 300,
                    MYT: 480,
                    NCT: 660,
                    NDT: -90,
                    NFT: 690,
                    NOVST: 420,
                    NOVT: 360,
                    NPT: 345,
                    NST: -150,
                    NUT: -660,
                    NZDT: 780,
                    NZST: 720,
                    OMSST: 420,
                    OMST: 420,
                    PDT: -420,
                    PET: -300,
                    PETST: 720,
                    PETT: 720,
                    PGT: 600,
                    PHOT: 780,
                    PHT: 480,
                    PKT: 300,
                    PMDT: -120,
                    PMST: -180,
                    PONT: 660,
                    PST: -480,
                    PT: {
                        timezoneOffsetDuringDst: -7 * 60,
                        timezoneOffsetNonDst: -8 * 60,
                        dstStart: function (year) { return getNthWeekdayOfMonth(year, types_1.Month.MARCH, types_1.Weekday.SUNDAY, 2, 2); },
                        dstEnd: function (year) { return getNthWeekdayOfMonth(year, types_1.Month.NOVEMBER, types_1.Weekday.SUNDAY, 1, 2); },
                    },
                    PWT: 540,
                    PYST: -180,
                    PYT: -240,
                    RET: 240,
                    SAMT: 240,
                    SAST: 120,
                    SBT: 660,
                    SCT: 240,
                    SGT: 480,
                    SRT: -180,
                    SST: -660,
                    TAHT: -600,
                    TFT: 300,
                    TJT: 300,
                    TKT: 780,
                    TLT: 540,
                    TMT: 300,
                    TVT: 720,
                    ULAT: 480,
                    UTC: 0,
                    UYST: -120,
                    UYT: -180,
                    UZT: 300,
                    VET: -210,
                    VLAST: 660,
                    VLAT: 660,
                    VUT: 660,
                    WAST: 120,
                    WAT: 60,
                    WEST: 60,
                    WESZ: 60,
                    WET: 0,
                    WEZ: 0,
                    WFT: 720,
                    WGST: -120,
                    WGT: -180,
                    WIB: 420,
                    WIT: 540,
                    WITA: 480,
                    WST: 780,
                    WT: 0,
                    YAKST: 600,
                    YAKT: 600,
                    YAPT: 600,
                    YEKST: 360,
                    YEKT: 360,
                };
                function getNthWeekdayOfMonth(year, month, weekday, n, hour) {
                    if (hour === void 0) { hour = 0; }
                    var dayOfMonth = 0;
                    var i = 0;
                    while (i < n) {
                        dayOfMonth++;
                        var date = new Date(year, month - 1, dayOfMonth);
                        if (date.getDay() === weekday)
                            i++;
                    }
                    return new Date(year, month - 1, dayOfMonth, hour);
                }
                exports.getNthWeekdayOfMonth = getNthWeekdayOfMonth;
                function getLastWeekdayOfMonth(year, month, weekday, hour) {
                    if (hour === void 0) { hour = 0; }
                    var oneIndexedWeekday = weekday === 0 ? 7 : weekday;
                    var date = new Date(year, month - 1 + 1, 1, 12);
                    var firstWeekdayNextMonth = date.getDay() === 0 ? 7 : date.getDay();
                    var dayDiff;
                    if (firstWeekdayNextMonth === oneIndexedWeekday)
                        dayDiff = 7;
                    else if (firstWeekdayNextMonth < oneIndexedWeekday)
                        dayDiff = 7 + firstWeekdayNextMonth - oneIndexedWeekday;
                    else
                        dayDiff = firstWeekdayNextMonth - oneIndexedWeekday;
                    date.setDate(date.getDate() - dayDiff);
                    return new Date(year, month - 1, date.getDate(), hour);
                }
                exports.getLastWeekdayOfMonth = getLastWeekdayOfMonth;
                function toTimezoneOffset(timezoneInput, date, timezoneOverrides) {
                    if (timezoneOverrides === void 0) { timezoneOverrides = {}; }
                    var _a;
                    if (timezoneInput == null) {
                        return null;
                    }
                    if (typeof timezoneInput === "number") {
                        return timezoneInput;
                    }
                    var matchedTimezone = (_a = timezoneOverrides[timezoneInput]) !== null && _a !== void 0 ? _a : exports.TIMEZONE_ABBR_MAP[timezoneInput];
                    if (matchedTimezone == null) {
                        return null;
                    }
                    if (typeof matchedTimezone == "number") {
                        return matchedTimezone;
                    }
                    if (date == null) {
                        return null;
                    }
                    if (dayjs_1.default(date).isAfter(matchedTimezone.dstStart(date.getFullYear())) &&
                        !dayjs_1.default(date).isAfter(matchedTimezone.dstEnd(date.getFullYear()))) {
                        return matchedTimezone.timezoneOffsetDuringDst;
                    }
                    return matchedTimezone.timezoneOffsetNonDst;
                }
                exports.toTimezoneOffset = toTimezoneOffset;
            }, { "./types": 165, "dayjs": 169 }], 165: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.Month = exports.Weekday = exports.Meridiem = void 0;
                var Meridiem;
                (function (Meridiem) {
                    Meridiem[Meridiem["AM"] = 0] = "AM";
                    Meridiem[Meridiem["PM"] = 1] = "PM";
                })(Meridiem = exports.Meridiem || (exports.Meridiem = {}));
                var Weekday;
                (function (Weekday) {
                    Weekday[Weekday["SUNDAY"] = 0] = "SUNDAY";
                    Weekday[Weekday["MONDAY"] = 1] = "MONDAY";
                    Weekday[Weekday["TUESDAY"] = 2] = "TUESDAY";
                    Weekday[Weekday["WEDNESDAY"] = 3] = "WEDNESDAY";
                    Weekday[Weekday["THURSDAY"] = 4] = "THURSDAY";
                    Weekday[Weekday["FRIDAY"] = 5] = "FRIDAY";
                    Weekday[Weekday["SATURDAY"] = 6] = "SATURDAY";
                })(Weekday = exports.Weekday || (exports.Weekday = {}));
                var Month;
                (function (Month) {
                    Month[Month["JANUARY"] = 1] = "JANUARY";
                    Month[Month["FEBRUARY"] = 2] = "FEBRUARY";
                    Month[Month["MARCH"] = 3] = "MARCH";
                    Month[Month["APRIL"] = 4] = "APRIL";
                    Month[Month["MAY"] = 5] = "MAY";
                    Month[Month["JUNE"] = 6] = "JUNE";
                    Month[Month["JULY"] = 7] = "JULY";
                    Month[Month["AUGUST"] = 8] = "AUGUST";
                    Month[Month["SEPTEMBER"] = 9] = "SEPTEMBER";
                    Month[Month["OCTOBER"] = 10] = "OCTOBER";
                    Month[Month["NOVEMBER"] = 11] = "NOVEMBER";
                    Month[Month["DECEMBER"] = 12] = "DECEMBER";
                })(Month = exports.Month || (exports.Month = {}));
            }, {}], 166: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.implySimilarTime = exports.implySimilarDate = exports.assignSimilarTime = exports.assignSimilarDate = exports.implyTheNextDay = exports.assignTheNextDay = void 0;
                var types_1 = require("../types");
                function assignTheNextDay(component, targetDayJs) {
                    targetDayJs = targetDayJs.add(1, "day");
                    assignSimilarDate(component, targetDayJs);
                    implySimilarTime(component, targetDayJs);
                }
                exports.assignTheNextDay = assignTheNextDay;
                function implyTheNextDay(component, targetDayJs) {
                    targetDayJs = targetDayJs.add(1, "day");
                    implySimilarDate(component, targetDayJs);
                    implySimilarTime(component, targetDayJs);
                }
                exports.implyTheNextDay = implyTheNextDay;
                function assignSimilarDate(component, targetDayJs) {
                    component.assign("day", targetDayJs.date());
                    component.assign("month", targetDayJs.month() + 1);
                    component.assign("year", targetDayJs.year());
                }
                exports.assignSimilarDate = assignSimilarDate;
                function assignSimilarTime(component, targetDayJs) {
                    component.assign("hour", targetDayJs.hour());
                    component.assign("minute", targetDayJs.minute());
                    component.assign("second", targetDayJs.second());
                    component.assign("millisecond", targetDayJs.millisecond());
                    if (component.get("hour") < 12) {
                        component.assign("meridiem", types_1.Meridiem.AM);
                    }
                    else {
                        component.assign("meridiem", types_1.Meridiem.PM);
                    }
                }
                exports.assignSimilarTime = assignSimilarTime;
                function implySimilarDate(component, targetDayJs) {
                    component.imply("day", targetDayJs.date());
                    component.imply("month", targetDayJs.month() + 1);
                    component.imply("year", targetDayJs.year());
                }
                exports.implySimilarDate = implySimilarDate;
                function implySimilarTime(component, targetDayJs) {
                    component.imply("hour", targetDayJs.hour());
                    component.imply("minute", targetDayJs.minute());
                    component.imply("second", targetDayJs.second());
                    component.imply("millisecond", targetDayJs.millisecond());
                }
                exports.implySimilarTime = implySimilarTime;
            }, { "../types": 165 }], 167: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.matchAnyPattern = exports.extractTerms = exports.repeatedTimeunitPattern = void 0;
                function repeatedTimeunitPattern(prefix, singleTimeunitPattern, connectorPattern) {
                    if (connectorPattern === void 0) { connectorPattern = "\\s{0,5},?\\s{0,5}"; }
                    var singleTimeunitPatternNoCapture = singleTimeunitPattern.replace(/\((?!\?)/g, "(?:");
                    return "".concat(prefix).concat(singleTimeunitPatternNoCapture, "(?:").concat(connectorPattern).concat(singleTimeunitPatternNoCapture, "){0,10}");
                }
                exports.repeatedTimeunitPattern = repeatedTimeunitPattern;
                function extractTerms(dictionary) {
                    var keys;
                    if (dictionary instanceof Array) {
                        keys = __spreadArray([], dictionary, true);
                    }
                    else if (dictionary instanceof Map) {
                        keys = Array.from(dictionary.keys());
                    }
                    else {
                        keys = Object.keys(dictionary);
                    }
                    return keys;
                }
                exports.extractTerms = extractTerms;
                function matchAnyPattern(dictionary) {
                    var joinedTerms = extractTerms(dictionary)
                        .sort(function (a, b) { return b.length - a.length; })
                        .join("|")
                        .replace(/\./g, "\\.");
                    return "(?:".concat(joinedTerms, ")");
                }
                exports.matchAnyPattern = matchAnyPattern;
            }, {}], 168: [function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                exports.addImpliedTimeUnits = exports.reverseTimeUnits = void 0;
                function reverseTimeUnits(timeUnits) {
                    var reversed = {};
                    for (var key in timeUnits) {
                        reversed[key] = -timeUnits[key];
                    }
                    return reversed;
                }
                exports.reverseTimeUnits = reverseTimeUnits;
                function addImpliedTimeUnits(components, timeUnits) {
                    var output = components.clone();
                    var date = components.dayjs();
                    for (var key in timeUnits) {
                        date = date.add(timeUnits[key], key);
                    }
                    if ("day" in timeUnits || "d" in timeUnits || "week" in timeUnits || "month" in timeUnits || "year" in timeUnits) {
                        output.imply("day", date.date());
                        output.imply("month", date.month() + 1);
                        output.imply("year", date.year());
                    }
                    if ("second" in timeUnits || "minute" in timeUnits || "hour" in timeUnits) {
                        output.imply("second", date.second());
                        output.imply("minute", date.minute());
                        output.imply("hour", date.hour());
                    }
                    return output;
                }
                exports.addImpliedTimeUnits = addImpliedTimeUnits;
            }, {}], 169: [function (require, module, exports) {
                !function (t, e) { "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs = e(); }(this, (function () {
                    "use strict";
                    var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function (t) { var e = ["th", "st", "nd", "rd"], n = t % 100; return "[" + t + (e[(n - 20) % 10] || e[n] || e[0]) + "]"; } }, m = function (t, e, n) { var r = String(t); return !r || r.length >= e ? t : "" + Array(e + 1 - r.length).join(n) + t; }, v = { s: m, z: function (t) { var e = -t.utcOffset(), n = Math.abs(e), r = Math.floor(n / 60), i = n % 60; return (e <= 0 ? "+" : "-") + m(r, 2, "0") + ":" + m(i, 2, "0"); }, m: function t(e, n) { if (e.date() < n.date())
                            return -t(n, e); var r = 12 * (n.year() - e.year()) + (n.month() - e.month()), i = e.clone().add(r, c), s = n - i < 0, u = e.clone().add(r + (s ? -1 : 1), c); return +(-(r + (n - i) / (s ? i - u : u - i)) || 0); }, a: function (t) { return t < 0 ? Math.ceil(t) || 0 : Math.floor(t); }, p: function (t) { return { M: c, y: h, w: o, d: a, D: d, h: u, m: s, s: i, ms: r, Q: f }[t] || String(t || "").toLowerCase().replace(/s$/, ""); }, u: function (t) { return void 0 === t; } }, g = "en", D = {};
                    D[g] = M;
                    var p = "$isDayjsObject", S = function (t) { return t instanceof _ || !(!t || !t[p]); }, w = function t(e, n, r) { var i; if (!e)
                        return g; if ("string" == typeof e) {
                        var s = e.toLowerCase();
                        D[s] && (i = s), n && (D[s] = n, i = s);
                        var u = e.split("-");
                        if (!i && u.length > 1)
                            return t(u[0]);
                    }
                    else {
                        var a = e.name;
                        D[a] = e, i = a;
                    } return !r && i && (g = i), i || !r && g; }, O = function (t, e) { if (S(t))
                        return t.clone(); var n = "object" == typeof e ? e : {}; return n.date = t, n.args = arguments, new _(n); }, b = v;
                    b.l = w, b.i = S, b.w = function (t, e) { return O(t, { locale: e.$L, utc: e.$u, x: e.$x, $offset: e.$offset }); };
                    var _ = function () { function M(t) { this.$L = w(t.locale, null, !0), this.parse(t), this.$x = this.$x || t.x || {}, this[p] = !0; } var m = M.prototype; return m.parse = function (t) { this.$d = function (t) { var e = t.date, n = t.utc; if (null === e)
                        return new Date(NaN); if (b.u(e))
                        return new Date; if (e instanceof Date)
                        return new Date(e); if ("string" == typeof e && !/Z$/i.test(e)) {
                        var r = e.match($);
                        if (r) {
                            var i = r[2] - 1 || 0, s = (r[7] || "0").substring(0, 3);
                            return n ? new Date(Date.UTC(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s)) : new Date(r[1], i, r[3] || 1, r[4] || 0, r[5] || 0, r[6] || 0, s);
                        }
                    } return new Date(e); }(t), this.init(); }, m.init = function () { var t = this.$d; this.$y = t.getFullYear(), this.$M = t.getMonth(), this.$D = t.getDate(), this.$W = t.getDay(), this.$H = t.getHours(), this.$m = t.getMinutes(), this.$s = t.getSeconds(), this.$ms = t.getMilliseconds(); }, m.$utils = function () { return b; }, m.isValid = function () { return !(this.$d.toString() === l); }, m.isSame = function (t, e) { var n = O(t); return this.startOf(e) <= n && n <= this.endOf(e); }, m.isAfter = function (t, e) { return O(t) < this.startOf(e); }, m.isBefore = function (t, e) { return this.endOf(e) < O(t); }, m.$g = function (t, e, n) { return b.u(t) ? this[e] : this.set(n, t); }, m.unix = function () { return Math.floor(this.valueOf() / 1e3); }, m.valueOf = function () { return this.$d.getTime(); }, m.startOf = function (t, e) { var n = this, r = !!b.u(e) || e, f = b.p(t), l = function (t, e) { var i = b.w(n.$u ? Date.UTC(n.$y, e, t) : new Date(n.$y, e, t), n); return r ? i : i.endOf(a); }, $ = function (t, e) { return b.w(n.toDate()[t].apply(n.toDate("s"), (r ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e)), n); }, y = this.$W, M = this.$M, m = this.$D, v = "set" + (this.$u ? "UTC" : ""); switch (f) {
                        case h: return r ? l(1, 0) : l(31, 11);
                        case c: return r ? l(1, M) : l(0, M + 1);
                        case o:
                            var g = this.$locale().weekStart || 0, D = (y < g ? y + 7 : y) - g;
                            return l(r ? m - D : m + (6 - D), M);
                        case a:
                        case d: return $(v + "Hours", 0);
                        case u: return $(v + "Minutes", 1);
                        case s: return $(v + "Seconds", 2);
                        case i: return $(v + "Milliseconds", 3);
                        default: return this.clone();
                    } }, m.endOf = function (t) { return this.startOf(t, !1); }, m.$set = function (t, e) { var n, o = b.p(t), f = "set" + (this.$u ? "UTC" : ""), l = (n = {}, n[a] = f + "Date", n[d] = f + "Date", n[c] = f + "Month", n[h] = f + "FullYear", n[u] = f + "Hours", n[s] = f + "Minutes", n[i] = f + "Seconds", n[r] = f + "Milliseconds", n)[o], $ = o === a ? this.$D + (e - this.$W) : e; if (o === c || o === h) {
                        var y = this.clone().set(d, 1);
                        y.$d[l]($), y.init(), this.$d = y.set(d, Math.min(this.$D, y.daysInMonth())).$d;
                    }
                    else
                        l && this.$d[l]($); return this.init(), this; }, m.set = function (t, e) { return this.clone().$set(t, e); }, m.get = function (t) { return this[b.p(t)](); }, m.add = function (r, f) { var d, l = this; r = Number(r); var $ = b.p(f), y = function (t) { var e = O(l); return b.w(e.date(e.date() + Math.round(t * r)), l); }; if ($ === c)
                        return this.set(c, this.$M + r); if ($ === h)
                        return this.set(h, this.$y + r); if ($ === a)
                        return y(1); if ($ === o)
                        return y(7); var M = (d = {}, d[s] = e, d[u] = n, d[i] = t, d)[$] || 1, m = this.$d.getTime() + r * M; return b.w(m, this); }, m.subtract = function (t, e) { return this.add(-1 * t, e); }, m.format = function (t) { var e = this, n = this.$locale(); if (!this.isValid())
                        return n.invalidDate || l; var r = t || "YYYY-MM-DDTHH:mm:ssZ", i = b.z(this), s = this.$H, u = this.$m, a = this.$M, o = n.weekdays, c = n.months, f = n.meridiem, h = function (t, n, i, s) { return t && (t[n] || t(e, r)) || i[n].slice(0, s); }, d = function (t) { return b.s(s % 12 || 12, t, "0"); }, $ = f || function (t, e, n) { var r = t < 12 ? "AM" : "PM"; return n ? r.toLowerCase() : r; }; return r.replace(y, (function (t, r) { return r || function (t) { switch (t) {
                        case "YY": return String(e.$y).slice(-2);
                        case "YYYY": return b.s(e.$y, 4, "0");
                        case "M": return a + 1;
                        case "MM": return b.s(a + 1, 2, "0");
                        case "MMM": return h(n.monthsShort, a, c, 3);
                        case "MMMM": return h(c, a);
                        case "D": return e.$D;
                        case "DD": return b.s(e.$D, 2, "0");
                        case "d": return String(e.$W);
                        case "dd": return h(n.weekdaysMin, e.$W, o, 2);
                        case "ddd": return h(n.weekdaysShort, e.$W, o, 3);
                        case "dddd": return o[e.$W];
                        case "H": return String(s);
                        case "HH": return b.s(s, 2, "0");
                        case "h": return d(1);
                        case "hh": return d(2);
                        case "a": return $(s, u, !0);
                        case "A": return $(s, u, !1);
                        case "m": return String(u);
                        case "mm": return b.s(u, 2, "0");
                        case "s": return String(e.$s);
                        case "ss": return b.s(e.$s, 2, "0");
                        case "SSS": return b.s(e.$ms, 3, "0");
                        case "Z": return i;
                    } return null; }(t) || i.replace(":", ""); })); }, m.utcOffset = function () { return 15 * -Math.round(this.$d.getTimezoneOffset() / 15); }, m.diff = function (r, d, l) { var $, y = this, M = b.p(d), m = O(r), v = (m.utcOffset() - this.utcOffset()) * e, g = this - m, D = function () { return b.m(y, m); }; switch (M) {
                        case h:
                            $ = D() / 12;
                            break;
                        case c:
                            $ = D();
                            break;
                        case f:
                            $ = D() / 3;
                            break;
                        case o:
                            $ = (g - v) / 6048e5;
                            break;
                        case a:
                            $ = (g - v) / 864e5;
                            break;
                        case u:
                            $ = g / n;
                            break;
                        case s:
                            $ = g / e;
                            break;
                        case i:
                            $ = g / t;
                            break;
                        default: $ = g;
                    } return l ? $ : b.a($); }, m.daysInMonth = function () { return this.endOf(c).$D; }, m.$locale = function () { return D[this.$L]; }, m.locale = function (t, e) { if (!t)
                        return this.$L; var n = this.clone(), r = w(t, e, !0); return r && (n.$L = r), n; }, m.clone = function () { return b.w(this.$d, this); }, m.toDate = function () { return new Date(this.valueOf()); }, m.toJSON = function () { return this.isValid() ? this.toISOString() : null; }, m.toISOString = function () { return this.$d.toISOString(); }, m.toString = function () { return this.$d.toUTCString(); }, M; }(), k = _.prototype;
                    return O.prototype = k, [["$ms", r], ["$s", i], ["$m", s], ["$H", u], ["$W", a], ["$M", c], ["$y", h], ["$D", d]].forEach((function (t) { k[t[1]] = function (e) { return this.$g(e, t[0], t[1]); }; })), O.extend = function (t, e) { return t.$i || (t(e, _, O), t.$i = !0), O; }, O.locale = w, O.isDayjs = S, O.unix = function (t) { return O(1e3 * t); }, O.en = D[g], O.Ls = D, O.p = {}, O;
                }));
            }, {}], 170: [function (require, module, exports) {
                !function (t, n) { "object" == typeof exports && "undefined" != typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define(n) : (t = "undefined" != typeof globalThis ? globalThis : t || self).dayjs_plugin_quarterOfYear = n(); }(this, (function () {
                    "use strict";
                    var t = "month", n = "quarter";
                    return function (e, i) { var r = i.prototype; r.quarter = function (t) { return this.$utils().u(t) ? Math.ceil((this.month() + 1) / 3) : this.month(this.month() % 3 + 3 * (t - 1)); }; var s = r.add; r.add = function (e, i) { return e = Number(e), this.$utils().p(i) === n ? this.add(3 * e, t) : s.bind(this)(e, i); }; var u = r.startOf; r.startOf = function (e, i) { var r = this.$utils(), s = !!r.u(i) || i; if (r.p(e) === n) {
                        var o = this.quarter() - 1;
                        return s ? this.month(3 * o).startOf(t).startOf("day") : this.month(3 * o + 2).endOf(t).endOf("day");
                    } return u.bind(this)(e, i); }; };
                }));
            }, {}] }, {}, [1])(1);
});
