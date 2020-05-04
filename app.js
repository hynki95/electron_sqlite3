const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

const mainArea = document.getElementById('main-area');
const template = document.querySelector('#card-template');
const contents = document.getElementById('input-memo');

/* 날짜를 YYYY-MM-DD로 출력하기 위해 사용됩니다. */
Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    return  yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]);
}

function addMemo() {
    date = new Date().yyyymmdd();
    const query = `INSERT INTO memo(contents, date) VALUES ('${contents.value}', '${date}')`;
    db.serialize();
    db.each(query);
    contents.value = ""; /* input에 입력된 값을 없앱니다. */
    listMemo(); /* 메모가 추가되면, 화면에 새로 업데이트해줍니다. */
}

function displayMemo(contents, date) {
    let clone = document.importNode(template.content, true);
    clone.querySelector('.contents').innerText = contents;
    clone.querySelector('.date').innerText = date;
    mainArea.appendChild(clone);
}

function listMemo() {
    mainArea.innerHTML = ""; /* 메모 목록을 보여주기 전에 mainArea를 비웁니다. */
    db.serialize(function () {
        db.each("SELECT rowid AS id, contents, date FROM memo", function (err, row) {
            displayMemo(row.contents, row.date);
        });
    });
}

listMemo();