class Calendar {
    //初始化
    constructor(node) {
        this.calendarMain = node;            //传递实例
        this.calendarFound = false;         //日历未创建
        this.display = false;               //日历未显示
        this.date = new Date();
        this.calendarDate = {};
    }

    //创建节点
    creatElement(tag) {
        return document.createElement(tag);
    }

    //选择节点
    queryElement(selector, boolean) {
        return boolean ? document.querySelector(selector) : document.querySelectorAll(selector);
    }

    //隐藏元素
    hide(elm) {
        elm.style.display = 'none';
    }

    //显示元素
    show(elm) {
        elm.style.display = '';
    }

    start() {

        var cthis = this;//cthis指向Calendar

        //绘制chooseDate
        var chooseDate = this.creatElement('div');
        chooseDate.className = 'chooseDate';
        var input = this.creatElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', '点击选择时间');
        var iconRili = this.creatElement('i');
        iconRili.className = 'iconfont icon-rili';

        //拼接chooseDate
        chooseDate.appendChild(input);
        chooseDate.appendChild(iconRili);
        this.calendarMain.appendChild(chooseDate);

        //input绑定点击事件
        this.queryElement('.chooseDate>input', true).addEventListener('click', function () {
            if (!cthis.calendarFound && !cthis.display) {                       //日历未创建未显示
                cthis.create();                                                 //创建日历并显示
                cthis.calendarFound = true;
                cthis.display = true;
            } else if (cthis.display) {                                           //日历已创建已显示
                cthis.hide(cthis.queryElement('.calendar', true));            //隐藏日历
                cthis.display = false;                                         //修改初始值为未显示
            } else if (!cthis.display) {                                          //日历已创建未显示
                cthis.show(cthis.queryElement('.calendar', true));             //显示日历
                cthis.display = true;                                           //修改初始值为已显示
            }
        })
    }

    //创建并绘制日历
    create() {
        this.calendarFound = true;                   //修改初始值为已创建
        this.display = true;                         //修改初始值为已显示

        //绘制calecdar
        var calendar = this.creatElement('div');
        calendar.className = 'calendar clear';
        var calendarShow = this.creatElement('div');
        calendarShow.className = 'c-show';                   //日历左边c-show
        var calendarBox = this.creatElement('div');
        calendarBox.className = 'c-box';                     //日历右边c-box

        //拼接calendar
        calendar.appendChild(calendarShow);
        calendar.appendChild(calendarBox);
        this.calendarMain.appendChild(calendar);

        //获取当前时间保存在this.calendarDate对象里
        var weeks = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        this.calendarDate.year = this.date.getFullYear();        //年
        this.calendarDate.month = months[this.date.getMonth()];  //月
        this.calendarDate.day = this.date.getDate();             //日
        this.calendarDate.week = weeks[this.date.getDay()];      //周几

        //获取当月天数并展示主体
        this.calendarDate.Alldays = this.days(this.calendarDate.year, this.calendarDate.month);
        var calendarDate = this.calendarDate;
        this.initialCalendarShow(calendarDate, calendarShow, calendarBox);
        this.initialCalendarBox(calendarDate, calendarBox, calendarShow);
    }
    //6.获取当月天数

    days(year, month) {
        var days = 30;
        switch (month) {
            case 'Jan':
            case 'Mar':
            case 'May':
            case 'Jul':
            case 'Aug':
            case 'Oct':
            case 'Dec':
                days = 31;
                break;
            case 'Feb':
                if (year % 4 === 0 && year % 100 !== 0) {
                    days = 29;
                } else if (year % 400 === 0) {
                    days = 29;
                } else {
                    days = 28;
                }
                break;
        }
        return days;
    }

    //初始化calendarShow
    initialCalendarShow(date, calendarShow, calendarBox) {
        var cthis = this;

        //绘制calendarShow
        calendarShow.innerHTML = '';

        var showYear = this.creatElement('a');
        showYear.className = 'year';
        showYear.innerHTML = date.year;
        var showWeek = this.creatElement('a');
        showWeek.className = 'week';
        showWeek.innerHTML = date.week + ',';
        var showDay = this.creatElement('a');
        showDay.className = 'day';
        showDay.innerHTML = date.month + ' ' + date.day;

        //拼接calendarShow
        calendarShow.appendChild(showYear);
        calendarShow.appendChild(showWeek);
        calendarShow.appendChild(showDay);

        //选年选月按钮切换
        showYear.addEventListener('click', function () {
            cthis.hide(showWeek);                    //隐藏显示的日期 
            cthis.hide(showDay);
            // 点击年份之后，显示'Choose Month'和年份列表
            if (showYear.innerHTML !== 'Choose Month') {
                showYear.innerHTML = 'Choose Month';
                if (cthis.queryElement('.monthList', true)) {
                    cthis.hide(cthis.queryElement('.monthList', true));
                }
                cthis.chooseYear(date, calendarShow, calendarBox);
            } else {
                // 再次点击时，切换为显示'Choose Year'，并显示月份列表
                showYear.innerHTML = 'Choose Year';
                if (cthis.queryElement('.yearList', true)) {
                    cthis.hide(cthis.queryElement('.yearList', true));
                }
                cthis.chooseMonth(date, calendarShow, calendarBox);
            }
        })
    }

    //yearList
    chooseYear(date, calendarShow, calendarBox) {
        var cthis = this;
        date.year = parseInt(date.year);
        if (!this.queryElement('.yearList', true)) {
            var yearList = cthis.creatElement('div');
            yearList.className = 'yearList';
            // 每页显示9个年份item
            // 当前年份的上一年显示成上剪头
            // 当前年份+9年显示成下箭头
            // 其他年份渲染成a标签显示
            for (var i = date.year - 1; i < date.year + 10; i++) {
                if (i === date.year - 1) {
                    var iconfontShang = cthis.creatElement('a');
                    iconfontShang.className = 'iconfont';
                    var iconShang = cthis.creatElement('i');
                    iconShang.className = 'iconfont icon-shang';
                    yearList.appendChild(iconfontShang);
                    iconfontShang.appendChild(iconShang);
                } else if (i === date.year + 9) {
                    var iconfontXia = cthis.creatElement('a');
                    iconfontXia.className = 'iconfont';
                    var iconXia = cthis.creatElement('i');
                    iconXia.className = 'iconfont icon-xia';
                    yearList.appendChild(iconfontXia);
                    iconfontXia.appendChild(iconXia);
                } else {
                    var yearItem = cthis.creatElement('a');
                    yearItem.className = 'year-item';
                    yearItem.innerHTML = i;
                    yearList.appendChild(yearItem);
                    yearItem.addEventListener('click', function () {
                        date.year = this.innerHTML;
                        // 同时渲染右侧title的年份
                        cthis.initialCalendarBox(date, calendarBox, calendarShow, 'animate');
                    })
                }
            }
            // 拼接年份列表
            calendarShow.appendChild(yearList);


            //向下滚动
            // 将每一个当前显示的年份+9，就是下一个年份列表
            iconfontXia.addEventListener('click', function () {
                var nextYearList = cthis.queryElement('.year-item');
                for (var i = 0; i < nextYearList.length; i++) {
                    nextYearList[i].innerHTML = parseInt(nextYearList[i].innerHTML) + 9;
                }
            })

            //向上滚动
            iconfontShang.addEventListener('click', function () {
                var lastYearList = cthis.queryElement('.year-item');
                for (var i = 0; i < lastYearList.length; i++) {
                    lastYearList[i].innerHTML = parseInt(lastYearList[i].innerHTML) - 9;
                }
            })

        } else {
            this.show(this.queryElement('.yearList', true));
        }
    }

    //monthList
    chooseMonth(date, calendarShow, calendarBox) {
        var cthis = this;
        if (!this.queryElement('.monthList', true)) {
            var monthList = cthis.creatElement('div');
            monthList.className = 'monthList';
            // 将月份渲染出来
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            for (var i = 0; i < months.length; i++) {
                var monthItem = cthis.creatElement('a');
                monthItem.className = 'month-item';
                monthItem.innerHTML = months[i];
                monthList.appendChild(monthItem)
            }
            calendarShow.appendChild(monthList);
        } else {
            this.show(this.queryElement('.monthList', true));
        }
        // 给月份列表中每个月份添加点击事件
        // 修改显示日期的月份，渲染右侧
        var monthItems = this.queryElement('.month-item');
        for (var i = 0; i < monthItems.length; i++) {
            monthItems[i].addEventListener('click', function () {
                date.month = this.innerHTML;
                cthis.initialCalendarBox(date, calendarBox, calendarShow, 'animate');
            })
        }
    }

    //初始化calendarBox
    initialCalendarBox(date, calendarBox, calendarShow, animate) {
        var cthis = this;

        //绘制calendarBox
        calendarBox.innerHTML = '';

        var control = this.creatElement('div');
        control.className = 'c-year clear';
        var iconZuo = this.creatElement('i');
        iconZuo.className = 'iconfont icon-zuo';
        iconZuo.innerHTML = '<';
        var currentYear = this.creatElement('a');
        currentYear.className = 'years';
        currentYear.innerHTML = date.month + ' ' + date.year;
        var iconGengDuo = this.creatElement('i');
        iconGengDuo.className = 'iconfont icon-gengduo';
        iconGengDuo.innerHTML = '>';

        //拼接calendarBox
        calendarBox.appendChild(control);
        control.appendChild(iconZuo);
        control.appendChild(currentYear);
        control.appendChild(iconGengDuo);

        //显示日历数字部分
        this.dateTable(calendarBox, date, calendarShow, animate);

        //绘制控制按钮
        var controlButton = this.creatElement('div');
        controlButton.className = 'c-button';
        var deterMine = this.creatElement('a');
        deterMine.className = 'go-determine';
        deterMine.innerHTML = 'OK';
        var today = this.creatElement('a');
        today.className = 'go-today';
        today.innerHTML = 'Today';

        //拼接控制按钮
        calendarBox.appendChild(controlButton);
        controlButton.appendChild(deterMine);
        controlButton.appendChild(today);

        //today绑定点击事件
        today.addEventListener('click', function () {
            var now = new Date();
            var weeks = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            date.year = now.getFullYear();
            date.month = months[now.getMonth()];
            date.day = now.getDate();
            date.week = weeks[now.getDay()];
            date.Alldays = cthis.days(date.year, date.month);
            cthis.initialCalendarBox(date, calendarBox, calendarShow, 'animate');
            cthis.initialCalendarShow(date, calendarShow, calendarBox);
        })

        //ok绑定点击事件
        deterMine.addEventListener('click', function () {
            cthis.hide(cthis.queryElement('.calendar', true));
            cthis.display = false;
            cthis.queryElement('.chooseDate>input', true).value = date.day + ' ' + date.month + ' ' + date.year;
            cthis.initialCalendarShow(date, calendarShow, calendarBox);
        })

        //向左滚动
        this.queryElement('.icon-zuo', true).addEventListener('click', function () {
            var weeks = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            // 2-12月，仅月份减1再重新获取当月天数即可
            if (date.month !== 'Jan') {
                var currentIdx = months.indexOf(date.month);
                date.month = months[currentIdx - 1];
                date.Alldays = cthis.days(date.year, date.month);
            } else {
                // 如果当前已经是1月，则年份减1 ，月份显示为12月
                date.year -= 1;
                date.month = months[11];
            }
            date.day = 1;
            var currentDate = new Date(date.year + '/' + date.month + '/' + date.day);
            date.week = weeks[currentDate.getDay()];
            cthis.initialCalendarBox(date, calendarBox, calendarShow);
            cthis.initialCalendarShow(date, calendarShow, calendarBox);
        })

        //向右滚动
        this.queryElement('.icon-gengduo', true).addEventListener('click', function () {
            var weeks = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            // 1-11月，月份加1并获取天数即可
            if (date.month !== 'Dec') {
                var currentIdx = months.indexOf(date.month);
                date.month = months[currentIdx + 1];
                date.Alldays = cthis.days(date.year, date.month);
            } else {
                // 12时，再下一个月就是下一年了，因此年份加1，显示一月
                date.year += 1;
                date.month = months[0];
            }
            date.day = 1
            var currentDate = new Date(date.year + '/' + date.month + '/' + date.day);
            date.week = weeks[currentDate.getDay()];
            cthis.initialCalendarBox(date, calendarBox, calendarShow);
            cthis.initialCalendarShow(date, calendarShow, calendarBox);
        })
    }

    //显示日历数字部分
    dateTable(calendarBox, date, calendarShow, animate) {
        var cthis = this;

        //绘制date-box
        var table = this.creatElement('table');
        table.className = 'date-box';
        var thead = this.creatElement('thead');
        var theadTr = this.creatElement('tr');
        var header = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        header.forEach(function (val) {
            var th = cthis.creatElement('th');
            th.innerHTML = val;
            theadTr.appendChild(th);
        })

        //拼接date-box
        table.appendChild(thead);
        thead.appendChild(theadTr);
        table.className == 'animate' ? '' : 'animate';

        //得到每月第一天周几
        var tbody = this.creatElement('tbody');
        var firstDay = new Date(date.year + '/' + date.month + '/' + 1).getDay();

        //计算出一个月中的每个周日
        //i表示本月table第几天，date.Alldays+firstDay-1表示循环次数，需要加上table中空缺的前几天
        for (var i = 0; i < date.Alldays + firstDay; i++) {
            // 当是table的第1、7、14、21、28天，也就是table周日的位置，新建一行
            if (i === 0 || i % 7 === 0) {
                var tbodyTr = this.creatElement('tr');
            }
            // 非周日的，新建td
            var td = this.creatElement('td');
            // 只有当i循环到等于本月第一天的时候，才开始真正的本月table渲染
            if (i >= firstDay) {
                var a = this.creatElement('a');
                var currentDay = i - firstDay + 1;       //当前是本月几号
                a.innerHTML = currentDay;
                // 当循环的到当前时间刚好是获取的今天时
                if (date.day === currentDay) {
                    a.className = 'active';
                }
                a.addEventListener('click', function () {
                    var weeks = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
                    date.day = parseInt(this.innerHTML);
                    var currentDate = new Date(date.year + '/' + date.month + '/' + date.day);
                    date.week = weeks[currentDate.getDay()];
                    cthis.initialCalendarBox(date, calendarBox, calendarShow);
                    cthis.initialCalendarShow(date, calendarShow, calendarBox);
                })
                td.appendChild(a);
            }
            tbodyTr.appendChild(td)
            if (i === 0 || i % 7 === 0) {
                tbody.appendChild(tbodyTr);
            }
        }
        table.appendChild(tbody);
        calendarBox.appendChild(table);
    }
}

