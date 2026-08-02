// =========================================
// Firebase 初期化
// =========================================

// const firebaseConfig = {
//     apiKey: "あなたのAPIキー",
//     authDomain: "slot-nanryo.firebaseapp.com",
//     databaseURL: "https://slot-nanryo-default-rtdb.firebaseio.com",
//     projectId: "slot-nanryo",
//     storageBucket: "slot-nanryo.appspot.com",
//     messagingSenderId: "xxxxxxxxxxxx",
//     appId: "xxxxxxxxxxxxxxxxxxxxxxxx"
// };

const firebaseConfig = {
    apiKey: "AIzaSyAqr8nBTr78Lw7tM-B5v2dm0FSBwsRU0pI",
    authDomain: "slot-nanryo.firebaseapp.com",
    databaseURL: "https://slot-nanryo-default-rtdb.firebaseio.com",
    projectId: "slot-nanryo",
    storageBucket: "slot-nanryo.firebasestorage.app",
    messagingSenderId: "328158773887",
    appId: "1:328158773887:web:e39ba32ff925509b28f54a"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
const auth = firebase.auth();


// =========================================
// 匿名認証
// =========================================

async function loginFirebase() {

    if (auth.currentUser) {
        return auth.currentUser;
    }

    try {

        const result = await auth.signInAnonymously();

        console.log("Firebase Anonymous Login");

        return result.user;

    } catch (e) {

        console.error(e);

        alert("Firebaseへ接続できませんでした。");

        throw e;

    }

}



// =========================================
// Config取得
// =========================================

async function getConfig() {

    const snapshot = await db.ref("config").once("value");

    return snapshot.val();

}



// =========================================
// Config保存
// =========================================

async function saveConfig(config) {

    await loginFirebase();

    await db.ref("config").set(config);

}



// =========================================
// Counter取得
// =========================================

async function getCounter() {

    await loginFirebase();

    const snapshot = await db.ref("counter").once("value");

    return snapshot.val();

}



// =========================================
// Counter加算
// =========================================
function getToday() {
    const now = new Date();
    return now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, "0") + "-" +
        String(now.getDate()).padStart(2, "0");
}
async function incrementCounter(type) {

    await loginFirebase();

    const today = getToday();

    const ref = db.ref("counter/" + today + "/" + type);

    const snapshot = await ref.once("value");

    let count = snapshot.val();

    if (count == null) {
        count = 0;
    }

    await ref.set(count + 1);

}
async function loadCounter() {
    
    const data = await getCounter();

    console.log(data);

    const tbody = $("#counterTable tbody");
    tbody.empty();

    let totalOoatari = 0;
    let totalOmake = 0;
    let rowCount = 0;

    const targetDates = [
        "2026-08-02",
        "2026-09-10",
        "2026-09-11",
        "2026-09-12"
    ];

    targetDates.reverse().forEach(date => {

        if (!data || !data[date]) return;

        const oo = data[date].hit ?? 0;
        const om = data[date].bonus ?? 0;

        if (oo === 0 && om === 0) return;

        totalOoatari += oo;
        totalOmake += om;
        rowCount++;

        tbody.append(`
            <tr>
                <td>${date}</td>
                <td>${oo}</td>
                <td>${om}</td>
                <td>${oo + om}</td>
            </tr>
        `);
    });

    $("#totalOoatari").text(totalOoatari);
    $("#totalOmake").text(totalOmake);
    $("#grandTotal").text(totalOoatari + totalOmake);

    $("#counterTable").toggle(rowCount > 0);
}

