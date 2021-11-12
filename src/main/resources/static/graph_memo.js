/****************************************
/* 定数
/***************************************/
// １日をミリ秒で表した値（86,400,000ms）
var ONE_DAY_MS = 864e5;
// 年月表示領域の縦幅(px)
var MONTH_AREA_HEIGHT_PX = 40;
// 日付表示流域の縦幅(px)
var DAY_AREA_HEIGHT_PX = 30;
// 生理日表示領域の縦幅(px)
var MENS_AREA_HEIGHT_PX = 16;
// SEX日表示領域の縦幅(px)
var SEX_AREA_HEIGHT_PX = 16;
// 腹痛日表示領域の縦幅(px)
var PAINS_AREA_HEIGHT_PX = 16;
// 不正出血日表示領域の縦幅(px)
var BLOOD_AREA_HEIGHT_PX = 16;
// おりもの日表示領域の縦幅(px)
var ORIMONO_AREA_HEIGHT_PX = 16;
// 周期表示領域の縦幅(px)
var PERIOD_AREA_HEIGHT_PX = 20;
// 各表示領域間の余白(px)
var AREAS_MARGIN_PX = 5;
// グラフの高さ. 横長≒画面の向き横
var GRAPH_HEIGHT_PX = Number($("#graph-section").attr("graph-high"));
// グラフヘッドの高さ. 横長≒画面の向き横
var GRAPH_HEAD_HEIGHT_PX = 98;
// グラフ体温の横幅
var GRAPH_TEMP_WIDTH_PX = 60;
// １画面に表示する日数
var DISPLAY_DAYS = window.innerWidth < 1920 ? 53 : 73;

var isIpadDesktopMode = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
var agent = window.navigator.userAgent.toLowerCase();
if (((agent.indexOf("chrome") !== -1) && (agent.indexOf("edge") === -1) && (agent.indexOf("opr") === -1)) || (agent.indexOf("Mac") > -1 && !isIpadDesktopMode)) {
    // ブラウザズーム率の取得
    var zoom = Math.round(((window.outerWidth) / window.innerWidth) * 100) / 100;

    if (screen.width <= 1280 || (screen.width < screen.height)) {
        DISPLAY_DAYS = 53 - Math.floor((1920 - window.innerWidth) / 150);

        if (zoom <= 0.9) {
            DISPLAY_DAYS = DISPLAY_DAYS - Math.round(zoom * 5);
        }
    }

    // 拡大したら表示日数補正
    if (zoom >= 1.1) {
        DISPLAY_DAYS = DISPLAY_DAYS + Math.round(zoom * 10);
    }


    DISPLAY_DAYS = Math.round(DISPLAY_DAYS / zoom);
}

/****************************************
/* 表示のたびに変わる項目
/***************************************/

// 現在日時(ユーザーのタイムゾーンで作成)
var NOW = new Date();
// 現在日(年月日のみ)
var TODAY = NOW.getUTC12am();
// 現在日のUNIX時間
var TODAY_UNIX = TODAY.getTime();
// 四十日後のUNIX時間
var Future40_UNIX = new Date(getDateStr(40)).getUTC12am().getTime();
// 一年前のUNIX時間
var Past365_Unix = new Date(oneYearAgo()).getUTC12am().getTime();
// 移動下限日数
var MOST_PAST_DAYS = Number($("#graph-section").attr("past"));
// 移動上限日数
var MOST_FUTURE_DAYS = Number($("#graph-section").attr("future"));
// 移動下限（過去日）
var MOST_PAST_DATE = new Date(TODAY_UNIX).addDate(-MOST_PAST_DAYS);
// 移動上限（未来日）
var MOST_FUTURE_DATE = new Date(TODAY_UNIX + MOST_FUTURE_DAYS * ONE_DAY_MS);
// 表示される最過去日
var MOST_PAST_DISPLAY_DATE = new Date(MOST_PAST_DATE).addDate(-((DISPLAY_DAYS - 1) / 2));
// 表示される最未来日
var MOST_FUTURE_DISPLAY_DATE = new Date(MOST_FUTURE_DATE).addDate((DISPLAY_DAYS - 1) / 2);

// X軸の最大値
var X_MAX = MOST_FUTURE_DISPLAY_DATE.getTime() + ONE_DAY_MS / 2;
// X軸の最小値
var X_MIN = MOST_PAST_DISPLAY_DATE.getTime() - ONE_DAY_MS / 2;

// 最低体温
var MIN_TEMP = Number($("#graph-section").attr("min-temp") || 35.5);
// 最高体温
var MAX_TEMP = Number($("#graph-section").attr("max-temp") || 38.5);
// 最低体温(ZoomIn)
var MIN_TEMP_ZOOMIN = Number(36);
// 最高体温(ZoomIn)
var MAX_TEMP_ZOOMIN = Number(37.05);

// 色付き線を引く温度
var HIGHLIGHTED_TEMP = Number($("#graph-section").attr("highlighted-temp") || 0);
// 1℃の幅(px)
var PX_PER_CELSIUS = (GRAPH_HEIGHT_PX - (MENS_AREA_HEIGHT_PX + SEX_AREA_HEIGHT_PX + PAINS_AREA_HEIGHT_PX + BLOOD_AREA_HEIGHT_PX + ORIMONO_AREA_HEIGHT_PX + PERIOD_AREA_HEIGHT_PX + (AREAS_MARGIN_PX * 7))) / (MAX_TEMP - MIN_TEMP);
// 1℃の幅(px)(ZoomIn)
var PX_PER_CELSIUS_ZOOMIN = (GRAPH_HEIGHT_PX - (MENS_AREA_HEIGHT_PX + SEX_AREA_HEIGHT_PX + PAINS_AREA_HEIGHT_PX + BLOOD_AREA_HEIGHT_PX + ORIMONO_AREA_HEIGHT_PX + PERIOD_AREA_HEIGHT_PX + (AREAS_MARGIN_PX * 7))) / (MAX_TEMP_ZOOMIN - MIN_TEMP_ZOOMIN);
// pxから℃への変換
var MENS_AREA_HEIGHT_C = MENS_AREA_HEIGHT_PX / PX_PER_CELSIUS;
var SEX_AREA_HEIGHT_C = SEX_AREA_HEIGHT_PX / PX_PER_CELSIUS;
var PAINS_AREA_HEIGHT_C = PAINS_AREA_HEIGHT_PX / PX_PER_CELSIUS;
var BLOOD_AREA_HEIGHT_C = BLOOD_AREA_HEIGHT_PX / PX_PER_CELSIUS;
var ORIMONO_AREA_HEIGHT_C = ORIMONO_AREA_HEIGHT_PX / PX_PER_CELSIUS;
var AREAS_MARGIN_C = AREAS_MARGIN_PX / PX_PER_CELSIUS;
var PERIOD_AREA_HEIGHT_C = PERIOD_AREA_HEIGHT_PX / PX_PER_CELSIUS;
// pxから℃への変換(ZoomIn)
var MENS_AREA_HEIGHT_C_ZOOMIN = MENS_AREA_HEIGHT_PX / PX_PER_CELSIUS_ZOOMIN;
var SEX_AREA_HEIGHT_C_ZOOMIN = SEX_AREA_HEIGHT_PX / PX_PER_CELSIUS_ZOOMIN;
var PAINS_AREA_HEIGHT_C_ZOOMIN = PAINS_AREA_HEIGHT_PX / PX_PER_CELSIUS_ZOOMIN;
var BLOOD_AREA_HEIGHT_C_ZOOMIN = BLOOD_AREA_HEIGHT_PX / PX_PER_CELSIUS_ZOOMIN;
var ORIMONO_AREA_HEIGHT_C_ZOOMIN = ORIMONO_AREA_HEIGHT_PX / PX_PER_CELSIUS_ZOOMIN;
var AREAS_MARGIN_C_ZOOMIN = AREAS_MARGIN_PX / PX_PER_CELSIUS_ZOOMIN;
var PERIOD_AREA_HEIGHT_C_ZOOMIN = PERIOD_AREA_HEIGHT_PX / PX_PER_CELSIUS_ZOOMIN;
var CLASS_NAME = $("#graph-section").attr("class-name");
var SCREEN_ADAPTIVE_HEIGHT = 603;
var MAC_ADAPTIVE_VALUE = 0;

/****************************************
/* タグマウント後に計算される定数
/***************************************/

// 1日分の横幅
var oneDayWidthPx;
// グラフの横幅
var graphWidthPx;
// 選択可能な左端日のスクロール位置(px)
var mostPastDateLeftPx;

// 背景色がある生理日
var plotBandDate;

// 低体温ボタン押す前の位置(px)
var beforeTopPx;

var state = {
    // 生理開始日一覧
    mensStarts: [],
    // 平均生理周期
    averageCycle: null,
    // グラフオブジェクト
    chart: null,
    // 遅延描画のためのtimeout
    drawTimeouts: [],
    // グラフヘッドオブジェクト
    chartHead: null,
    // グラフ体温オブジェクト
    chartTemp: null,
    // グラフ注射オブジェクト
    chartTailTemp: null,
    // グラフ注射オブジェクト
    chartTail: null,
    // グラフfooterオブジェクト
    chartFooter: null,
    // 注射データ
    injectionList: null,
    // 薬剤データ
    medicationList: null,
    // timingデータ
    timingScheduleList: null,
    // visitデータ
    visitScheduleList: null,
    // mstinjectデータ
    mstInjection: null,
    // mstmedicationデータ
    mstMedication: null,
    // 注射のタイム
    injectDayList: [],
    // 薬剤のタイム
    medicationDayList: [],
    // 注射の種類
    injectKindList: [],
    // 薬剤の種類
    medicationKindList: [],
    // 注射のid
    injectIdList: [],
    // 薬剤のid
    medicationIdList: [],
    // timingのタイム
    timingDayList: [],
    // visitのタイム
    visitDayList: []
};


/**
 * グラフ表示のためのデータ加工
 * 初回表示時のみ加工・保存、それ以降は復元
 */
function initial() {
    if (!data) return;
    // 生理開始日のリストを用意
    if (data.mens && data.mens.mensDataList) {
        const list = data.mens.mensDataList;
        const length = list.length;
        const mensStarts = [];
        for (let i = 0; i < length; i++) {
            mensStarts[i] = list[i].start.convertDateFromString(true).getTime();
        }
        state.mensStarts = mensStarts;
    }

    // 平均生理周期
    if (data.mensac && data.mensac.averageCycle) {
        state.averageCycle = data.mensac.averageCycle;
    }

    // memodataを用意
    if (!memoData) return;
    if (memoData.injectionList) {
        state.injectionList = memoData.injectionList;
        for (let i = 0; i < memoData.injectionList.length; i++) {
            state.injectDayList[i] = new Date(memoData.injectionList[i].injectionDate).getTime();
        }
    }
    if (memoData.medicationList) {
        state.medicationList = memoData.medicationList;
        for (let i = 0; i < memoData.medicationList.length; i++) {
            state.medicationDayList[i] = new Date(memoData.medicationList[i].medicationDate).getTime();
        }
    }
    if (memoData.timingScheduleList) {
        state.timingScheduleList = memoData.timingScheduleList;
        for (let i = 0; i < memoData.timingScheduleList.length; i++) {
            state.timingDayList[i] = new Date(memoData.timingScheduleList[i].timingDate).getTime();
        }
    }
    if (memoData.visitScheduleList) {
        state.visitScheduleList = memoData.visitScheduleList;
        for (let i = 0; i < memoData.visitScheduleList.length; i++) {
            state.visitDayList[i] = new Date(memoData.visitScheduleList[i].visitDate).getTime();
        }
    }
    if (memoData.injectionMsts) {

        state.mstInjection = memoData.injectionMsts;
        for (let i = 0; i < memoData.injectionMsts.length; i++) {
            state.injectKindList[i] = memoData.injectionMsts[i].injectionDrug;
            state.injectIdList[i] = memoData.injectionMsts[i].drugId;
        }
    }
    if (memoData.medicationMsts) {
        state.mstMedication = memoData.medicationMsts;
        for (let i = 0; i < memoData.medicationMsts.length; i++) {
            state.medicationKindList[i] = memoData.medicationMsts[i].medicationDrug;
            state.medicationIdList[i] = memoData.medicationMsts[i].drugId;
        }
    }
}

/****************************************
/* 関数
/***************************************/
function drawGraph() {
    if (tagState.GraphState === 1) {
        return;
    }

    $("#bbtDisplay").text("表示");
    if (navigator.userAgent.indexOf("Mac") > -1) {
        SCREEN_ADAPTIVE_HEIGHT = 620;
        MAC_ADAPTIVE_VALUE = 6;
    }
    $("[ref='graph']").scroll(function () {
        $("[ref='graphTemp']").scrollTop($(this).scrollTop());
        $("[ref='graphHead']").scrollLeft($(this).scrollLeft());
    });


    initial();
    initializeDynamicValues();
    initializeGraph();

    tagState.GraphState = 1;
    $(".highcharts-xaxis-labels text tspan").each(function () {
        if ($(this).text() === "…") $(this).text("");
    });
    if ($(".ln-graph-caption-list").width() < 1024) {
        $(".ln-graph-caption-list li:nth-child(5)").after("</br>");
        $(".graph-sec").css("margin-bottom", "73px");
    }
}

/**
 * 画面切り替え時に行うクリーンアップ処理
 */
function cleanupState() {
    if (!state) return;

    for (let timeout in state.drawTimeouts) {
        if (Object.prototype.hasOwnProperty.call(state.drawTimeouts, timeout)) {
            clearTimeout(timeout);
        }
    }
    state.chart && state.chart.destroy();
    state.chart = null;
    state.chartHead && state.chartHead.destroy();
    state.chartHead = null;
    state.chartTemp && state.chartTemp.destroy();
    state.chartTemp = null;
    state.chartTailTemp && state.chartTailTemp.destroy();
    state.chartTailTemp = null;
    state.chartTail && state.chartTail.destroy();
    state.chartTail = null;
    state.chartFooter && state.chartFooter.destroy();
    state.chartFooter = null;
}

/**
 * 変数の初期化
 */
function initializeDynamicValues() {
    // 1日分の横幅
    oneDayWidthPx = ($("#bbtGraph .graph-container").innerWidth() === 0 ? 1920 : $("#bbtGraph .graph-container").innerWidth()) / DISPLAY_DAYS;
    graphWidthPx = oneDayWidthPx * (MOST_PAST_DAYS + MOST_FUTURE_DAYS + DISPLAY_DAYS);
}

/**
 * HighChartsに関する初期化
 */
function initializeGraph() {
    Highcharts.setOptions({
        global: {
            useUTC: true
        }
    });
    const options = createHighchartsOptions();
    options.chart.renderTo = "highchart";
    state.chart = new Highcharts.Chart(options);
    const headOptions = createHighchartsHeadOptions();
    headOptions.chart.renderTo = "highchartHead";
    state.chartHead = new Highcharts.Chart(headOptions);
    const tempOptions = createHighchartsTempOptions(MIN_TEMP, MAX_TEMP, PX_PER_CELSIUS);
    tempOptions.chart.renderTo = "highchartTemp";
    state.chartTemp = new Highcharts.Chart(tempOptions);
    const tailOptions = createHighchartsTailOptions();
    tailOptions.chart.renderTo = "highchartTail";
    state.chartTail = new Highcharts.Chart(tailOptions);
    const tailTempOptions = createHighchartsTailTempOptions();
    tailTempOptions.chart.renderTo = "highchartTailTemp";
    state.chartTailTemp = new Highcharts.Chart(tailTempOptions);
    const chartFooter = createHighchartsFooter();
    chartFooter.chart.renderTo = "highchartFooter";
    state.chartFooter = new Highcharts.Chart(chartFooter);
    $("#bbtGraph .graph-container").scrollTop();
}

function onClick() {
    if (Math.floor(MAX_TEMP - MIN_TEMP) === 1) {
        GRAPH_HEIGHT_PX = 734;
        MIN_TEMP = Number(35);
        MAX_TEMP = Number(37.35);
        CLASS_NAME = "temp-period-labels-hyp";
        $("#bbtDisplay").text("非表示");
        $(".graph-container-tail-temp").css("top", "833px");
        $(".graph-tail-timing").css("top", "896px");
        $(".graph-tail-visiting").css("top", "927px");
        memoEvent = ["", "", "薬剤", "注射", "mouseOver", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
        minTailTemp = Number(0);
        maxTailTemp = Number(memoEvent.length);
        tailHeight = 28 * DAY_AREA_HEIGHT_PX + 15;
        $("#highchartTail").css("transform", "translate(0px, -734px)");
    } else {
        GRAPH_HEIGHT_PX = 607;
        MIN_TEMP = Number(35.5);
        MAX_TEMP = Number(37.35);
        CLASS_NAME = "temp-period-labels";
        $("#bbtDisplay").text("表示");
        $(".graph-container-tail-temp").css("top", "706px");
        $(".graph-tail-timing").css("top", "771px");
        $(".graph-tail-visiting").css("top", "801px");
        memoEvent = ["", "", "薬剤", "注射", "mouseOver", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
        minTailTemp = Number(0);
        maxTailTemp = Number(memoEvent.length);
        tailHeight = 24 * DAY_AREA_HEIGHT_PX + 7;
        $("#highchartTail").css("transform", "translate(0px, -606px)");
    }
    PX_PER_CELSIUS = (GRAPH_HEIGHT_PX - (MENS_AREA_HEIGHT_PX + SEX_AREA_HEIGHT_PX + PAINS_AREA_HEIGHT_PX + BLOOD_AREA_HEIGHT_PX + ORIMONO_AREA_HEIGHT_PX + PERIOD_AREA_HEIGHT_PX + (AREAS_MARGIN_PX * 7))) / (MAX_TEMP - MIN_TEMP);
    PX_PER_CELSIUS_ZOOMIN = (GRAPH_HEIGHT_PX - (MENS_AREA_HEIGHT_PX + SEX_AREA_HEIGHT_PX + PAINS_AREA_HEIGHT_PX + BLOOD_AREA_HEIGHT_PX + ORIMONO_AREA_HEIGHT_PX + PERIOD_AREA_HEIGHT_PX + (AREAS_MARGIN_PX * 7))) / (MAX_TEMP_ZOOMIN - MIN_TEMP_ZOOMIN);
    MENS_AREA_HEIGHT_C = MENS_AREA_HEIGHT_PX / PX_PER_CELSIUS;
    SEX_AREA_HEIGHT_C = SEX_AREA_HEIGHT_PX / PX_PER_CELSIUS;
    PAINS_AREA_HEIGHT_C = PAINS_AREA_HEIGHT_PX / PX_PER_CELSIUS;
    BLOOD_AREA_HEIGHT_C = BLOOD_AREA_HEIGHT_PX / PX_PER_CELSIUS;
    ORIMONO_AREA_HEIGHT_C = ORIMONO_AREA_HEIGHT_PX / PX_PER_CELSIUS;
    AREAS_MARGIN_C = AREAS_MARGIN_PX / PX_PER_CELSIUS;
    PERIOD_AREA_HEIGHT_C = PERIOD_AREA_HEIGHT_PX / PX_PER_CELSIUS;
    MENS_AREA_HEIGHT_C_ZOOMIN = MENS_AREA_HEIGHT_PX / PX_PER_CELSIUS_ZOOMIN;
    SEX_AREA_HEIGHT_C_ZOOMIN = SEX_AREA_HEIGHT_PX / PX_PER_CELSIUS_ZOOMIN;
    PAINS_AREA_HEIGHT_C_ZOOMIN = PAINS_AREA_HEIGHT_PX / PX_PER_CELSIUS_ZOOMIN;
    BLOOD_AREA_HEIGHT_C_ZOOMIN = BLOOD_AREA_HEIGHT_PX / PX_PER_CELSIUS_ZOOMIN;
    ORIMONO_AREA_HEIGHT_C_ZOOMIN = ORIMONO_AREA_HEIGHT_PX / PX_PER_CELSIUS_ZOOMIN;
    AREAS_MARGIN_C_ZOOMIN = AREAS_MARGIN_PX / PX_PER_CELSIUS_ZOOMIN;
    PERIOD_AREA_HEIGHT_C_ZOOMIN = PERIOD_AREA_HEIGHT_PX / PX_PER_CELSIUS_ZOOMIN;

    const leftPx = $("#bbtGraph .graph-container").scrollLeft();

    refreshChart();

    $("#bbtGraph .graph-container").scrollLeft(leftPx);
    $("#bbtGraph .graph-container").scrollTop();
    $("#bbtGraph .graph-container-footer").scrollLeft(leftPx);
}

//チャートの読み込みが完了したときに呼び出される
function onHeadChartLoaded(e) {
    var chart = e.target;

    addPlotBandToGraph(chart, getParameterByName("date"));
    appendPeriodLabel();

    // バイタルデータの描画を遅延させることで体感速度を上げる
    for (let timeout in state.drawTimeouts) {
        if (Object.prototype.hasOwnProperty.call(state.drawTimeouts, timeout)) {
            clearTimeout(timeout);
        }
    }
    state.drawTimeouts.push(
        setTimeout(function () {
            addPlotLineToGraph(chart);
            chart.redraw();
        }, 50)
    );
}

//チャートの読み込みが完了したときに呼び出される
function onChartLoaded(e) {
    var chart = e.target;
    mostPastDateLeftPx = chart.xAxis[0].toPixels(MOST_PAST_DATE.getTime());
    timeleap(chart, getParameterByName("date"));

    // バイタルデータの描画を遅延させることで体感速度を上げる
    for (let timeout in state.drawTimeouts) {
        if (Object.prototype.hasOwnProperty.call(state.drawTimeouts, timeout)) {
            clearTimeout(timeout);
        }
    }
    state.drawTimeouts.push(
        setTimeout(function () {
            addBbtToSeries(chart);
            addDailyEventIconsToGraph(chart);
            addMensIconsToGraph(chart);
            addPlotBandToToday(chart);
            chart.redraw();
        }, 50)
    );
}

//チャートの読み込みが完了したときに呼び出される
function onTailChartLoaded(e) {
    var chart = e.target;

    // 本日を画面中央にして表示
    mostPastDateLeftPx = chart.xAxis[0].toPixels(MOST_PAST_DATE.getTime());
    tailRefresh = false;
    // バイタルデータの描画を遅延させることで体感速度を上げる
    for (let timeout in state.drawTimeouts) {
        if (Object.prototype.hasOwnProperty.call(state.drawTimeouts, timeout)) {
            clearTimeout(timeout);
        }
    }
    state.drawTimeouts.push(
        setTimeout(function () {
            addPlotLineToTailGraph(chart);
            addMemoIconToGraph(chart);
            addPlotBandFuture(chart);
            addPlotBandPast(chart);
            addPlotBandToTodayTail(chart);
            chart.redraw();
        }, 50)
    );
}

//受診日当日（データ表示日＝today）のマスを色付けする
function addPlotBandToTodayTail(chart) {
    chart.xAxis[0].addPlotBand({
        from: TODAY_UNIX - ONE_DAY_MS / 2,
        to: TODAY_UNIX + ONE_DAY_MS / 2,
        color: "rgb(255,237,238)",
        events: {
            dblclick: function () {
                refreshTempChart();
            }
        },
        className: "todayRedBackground"
    });
}

//チャートの読み込みが完了したときに呼び出される
function onFootChartLoaded(e) {
    var chart = e.target;

    mostPastDateLeftPx = chart.xAxis[0].toPixels(MOST_PAST_DATE.getTime());
    addPlotBandToGraph(chart, getParameterByName("date"));

    // バイタルデータの描画を遅延させることで体感速度を上げる
    for (let timeout in state.drawTimeouts) {
        if (Object.prototype.hasOwnProperty.call(state.drawTimeouts, timeout)) {
            clearTimeout(timeout);
        }
    }
    state.drawTimeouts.push(
        setTimeout(function () {
            addPlotLineToGraph(chart);
            chart.redraw();
        }, 50)
    );
}

/**
 * 周期ラベルを追加する
 */
function appendPeriodLabel() {
    // ラベルに白縁を付ける
    $("#bbtGraph .y-label").text("周期");
    $("#bbtGraph .y-label").css("text-shadow", "1px 1px 0 #fff,-1px 1px 0 #fff,1px -1px 0 #fff,-1px -1px 0 #fff,2px 2px 0 #fff,-2px 2px 0 #fff,2px -2px 0 #fff,-2px -2px 0 #fff");
}

//指定した日に移動するメソッド
function timeleap(chart, targetDate) {
    if (!chart) {
        return;
    }
    addPlotBandToGraph(chart, targetDate);
    const targetPx = chart.xAxis[0].toPixels(targetDate ? targetDate : new Date(TODAY_UNIX).getTime());
    const position = targetPx - mostPastDateLeftPx - 1;
    // highchart v8対応するため
    $("#highchart").css("overflow", "visible");
    $("#bbtGraph .graph-container").scrollLeft(position);
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return null;
    return new Date(results[2].replace(/\+/g, " "));
}

//日付の区切り線をシリーズに追加する.
function addPlotLineToGraph(chart) {
    const halfDay = ONE_DAY_MS / 2;
    const xStart = MOST_PAST_DISPLAY_DATE.getTime();
    const xEnd = MOST_FUTURE_DISPLAY_DATE.getTime();
    for (let x = xStart; x <= xEnd; x += ONE_DAY_MS) {
        // 同時に日付の区切り線(縦線)を描画する
        chart.xAxis[0].addPlotLine({
            color: "#e5e5e5",
            dashStyle: "solid",
            value: x - halfDay,
            width: 1,
            zIndex: 1
        });
    }
}

//日付の区切り線をシリーズに追加する.
function addPlotLineToTailGraph(chart) {
    const halfDay = ONE_DAY_MS / 2;
    const xStart = MOST_PAST_DISPLAY_DATE.getTime() + 2 * ONE_DAY_MS;
    const xEnd = MOST_FUTURE_DISPLAY_DATE.getTime();
    for (let x = xStart; x <= xEnd; x += ONE_DAY_MS) {
        // 同時に日付の区切り線(縦線)を描画する
        chart.xAxis[0].addPlotLine({
            color: "#e5e5e5",
            dashStyle: "solid",
            value: x - halfDay,
            width: 1,
            zIndex: 1,
            className: "tailPlotLine"
        });
    }
}

//受診日当日（データ表示日＝today）のマスを色付けする
function addPlotBandToToday(chart) {
    chart.xAxis[0].addPlotBand({
        from: TODAY_UNIX - ONE_DAY_MS / 2,
        to: TODAY_UNIX + ONE_DAY_MS / 2,
        color: "#ffedee",
        events: {
            dblclick: function () {
                refreshTempChart();
            }
        }
    });
}

//受診日当日四十日後の日付のマスを色付けする
function addPlotBandFuture(chart) {
    chart.xAxis[0].addPlotBand({
        from: Future40_UNIX - ONE_DAY_MS / 2,
        to: X_MAX,
        color: "rgba(204, 204, 204, 0.2)",
        events: {
            dblclick: function () {
                refreshTempChart();
            }
        }
    });
}

//受診日当日一年前以前の日付のマスを色付けする
function addPlotBandPast(chart) {
    chart.xAxis[0].addPlotBand({
        from: X_MIN,
        to: Past365_Unix + ONE_DAY_MS / 2,
        color: "rgba(204, 204, 204, 0.2)",
        events: {
            dblclick: function () {
                refreshTempChart();
            }
        }
    });
}

//指定した生理日の背景色をシリーズに追加する
function addPlotBandToGraph(chart, targetDate) {
    if (data && data.mens && data.mens.mensDataList && targetDate !== null) {
        plotBandDate = targetDate;
        const length = data.mens.mensDataList.length || 0;
        for (let i = 0; i < length; i++) {
            const mens = data.mens.mensDataList[i];
            const xStart = mens.start.convertDateFromString(true).getTime();
            const xEnd = mens.end ? mens.end.convertDateFromString(true).getTime() : xStart;
            const tDate = targetDate.getFullYear() + "-" + ("0" + (targetDate.getMonth() + 1)).slice(-2) + "-" + ("0" + targetDate.getDate()).slice(-2);
            if (mens.start === tDate) {
                chart.xAxis[0].addPlotBand({
                    from: xStart - ONE_DAY_MS / 2,
                    to: xEnd + ONE_DAY_MS / 2,
                    color: "#eaf8ff",
                    events: {
                        dblclick: function () {
                            refreshTempChart();
                        }
                    }
                });
                return;
            }
        }
    }
}

//基礎体温をシリーズに追加する.
function addBbtToSeries(chart) {
    const bbtPoints = {};
    const halfDay = ONE_DAY_MS / 2;
    const xStart = MOST_PAST_DISPLAY_DATE.getTime();
    const xEnd = MOST_FUTURE_DISPLAY_DATE.getTime();
    for (let x = xStart; x <= xEnd; x += ONE_DAY_MS) {
        // yを全てnullで埋める
        // こうすることで未入力区間に線が結ばれないようにする
        bbtPoints[x] = {
            x: x,
            y: null
        };
        // 同時に日付の区切り線(縦線)を描画する
        chart.xAxis[0].addPlotLine({
            color: "#e5e5e5",
            dashStyle: "solid",
            value: x - halfDay,
            width: 1,
            zIndex: 1
        });
    }

    if (!data || !data.bbts || !data.bbts.bbtDataList) {
        return;
    }
    // 計測されている日時の基礎体温の値を上書き
    const bbts = data.bbts.bbtDataList;
    const length = bbts.length;
    for (let i = 0; i < length; i++) {
        const bbtTime = bbts[i].date.convertDateFromString(true).getTime();
        if (bbtTime in bbtPoints) {
            bbtPoints[bbtTime] = {
                x: bbtTime,
                y: bbts[i].bbt
            };
        }
    }

    // グラフに追加
    const series = chart.series[0];
    for (let key in bbtPoints) {
        if (bbtPoints.hasOwnProperty(key)) {
            series.addPoint(bbtPoints[key], false, false, false);
        }
    }
}

//デイリーイベントの追加
function addDailyEventIconsToGraph(chart) {
    if (!data || !data.sex || !data.sex.eventDataList) {
        return;
    }

    var eventDataList = data.sex.eventDataList;
    var painsY = MIN_TEMP - PERIOD_AREA_HEIGHT_C - MENS_AREA_HEIGHT_C - (PAINS_AREA_HEIGHT_C / 2) - (AREAS_MARGIN_C * 3);
    var bloodY = MIN_TEMP - PERIOD_AREA_HEIGHT_C - MENS_AREA_HEIGHT_C - PAINS_AREA_HEIGHT_C - (BLOOD_AREA_HEIGHT_C / 2) - (AREAS_MARGIN_C * 4);
    var sexY = MIN_TEMP - PERIOD_AREA_HEIGHT_C - MENS_AREA_HEIGHT_C - PAINS_AREA_HEIGHT_C - BLOOD_AREA_HEIGHT_C - (SEX_AREA_HEIGHT_C / 2) - (AREAS_MARGIN_C * 5);
    var orimonoY = MIN_TEMP - PERIOD_AREA_HEIGHT_C - MENS_AREA_HEIGHT_C - PAINS_AREA_HEIGHT_C - BLOOD_AREA_HEIGHT_C - SEX_AREA_HEIGHT_C - (ORIMONO_AREA_HEIGHT_C / 2) - (AREAS_MARGIN_C * 6);
    var sexSeries = chart.series[1];
    var painsSeries = chart.series[3];
    var bloodSeries = chart.series[4];
    var orimonoSeries = chart.series[5];
    // 3:激痛/2:痛い/1:少し痛い
    var painstr = ["1", "2", "3"];
    // 3:黄色/2:白/1:透明
    var orimonoColor = ["1", "2", "3"];
    // 3:べたべた/2:さらさら/1:ぼろぼろ
    var orimonoViscosity = ["1", "2", "3"];
    // 3:多い/2:普通/1:少ない
    var orimonoQuantity = ["1", "2", "3"];
    // 3:多い/2:普通/1:少ない
    var bleeding = ["1", "2", "3"];
    var point;
    for (var i = 0, length = eventDataList.length; i < length; i++) {
        var eventData = eventDataList[i];
        if (eventData.date) {
            if (data.sex.painIsDisplay === true) {
                if ($.inArray(eventData.abdominalPain, painstr) >= 0 || $.inArray(eventData.menstrualPain, painstr) >= 0 || $.inArray(eventData.ovulationPain, painstr) >= 0) {
                    point = {
                        x: eventDataList[i].date.convertDateFromString(true).getTime(),
                        y: painsY
                    };
                    painsSeries.addPoint(point, false, false, false);
                }
            }
            if (data.sex.bloodIsDisplay === true) {
                if ($.inArray(eventData.bleeding, bleeding) >= 0) {
                    point = {
                        x: eventDataList[i].date.convertDateFromString(true).getTime(),
                        y: bloodY
                    };
                    bloodSeries.addPoint(point, false, false, false);
                }
            }
            if (data.sex.sexIsDisplay === true) {
                if (eventData.sex === "1") {
                    point = {
                        x: eventDataList[i].date.convertDateFromString(true).getTime(),
                        y: sexY
                    };
                    sexSeries.addPoint(point, false, false, false);
                }
            }
            if (data.sex.orimonoIsDisplay === true) {
                if ($.inArray(eventData.leukorrheaColor, orimonoColor) >= 0 || $.inArray(eventData.leukorrheaViscosity, orimonoViscosity) >= 0 || $.inArray(eventData.leukorrheaQuantity, orimonoQuantity) >= 0) {
                    point = {
                        x: eventDataList[i].date.convertDateFromString(true).getTime(),
                        y: orimonoY
                    };
                    orimonoSeries.addPoint(point, false, false, false);
                }
            }
        }
    }
}

//生理日の追加
function addMensIconsToGraph(chart) {
    if (!data || !data.mens || !data.mens.mensDataList) {
        return;
    }

    const series = chart.series[2];
    const y = MIN_TEMP - PERIOD_AREA_HEIGHT_C - (MENS_AREA_HEIGHT_C / 2) - (AREAS_MARGIN_C * 2);
    const length = data.mens.mensDataList.length || 0;
    for (let i = 0; i < length; i++) {
        const mens = data.mens.mensDataList[i];
        const xStart = mens.start.convertDateFromString(true).getTime();
        const xEnd = mens.end ? mens.end.convertDateFromString(true).getTime() : xStart;
        for (let x = xStart; x <= xEnd; x += ONE_DAY_MS) {
            const point = {
                x: x,
                y: y
            };
            series.addPoint(point, false, false, false);
        }
    }
}

//0.5℃ごとに実線作成
function createSolidPositions(min, max) {
    const fixedMaxY = max.toFixed(2);
    const solidPositions = [];
    for (let y = Math.ceil(min * 2) / 2; y < max; y += 0.5) {
        // 最大値線と重なる場合は描画しない
        if (y.toFixed(2) === fixedMaxY) {
            continue;
        }
        solidPositions[solidPositions.length] = y;
    }
    return solidPositions;
}

// 0.05℃ごとに破線作成
function createDashPositions(min, max, solidPositions) {
    const fixedMaxY = max.toFixed(2);
    const dashPositions = [];
    for (let y = Math.ceil(min * 20) / 20; y < max; y += 0.05) {
        // 線が既にある場合は描画しない
        var fixedY = y.toFixed(2);
        if (solidPositions.some(function (p) { return p.toFixed(2) === fixedY; }) || fixedY === fixedMaxY) {
            continue;
        }
        dashPositions[dashPositions.length] = y;
    }
    return dashPositions;
}

//色付き横線(実線)
function createColorPositions() {
    const highlightedPositions = [];
    if (HIGHLIGHTED_TEMP) {
        highlightedPositions[0] = HIGHLIGHTED_TEMP;
    }
    return highlightedPositions;
}

//tailの実線作成
function createSolidPositionsTail(min, max) {
    const fixedMaxY = max.toFixed(2);
    const solidPositions = [];
    for (let y = Math.ceil(min * 2) / 2; y < max; y += 1) {
        // 最大値線と重なる場合は描画しない
        if (y.toFixed(2) === fixedMaxY || y > 4) {
            continue;
        }
        solidPositions[solidPositions.length] = y;
    }
    return solidPositions;
}

//体温グラフ更新
function refreshChart() {
    const tempOptions = createHighchartsTempOptions(MIN_TEMP, MAX_TEMP, PX_PER_CELSIUS);
    tempOptions.chart.renderTo = "highchartTemp";
    state.chartTemp = new Highcharts.Chart(tempOptions);
    const options = createHighchartsOptions();
    options.chart.renderTo = "highchart";
    state.chart = new Highcharts.Chart(options);
    const tailOptions = createHighchartsTailOptions();
    tailOptions.chart.renderTo = "highchartTail";
    state.chartTail = new Highcharts.Chart(tailOptions);

    // highchart v8対応するため
    $("#highchart").css("overflow", "visible");
    $("#highchartTail").css("overflow", "visible");

    if (plotBandDate != null) {
        addPlotBandToGraph(state.chart, plotBandDate);
    }
    $(".highcharts-xaxis-labels text tspan").each(function () {
        if ($(this).text() === "…") $(this).text("");
    });
}

//体温グラフ更新
function refreshTempChart() {
    var chart = state.chart;
    var minTemp = chart.yAxis[0].min;
    var maxTemp = chart.yAxis[0].max;
    var maxTempDisplay;
    var periodAreaHeight;
    var sexAreaHeight;
    var areasMargin;
    var mensAreaHeight;
    var painsAreaHeight;
    var bloodAreaHeight;
    var orimonoAreaHeight;
    var minTempDisplay;
    var tempOptions;

    // ZoomInとZoomOut切替する
    if (Math.round(maxTemp - minTemp) === 1) {
        minTemp = MIN_TEMP;
        maxTemp = MAX_TEMP;
        minTempDisplay = MIN_TEMP - (MENS_AREA_HEIGHT_PX + SEX_AREA_HEIGHT_PX + PERIOD_AREA_HEIGHT_PX + PAINS_AREA_HEIGHT_PX + BLOOD_AREA_HEIGHT_PX + ORIMONO_AREA_HEIGHT_PX + (AREAS_MARGIN_PX * 7)) / PX_PER_CELSIUS;
        maxTempDisplay = MAX_TEMP;
        periodAreaHeight = PERIOD_AREA_HEIGHT_C;
        sexAreaHeight = SEX_AREA_HEIGHT_C;
        areasMargin = AREAS_MARGIN_C;
        mensAreaHeight = MENS_AREA_HEIGHT_C;
        painsAreaHeight = PAINS_AREA_HEIGHT_C;
        bloodAreaHeight = BLOOD_AREA_HEIGHT_C;
        orimonoAreaHeight = ORIMONO_AREA_HEIGHT_C;
        tempOptions = createHighchartsTempOptions(MIN_TEMP, MAX_TEMP, PX_PER_CELSIUS);
    } else {
        minTemp = MIN_TEMP_ZOOMIN;
        maxTemp = MAX_TEMP_ZOOMIN;
        minTempDisplay = MIN_TEMP_ZOOMIN - (MENS_AREA_HEIGHT_PX + SEX_AREA_HEIGHT_PX + PERIOD_AREA_HEIGHT_PX + PAINS_AREA_HEIGHT_PX + BLOOD_AREA_HEIGHT_PX + ORIMONO_AREA_HEIGHT_PX + (AREAS_MARGIN_PX * 7)) / PX_PER_CELSIUS_ZOOMIN;
        maxTempDisplay = MAX_TEMP_ZOOMIN;
        periodAreaHeight = PERIOD_AREA_HEIGHT_C_ZOOMIN;
        sexAreaHeight = SEX_AREA_HEIGHT_C_ZOOMIN;
        areasMargin = AREAS_MARGIN_C_ZOOMIN;
        mensAreaHeight = MENS_AREA_HEIGHT_C_ZOOMIN;
        painsAreaHeight = PAINS_AREA_HEIGHT_C_ZOOMIN;
        bloodAreaHeight = BLOOD_AREA_HEIGHT_C_ZOOMIN;
        orimonoAreaHeight = ORIMONO_AREA_HEIGHT_C_ZOOMIN;
        tempOptions = createHighchartsTempOptions(MIN_TEMP_ZOOMIN, MAX_TEMP_ZOOMIN, PX_PER_CELSIUS_ZOOMIN);
    }
    tempOptions.chart.renderTo = "highchartTemp";
    state.chartTemp = new Highcharts.Chart(tempOptions);
    var solidPositions = createSolidPositions(minTemp, maxTemp);
    var dashPositions = createDashPositions(minTemp, maxTemp, solidPositions);
    var colorPositions = createColorPositions();

    // 体温表示範囲を変更する
    chart.yAxis[0].update({
        min: minTempDisplay,
        max: maxTempDisplay
    }, false);

    // 横線(実線、破線)
    chart.yAxis[1].update({
        tickPositions: solidPositions
    }, false);

    chart.yAxis[2].update({
        tickPositions: dashPositions
    }, false);

    // 色付き横線(実線)
    chart.yAxis[3].update({
        tickPositions: colorPositions
    }, false);

    // デイリーイベント表示位置(Y軸)の変更
    refreshDailyEventIcon(minTemp, periodAreaHeight, mensAreaHeight, sexAreaHeight, areasMargin, painsAreaHeight, bloodAreaHeight, orimonoAreaHeight);


    // 生理日表示位置(Y軸)の変更
    refreshMensIcon(minTemp, periodAreaHeight, mensAreaHeight, areasMargin);

    chart.yAxis[0].removePlotBand("plotband-1");

    chart.yAxis[0].addPlotBand({
        id: "plotband-1",
        color: "white",
        from: 30,
        to: 40,
        zIndex: 0,
        events: {
            dblclick: function () {
                refreshTempChart();
            }
        }
    });
    addPlotLineToGraph(chart);
    // 受診日当日（データ表示日＝today）のマスを色付けする
    addPlotBandToToday(chart);
    chart.redraw(false);
    ga("send", "event", "graph", "dbclick");
}

//デイリーイベントの表示位置更新
function refreshDailyEventIcon(min, periodAreaHeight, mensAreaHeight, sexAreaHeight, areasMargin, painsAreaHeight, bloodAreaHeight, orimonoAreaHeight) {

    if (!data || !data.sex || !data.sex.eventDataList) {
        return;
    }

    var chart = state.chart;
    var eventDataList = data.sex.eventDataList;
    var painsY = min - periodAreaHeight - mensAreaHeight - (painsAreaHeight / 2) - (areasMargin * 3);
    var bloodY = min - periodAreaHeight - mensAreaHeight - painsAreaHeight - (bloodAreaHeight / 2) - (areasMargin * 4);
    var sexY = min - periodAreaHeight - mensAreaHeight - painsAreaHeight - bloodAreaHeight - (sexAreaHeight / 2) - (areasMargin * 5);
    var orimonoY = min - periodAreaHeight - mensAreaHeight - painsAreaHeight - bloodAreaHeight - sexAreaHeight - (orimonoAreaHeight / 2) - (areasMargin * 6);
    var sexSeries = chart.series[1];
    var painsSeries = chart.series[3];
    var bloodSeries = chart.series[4];
    var orimonoSeries = chart.series[5];
    var sexPoints = [];
    var painsPoints = [];
    var bloodPoints = [];
    var orimonoPoints = [];
    // 3:激痛/2:痛い/1:少し痛い
    var painstr = ["1", "2", "3"];
    // 3:黄色/2:白/1:透明
    var orimonoColor = ["1", "2", "3"];
    // 3:べたべた/2:さらさら/1:ぼろぼろ
    var orimonoViscosity = ["1", "2", "3"];
    // 3:多い/2:普通/1:少ない
    var orimonoQuantity = ["1", "2", "3"];
    // 3:多い/2:普通/1:少ない
    var bleeding = ["1", "2", "3"];
    var point;
    for (var i = 0, length = eventDataList.length; i < length; i++) {
        var eventData = eventDataList[i];
        if (eventData.date) {
            if (data.sex.painIsDisplay === true) {
                if ($.inArray(eventData.abdominalPain, painstr) >= 0 || $.inArray(eventData.menstrualPain, painstr) >= 0 || $.inArray(eventData.ovulationPain, painstr) >= 0) {
                    point = {
                        x: eventDataList[i].date.convertDateFromString(true).getTime(),
                        y: painsY
                    };
                    painsPoints[painsPoints.length] = point;
                }
            }
            if (data.sex.bloodIsDisplay === true) {
                if ($.inArray(eventData.bleeding, bleeding) >= 0) {
                    point = {
                        x: eventDataList[i].date.convertDateFromString(true).getTime(),
                        y: bloodY
                    };
                    bloodPoints[bloodPoints.length] = point;
                }
            }
            if (data.sex.sexIsDisplay === true) {
                if (eventData.sex === "1") {
                    point = {
                        x: eventDataList[i].date.convertDateFromString(true).getTime(),
                        y: sexY
                    };
                    sexPoints[sexPoints.length] = point;
                }
            }
            if (data.sex.orimonoIsDisplay === true) {
                if ($.inArray(eventData.leukorrheaColor, orimonoColor) >= 0 || $.inArray(eventData.leukorrheaViscosity, orimonoViscosity) >= 0 || $.inArray(eventData.leukorrheaQuantity, orimonoQuantity) >= 0) {
                    point = {
                        x: eventDataList[i].date.convertDateFromString(true).getTime(),
                        y: orimonoY
                    };
                    orimonoPoints[orimonoPoints.length] = point;
                }
            }
        }
    }
    painsSeries.update({
        data: painsPoints
    }, false);
    bloodSeries.update({
        data: bloodPoints
    }, false);
    sexSeries.update({
        data: sexPoints
    }, false);
    orimonoSeries.update({
        data: orimonoPoints
    }, false);
}

//生理日の表示位置更新
function refreshMensIcon(min, periodAreaHeight, mensAreaHeight, areasMargin) {
    if (!data || !data.mens || !data.mens.mensDataList) {
        return;
    }

    const chart = state.chart;
    const series = chart.series[2];
    const mensPoints = [];
    const mensPlotBands = [];
    const y = min - periodAreaHeight - (mensAreaHeight / 2) - (areasMargin * 2);
    const length = data.mens.mensDataList.length || 0;
    for (let i = 0; i < length; i++) {
        const mens = data.mens.mensDataList[i];
        const xStart = mens.start.convertDateFromString(true).getTime();
        const xEnd = mens.end ? mens.end.convertDateFromString(true).getTime() : xStart;
        for (let x = xStart; x <= xEnd; x += ONE_DAY_MS) {
            const point = {
                x: x,
                y: y
            };
            mensPoints[mensPoints.length] = point;
        }
        const targetDate = getParameterByName("date");
        if (targetDate) {
            const tDate = targetDate.getFullYear() + "-" + ("0" + (targetDate.getMonth() + 1)).slice(-2) + "-" + ("0" + targetDate.getDate()).slice(-2);
            if (mens.start === tDate) {
                mensPlotBands[mensPlotBands.length] = {
                    from: xStart - ONE_DAY_MS / 2,
                    to: xEnd + ONE_DAY_MS / 2,
                    color: "#eaf8ff",
                    events: {
                        dblclick: function () {
                            refreshTempChart();
                        }
                    }
                };
            }
        }
    }
    series.update({
        data: mensPoints
    }, false);

    chart.xAxis[0].update({
        plotBands: mensPlotBands
    }, false);
}

//Highchartsに渡すoptionsを生成
function createHighchartsHeadOptions() {
    return {
        chart: {
            marginTop: MONTH_AREA_HEIGHT_PX,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            height: GRAPH_HEAD_HEIGHT_PX,
            width: graphWidthPx,
            plotBorderWidth: 0,
            events: {
                load: onHeadChartLoaded
            },
            animation: false
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        credits: {
            // Highchartsへのリンクの非表示
            enabled: false
        },
        legend: {
            // プロットの凡例の非表示
            enabled: false
        },
        exporting: {
            // エクスポート機能無効化
            enabled: false
        },
        tooltip: {
            // カーソルをホバーした際に吹き出しを表示しない
            enabled: false
        },
        plotOptions: {
            series: {
                turboThreshold: 99999,
                enableMouseTracking: false,
                animation: false
            }
        },
        yAxis: {
            labels: {
                enabled: false
            }
        },
        xAxis: [{
            // 日の軸
            type: "datetime",
            max: X_MAX,
            min: X_MIN,
            tickInterval: ONE_DAY_MS,
            // 目盛りを下ではなく上に表示する
            opposite: true,
            // 目盛りとグラフエリアの間のオフセット
            offset: -DAY_AREA_HEIGHT_PX,
            plotLines: [],
            tickLength: 0,
            lineWidth: 1,
            lineColor: "#e5e5e5",
            labels: {
                align: "center",
                rotation: 0,
                y: -9,
                padding: 0,
                formatter: function () {
                    // 土日だけ文字色を変更させる
                    const date = new Date(this.value);
                    var color;
                    switch (date.getDay()) {
                        case 0:
                            color = "#ef9e9e";
                            break;
                        case 6:
                            color = "#79a0cd";
                            break;
                        default:
                            color = "#585858";
                    }
                    return '<span style="color: ' + encodeURI(color) + ';">' + encodeURI(date.getDate()) + "</span>";
                },
                style: {
                    fontSize: "18px",
                    fontWeight: "bold"
                }
            }
        }, {
            // 年月の軸
            linkedTo: 0,
            type: "datetime",
            max: X_MAX,
            min: X_MIN,
            tickInterval: ONE_DAY_MS,
            opposite: true,
            offset: 0,
            tickLength: 0,
            lineWidth: 1,
            lineColor: "#e5e5e5",
            labels: {
                align: "left",
                rotation: 0,
                x: -13,
                y: -MONTH_AREA_HEIGHT_PX / 2 + 9,
                padding: 0,
                formatter: function () {
                    const date = new Date(this.value);
                    if (date.getDate() === 1 && date >= MOST_PAST_DISPLAY_DATE && date <= MOST_FUTURE_DISPLAY_DATE) {
                        return Highcharts.dateFormat("%Y/%m", this.value);
                    } else {
                        return null;
                    }
                },
                style: {
                    color: "#585858",
                    fontSize: "18px",
                    fontWeight: "bold",
                    // 文字がはみ出した場合に省略されないようにする
                    textOverflow: "none"
                }
            }
        }, {
            // 生理周期
            linkedTo: 0,
            type: "datetime",
            max: X_MAX,
            min: X_MIN,
            tickInterval: ONE_DAY_MS,
            opposite: true,
            offset: -(DAY_AREA_HEIGHT_PX + MONTH_AREA_HEIGHT_PX + PERIOD_AREA_HEIGHT_PX / 2) + 2 + MAC_ADAPTIVE_VALUE,
            tickLength: 0,
            lineWidth: 0,
            labels: {
                rotation: 0,
                padding: 0,
                // 生理周期の計算
                formatter: function () {
                    const length = state.mensStarts.length;
                    if (!length || length < 2) {
                        // 生理開始日が2件未満の場合は計算しない
                        return null;
                    }
                    // 生理開始日リストをコピーする
                    // sliceやconcatよりforループの方が2倍以上速いらしい
                    const copy = [];
                    for (let i = 0; i < length; i++) {
                        copy[i] = state.mensStarts[i];
                    }
                    // 生理開始日のリストに当該日を追加
                    copy[length] = this.value;
                    // 昇順にソートして位置を特定
                    copy.sort(function (a, b) { return a - b; });
                    const index = copy.lastIndexOf(this.value);
                    if (index <= 0) {
                        // 当該日がどの生理開始日よりも過去の場合は何も表示しない
                        return null;
                    }
                    // 直前の生理開始日から当該日までの経過日数を計算
                    const fromStart = Math.floor((this.value - copy[index - 1]) / ONE_DAY_MS) + 1;

                    const text = fromStart < 100 ? fromStart : "...";
                    // 交互に色を変える
                    const colors = ["#b2b2b2", "#ce9c95"];
                    return '<span style="color: ' + encodeURI(colors[index % 2]) + ';">' + encodeURI(text) + "</span>";
                },
                style: {
                    fontSize: "18px"
                }
            }
        }],
        series: [{
            type: "line",
            animation: false
        }]
    };
}

//Highchartsに渡すoptionsを生成
function createHighchartsOptions() {
    // 色付き線を引く
    const highlightedPositions = createColorPositions();

    // 0.5℃ごとに実線を引く
    const solidPositions = createSolidPositions(MIN_TEMP, MAX_TEMP);

    // 0.05℃ごとに破線を引く
    const dashPositions = createDashPositions(MIN_TEMP, MAX_TEMP, solidPositions);

    return {
        chart: {
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            height: GRAPH_HEIGHT_PX,
            width: graphWidthPx,
            plotBorderWidth: 0,
            events: {
                load: onChartLoaded
            },
            animation: false
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        credits: {
            // Highchartsへのリンクの非表示
            enabled: false
        },
        legend: {
            // プロットの凡例の非表示
            enabled: false
        },
        exporting: {
            // エクスポート機能無効化
            enabled: false
        },
        tooltip: {
            // カーソルをホバーした際に吹き出しを表示しない
            enabled: false
        },
        plotOptions: {
            series: {
                turboThreshold: 99999,
                enableMouseTracking: false,
                animation: false
            }
        },
        yAxis: [{
            plotBands: [{
                id: "plotband-1",
                color: "white",
                from: 30,
                to: 40,
                zIndex: 0,
                events: {
                    dblclick: function () {
                        refreshTempChart();
                    }
                }
            }],
            labels: {
                enabled: false
            },
            tickLength: 0,
            title: {
                text: null
            },
            gridLineWidth: 0,
            tickInterval: 1,
            maxPadding: 0,
            max: MAX_TEMP,
            min: MIN_TEMP - (MENS_AREA_HEIGHT_PX + SEX_AREA_HEIGHT_PX + PERIOD_AREA_HEIGHT_PX + PAINS_AREA_HEIGHT_PX + BLOOD_AREA_HEIGHT_PX + ORIMONO_AREA_HEIGHT_PX + (AREAS_MARGIN_PX * 7)) / PX_PER_CELSIUS,
            tickmarkPlacement: "on",
            endOnTick: false,
            startOnTick: false
        }, {
            // 横線(実線)
            linkedTo: 0,
            gridLineWidth: 1,
            gridLineColor: "#b2b2b2",
            gridLineDashStyle: "solid",
            tickPositions: solidPositions,
            maxPadding: 0,
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            tickLength: 0
        }, {
            // 横線(破線)
            linkedTo: 0,
            gridLineWidth: 1,
            gridLineColor: "#e5e5e5",
            gridLineDashStyle: "shortdash",
            tickPositions: dashPositions,
            maxPadding: 0,
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            tickLength: 0
        }, {
            // 色付き横線(実線)
            linkedTo: 0,
            gridLineWidth: 1,
            gridLineColor: "#ff5d5d",
            gridLineDashStyle: "solid",
            tickPositions: highlightedPositions,
            maxPadding: 0,
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            tickLength: 0
        }],
        xAxis: [{
            type: "datetime",
            max: X_MAX,
            min: X_MIN,
            tickInterval: ONE_DAY_MS,
            // 目盛りを下ではなく上に表示する
            opposite: true,
            // 目盛りとグラフエリアの間のオフセット
            offset: 0,
            plotLines: [],
            tickLength: 0,
            lineWidth: 1,
            lineColor: "#e5e5e5",
            labels: {
                enabled: false
            }
        }, {
            // 生理周期
            linkedTo: 0,
            type: "datetime",
            max: X_MAX,
            min: X_MIN,
            tickInterval: ONE_DAY_MS,
            opposite: true,
            offset: -((MAX_TEMP - MIN_TEMP) * PX_PER_CELSIUS + 50) + MAC_ADAPTIVE_VALUE,
            tickLength: 0,
            lineWidth: 0,
            labels: {
                rotation: 0,
                padding: 0,
                // 生理周期の計算
                formatter: function () {
                    const length = state.mensStarts.length;
                    if (!length || length < 2) {
                        // 生理開始日が2件未満の場合は計算しない
                        return null;
                    }
                    // 生理開始日リストをコピーする
                    // sliceやconcatよりforループの方が2倍以上速いらしい
                    const copy = [];
                    for (let i = 0; i < length; i++) {
                        copy[i] = state.mensStarts[i];
                    }
                    // 生理開始日のリストに当該日を追加
                    copy[length] = this.value;
                    // 昇順にソートして位置を特定
                    copy.sort(function (a, b) { return a - b; });
                    const index = copy.lastIndexOf(this.value);
                    if (index <= 0) {
                        // 当該日がどの生理開始日よりも過去の場合は何も表示しない
                        return null;
                    }
                    // 直前の生理開始日から当該日までの経過日数を計算
                    const fromStart = Math.floor((this.value - copy[index - 1]) / ONE_DAY_MS) + 1;

                    const text = fromStart < 100 ? fromStart : "...";
                    // 交互に色を変える
                    const colors = ["#b2b2b2", "#ce9c95"];
                    return '<span style="color: ' + encodeURI(colors[index % 2]) + ';">' + encodeURI(text) + "</span>";
                },
                style: {
                    fontSize: "18px"
                }
            }
        }],
        series: [{
            // 基礎体温の折れ線グラフ
            type: "line",
            animation: false,
            data: [],
            color: "#61a7f5",
            marker: { // プロットの丸の設定
                symbol: "circle",
                fillColor: "#ffffff",
                lineWidth: 3,
                lineColor: "#61a7f5",
                radius: 3
            },
            lineWidth: "3px",
            dataLabels: {
                enabled: false
            },
            zIndex: 5
        }, {
            // 性交アイコン
            type: "scatter",
            animation: false,
            data: [],
            dataLabels: {
                enabled: false
            },
            marker: {
                symbol: "url(/img/ico-ok-02.png)",
                width: 16,
                height: 16
            },
            zIndex: 5
        }, {
            // 月経アイコン
            type: "scatter",
            animation: false,
            data: [],
            dataLabels: {
                enabled: false
            },
            marker: {
                symbol: "url(/img/ico-ng-02.png)",
                width: 15,
                height: 15
            },
            zIndex: 5
        }, {
            // 腹痛アイコン
            type: "scatter",
            animation: false,
            data: [],
            dataLabels: {
                enabled: false
            },
            marker: {
                symbol: "url(/img/ico-triangle.png)",
                width: 16,
                height: 14
            },
            zIndex: 5
        }, {
            // 不正出血アイコン
            type: "scatter",
            animation: false,
            data: [],
            dataLabels: {
                enabled: false
            },
            marker: {
                symbol: "url(/img/ico-triangle-fill.png)",
                width: 16,
                height: 14
            },
            zIndex: 5
        }, {
            // おりものアイコン
            type: "scatter",
            animation: false,
            data: [],
            dataLabels: {
                enabled: false
            },
            marker: {
                symbol: "url(/img/ico-plus.png)",
                width: 16,
                height: 16
            },
            zIndex: 5
        }]
    };
}

//Highchartsに渡すoptionsを生成
function createHighchartsTempOptions(minTemp, maxTemp, pxPerCelsius) {
    // 色付き線を引く
    const highlightedPositions = createColorPositions();

    // 0.5℃ごとに実線を引く
    const solidPositions = createSolidPositions(minTemp, maxTemp);

    // 0.05℃ごとに破線を引く
    const dashPositions = createDashPositions(minTemp, maxTemp, solidPositions);

    return {
        chart: {
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            height: GRAPH_HEIGHT_PX,
            width: 138,
            plotBorderWidth: 0,
            animation: false
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        credits: {
            // Highchartsへのリンクの非表示
            enabled: false
        },
        legend: {
            // プロットの凡例の非表示
            enabled: false
        },
        exporting: {
            // エクスポート機能無効化
            enabled: false
        },
        tooltip: {
            // カーソルをホバーした際に吹き出しを表示しない
            enabled: false
        },
        plotOptions: {
            series: {
                turboThreshold: 99999,
                enableMouseTracking: false,
                animation: false
            }
        },
        yAxis: [{
            labels: {
                align: "right",
                rotation: 0,
                padding: 0,
                x: 44,
                formatter: function () {
                    if (minTemp <= this.value && this.value <= maxTemp) {
                        const firstDecimal = Math.round(this.value * 10) % 10;
                        if (firstDecimal % 5 === 0) {
                            return this.value.toFixed(1);
                        } else {
                            return firstDecimal.toFixed(0);
                        }
                    }
                    if (minTemp - 0.1 === this.value) {
                        return "周期";
                    }
                },
                useHTML: true,
                style: {
                    color: "#585858",
                    fontSize: "18px",
                    fontFamily: "Helvetica,Arial,sans-serif",
                    textOverflow: "clip"
                }
            },
            className: CLASS_NAME,
            tickLength: 0,
            title: {
                text: null
            },
            gridLineWidth: 0,
            tickInterval: 0.1,
            maxPadding: 0,
            max: maxTemp,
            min: minTemp - (MENS_AREA_HEIGHT_PX + SEX_AREA_HEIGHT_PX + PERIOD_AREA_HEIGHT_PX + PAINS_AREA_HEIGHT_PX + BLOOD_AREA_HEIGHT_PX + ORIMONO_AREA_HEIGHT_PX + (AREAS_MARGIN_PX * 7)) / pxPerCelsius,
            tickmarkPlacement: "on",
            endOnTick: false,
            startOnTick: false
        }, {
            // 横線(実線)
            linkedTo: 0,
            gridLineWidth: 1,
            gridLineColor: "#b2b2b2",
            gridLineDashStyle: "solid",
            tickPositions: solidPositions,
            maxPadding: 0,
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            tickLength: 0
        }, {
            // 横線(破線)
            linkedTo: 0,
            gridLineWidth: 1,
            gridLineColor: "#e5e5e5",
            gridLineDashStyle: "shortdash",
            tickPositions: dashPositions,
            maxPadding: 0,
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            tickLength: 0
        }, {
            // 色付き横線(実線)
            linkedTo: 0,
            gridLineWidth: 1,
            gridLineColor: "#ff5d5d",
            gridLineDashStyle: "solid",
            tickPositions: highlightedPositions,
            maxPadding: 0,
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            tickLength: 0
        }],
        xAxis: [{
            visible: false
        }],
        series: [{
            type: "line",
            animation: false
        }]
    };
}

//Highchartsに渡すoptionsを生成
function createHighchartsTailTempOptions() {
    // 実線を引く
    const solidPositions = createSolidPositionsTail(minTailTemp, maxTailTemp);
    return {
        chart: {
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            height: tailHeight,
            width: 138,
            plotBorderWidth: 0,
            animation: false
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        credits: {
            // Highchartsへのリンクの非表示
            enabled: false
        },
        legend: {
            // プロットの凡例の非表示
            enabled: false
        },
        exporting: {
            // エクスポート機能無効化
            enabled: false
        },
        tooltip: {
            // カーソルをホバーした際に吹き出しを表示しない
            enabled: false
        },
        plotOptions: {
            series: {
                turboThreshold: 99999,
                enableMouseTracking: false,
                animation: false
            }
        },
        yAxis: [{
            labels: {
                align: "right",
                rotation: 0,
                padding: 0,
                x: 43,
                y: 20,
                formatter: function () {
                    return memoEvent[this.value - 1];
                },
                useHTML: true,
                style: {
                    color: "#585858",
                    fontSize: "18px",
                    fontFamily: "Helvetica,Arial,sans-serif",
                    textOverflow: "clip"
                }
            },
            className: $("#graph-section").attr("class-name"),
            tickLength: 0,
            title: {
                text: null
            },
            gridLineWidth: 0,
            tickInterval: 1,
            maxPadding: 0,
            max: maxTailTemp,
            min: minTailTemp,
            endOnTick: false,
            startOnTick: false
        }, {
            // 横線(実線)
            linkedTo: 0,
            gridLineWidth: 1,
            gridLineColor: "#e5e5e5",
            gridLineDashStyle: "solid",
            tickPositions: solidPositions,
            maxPadding: 0,
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            tickLength: 0
        }],
        xAxis: [{
            visible: false
        }],
        series: [{
            type: "line",
            animation: false
        }]
    };
}

//Highchartsに渡すoptionsを生成
function createHighchartsTailOptions() {
    // 実線を引く
    const solidPositions = createSolidPositionsTail(minTailTemp, maxTailTemp);
    return {
        chart: {
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            height: tailHeight,
            width: graphWidthPx,
            plotBorderWidth: 0,
            events: {
                load: onTailChartLoaded
            },
            animation: false,
            backgroundColor: 'rgba(0,0,0,0)'
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        credits: {
            // Highchartsへのリンクの非表示
            enabled: false
        },
        legend: {
            // プロットの凡例の非表示
            enabled: false
        },
        exporting: {
            // エクスポート機能無効化
            enabled: false
        },
        plotOptions: {
            stickyTracking: false,
            series: {
                cursor: "pointer",
                turboThreshold: 99999,
                animation: false,
                events: {
                    click: function (event) {
                        if (event.point.y === 2.5 || event.point.y === 3.5) {
                            popBox(event.point.x, event.point.y, this.name);
                        } else if (event.point.y === 1.5) {
                            timingEvent(event.point.x, this.name);
                        } else if (event.point.y === 0.5) {
                            visitEvent(event.point.x, this.name);
                        } else {
                            return;
                        }
                    }
                },
                states: {
                    hover: {
                        enabled: false
                    },
                    inactive: {
                        enabled: false
                    }
                }
            }
        },
        tooltip: {
            enabled: true,
            backgroundColor: "#000000",
            borderRadius: 6,
            borderWidth: 0,
            style: {
                opacity: 0.7,
                fontFamily: "Helvetica,Arial,sans-serif",
                fontSize: "13px",
                lineHeight: "20px",
                letterSpacing: "1.3px",
                textAlign: "center",
                color: "#ffffff",
                zIndex: "1200",
            },
            useHTML: true,
            formatter: function () {
                if (this.series.name === "Series 5") {
                    return false;
                }
                if (this.y === 3.5 && this.series.name === "Series 1") {
                    var ondayDate = getOneDayInjectData(this.x);
                    var html = '<div>';
                    for (let i = 0; i < ondayDate.length; i++) {
                        html += '' + state.injectKindList[(ondayDate[i].injectionDrugId - 1)] + '</br>';
                    }
                    html += '</div>';
                    return html;
                } else if (this.y === 2.5 && this.series.name === "Series 2") {
                    var ondayDate = getOneDayMedicationData(this.x);
                    var html = '<div>';
                    for (let i = 0; i < ondayDate.length; i++) {
                        html += '' + state.medicationKindList[(ondayDate[i].medicationDrugId - 1)] + '</br>';
                    }
                    html += '</div>';
                    return html;
                } else
                    return false;
            },
        },
        xAxis: {
            type: "datetime",
            max: X_MAX,
            min: X_MIN,
            tickInterval: ONE_DAY_MS,
            opposite: true,
            offset: 0,
            plotLines: [],
            tickLength: 0,
            lineWidth: 1,
            lineColor: "#e5e5e5",
            labels: {
                enabled: false
            }
        },
        yAxis: [{
            labels: {
                enabled: false
            },
            tickLength: 0,
            title: {
                text: null
            },
            gridLineWidth: 0,
            tickInterval: 1,
            maxPadding: 0,
            max: maxTailTemp,
            min: minTailTemp,
            tickmarkPlacement: "on",
            endOnTick: false,
            startOnTick: false,
            plotBands: [{
                color: "rgba(0,0,0,0)",
                from: minTailTemp + 4,
                to: maxTailTemp,
                zIndex: 0,
                events: {
                    dblclick: function () {
                        refreshTempChart();
                    }
                }
            }]
        }, {
            // 横線(実線)
            linkedTo: 0,
            gridLineWidth: 1,
            gridLineColor: "#e5e5e5",
            gridLineDashStyle: "solid",
            tickPositions: solidPositions,
            maxPadding: 0,
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            tickLength: 0
        }],
        series: [{
            // 注射アイコン
            type: "scatter",
            animation: false,
            data: [],
            dataLabels: {
                enabled: false
            },
            marker: {
                symbol: "url(/img/highcharts/svg/icon_graph_injection.svg)"
            },
            zIndex: 5
        }, {
            // 薬剤アイコン
            type: "scatter",
            animation: false,
            data: [],
            dataLabels: {
                enabled: false
            },
            marker: {
                symbol: "url(/img/highcharts/svg/icon_graph_yakuzai.svg)"
            },
            zIndex: 130
        }, {
            // タイミングアイコン
            type: "scatter",
            animation: false,
            data: [],
            dataLabels: {
                enabled: false
            },
            marker: {
                symbol: "url(/img/highcharts/svg/icon_graph_timing.svg)"
            },
            zIndex: 5
        }, {
            // 受診目安日アイコン
            type: "scatter",
            animation: false,
            data: [],
            dataLabels: {
                enabled: false
            },
            marker: {
                symbol: "url(/img/highcharts/svg/icon_graph_hospital.svg)"
            },
            zIndex: 5
        }, {
            // 隠すアイコン
            type: "scatter",
            animation: false,
            data: [],
            dataLabels: {
                enabled: false
            },
            marker: {
                symbol: "url(/img/highcharts/svg/icon_calender.svg)",
                width: 19,
                height: 19,
            },
            zIndex: 5,
            className: "hidePoint"
        }, {
            // mouseOverためのアイコン
            type: "scatter",
            animation: false,
            data: [],
            dataLabels: {
                enabled: false
            },
            marker: {
                lineWidth: 4,
            },
            zIndex: 5,
            color: 'rbga(0,0,0,0,0)',
            className: "sixPoint"
        }]
    };
}

//Highchartsに渡すoptionsを生成
function createHighchartsFooter() {
    return {
        chart: {
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            borderWidth: 0,
            borderColor: "rgb(229, 229, 229)",
            height: DAY_AREA_HEIGHT_PX,
            width: graphWidthPx,
            plotBorderWidth: 0,
            events: {
                load: onFootChartLoaded
            },
            animation: false
        },
        title: {
            text: null
        },
        subtitle: {
            text: null
        },
        credits: {
            // Highchartsへのリンクの非表示
            enabled: false
        },
        legend: {
            // プロットの凡例の非表示
            enabled: false
        },
        exporting: {
            // エクスポート機能無効化
            enabled: false
        },
        tooltip: {
            // カーソルをホバーした際に吹き出しを表示しない
            enabled: false
        },
        plotOptions: {
            series: {
                turboThreshold: 99999,
                enableMouseTracking: false,
                animation: false
            }
        },
        yAxis: {
            labels: {
                enabled: false
            }
        },
        xAxis: [{
            // 日の軸
            type: "datetime",
            max: X_MAX,
            min: X_MIN,
            tickInterval: ONE_DAY_MS,
            offset: 0,
            plotLines: [],
            tickLength: 0,
            lineWidth: 1,
            lineColor: "#e5e5e5",
            labels: {
                align: "center",
                rotation: 0,
                y: -9,
                padding: 0,
                formatter: function () {
                    // 土日だけ文字色を変更させる
                    const date = new Date(this.value);
                    var color;
                    switch (date.getDay()) {
                        case 0:
                            color = "#ef9e9e";
                            break;
                        case 6:
                            color = "#79a0cd";
                            break;
                        default:
                            color = "#585858";
                    }
                    return '<span style="color: ' + encodeURI(color) + ';" value=' + this.value + '>' + encodeURI(date.getDate()) + "</span>";
                },
                style: {
                    fontSize: "18px",
                    fontWeight: "bold"
                }
            }
        }],
        series: [{
            type: "line",
            animation: false
        }]
    };
}

//MemoのIcon 追加
function addMemoIconToGraph(chart) {
    if (!memoData) {
        return;
    }
    var xStart = Past365_Unix;
    var xEnd = Future40_UNIX;
    var injectionY = getIndex("注射");
    var medicationY = getIndex("薬剤");
    var timingY = 1.5;
    var visitY = 0.5;
    var mouseOverY = getIndex("mouseOver");
    var injectionSeries = chart.series[0];
    var medicationSeries = chart.series[1];
    var timingSeries = chart.series[2];
    var visitSeries = chart.series[3];
    var hideSeries = chart.series[4];
    var mouseOverSeries = chart.series[5];
    var point;
    for (let x = xStart + ONE_DAY_MS; x < xEnd; x += ONE_DAY_MS) {
        point = {
            x: x,
            y: mouseOverY
        };
        mouseOverSeries.addPoint(point, false, false, false);
        if (state.injectDayList.indexOf(x) > -1) {
            point = {
                x: x,
                y: injectionY
            };
            injectionSeries.addPoint(point, false, false, false);
        } else {
            point = {
                x: x,
                y: injectionY
            };
            hideSeries.addPoint(point, false, false, false);
        }
        if (state.medicationDayList.indexOf(x) > -1) {
            point = {
                x: x,
                y: medicationY
            };
            medicationSeries.addPoint(point, false, false, false);
        } else {
            point = {
                x: x,
                y: medicationY
            };
            hideSeries.addPoint(point, false, false, false);
        }
        if (state.timingDayList.indexOf(x) > -1) {
            point = {
                x: x,
                y: timingY
            };
            timingSeries.addPoint(point, false, false, false);
        } else {
            point = {
                x: x,
                y: timingY
            };
            hideSeries.addPoint(point, false, false, false);
        }
        if (state.visitDayList.indexOf(x) > -1) {
            point = {
                x: x,
                y: visitY
            };
            visitSeries.addPoint(point, false, false, false);
        } else {
            point = {
                x: x,
                y: visitY
            };
            hideSeries.addPoint(point, false, false, false);
        }
    }
}

//指定症状のindexを取得
function getIndex(name) {
    return memoEvent.indexOf(name) + 0.5;
}

//「" "」はタイミングと受診目安日のため 、「"mouseOver"は薬のlistを展開のため」
var memoEvent = ["", "", "薬剤", "注射", "mouseOver", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
var minTailTemp = Number(0);
var maxTailTemp = Number(memoEvent.length);
var tailHeight = 24 * DAY_AREA_HEIGHT_PX + 7;

//書き込みのダイアログを展開
function popBox(value, height, seriesName) {
    //クリックしたアイコンのクラス
    var className;
    var oneDayData;
    var oneDayDataId;
    var date = convertStampToDateTwo(value);
    if (height === 3.5) {
        oneDayData = getOneDayInjectData(value);
        oneDayDataId = getOneDayDataInjectId(oneDayData);
        for (let i = 0; i < state.injectIdList.length; i++) {
            let index = oneDayDataId.indexOf(state.injectIdList[i]);
            let drugItemHtml;
            if (index > -1) {
                drugItemHtml = '<div id="oldData' + oneDayData[index].injectionDrugId + '" class="oldData" injectiondrugid="' + oneDayData[index].injectionDrugId + '" injectionstart="' + oneDayData[index].injectionStart + '" injectionperiod="' + oneDayData[index].injectionPeriod + '" checked="1" style="display: none"></div>';
                drugItemHtml += '<div class="medicine" id=' + state.injectIdList[i] + ' style="height: 155px">'
                    + '<div class="drug-name" name="' + state.injectIdList[i] + '"><input onclick="showChoice(this)" kind="injection" type="checkbox" class="box" id="check' + state.injectIdList[i] + '" name="' + state.injectIdList[i] + '" checked/><label id="drug' + state.injectIdList[i] + '" for="check' + state.injectIdList[i] + '" style="font-weight: 600">' + state.injectKindList[i] + '</label></div>'
                    + '<div class="date" id="date' + state.injectIdList[i] + '">'
                    + '<span class="startDate">注射開始日</span>'
                    + '<span class="predio">注射期間</span>'
                    + '<div class="choice" id="choice' + state.injectIdList[i] + '">'
                    + '<div class="calendar" id="calendar' + oneDayData[index].injectionDrugId + '" value="' + oneDayData[index].injectionStart.replace(/\-/g, '/') + '"><input type="text" class="datepicker" id="datepicker' + state.injectIdList[i] + '" autocomplete="off" value="' + oneDayData[index].injectionStart.replace(/\-/g, '/') + '" readonly>'
                    + '<img src="/img/kakikomi/svg/icon_calender.svg" class="calendar-icon" /></div>'
                    + '<select id="mySelect' + state.injectIdList[i] + '" class="selectBox">';
                for (let j = 1; j <= 20; j++) {
                    if (oneDayData[index].injectionPeriod == j) {
                        drugItemHtml += '<option value="' + j + '" selected="selected">' + j + '日間</option>';
                    } else {
                        drugItemHtml += '<option value="' + j + '">' + j + '日間</option>';
                    }
                }
            } else {
                drugItemHtml = '<div class="medicine" id=' + state.injectIdList[i] + '>'
                    + '<div class="drug-name" name="' + state.injectIdList[i] + '"><input onclick="showChoice(this)" kind="injection" type="checkbox" class="box" id="check' + state.injectIdList[i] + '" name="' + state.injectIdList[i] + '"/><label id="drug' + state.injectIdList[i] + '" for="check' + state.injectIdList[i] + '">' + state.injectKindList[i] + '</label></div>'
                    + '<div class="date" id="date' + state.injectIdList[i] + '" style="display: none">'
                    + '<span class="startDate">注射開始日</span>'
                    + '<span class="predio">注射期間</span>'
                    + '<div class="choice" id="choice' + state.injectIdList[i] + '">'
                    + '<div class="calendar" id="calendar' + state.injectIdList[i] + '" value="' + date + '"><input type="text" class="datepicker" id="datepicker' + state.injectIdList[i] + '" autocomplete="off" value="' + date + '" readonly>'
                    + '<img src="/img/kakikomi/svg/icon_calender.svg" class="calendar-icon" /></div>'
                    + '<select id="mySelect' + state.injectIdList[i] + '" class="selectBox">'
                    + '<option value="1" selected="selected">1日間</option>';
                for (let j = 2; j <= 20; j++) {
                    drugItemHtml += '<option value="' + j + '">' + j + '日間</option>';
                }
            }
            drugItemHtml += '</select>'
                + '</div>'
                + '</div>'
                + '</div>';

            $(".list-item:eq(" + (i % 3) + ")").append(drugItemHtml);
        }
        for (let i = state.injectIdList.length; i < state.injectIdList.length + (3 - (state.injectIdList.length % 3)); i++) {
            drugItemHtml = '<div class="hide" id=' + i + '>test</div>';
            $(".list-item:eq(" + (i % 3) + ")").append(drugItemHtml);
        }

    } else {
        oneDayData = getOneDayMedicationData(value);
        oneDayDataId = getOneDayDataMedicationId(oneDayData);
        for (let i = 0; i < state.medicationIdList.length; i++) {
            let index1 = oneDayDataId.indexOf(state.medicationIdList[i]);
            let drugItemHtml;
            if (index1 > -1) {
                drugItemHtml = '<div id="oldData' + oneDayData[index1].medicationDrugId + '" class="oldData" medicationdrugid="' + oneDayData[index1].medicationDrugId + '" medicationstart="' + oneDayData[index1].medicationStart + '" medicationperiod="' + oneDayData[index1].medicationPeriod + '" checked="1"  style="display: none"></div>';
                drugItemHtml += '<div class="medicine" id=' + state.medicationIdList[i] + ' style="height: 155px">'
                    + '<div class="drug-name" name="' + state.medicationIdList[i] + '"><input onclick="showChoice(this)" kind="medication" type="checkbox" class="box" id="check' + state.medicationIdList[i] + '" name="' + state.medicationIdList[i] + '" checked/><label id="drug' + state.medicationIdList[i] + '" for="check' + state.medicationIdList[i] + '" style="font-weight: 600">' + state.medicationKindList[i] + '</label></div>'
                    + '<div class="date" id="date' + state.medicationIdList[i] + '">'
                    + '<span class="startDate">服薬開始日</span>'
                    + '<span class="predio">服薬期間</span>'
                    + '<div class="choice" id="choice' + state.medicationIdList[i] + '">'
                    + '<div class="calendar" id="calendar' + oneDayData[index1].medicationDrugId + '" value="' + oneDayData[index1].medicationStart.replace(/\-/g, '/') + '"><input type="text" class="datepicker" id="datepicker' + state.medicationIdList[i] + '" autocomplete="off" value="' + oneDayData[index1].medicationStart.replace(/\-/g, '/') + '" readonly>'
                    + '<img src="/img/kakikomi/svg/icon_calender.svg" class="calendar-icon" /></div>'
                    + '<select id="mySelect' + state.medicationIdList[i] + '" class="selectBox">'
                for (let j = 1; j <= 20; j++) {
                    if (oneDayData[index1].medicationPeriod == j) {
                        drugItemHtml += '<option value="' + j + '" selected="selected">' + j + '日間</option>';
                    } else {
                        drugItemHtml += '<option value="' + j + '">' + j + '日間</option>';
                    }
                }
            } else {
                drugItemHtml = '<div class="medicine" id=' + state.medicationIdList[i] + '>'
                    + '<div class="drug-name" name="' + state.medicationIdList[i] + '"><input onclick="showChoice(this)" kind="medication" type="checkbox" class="box" id="check' + state.medicationIdList[i] + '" name="' + state.medicationIdList[i] + '" /><label id="drug' + state.medicationIdList[i] + '" for="check' + state.medicationIdList[i] + '">' + state.medicationKindList[i] + '</label></div>'
                    + '<div class="date" id="date' + state.medicationIdList[i] + '" style="display: none">'
                    + '<span class="startDate">服薬開始日</span>'
                    + '<span class="predio">服薬期間</span>'
                    + '<div class="choice" id="choice' + state.medicationIdList[i] + '">'
                    + '<div class="calendar" id="calendar' + state.medicationIdList[i] + '" value="' + date + '"><input type="text" class="datepicker" id="datepicker' + state.medicationIdList[i] + '" autocomplete="off" value="' + date + '" readonly>'
                    + '<img src="/img/kakikomi/svg/icon_calender.svg" class="calendar-icon" /></div>'
                    + '<select id="mySelect' + state.medicationIdList[i] + '" class="selectBox">'
                    + '<option value="1" selected="selected">1日間</option>';
                for (let j = 2; j <= 20; j++) {
                    drugItemHtml += '<option value="' + j + '">' + j + '日間</option>';
                }
            }
            drugItemHtml += '</select>'
                + '</div>'
                + '</div>'
                + '</div>';

            $(".list-item:eq(" + (i % 3) + ")").append(drugItemHtml);
        }
        for (let i = state.medicationIdList.length; i < state.medicationIdList.length + (3 - (state.medicationIdList.length % 3)); i++) {
            drugItemHtml = '<div class="hide" id=' + i + '>test</div>';
            $(".list-item:eq(" + (i % 3) + ")").append(drugItemHtml);
        }
    }

    if (seriesName == "Series 5") {
        if (height === 2.5) {
            className = "medicine-img";
            $("#box-title").text("薬剤登録");
            for (let i = 1; i <= state.medicationIdList.length; i++) {
                datepicker.init('datepicker' + i + '', value);
            }
        } else {
            $("#box-title").text("注射登録");
            className = "inject-img";
            for (let i = 1; i <= state.injectIdList.length; i++) {
                datepicker.init('datepicker' + i + '', value);
            }
        }
    } else {
        if (height === 2.5) {
            className = "medicine-img";
            $("#box-title").text("登録中の薬剤");
            for (let i = 1; i <= state.medicationIdList.length; i++) {
                datepicker.init('datepicker' + i + '', value);
            }
        } else {
            $("#box-title").text("登録中の注射");
            className = "inject-img";
            for (let i = 1; i <= state.injectIdList.length; i++) {
                datepicker.init('datepicker' + i + '', value);
            }
        }
    }

    if ("Series 5" != seriesName) {
        $("#write").css("display", "none");
        $("#delete").css("display", "inline");
        $("#delete").attr("kind", className);
        $("#change").css("display", "inline");
        $("#change").attr("kind", className);
    } else {
        $("#write").css("display", "inline");
        $("#write").attr("kind", className);
        $("#delete").css("display", "none");
        $("#change").css("display", "none");
    }


    if (agent.indexOf("mac") !== -1) {
        $('.datepicker').css("font-family", "Helvetica,Arial,sans-serif");
        $('.selectBox').css("font-family", "Helvetica,Arial,sans-serif");
        $('.startDate').css("font-family", "Helvetica,Arial,sans-serif");
        $('.predio').css("font-family", "Helvetica,Arial,sans-serif");
    }

    //ブラウザの高さ
    var totalHeight = document.documentElement.clientHeight;
    //ダイアログの高さ
    var height = totalHeight - 50;
    $('#popBox').css("height", height);

    if ($('.list-item').innerWidth() * 3 < $('#popBox').innerWidth()) {
        $('.drug-list').css('justify-content', 'flex-end');
    }

    $('#popBox').css("display", "block");
    $('#popLayer').css("display", "block");
    $('.drug-list').css("top", "12%");
    $('.drug-list').css("height", "74%");

    drugListHeightSet();
}

//書き込みのダイアログを閉じる
function closeBox() {
    $('.errorMessage').hide();
    $('#popBox').hide();
    $('#popLayer').hide();
    $('.list-item').empty();
    $('#change').css("color", "#C5C5C5");
    $('#change').css("background", "#f7f7f7");
    $('#change').css("box-shadow", "none");
    $('#change').attr("disabled", "disabled");
}

//薬の選択肢を開く
function showChoice(obj) {
    var a = obj.getAttribute('name');
    //checkboxのid
    var boxId = "check" + a;
    //calendarのdivのid
    var id = "date" + a;
    if ($('#' + boxId + '').attr("checked") == undefined) {
        $('#' + id + '').show();
        $('#' + a + '').css("height", "155px");
        $('#' + boxId + '').attr("checked", "checked");
        $('#drug' + a + '').css("font-weight", "600");
    } else {
        $('#' + id + '').hide();
        $('#' + a + '').css("height", "55px");
        $('#' + boxId + '').removeAttr("checked");
        $('#drug' + a + '').css("font-weight", "normal");
    }
    drugListHeightSet();
    if (navigator.userAgent.indexOf("Safari") >= 0) {
        drugChange();
    }
}

const _item1 = document.getElementById("item1");
const _item2 = document.getElementById("item2");
const _item3 = document.getElementById("item3");

function drugListHeightSet() {
    let scrollTop3 = $('#item3').scrollTop();
    $('.placeholder').remove();
    if (_item1.scrollHeight - _item1.offsetHeight <= 0 &&
        _item2.scrollHeight - _item2.offsetHeight <= 0 &&
        _item3.scrollHeight - _item3.offsetHeight <= 0) {
        return;
    }

    const maxScrollHeight = Math.max(_item1.scrollHeight, _item2.scrollHeight, _item3.scrollHeight);
    var itemArray = [_item1, _item2, _item3];

    for (let i = 0; i < itemArray.length; i++) {
        if (itemArray[i].scrollHeight < maxScrollHeight) {
            let contentHeight = 0;
            $("#item" + (parseInt(i) + 1) + " .medicine").each(function () {
                contentHeight += $(this).height();
            })
            if (i == 2) {
                contentHeight += 55;
            }
            $("#item" + (i + 1) + "").append('<div class="placeholder" style="height: ' + parseInt(maxScrollHeight - contentHeight) + 'px"></div>');
            $("#item" + (i + 1) + "").scrollTop(scrollTop3);
        }
    }
}

/*****************
 *datepickerについて 
 * ***************/
var todayYear = NOW.getFullYear();
var todayMonth = NOW.getMonth() + 1;
var todayDate = NOW.getDate();
var fourtyDayMonth = new Date(getDateStr(40)).getMonth() + 1;
var fourtyDayYear = new Date(getDateStr(40)).getFullYear();
var oneYearPastStamp = new Date(todayYear - 1, todayMonth - 1, 1).getTime();
var fourtyDayStamp = new Date(fourtyDayYear, fourtyDayMonth - 1, 1).getTime();

(function () {
    var datepicker = {};
    datepicker.getMonthDate = function (year, month) {
        var ret = [];
        if ((!year || !month) && month != 0) {
            var today = new Date();
            year = today.getFullYear();
            month = today.getMonth() + 1;
        }
        var firstDay = new Date(year, month - 1, 1);
        var firstDayWeekDay = firstDay.getDay();
        if (firstDayWeekDay === 0) {
            firstDayWeekDay = 1;
        }
        year = firstDay.getFullYear();
        month = firstDay.getMonth() + 1;
        var lastDayOfLastMonth = new Date(year, month - 1, 0);
        var lastDateOfLastMonth = lastDayOfLastMonth.getDate();
        //表示された先月の日数
        var preMonthDayCount = firstDayWeekDay;
        //今月最後の日
        var lastDay = new Date(year, month, 0);
        var lastDate = lastDay.getDate();
        for (var i = 0; i < 7 * 6; i++) {
            var date = i + 1 - preMonthDayCount;
            var showDate = date;
            var thisMonth = month;
            if (date <= 0) {
                thisMonth = month - 1;
                showDate = lastDateOfLastMonth + date;
            } else if (date > lastDate) {
                thisMonth = month + 1;
                showDate = showDate - lastDate;
            }
            if (thisMonth === 0) {
                thisMonth = 12;
            }
            if (thisMonth === 13) {
                thisMonth = 1;
            }
            ret.push({
                month: thisMonth,
                date: date,
                showDate: showDate
            });
        }
        return {
            year: year,
            month: month,
            days: ret
        };
    }
    window.datepicker = datepicker;
})();

(function () {
    var datepicker = window.datepicker;
    var monthData;
    datepicker.buildUi = function (year, month, value) {
        var colorChangeDateFuture = new Date().addDate(40);
        var colorChangeDatePast = new Date().addDate(-365);
        var colorChangeDayFuture = colorChangeDateFuture.getDate();
        var colorChangeMonFuture = colorChangeDateFuture.getMonth() + 1;
        var colorChangeYearFuture = colorChangeDateFuture.getFullYear();

        var colorChangeDayPast = colorChangeDatePast.getDate();
        var colorChangeMonPast = colorChangeDatePast.getMonth() + 1;
        var colorChangeYearPast = colorChangeDatePast.getFullYear();

        var selectedDayYear = new Date(value).getFullYear();
        var selectedDayMonth = new Date(value).getMonth() + 1;
        var selectedDayDate = new Date(value).getDate();
        monthData = datepicker.getMonthDate(year, month);
        var html = '<div class="calendar_border">' +
            '<div class="ui_datapicker_header">' +
            '<img src="/img/kakikomi/svg/icon_Calender_arrow_1.svg" class="ui_datapicker_btn ui_datapicker_prev_btn"/>' +
            '<img src="/img/kakikomi/svg/icon_Calender_arrow_2.svg" class="ui_datapicker_btn ui_datapicker_next_btn" />' +
            '<span class="ui_datapicker_curr_month" currMonth="' + monthData.month + '" currYear="' + monthData.getFullYear + '">' + monthData.year + '年' + monthData.month + '月' + '</span>' +
            '</div>' +
            '<div class="ui_datapicker_body">' +
            '<table>' +
            '<thead>' +
            '<tr>' +
            '<th>日</th>' +
            '<th>月</th>' +
            '<th>火</th>' +
            '<th>水</th>' +
            '<th>木</th>' +
            '<th>金</th>' +
            '<th>土</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';
        for (var i = 0; i < monthData.days.length; i++) {
            var date = monthData.days[i];
            if (i % 7 === 0) {
                html += '<tr>';
            }

            if (monthData.month < monthData.days[i].month || monthData.month > monthData.days[i].month) {
                html += '<td data-date=-1 class="unable"></td>';
            } else if (monthData.year == selectedDayYear && monthData.month == selectedDayMonth && monthData.days[i].showDate == selectedDayDate) {
                html += '<td data-date="' + date.date + '" style="background: #e5f1ff">' + date.showDate + '</td>';
            } else if (monthData.year == todayYear && monthData.month == todayMonth && monthData.days[i].showDate == todayDate) {
                html += '<td data-date="' + date.date + '" style="background: #FFEDEE">' + date.showDate + '</td>';
            } else if (monthData.year == colorChangeYearFuture && monthData.month == colorChangeMonFuture && monthData.days[i].date >= colorChangeDayFuture) {
                html += '<td data-date="' + date.date + '" class="unable">' + date.showDate + '</td>';
            } else if (monthData.year == colorChangeYearPast && monthData.month == colorChangeMonPast && monthData.days[i].date <= colorChangeDayPast) {
                html += '<td data-date="' + date.date + '" class="unable">' + date.showDate + '</td>';
            } else {
                html += '<td data-date="' + date.date + '" class="sample">' + date.showDate + '</td>';
            }
            if (i % 7 === 6) {
                html += '</tr>';
            }
        }
        html += '</tbody>' + '</table>' + '</div>' + '</div>';
        return html;
    };

    datepicker.render = function (direction, input, value) {
        var year = new Date(value).getFullYear();
        var month = new Date(value).getMonth() + 1;
        if (direction != "") {
            year = monthData.year;
            month = monthData.month;
        }
        var selectDayStamp = new Date(year, month - 1, 1).getTime();
        if (direction === 'prev' && selectDayStamp > oneYearPastStamp) {
            month--;
        }
        if (direction === 'next' && selectDayStamp < fourtyDayStamp) {
            month++;
        }
        var html = datepicker.buildUi(year, month, value);

        var $wrapper = document.getElementById('ui_' + input + '');
        if (null == $wrapper) {
            $wrapper = document.createElement('div');
            $('#' + input + '').parent("div").append($wrapper);
            $wrapper.className = 'ui_datapicker_wrapper';
            $wrapper.id = 'ui_' + input;
        }
        $wrapper.innerHTML = html;
        $('.ui_datapicker_btn.ui_datapicker_prev_btn').show();
        $('.ui_datapicker_btn.ui_datapicker_next_btn').show();
        if (year == fourtyDayYear && month == fourtyDayMonth) {
            $('.ui_datapicker_btn.ui_datapicker_next_btn').css("display", "none");
        } else if (year == todayYear - 1 && month == todayMonth) {
            $('.ui_datapicker_btn.ui_datapicker_prev_btn').css("display", "none");
        }
    };

    datepicker.init = function (input, value) {
        datepicker.render("", input, value);
        var $input = document.getElementById(input);
        var id = input.replace(/[^0-9]/ig, "");
        var $calendar = document.getElementById('calendar' + id + '');
        var $wrapper = document.getElementById('ui_' + input + '');
        $calendar.addEventListener('click', function (e) {
            if ($('#ui_datepicker' + id + '').hasClass('ui_datapicker_wrapper_show')) {
                $('#ui_datepicker' + id + '').removeClass('ui_datapicker_wrapper_show');
            } else {
                $('.ui_datapicker_wrapper').removeClass('ui_datapicker_wrapper_show');
                datepicker.render("", input, $input.value);
                $wrapper.classList.add('ui_datapicker_wrapper_show');
                var left = $input.offsetLeft;
                var top = $input.offsetTop;
                var height = $input.offsetHeight;
                $wrapper.style.top = top + height + 0 + 'px';
                $wrapper.style.left = left + 'px';
            }
            e.stopPropagation();
            drugListHeightSet();
        });
        $wrapper.addEventListener('click', function (e) {
            var $target = e.target;
            if (!$target.classList.contains('ui_datapicker_btn')) {
                e.stopPropagation();
            }
            if ($target.classList.contains('ui_datapicker_prev_btn')) {
                datepicker.render('prev', input, $input.value);
                e.stopPropagation();
            } else if ($target.classList.contains('ui_datapicker_next_btn')) {
                datepicker.render('next', input, $input.value);
                e.stopPropagation();
            }
        });
        $wrapper.addEventListener('click', function (e) {
            var $target = e.target;
            var className = $target.getAttribute("class");
            if ($target.tagName.toLowerCase() !== 'td' || className == "unable") {
                e.stopPropagation();
            } else {
                var date = new Date(monthData.year, monthData.month - 1, $target.dataset.date);
                $input.value = format(date);
                onDatepickerChange();
                $wrapper.classList.remove('ui_datapicker_wrapper_show');
                datepicker.render('', input, value);
                drugListHeightSet();
                e.stopPropagation();
            }
        });
    };
    function format(date) {
        let ret = '';
        var padding = function (num) {
            if (num <= 9) {
                return '0' + num;
            }
            return num;
        }
        ret += date.getFullYear() + '/';
        ret += padding(date.getMonth() + 1) + '/';
        ret += padding(date.getDate());
        return ret;
    }
})();

//当日から何日後のdate
function getDateStr(x) {
    var dd = new Date();
    dd.setDate(dd.getDate() + x);
    var y = dd.getFullYear();
    var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
    return y + "-" + m + "-" + d;
};
//一年前の日付
function oneYearAgo() {
    var dd = new Date();
    var y = dd.getFullYear() - 1;
    var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
    return y + "-" + m + "-" + d;
}
//変更buttonを活性化する
window.addEventListener('input', function (e) {
    var flg = false;
    $(':checkbox').each(function () {
        var id = $(this).attr("name");
        if ($(this).attr("checked") == "checked") {
            if ($('#oldData' + id + '').attr("checked") != "checked") {
                flg = true;
                return;
            } else {
                var oldStart = $('#oldData' + id + '').attr("injectionstart");
                var oldPeriod = $('#oldData' + id + '').attr("injectionperiod");
                if ($(this).attr("kind") == "medication") {
                    oldStart = $('#oldData' + id + '').attr("medicationstart");
                    oldPeriod = $('#oldData' + id + '').attr("medicationperiod");
                }
                oldStart = oldStart.replace(/-/g, "/");
                if ($('#datepicker' + id + '').val() != oldStart || $('#mySelect' + id + '').val() != oldPeriod) {
                    flg = true;
                    return;
                }
            }
        } else {
            if ($('#oldData' + id + '').attr("checked") == "checked") {
                flg = true;
                return;
            }
        }
    });
    if (flg) {
        $('#change').css("color", "#585858");
        $('#change').css("background", "linear-gradient(180deg, #F7F7F7 0%, #DFDFDF 100%)");
        $('#change').css("box-shadow", "0 2px 2px #acacac");
        $('#change').removeAttr("disabled");
    } else {
        $('#change').css("color", "#C5C5C5");
        $('#change').css("background", "#f7f7f7");
        $('#change').css("box-shadow", "none");
        $('#change').attr("disabled", "disabled");
    }
}, false);

//datepickerの値が変わった時
function onDatepickerChange() {
    var flg = false;
    $(".datepicker").each(function () {
        if ($(this).val() != $(this).attr("value")) {
            flg = true;
            return flg;
        }
    });
    $(":checkbox").each(function () {
        var id = $(this).attr("name");
        if ($(this).attr("checked") == "checked") {
            if ($('#oldData' + id + '').attr("checked") != "checked") {
                flg = true;
                return flg;
            } else {
                var oldStart = $('#oldData' + id + '').attr("injectionstart");
                var oldPeriod = $('#oldData' + id + '').attr("injectionperiod");
                if ($(this).attr("kind") == "medication") {
                    oldStart = $('#oldData' + id + '').attr("medicationstart");
                    oldPeriod = $('#oldData' + id + '').attr("medicationperiod");
                }
                oldStart = oldStart.replace(/-/g, "/");
                if ($('#datepicker' + id + '').val() != oldStart || $('#mySelect' + id + '').val() != oldPeriod) {
                    flg = true;
                    return flg;
                }
            }
        } else {
            if ($('#oldData' + id + '').attr("checked") == "checked") {
                flg = true;
                return flg;
            }
        }
    });
    if (flg) {
        $('#change').css("color", "#585858");
        $('#change').css("background", "linear-gradient(180deg, #F7F7F7 0%, #DFDFDF 100%)");
        $('#change').css("box-shadow", "0 2px 2px #acacac");
        $('#change').removeAttr("disabled");
    } else {
        $('#change').css("color", "#C5C5C5");
        $('#change').css("background", "#f7f7f7");
        $('#change').css("box-shadow", "none");
        $('#change').attr("disabled", "disabled");
    }
}

function drugChange() {
    var flg = false;
    $(":checkbox").each(function () {
        var id = $(this).attr("name");
        if ($(this).attr("checked") == "checked") {
            if ($('#oldData' + id + '').attr("checked") != "checked") {
                flg = true;
                return flg;
            } else {
                var oldStart = $('#oldData' + id + '').attr("injectionstart");
                var oldPeriod = $('#oldData' + id + '').attr("injectionperiod");
                if ($(this).attr("kind") == "medication") {
                    oldStart = $('#oldData' + id + '').attr("medicationstart");
                    oldPeriod = $('#oldData' + id + '').attr("medicationperiod");
                }
                oldStart = oldStart.replace(/-/g, "/");
                if ($('#datepicker' + id + '').val() != oldStart || $('#mySelect' + id + '').val() != oldPeriod) {
                    flg = true;
                    return flg;
                }
            }
        } else {
            if ($('#oldData' + id + '').attr("checked") == "checked") {
                flg = true;
                return flg;
            }
        }
    });
    if (flg) {
        $('#change').css("color", "#585858");
        $('#change').css("background", "linear-gradient(180deg, #F7F7F7 0%, #DFDFDF 100%)");
        $('#change').css("box-shadow", "0 2px 2px #acacac");
        $('#change').removeAttr("disabled");
    } else {
        $('#change').css("color", "#C5C5C5");
        $('#change').css("background", "#f7f7f7");
        $('#change').css("box-shadow", "none");
        $('#change').attr("disabled", "disabled");
    }
}

$(document).mouseup(function (e) {
    var target = $('.ui_datapicker_wrapper');
    if (!target.is(e.target) && target.has(e.target).length === 0) {
        if (!$('.datepicker').is(e.target) && !$('.calendar-icon').is(e.target)) {
            $('.ui_datapicker_wrapper').removeClass('ui_datapicker_wrapper_show');
        }
        drugListHeightSet();
    }
    if ($('.selectBox').is(e.target)) {
        drugListHeightSet();
    }
    e.stopPropagation();
});