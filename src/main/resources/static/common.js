//tailGraphをrefreshするかどうか判断するため
var tailRefresh = false;

//Unix timestampを普通なdate typeにする
function add0(m) { return m < 10 ? "0" + m : m }
function convertStampToDate(timestamp) {
    var time = new Date(timestamp);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    return y + "-" + add0(m) + "-" + add0(d);
}
function convertStampToDateTwo(timestamp) {
    var time = new Date(timestamp);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    return y + "/" + add0(m) + "/" + add0(d);
}

//データ初期処理
function initialData() {
    state.injectionList = null;
    state.medicationList = null;
    state.timingScheduleList = null;
    state.visitScheduleList = null;
    state.mstInjection = null;
    state.mstMedication = null;
    state.baseParameter = null;
    state.injectDayList = [];
    state.medicationDayList = [];
    state.injectKindList = [];
    state.medicationKindList = [];
    state.injectIdList = [];
    state.medicationIdList = [];
    state.timingDayList = [];
    state.visitDayList = [];
    if (!memoData) return;
    state.injectionList = memoData.injectionList;
    for (let i = 0; i < memoData.injectionList.length; i++) {
        state.injectDayList[i] = new Date(memoData.injectionList[i].injectionDate).getTime();
    }
    state.medicationList = memoData.medicationList;
    for (let i = 0; i < memoData.medicationList.length; i++) {
        state.medicationDayList[i] = new Date(memoData.medicationList[i].medicationDate).getTime();
    }
    state.timingScheduleList = memoData.timingScheduleList;
    for (let i = 0; i < memoData.timingScheduleList.length; i++) {
        state.timingDayList[i] = new Date(memoData.timingScheduleList[i].timingDate).getTime();
    }
    state.visitScheduleList = memoData.visitScheduleList;
    for (let i = 0; i < memoData.visitScheduleList.length; i++) {
        state.visitDayList[i] = new Date(memoData.visitScheduleList[i].visitDate).getTime();
    }
    state.mstInjection = memoData.injectionMsts;
    for (let i = 0; i < memoData.injectionMsts.length; i++) {
        state.injectKindList[i] = memoData.injectionMsts[i].injectionDrug;
        state.injectIdList[i] = memoData.injectionMsts[i].drugId;
    }
    state.mstMedication = memoData.medicationMsts;
    for (let i = 0; i < memoData.medicationMsts.length; i++) {
        state.medicationKindList[i] = memoData.medicationMsts[i].medicationDrug;
        state.medicationIdList[i] = memoData.medicationMsts[i].drugId;
    }
}
//tailGraph画面をrefresh
function drawTailGraph() {
    if (tagState.GraphState === 1) {
        return;
    }
    initialData();
    tailRefresh = true;
    state.chartTail && state.chartTail.destroy();
    state.chartTail = null;
    const tailOptions = createHighchartsTailOptions(minTailTemp, maxTailTemp);
    tailOptions.chart.renderTo = "highchartTail";
    state.chartTail = new Highcharts.Chart(tailOptions);
    tagState.GraphState = 1;
    $(".highcharts-xaxis-labels text tspan").each(function () {
        if ($(this).text() === "…") $(this).text("");
    });
}
function refreshTailGraph() {
    var request = new Object();
    request.PatientUid = patientUid;
    request.ClinicId = $("#ClinicId").val();
    request.DoctorSub = doctorSub;
    request.DataNumber = $("#DataNumber").val();
    var getMemoDataUri = "/api/memoApi/getMemoData";
    tagState.GraphState = -1;
    $.ajax({
        async: false,
        url: getMemoDataUri,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(request),
        success: function (response) {
            if (response.statusCode === 200) {
                memoData = response.data.memoData;
                patientUid = response.data.patientUid;
                doctorSub = response.data.doctorSub;
                //画面の描画
                drawTailGraph();
                setOverflowVisible();
            } else {
                showError();
            }
        },
        error: function () {
            showError();
        }
    });
}

//postdataの検查
function checkData(date, period) {
    var future40 = getDateStr(40).replace(/\-/g, "/");
    var plandate = addDays(date, period)
    var unix1 = Date.parse(future40);
    var unix2 = Date.parse(plandate);
    if (unix2 <= unix1) {
        return true;
    }
    else
        return false;
}
function addDays(date, days, separator = "/") {
    let oDate = new Date(date).valueOf();
    let nDate = oDate + days * 24 * 3600 * 1000;
    nDate = new Date(nDate);
    let y = nDate.getFullYear().toString().padStart(2, 0);
    let m = (nDate.getMonth() + 1).toString().padStart(2, 0);
    let d = nDate.getDate().toString().padStart(2, 0);
    return `${y}${separator}${m}${separator}${d}`;
}

//dataNumber = 111111の場合
function specialDeal() {
    $("#kakikomiLoading").css("display", "none");
    $("#indicateLayer").css("display", "none");
    closeBox();
}

//エラーboxを閉じる
function closeErrorBox() {
    $(".errorBox").css("display", "none");
    $("#popLayer").css("display", "none");
    $("#indicateLayer").css("display", "none");
}

function showMemoError(response) {
    $("#kakikomiLoading").css("display", "none");
    closeBox();
    $(".error-text").html(response);
    $(".errorBox").show();
    $("#popLayer").show();
}

//ダイアログを閉じる
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

/*********注射、薬剤のicon増加削除更新***********/
function addIcon(obj) {
    var url;
    var listName;
    var requestData;
    $(".drug-list").css("top", "12%");
    $(".drug-list").css("height", "74%");
    if (obj.getAttribute("kind") == "inject-img") {
        url = "/api/memoApi/addInjection";
        listName = "InjectionList";
        requestData = makeInjectPostData();
    }
    if (obj.getAttribute("kind") == "medicine-img") {
        url = "/api/memoApi/addMedication";
        listName = "MedicationList";
        requestData = makeMedicationPostData();
    }
    if (false == requestData) {
        $(".errorMessage").show();
        $(".drug-list").css("top", "15%");
        $(".drug-list").css("height", "70%");
        return;
    } else {
        $(".errorMessage").hide();
        $(".drug-list").css("top", "12%");
        $(".drug-list").css("height", "74%");
    }
    if (0 == requestData[listName].length) {
        return;
    }
    //データをDBに保存する
    var addIcon = $.ajax({
        async: true,
        url: url,
        timeout: 20000,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(requestData),
        beforeSend: function () {
            //loading画面表示
            $("#kakikomiLoading").show();
        },
        success: function (response) {
            if (response.statusCode === 200) {
                closeBox();
                //画面をrefresh
                refreshTailGraph();
                $("#kakikomiWrite").show();
                $("#kakikomiWrite").fadeOut(4500);
                $("#popLayer").css("display", "none");
            } else {
                var message = response.responseJSON.ErrorDescription;
                showMemoError(message);
            }
        },
        error: function (response, status) {
            if (response.status === 200) {
                specialDeal();
                $("#kakikomiWrite").show();
                $("#kakikomiWrite").fadeOut(4500);
                return;
            }
            if (status == "timeout" || response.responseJSON == undefined) {
                addIcon.abort();
                $("#kakikomiLoading").css("display", "none");
                var message = "データ登録する際にエラー発生しました。<br>通信状況を確認し、もう一度試してください。";
                showMemoError(message);
                return;
            }
            if (response.responseJSON.ErrorCode == "E003") {
                $("#kakikomiLoading").css("display", "none");
                $(".errorMessage").show();
                $(".errorMessage").html(response.responseJSON.ErrorDescription);
                $(".drug-list").css("top", "18%");
                $(".drug-list").css("height", "68%");
                return;
            }
            if (response != null) {
                var message = response.responseJSON.ErrorDescription;
                showMemoError(message);
                return;
            }
        },
        complete: function () {
            $("#kakikomiLoading").css("display", "none");
        }
    });
}

function updateIcon(obj) {
    var url;
    var request;
    var oldList;
    var arr;
    $(".drug-list").css("top", "12%");
    $(".drug-list").css("height", "74%");
    if (obj.getAttribute("kind") == "medicine-img") {
        url = "/api/memoApi/updateMedication";
        request = makeMedicationPostData();
        if (false == request) {
            $(".errorMessage").show();
            $(".drug-list").css("top", "15%");
            $(".drug-list").css("height", "70%");
            return;
        }
        oldList = [];
        $(".oldData").each(function () {
            var oldInfo = new Object();
            oldInfo.medicationDrugId = $(this).attr("medicationdrugid");
            arr = state.mstMedication.filter(function (item) {
                return item.drugId == oldInfo.medicationDrugId;
            });
            oldInfo.medicationName = arr[0].medicationDrug;
            oldInfo.medicationStart = $(this).attr("medicationstart");
            oldInfo.medicationPeriod = $(this).attr("medicationperiod");
            oldList.push(oldInfo);
        });
        request.OldMedicationList = oldList;

    } else {
        url = "/api/memoApi/updateInjection";
        request = makeInjectPostData();
        if (false == request) {
            $(".errorMessage").show();
            $(".drug-list").css("top", "15%");
            $(".drug-list").css("height", "70%");
            return;
        }
        oldList = [];
        $(".oldData").each(function () {
            var oldInfo = new Object();
            oldInfo.InjectionDrugId = $(this).attr("injectiondrugid");
            arr = state.mstInjection.filter(function(item) {
                return item.drugId == oldInfo.InjectionDrugId;
            });
            oldInfo.InjectionName = arr[0].injectionDrug;
            oldInfo.InjectionStart = $(this).attr("injectionstart");
            oldInfo.InjectionPeriod = $(this).attr("injectionperiod");
            oldList.push(oldInfo);
        });
        request.OldInjectionList = oldList;
    }
    var updateIcon = $.ajax({
        async: true,
        url: url,
        timeout: 20000,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(request),
        beforeSend: function () {
            //loading画面表示
            $("#kakikomiLoading").show();
        },
        success: function (response) {
            if (response.statusCode === 200) {
                closeBox();
                //画面をrefresh
                refreshTailGraph();
                $("#kakikomiUpdate").show();
                $("#kakikomiUpdate").fadeOut(4500);
                $("#popLayer").css("display", "none");
            } else {
                var message = response.responseJSON.ErrorDescription;
                showMemoError(message);
            }
        },
        error: function (response, status) {
            if (response.status === 200) {
                specialDeal();
                $("#kakikomiUpdate").show();
                $("#kakikomiUpdate").fadeOut(4500);
                return;
            }
            if (status == "timeout" || response.responseJSON == undefined) {
                updateIcon.abort();
                $("#kakikomiLoading").css("display", "none");
                var message = "データ登録する際にエラー発生しました。<br>通信状況を確認し、もう一度試してください。";
                showMemoError(message);
                return;
            }
            if (response.responseJSON.ErrorCode == "E003") {
                $("#kakikomiLoading").css("display", "none");
                $(".errorMessage").show();
                $(".errorMessage").html(response.responseJSON.ErrorDescription);
                $(".drug-list").css("top", "18%");
                $(".drug-list").css("height", "68%");
                return;
            }
            if (response != null) {
                var message = response.responseJSON.ErrorDescription;
                showMemoError(message);
                return;
            }
        },
        complete: function () {
            $("#kakikomiLoading").css("display", "none");
        }
    });
}

function deleteIcon(obj) {
    var oldList = [];
    var url;
    var request;
    var oldInfo;
    var arr;
    $(".drug-list").css("top", "12%");
    $(".drug-list").css("height", "74%");
    if (obj.getAttribute("kind") == "medicine-img") {
        url = "/api/memoApi/deleteMedication";
        $(".oldData").each(function () {
            oldInfo = new Object();
            oldInfo.medicationDrugId = $(this).attr("medicationdrugid");
            arr = state.mstMedication.filter(function (item) {
                return item.drugId == oldInfo.medicationDrugId;
            });
            oldInfo.medicationName = arr[0].medicationDrug;
            oldInfo.medicationStart = $(this).attr("medicationstart");
            oldInfo.medicationPeriod = $(this).attr("medicationperiod");
            oldList.push(oldInfo);
        });
        request = makeMedicationPostData();
        request.OldMedicationList = oldList;
        request.MedicationList = [{}];
    } else {
        //oldListとnewListを取得
        $(".oldData").each(function () {
            oldInfo = new Object();
            oldInfo.injectionDrugId = $(this).attr("injectiondrugid");
            arr = state.mstInjection.filter(function (item) {
                return item.drugId == oldInfo.injectionDrugId;
            });
            oldInfo.injectionName = arr[0].injectionDrug;
            oldInfo.injectionStart = $(this).attr("injectionstart");
            oldInfo.injectionPeriod = $(this).attr("injectionperiod");
            oldList.push(oldInfo);
        });
        request = makeInjectPostData();
        request.OldInjectionList = oldList;
        request.InjectionList = [{}];
        url = "/api/memoApi/deleteInjection";
    }
    var deleteIcon = $.ajax({
        async: true,
        url: url,
        timeout: 20000,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(request),
        beforeSend: function () {
            //loading画面表示
            $("#kakikomiLoading").show();
        },
        success: function (response) {
            if (response.statusCode === 200) {
                closeBox();
                //画面をrefresh
                refreshTailGraph();
                $("#kakikomiDelete").show();
                $("#kakikomiDelete").fadeOut(4500);
                $("#popLayer").css("display", "none");
            } else {
                var message = response.responseJSON.ErrorDescription;
                showMemoError(message);
            }
        },
        error: function (response, status) {
            if (response.status === 200) {
                specialDeal();
                $("#kakikomiDelete").show();
                $("#kakikomiDelete").fadeOut(4500);
                return;
            }
            if (status == "timeout" || response.responseJSON == undefined) {
                deleteIcon.abort();
                $("#kakikomiLoading").css("display", "none");
                var message = "データ登録する際にエラー発生しました。<br>通信状況を確認し、もう一度試してください。";
                showMemoError(message);
                return;
            }
            if (response != null) {
                var message = response.responseJSON.ErrorDescription;
                showMemoError(message);
                return;
            }
        },
        complete: function () {
            $("#kakikomiLoading").css("display", "none");
        }
    });
}
