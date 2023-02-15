var ze = Object.defineProperty, Je = Object.defineProperties;
var Ze = Object.getOwnPropertyDescriptors;
var Oe = Object.getOwnPropertySymbols;
var Ge = Object.prototype.hasOwnProperty, Qe = Object.prototype.propertyIsEnumerable;
var De = (t, n, e) => n in t ? ze(t, n, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[n] = e, G = (t, n) => {
  for (var e in n || (n = {}))
    Ge.call(n, e) && De(t, e, n[e]);
  if (Oe)
    for (var e of Oe(n))
      Qe.call(n, e) && De(t, e, n[e]);
  return t;
}, Me = (t, n) => Je(t, Ze(n));
var E = (t, n, e) => new Promise((s, i) => {
  var r = (u) => {
    try {
      l(e.next(u));
    } catch (c) {
      i(c);
    }
  }, a = (u) => {
    try {
      l(e.throw(u));
    } catch (c) {
      i(c);
    }
  }, l = (u) => u.done ? s(u.value) : Promise.resolve(u.value).then(r, a);
  l((e = e.apply(t, n)).next());
});
const S = {};
let et = require("child_process");
const Yt = (t, n) => E(void 0, null, function* () {
  const e = S.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(
    (s) => e.question(`${t} `, (i) => {
      (!n || n.includes(i)) && (s(i), e.close());
    })
  );
}), Ut = (t, n) => E(void 0, null, function* () {
  return new Promise((e) => {
    t && console.log(t), process.stdin.setRawMode(!0), process.stdin.resume(), process.stdin.setEncoding("utf8");
    const s = (i) => {
      i === "" && process.exit(), (!n || (Array.isArray(n) ? n.includes(i) : n(i))) && (process.stdin.setRawMode(!1), process.stdin.pause(), process.stdin.removeListener("data", s), e(i));
    };
    process.stdin.on("data", s);
  });
}), $t = (t) => E(void 0, null, function* () {
  return new Promise((n, e) => {
    et.exec(t, (s, i, r) => E(void 0, null, function* () {
      s ? e(s) : (r && console.log(`stderr: ${r}`), n(i));
    }));
  });
});
var tt = Object.defineProperty, nt = Object.defineProperties, st = Object.getOwnPropertyDescriptors, be = Object.getOwnPropertySymbols, it = Object.prototype.hasOwnProperty, rt = Object.prototype.propertyIsEnumerable, ae = Math.pow, Se = (t, n, e) => n in t ? tt(t, n, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[n] = e, at = (t, n) => {
  for (var e in n || (n = {}))
    it.call(n, e) && Se(t, e, n[e]);
  if (be)
    for (var e of be(n))
      rt.call(n, e) && Se(t, e, n[e]);
  return t;
}, ot = (t, n) => nt(t, st(n));
const K = function(t, n, e) {
  if (!e)
    return "";
  if (Array.isArray(t)) {
    let s = e;
    for (const i of t)
      s = K(i, n, s);
    return s;
  }
  return e.replace(new RegExp(t.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), "g"), n);
}, y = (t, n, e) => {
  if (!t)
    return 0;
  let s = t.toString();
  return s = K("$", "", s), s = K(",", "", s), s = K("%", "", s), s.trim().length === 0 || isNaN(s) ? e ? NaN : 0 : n !== void 0 ? lt(parseFloat(s), n) : parseFloat(s);
}, D = (t) => {
  if (!t)
    return !1;
  if (t === !0)
    return t;
  const n = parseFloat(t);
  return isNaN(n) ? ["true", "active", "on", "yes", "y", "t"].includes(t.toString().toLowerCase().trim()) : n > 0;
}, lt = (t, n = 0, e = "round") => e === "round" ? +Math.round((y(t) + Number.EPSILON) * ae(10, n)) / ae(10, n) : e === "down" ? +Math.floor((y(t) + Number.EPSILON) * ae(10, n)) / ae(10, n) : +Math.ceil((y(t) + Number.EPSILON) * ae(10, n)) / ae(10, n), ye = (t) => t == null ? [] : Array.isArray(t) ? t : [t];
function he(t, n, e = !1) {
  if (!n || !t)
    return "";
  const s = ye(t);
  let i = n;
  do
    for (const r of s)
      i.endsWith(r) && (i = i.substring(0, i.length - r.length));
  while (e && s.some((r) => i.endsWith(r)));
  return i;
}
function we(t, ...n) {
  if (t || n.length === 0)
    return t;
  for (const e of n)
    if (e)
      return e;
  return n[n.length - 1];
}
const Ce = (t) => {
  if (!t)
    return [];
  const n = ye(t);
  let e = [];
  const s = [" ", "_", ",", "-", "/", "\\", "'", '"', "=", "+", "~", ".", ",", "(", ")", "<", ">", "{", "}"];
  e:
    for (const i of n) {
      for (const r of s)
        if (i.includes(r)) {
          e = Ce([...e, ...i.split(r).filter((a) => !!a)]);
          continue e;
        }
      e = [...e, ...i.replace(/([A-Z]+|[A-Z]?[a-z]+)(?=[A-Z]|\b)/g, "!$&").split("!")].filter((r) => !!r);
    }
  return e.filter((i) => !!i);
}, ut = (t) => t ? t.substr(0, 1).toUpperCase() + t.substr(1).toLowerCase() : "", ct = (t) => t ? t === t.toUpperCase() ? t : t.toLowerCase() === "id" ? "ID" : ut(t) : "", mt = (t) => Ce(t).map((n) => n.toLowerCase()).join("_"), Tt = (t) => Ce(t).map((n) => n === n.toUpperCase() ? n : ct(n)).join(""), Et = function(t, n = 0, e = null) {
  return y(t).toLocaleString(void 0, {
    maximumFractionDigits: n,
    minimumFractionDigits: e != null ? e : n
  });
}, me = (t) => {
  let n = Et(t);
  if (!n)
    return null;
  switch (n.substr(-2)) {
    case "11":
    case "12":
    case "13":
      n += "th";
      break;
    default:
      switch (n.substr(-1)) {
        case "1":
          n += "st";
          break;
        case "2":
          n += "nd";
          break;
        case "3":
          n += "rd";
          break;
        default:
          n += "th";
          break;
      }
  }
  return n;
}, xe = "YYYY-MM-DD", ft = "HH:mm:ss", dt = xe + " " + ft, Ne = "MMM D, YYYY", Pe = `dd, ${Ne}`, ue = "h:mm a", ht = `${Ne}, ${ue}`, _t = `${Pe}, ${ue}`, Ae = "MMMM D, YYYY", ke = `dddd, ${Ae}`, pt = `${Ae}, ${ue}`, yt = `${ke}, ${ue}`, Ee = (t, n) => {
  var e;
  if (!t)
    return ((e = L(n != null ? n : "now", { ignoreIANA: !0 })) != null ? e : new Date()).getTimezoneOffset();
  const s = n ? ce(n, void 0, !0) : null;
  let i = s ? new Date(s) : new Date();
  function r(w) {
    const R = w.replace(":", " ").split(" ");
    return {
      day: parseInt(R[0]),
      hour: parseInt(R[1]),
      minute: parseInt(R[2])
    };
  }
  let a = i.toLocaleString(["nl-NL"], {
    timeZone: t,
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: !1
  });
  const l = r(a), u = l.day * 1440 + l.hour * 60 + l.minute;
  a = i.toLocaleString(["nl-NL"], { day: "numeric", hour: "numeric", minute: "numeric", hour12: !1 });
  const c = r(a);
  let m = c.day * 1440 + c.hour * 60 + c.minute;
  return l.day > c.day && (m += l.day * 1440), (m - u + i.getTimezoneOffset()) % 1440;
}, Be = (t) => t === "now" || t === "today" || t.includes("T") || t.substr(15).includes("Z") || t.includes("+") || t.substr(15).includes("-"), Re = (t) => {
  var n, e, s, i;
  let r = [
    "([0-9]{4})(-([0-9]{2})(-([0-9]{2})(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\\.([0-9]+))?)?(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?",
    "([0-9]{4})(-([0-9]{2})(-([0-9]{2})( ([0-9]{2}):([0-9]{2})(:([0-9]{2})(\\.([0-9]+))?)?(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?"
  ].reduce((m, w) => {
    const R = (t.length === 16 ? t + ":00" : t).match(new RegExp(w));
    return m ? R && R[10] && !m[10] ? R : m : R;
  }, null);
  if (r === null)
    return null;
  let a = new Date(y(r[1]), 0, 1);
  r[1] && a.setUTCFullYear(y(r[1])), r[3] && a.setUTCMonth(y(r[3]) - 1), r[5] && a.setUTCDate(y(r[5])), a.setUTCHours(y((n = r[7]) != null ? n : 0)), a.setUTCMinutes(y((e = r[8]) != null ? e : 0)), a.setUTCSeconds(y((s = r[10]) != null ? s : 0)), a.setUTCMilliseconds(y(((i = r[12]) != null ? i : 0).toString().padEnd(3, "0").substr(0, 3)));
  let l = 0;
  if (r[14])
    l = y(r[16]) + parseInt(r[17], 10), l *= r[15] === "-" ? 1 : -1;
  else if (t.length > 12) {
    const m = t.substring(t.length - 3);
    (m.startsWith("-") || m.endsWith("+")) && (l -= y(m));
  }
  const u = a.valueOf() + l * 36e5;
  let c = new Date(u);
  return c ? c.valueOf() : null;
}, ce = (t, n, e) => {
  var s, i;
  if (!t)
    return null;
  if (typeof t == "number")
    return t;
  if (typeof t == "object")
    return t.valueOf();
  if (t.toString().toLowerCase() === "now" || t.toString().toLowerCase() === "today")
    return new Date().valueOf();
  try {
    let r = Re(t);
    return r || (r = Date.parse(t.toString()), isNaN(r) && (new Date(t).valueOf() || (r = (s = Re(t)) != null ? s : 0))), r ? (!e && !Be(t) && (r += ((i = Ee(n, t)) != null ? i : 0) * 6e4), r) : null;
  } catch (r) {
    return null;
  }
}, He = (t, n) => {
  let e = ce(t, n == null ? void 0 : n.timezoneSource, n == null ? void 0 : n.ignoreIANA);
  return !e || !n ? e : x(e, n);
}, L = (t, n) => {
  const e = He(t, n);
  return e ? new Date(e) : null;
}, Ct = (t, n, e, s) => {
  var i, r, a;
  const l = typeof n == "string" && !Be(n);
  let u = L(ce(n, l ? s : void 0));
  if (e)
    try {
      if (!u || u.valueOf() === 0)
        return null;
      const A = n && n !== "now" && n !== "today" ? u : void 0, h = (i = Ee(s, A)) != null ? i : 0, U = (r = Ee(e, A)) != null ? r : 0, F = l ? s ? ((a = Ee(void 0, A)) != null ? a : 0) - h - (U - h) : U - h - (U - h) : h - U;
      u = L(u, { minutes: F });
    } catch (A) {
      return console.log("Invalid Timezone", A), null;
    }
  if (!u || u.valueOf() === 0)
    return null;
  const c = (A, h) => {
    var U, F, j, Q, ee, o, f, _, B;
    switch (A) {
      case "YYYY":
        return h.getFullYear().toString().padStart(4, "0");
      case "YY":
        return h.getFullYear().toString().substr(2).padStart(2, "0");
      case "Q":
        return Math.ceil((h.getMonth() + 1) / 3).toString();
      case "Qo":
        return (U = me(Math.ceil((h.getMonth() + 1) / 3))) != null ? U : "";
      case "MMMM":
        return (F = Le[h.getMonth()]) != null ? F : "";
      case "MMM":
        return ((j = Le[h.getMonth()]) != null ? j : "").substr(0, 3);
      case "MM":
        return (h.getMonth() + 1).toString().padStart(2, "0");
      case "Mo":
        return (Q = me(h.getMonth() + 1)) != null ? Q : "";
      case "M":
        return (h.getMonth() + 1).toString();
      case "DD":
        return h.getDate().toString().padStart(2, "0");
      case "Do":
        return (ee = me(h.getDate())) != null ? ee : "";
      case "D":
        return h.getDate().toString();
      case "d":
        return h.getDay().toString();
      case "do":
        return (o = me(h.getDay())) != null ? o : "";
      case "dd":
        return ((f = _e[h.getDay()]) != null ? f : "").substr(0, 2);
      case "ddd":
        return ((_ = _e[h.getDay()]) != null ? _ : "").substr(0, 3);
      case "dddd":
        return (B = _e[h.getDay()]) != null ? B : "";
      case "HH":
        return h.getHours().toString().padStart(2, "0");
      case "H":
        return h.getHours().toString();
      case "hh":
        return (h.getHours() > 12 ? h.getHours() - 12 : h.getHours()).toString().padStart(2, "0");
      case "h": {
        const H = h.getHours() > 12 ? h.getHours() - 12 : h.getHours();
        return (H === 0 ? 12 : H).toString();
      }
      case "mm":
        return h.getMinutes().toString().padStart(2, "0");
      case "m":
        return h.getMinutes().toString();
      case "ss":
        return h.getSeconds().toString().padStart(2, "0");
      case "s":
        return h.getSeconds().toString();
      case "A":
        return h.getHours() >= 12 ? "PM" : "AM";
      case "a":
        return h.getHours() >= 12 ? "pm" : "am";
      default:
        return A;
    }
  };
  let m;
  switch (t) {
    case "Local":
      m = "M/D/YYYY";
      break;
    case "LocalDoW":
      m = "dd, M/D/YYYY";
      break;
    case "LocalDateTime":
      m = "M/D/YYYY h:mm a";
      break;
    case "LocalDoWTime":
      m = "dd, M/D/YYYY h:mm a";
      break;
    case "Date":
      m = xe;
      break;
    case "DateTime":
      m = dt;
      break;
    case "DisplayDate":
      m = Ne;
      break;
    case "DisplayDateDoW":
      m = Pe;
      break;
    case "DisplayTime":
      m = ue;
      break;
    case "DisplayDateTime":
      m = ht;
      break;
    case "DisplayDateDoWTime":
      m = _t;
      break;
    case "DisplayDateLong":
      m = Ae;
      break;
    case "DisplayDateDoWLong":
      m = ke;
      break;
    case "DisplayDateTimeLong":
      m = pt;
      break;
    case "DisplayDateDoWTimeLong":
      m = yt;
      break;
    default:
      m = t != null ? t : "YYYY-MM-DD h:mm:ss a";
      break;
  }
  const w = m.split("");
  let R = "", k = "", Y = "", b = !1;
  const $ = ["Mo", "Qo", "Do", "do"];
  for (const A of w)
    b ? A === "]" ? b = !1 : R += A : A === "[" ? (R += c(Y, u), Y = "", k = "", b = !0) : (A === k || k === "" || Y.length > 0 && $.some(
      (h) => h.startsWith(Y) && A === h.substr(Y.length, 1)
    ) ? Y += A : (R += c(Y, u), Y = A), k = A);
  return R += c(Y, u), R;
}, Nt = (t, n, e, s) => Ct(t, n, e, s), At = (t) => {
  var n;
  const e = (n = L(t)) != null ? n : new Date();
  return `${e.getFullYear()}${(e.getMonth() + 1).toString().padStart(2, "0")}${e.getDate().toString().padStart(2, "0")}${e.getHours().toString().padStart(2, "0")}${e.getMinutes().toString().padStart(2, "0")}${e.getSeconds().toString().padStart(2, "0")}`;
}, We = (t) => {
  var n;
  const e = (n = L(t)) != null ? n : new Date();
  return `${e.getFullYear()}-${(e.getMonth() + 1).toString().padStart(2, "0")}-${e.getDate().toString().padStart(2, "0")}_${e.getHours().toString().padStart(2, "0")}-${e.getMinutes().toString().padStart(2, "0")}-${e.getSeconds().toString().padStart(2, "0")}`;
}, Le = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
], _e = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], It = (t) => t % 4 === 0 && t % 100 !== 0 || t % 400 === 0, se = (t, n) => {
  var e;
  let s = n, i = t;
  for (; s < 0; )
    s += 12, i -= 1;
  for (; s > 11; )
    s -= 12, i += 1;
  return (e = [31, It(i) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][s]) != null ? e : null;
}, pe = (t, n) => {
  var e, s, i, r, a, l, u, c, m;
  let w = ce(t);
  if (!w)
    return null;
  const R = n < 0, k = (e = L(t)) != null ? e : new Date(), Y = k.getUTCDate(), b = Y === se(k.getUTCFullYear(), k.getUTCMonth());
  for (let $ = 0; $ < Math.abs(n); $++) {
    const A = (s = L(w)) != null ? s : new Date(), h = A.getUTCFullYear(), U = A.getUTCMonth();
    if (b)
      R ? w -= 24 * 60 * 60 * 1e3 * ((i = se(h, U)) != null ? i : 0) : w += 24 * 60 * 60 * 1e3 * ((r = se(h, U + 1)) != null ? r : 0);
    else {
      R ? w -= 24 * 60 * 60 * 1e3 * ((a = se(h, U - 1)) != null ? a : 0) : w += 24 * 60 * 60 * 1e3 * ((l = se(h, U)) != null ? l : 0);
      let F = (u = L(w)) != null ? u : new Date();
      F.getUTCDate() < 15 && F.getUTCDate() < Y && (w -= 24 * 60 * 60 * 1e3 * F.getUTCDate()), F = (c = L(w)) != null ? c : new Date();
      const j = (m = se(F.getUTCFullYear(), F.getUTCMonth())) != null ? m : 0;
      F.getUTCDate() > 15 && F.getUTCDate() < Y && F.getUTCDate() < j && (w += 24 * 60 * 60 * 1e3 * ((j > Y ? Y : j) - F.getUTCDate()));
    }
  }
  return w;
}, x = (t, n) => {
  var e, s, i, r, a, l, u, c, m, w, R, k, Y, b, $, A, h, U, F, j, Q, ee, o, f, _, B, H, v, X, z, V, J, re, Z, q, W, te;
  let T = ce(t);
  for (const P of Object.keys(n)) {
    if (!T)
      return null;
    switch (P) {
      case "year":
      case "years":
        switch (n[P]) {
          case "StartOf":
            {
              const I = (e = L(T)) != null ? e : new Date();
              T = (s = x(T, {
                month: I.getUTCMonth() * -1,
                months: "StartOf"
              })) != null ? s : 0;
            }
            break;
          case "EndOf":
            {
              const I = (i = L(T)) != null ? i : new Date();
              T = (r = x(T, {
                month: 11 - I.getUTCMonth(),
                months: "EndOf"
              })) != null ? r : 0;
            }
            break;
          default:
            T = pe(T, y(n[P]) * 12);
            break;
        }
        break;
      case "month":
      case "months":
        switch (n[P]) {
          case "StartOf":
            {
              const I = (a = L(T)) != null ? a : new Date();
              T = (l = x(T, {
                day: (I.getUTCDate() - 1) * -1,
                days: "StartOf"
              })) != null ? l : 0;
            }
            break;
          case "EndOf":
            {
              const I = (u = L(T)) != null ? u : new Date();
              T = (m = x(T, {
                day: ((c = se(I.getUTCFullYear(), I.getUTCMonth())) != null ? c : 0) - I.getUTCDate(),
                days: "EndOf"
              })) != null ? m : 0;
            }
            break;
          default:
            T = pe(T, y(n[P]));
            break;
        }
        break;
      case "quarter":
      case "quarters":
        switch (n[P]) {
          case "StartOf":
            {
              const I = (w = L(T)) != null ? w : new Date();
              T = (R = x(T, {
                month: I.getUTCMonth() % 3 * -1,
                months: "StartOf"
              })) != null ? R : 0;
            }
            break;
          case "EndOf":
            {
              const I = (k = L(T)) != null ? k : new Date();
              T = (Y = x(T, {
                month: 2 - I.getUTCMonth() % 3,
                months: "EndOf"
              })) != null ? Y : 0;
            }
            break;
          default:
            T = pe(T, y(n[P]) * 3);
            break;
        }
        break;
      default:
        if (!T)
          return null;
        switch (P) {
          case "week":
          case "weeks":
            switch (n[P]) {
              case "StartOf":
                {
                  const I = (b = L(T)) != null ? b : new Date();
                  T = ($ = x(T, {
                    day: I.getUTCDay() * -1,
                    days: "StartOf"
                  })) != null ? $ : 0;
                }
                break;
              case "StartOfMon":
                {
                  const I = (A = L(T)) != null ? A : new Date();
                  switch (I.getUTCDay()) {
                    case 0:
                      T = (h = x(T, {
                        day: -6,
                        days: "StartOf"
                      })) != null ? h : 0;
                      break;
                    case 1:
                      T = (U = x(T, {
                        days: "StartOf"
                      })) != null ? U : 0;
                      break;
                    default:
                      T = (F = x(T, {
                        day: (I.getUTCDay() - 1) * -1,
                        days: "StartOf"
                      })) != null ? F : 0;
                      break;
                  }
                }
                break;
              case "EndOf":
                {
                  const I = (j = L(T)) != null ? j : new Date();
                  T = (Q = x(T, {
                    day: 6 - I.getUTCDay(),
                    days: "EndOf"
                  })) != null ? Q : 0;
                }
                break;
              default:
                T += y(n[P]) * 7 * 24 * 60 * 60 * 1e3;
                break;
            }
            break;
          case "day":
          case "days":
            switch (n[P]) {
              case "StartOf":
                {
                  const I = (ee = L(T)) != null ? ee : new Date();
                  T = (o = x(T, {
                    hour: I.getUTCHours() * -1,
                    hours: "StartOf"
                  })) != null ? o : 0;
                }
                break;
              case "EndOf":
                {
                  const I = (f = L(T)) != null ? f : new Date();
                  T = (_ = x(T, {
                    hour: 23 - I.getUTCHours(),
                    hours: "EndOf"
                  })) != null ? _ : 0;
                }
                break;
              default:
                T += y(n[P]) * 24 * 60 * 60 * 1e3;
                break;
            }
            break;
          case "hour":
          case "hours":
            switch (n[P]) {
              case "StartOf":
                {
                  const I = (B = L(T)) != null ? B : new Date();
                  T = (H = x(T, {
                    minute: I.getUTCMinutes() * -1,
                    minutes: "StartOf"
                  })) != null ? H : 0;
                }
                break;
              case "EndOf":
                {
                  const I = (v = L(T)) != null ? v : new Date();
                  T = (X = x(T, {
                    minute: 59 - I.getUTCMinutes(),
                    minutes: "EndOf"
                  })) != null ? X : 0;
                }
                break;
              default:
                T += y(n[P]) * 60 * 60 * 1e3;
                break;
            }
            break;
          case "minute":
          case "minutes":
            switch (n[P]) {
              case "StartOf":
                {
                  const I = (z = L(T)) != null ? z : new Date();
                  T = (V = x(T, {
                    second: I.getUTCSeconds() * -1,
                    seconds: "StartOf"
                  })) != null ? V : 0;
                }
                break;
              case "EndOf":
                {
                  const I = (J = L(T)) != null ? J : new Date();
                  T = (re = x(T, {
                    second: 59 - I.getUTCSeconds(),
                    seconds: "EndOf"
                  })) != null ? re : 0;
                }
                break;
              default:
                T += y(n[P]) * 60 * 1e3;
                break;
            }
            break;
          case "second":
          case "seconds":
            switch (n[P]) {
              case "StartOf":
                {
                  const I = (Z = L(T)) != null ? Z : new Date();
                  T = (q = x(T, {
                    millisecond: I.getUTCMilliseconds() * -1
                  })) != null ? q : 0;
                }
                break;
              case "EndOf":
                {
                  const I = (W = L(T)) != null ? W : new Date();
                  T = (te = x(T, {
                    millisecond: 999 - I.getUTCMilliseconds()
                  })) != null ? te : 0;
                }
                break;
              default:
                T += y(n[P]) * 1e3;
                break;
            }
            break;
          case "millisecond":
          case "milliseconds":
            T += y(n[P]);
            break;
        }
        break;
    }
  }
  return T;
};
var Ye;
((t) => {
  t.Header = (s = "calendar") => ({
    "Content-Type": "text/Calendar",
    "Content-Disposition": `inline; filename=${s}.ics`
  }), t.VCALENDAROpen_Text = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
`, t.VCALENDARClose_Text = `END:VCALENDAR
`;
  const n = (s, i) => {
    var r;
    return s ? `TZID=${i != null ? i : "America/New_York"}:${(r = At(He(s))) != null ? r : ""}` : "";
  }, e = (s) => K(`\r
`, "\\n", K(`
`, "\\n", K("\r", "\\n", K(",", "\\,", K(";", "\\;", K("\\", "\\\\", s))))));
  t.VEVENT_Text = (s) => {
    var i, r;
    let a = "";
    return a += `BEGIN:VEVENT
`, a += `CLASS:PUBLIC
`, a += "CREATED;" + n((i = s.dateTimeCreated) != null ? i : new Date().toISOString()) + `
`, a += "DESCRIPTION:" + e(s.description) + `
`, a += "DTSTART;" + n(s.dateTimeStart) + `
`, s.durationMinutes ? a += "DURATION:PT" + s.durationMinutes + `M
` : s.dateTimeEnd && (a += "DTEND;" + n(s.dateTimeEnd) + `
`), a += "DTSTAMP;" + n(new Date().toISOString()) + `
`, s.organizerName && s.organizerEmail && (a += `ORGANIZER;CN=${s.organizerName}:MAILTO:${s.organizerEmail}
`), a += "LAST-MODIFIED;" + n((r = s.dateTimeModified) != null ? r : new Date().toISOString()) + `
`, s.location && (s.location_altrep ? a += `LOCATION;ALTREP="${e(s.location_altrep)}":` + e(s.location) + `
` : a += "LOCATION:" + e(s.location) + `
`), s.priority && (a += `PRIORITY:${s.priority}
`), a += `SEQUENCE:0
`, a += "SUMMARY:" + e(s.subject) + `
`, a += `TRANSP:OPAQUE
`, a += "UID:" + s.UID + `
`, s.alarmTriggerMinutes !== void 0 && (a += `BEGIN:VALARM
`, a += `TRIGGER:-PT${s.alarmTriggerMinutes}M
`, a += `ACTION:DISPLAY
`, a += `DESCRIPTION:Reminder
`, a += `END:VALARM
`), a += `END:VEVENT
`, a;
  }, t.ICS_Text = (s) => t.VCALENDAROpen_Text + (0, t.VEVENT_Text)(s) + t.VCALENDARClose_Text;
})(Ye || (Ye = {}));
const gt = {
  primaryAscending: !0,
  primaryEmptyToBottom: null,
  secondarySort: null,
  secondaryAscending: !0,
  secondaryEmptyToBottom: null
};
ot(at({}, gt), { primarySort: "" });
const Te = (t) => t == null || t === "", Ot = (t, n, e = null) => {
  //!!emptyTo
  if (t === n)
    return null;
  if (e)
    if (e.endsWith("0")) {
      if (!t && n)
        return typeof n == "boolean" ? e === "Top0" ? 1 : -1 : e === "Top0" ? -1 : 1;
      if (!n && t)
        return typeof t == "boolean" ? e === "Top0" ? -1 : 1 : e === "Top0" ? 1 : -1;
    } else {
      if (Te(t) && !Te(n))
        return typeof n == "boolean" ? e === "Top" ? 1 : -1 : e === "Top" ? -1 : 1;
      if (Te(n) && !Te(t))
        return typeof t == "boolean" ? e === "Top" ? -1 : 1 : e === "Top" ? 1 : -1;
    }
  if (typeof t == "boolean" && typeof n == "boolean")
    return (t ? 1 : 0) - (n ? 1 : 0);
  const s = y(t, void 0, !0), i = y(n, void 0, !0);
  return !isNaN(s) && !isNaN(i) ? s - i : (t != null ? t : "").toString().localeCompare((n != null ? n : "").toString(), void 0, { sensitivity: "base" });
}, Dt = (t, n, e = null) => {
  var s;
  return (s = Ot(t, n, e)) != null ? s : 0;
}, Mt = (t, n = !0) => (t != null ? t : "").trim().split(/(\s+)/).map((e) => n ? e.trim().toLowerCase() : e.trim()).filter((e) => !!e), oe = (t) => typeof t == "number" ? t : t.id;
var Ue;
((t) => {
  t.IsSelected = (n, e) => !e.includes(oe(n)), t.SelectedIDs = (n, e) => n.reduce(
    (s, i) => {
      const r = oe(i);
      return e.find((a) => a === r) ? s : [...s, r];
    },
    []
  ), t.ToggleUnSelectedID = (n, e) => e.includes(n) ? e.filter((s) => s !== n) : [...e, n], t.SelectIDs = (n, e) => e.filter((s) => !n.find((i) => s === oe(i))), t.UnSelectIDs = (n, e) => [...e, ...n.map((s) => oe(s))], t.SelectedBetween = (n, e, s, i) => {
    const r = n.map((c) => oe(c)), a = !(0, t.IsSelected)(s, i);
    let l = [], u = !1;
    for (const c of r)
      if (c === e || c === s) {
        if (l.push(c), u)
          break;
        u = !0;
      } else
        u && l.push(c);
    return a ? (0, t.SelectIDs)(l, i) : (0, t.UnSelectIDs)(l, i);
  };
})(Ue || (Ue = {}));
const Ft = (t, n) => St(bt(t), y(n)), bt = (t) => ({
  page: t.page < 1 ? 1 : t.page,
  pageCount: 1,
  rowCount: 0,
  countPerPage: t.countPerPage,
  currentOffset: 1,
  rows: []
}), xt = (t, n) => {
  console.warn('"PaginatorApplyRowCount" will deprecate for "PaginatorReturnRowCount"'), t.rowCount = y(n), +n > 0 ? (t.pageCount = Math.floor((y(n) + y(t.countPerPage - 1)) / y(t.countPerPage)), y(t.page) < 1 && (t.page = 1), y(t.page) > y(t.pageCount) && (t.page = y(t.pageCount)), t.currentOffset = (+t.page - 1) * +t.countPerPage) : (t.pageCount = 0, t.currentOffset = 0, t.page = 1);
}, St = (t, n) => {
  let e = G({}, t);
  return e.rowCount = y(n), e.page = y(e.page), e.rowCount > 0 ? (e.pageCount = Math.floor((y(n) + (y(e.countPerPage) - 1)) / y(e.countPerPage)), e.page < 1 && (e.page = 1), e.page > e.pageCount && (e.page = e.pageCount), e.currentOffset = (e.page - 1) * e.countPerPage) : (e.pageCount = 0, e.currentOffset = 0, e.page = 1), e;
};
class fe {
  constructor(n) {
    this.enumName = "", this.values = [], n && this.deserialize(n);
  }
  deserialize(n) {
    const e = Object.keys(this);
    for (const s of e)
      n.hasOwnProperty(s) && (this[s] = n[s]);
  }
  get columnName() {
    return mt(this.enumName);
  }
  get typeName() {
    return this.enumName;
  }
  static TypeName(n) {
    return Tt(n);
  }
  ddlRemove() {
    return `DROP TYPE IF EXISTS ${this.columnName} CASCADE `;
  }
  ddlDefinition() {
    return `CREATE TYPE ${this.columnName} AS ENUM ('${this.values.join("','")}')`;
  }
}
const N = class {
  constructor(t) {
    this.column_name = "", this.ordinal_position = 0, this.column_default = null, this.is_nullable = "YES", this.udt_name = "", this.character_maximum_length = null, this.character_octet_length = null, this.numeric_precision = null, this.numeric_scale = null, this.datetime_precision = null, this.is_identity = "NO", this.is_self_referencing = "NO", this.identity_generation = null, this.array_dimensions = [], this.check = null, this.checkStringValues = [], this.generatedAlwaysAs = null, this.column_comment = "", this.isAutoIncrement = !0, this.jsType = () => typeof this.udt_name != "string" ? this.udt_name.enumName : this.jsonType() ? "any" : this.booleanType() ? "boolean" : this.integerFloatType() ? "number" : this.udt_name === N.TYPE_POINT ? "[number, number]" : this.udt_name.startsWith("e_") ? fe.TypeName(this.udt_name) : "string", this.isArray = () => {
      var n, e, s, i, r, a;
      return !!ye(this.array_dimensions)[0] || ((s = (e = (n = this.column_default) != null ? n : "") == null ? void 0 : e.toString()) == null ? void 0 : s.includes("{}")) || ((a = (r = (i = this.column_default) != null ? i : "") == null ? void 0 : r.toString()) == null ? void 0 : a.includes("[]"));
    }, this.isNullable = () => D(this.is_nullable), this.enumType = () => typeof this.udt_name != "string", this.integerType = () => typeof this.udt_name == "string" && (this.udt_name.toLowerCase().startsWith("int") || [N.TYPE_SMALLINT, N.TYPE_INTEGER, N.TYPE_BIGINT].includes(this.udt_name.toLowerCase())), this.floatType = () => typeof this.udt_name == "string" && [N.TYPE_NUMERIC, N.TYPE_FLOAT8].includes(this.udt_name.toLowerCase()), this.integerFloatType = () => this.integerType() || this.floatType(), this.booleanType = () => typeof this.udt_name == "string" && [N.TYPE_BOOLEAN].includes(this.udt_name.toLowerCase()), this.jsonType = () => typeof this.udt_name == "string" && [N.TYPE_JSON, N.TYPE_JSONB].includes(this.udt_name.toLowerCase()), this.generalStringType = () => typeof this.udt_name != "string" || [N.TYPE_VARCHAR].includes(this.udt_name.toLowerCase()), this.dateType = () => typeof this.udt_name == "string" && [
      N.TYPE_DATE,
      N.TYPE_TIME,
      N.TYPE_TIMETZ,
      N.TYPE_TIMESTAMP,
      N.TYPE_TIMESTAMPTZ
    ].includes(this.udt_name.toLowerCase()), this.dateOnlyType = () => typeof this.udt_name == "string" && [
      N.TYPE_DATE
    ].includes(this.udt_name.toLowerCase()), this.timeOnlyType = () => typeof this.udt_name == "string" && [
      N.TYPE_TIME,
      N.TYPE_TIMETZ
    ].includes(this.udt_name.toLowerCase()), this.dateTimeOnlyType = () => typeof this.udt_name == "string" && [
      N.TYPE_TIMESTAMP,
      N.TYPE_TIMESTAMPTZ
    ].includes(this.udt_name.toLowerCase()), this.blobType = () => typeof this.udt_name == "string" && [N.TYPE_TEXT].includes(this.udt_name.toLowerCase()), this.otherType = () => !this.integerFloatType && !this.booleanType && !this.dateType() && !this.generalStringType() && !this.blobType(), t && this.deserialize(t);
  }
  deserialize(t) {
    const n = Object.keys(this);
    for (const e of n)
      t.hasOwnProperty(e) && typeof t != "function" && (this[e] = t[e]);
  }
  clean() {
  }
  ddlDefinition() {
    var n, e, s, i, r, a, l, u;
    let t = '"' + this.column_name + '" ';
    return t += typeof this.udt_name == "string" ? this.udt_name : this.udt_name.columnName, this.array_dimensions.length > 0 ? t += `[${this.array_dimensions.map((c) => c ? c.toString() : "").join("],[")}] ` : this.udt_name !== N.TYPE_POINT ? this.floatType() && this.udt_name !== N.TYPE_FLOAT8 ? t += "(" + this.numeric_precision + "," + ((n = this.numeric_scale) != null ? n : 0) + ") " : this.dateType() ? this.datetime_precision ? t += "(" + this.datetime_precision + ") " : t += " " : this.generalStringType() && !this.blobType() && typeof this.udt_name == "string" ? t += "(" + ((e = this.character_maximum_length) != null ? e : 255) + ") " : t += " " : t += " ", D(this.is_nullable) || (t += "NOT NULL "), this.generatedAlwaysAs ? t += `GENERATED ALWAYS AS (${N.CleanComment(this.generatedAlwaysAs)}) STORED ` : (typeof this.column_default == "string" && this.column_default.toLowerCase().includes("null") && (this.column_default = null), (this.column_default !== void 0 && this.column_default !== null || this.is_identity || this.isAutoIncrement) && (this.dateType() && (!this.column_default || ((s = this.column_default) != null ? s : "").toString().toUpperCase().includes("NULL")) || (this.array_dimensions.length > 0 ? D(this.is_nullable) ? t += `DEFAULT ${(i = this.column_default) != null ? i : "NULL"} ` : t += `DEFAULT ${(a = this.column_default) != null ? a : typeof this.udt_name == "string" ? "'{}'" : (r = this.udt_name.defaultValue) != null ? r : "'{}"} ` : this.blobType() || (D(this.is_identity) ? this.isAutoIncrement && (this.identity_generation ? t += `GENERATED ${this.identity_generation} AS IDENTITY ` : t += "GENERATED BY DEFAULT AS IDENTITY ") : this.booleanType() ? D(this.is_nullable) || this.column_default === null ? t += "DEFAULT NULL " : t += `DEFAULT ${D(this.column_default) ? "true" : "false"} ` : !this.column_default && typeof this.udt_name != "string" && this.udt_name.defaultValue ? t += `DEFAULT '${this.udt_name.defaultValue}' ` : this.column_default ? this.integerFloatType() || this.dateType() || ((l = this.column_default) != null ? l : "").toString().includes("::") || ((u = this.column_default) != null ? u : "").toString().includes("()") ? t += `DEFAULT ${this.column_default} ` : t += `DEFAULT '${this.column_default}' ` : D(this.is_nullable) ? t += "DEFAULT NULL " : this.integerFloatType() ? t += "DEFAULT 0 " : this.dateType() ? t += "DEFAULT now() " : t += "DEFAULT '' "))), this.check ? t += `CHECK (${this.check}) ` : this.checkStringValues.length > 0 && (t += `CHECK (${D(this.is_nullable) ? this.column_name + " IS NULL OR " : ""}${this.column_name} IN ('${this.checkStringValues.join("', '")}')) `)), t.trim();
  }
  static CleanComment(t) {
    return t && t.replace(/[\n\r]/g, " ");
  }
};
let M = N;
M.TYPE_BOOLEAN = "bool";
M.TYPE_NUMERIC = "numeric";
M.TYPE_FLOAT8 = "float8";
M.TYPE_POINT = "point";
M.TYPE_SMALLINT = "smallint";
M.TYPE_INTEGER = "integer";
M.TYPE_BIGINT = "bigint";
M.TYPE_VARCHAR = "varchar";
M.TYPE_TEXT = "text";
M.TYPE_JSON = "json";
M.TYPE_JSONB = "jsonb";
M.TYPE_DATE = "date";
M.TYPE_TIME = "time";
M.TYPE_TIMETZ = "timetz";
M.TYPE_TIMESTAMP = "timestamp";
M.TYPE_TIMESTAMPTZ = "timestamptz";
M.TYPE_BYTEA = "bytea";
M.TYPE_UUID = "uuid";
M.TYPES_ALL = [
  N.TYPE_BOOLEAN,
  N.TYPE_NUMERIC,
  N.TYPE_FLOAT8,
  N.TYPE_POINT,
  N.TYPE_SMALLINT,
  N.TYPE_INTEGER,
  N.TYPE_BIGINT,
  N.TYPE_VARCHAR,
  N.TYPE_TEXT,
  N.TYPE_JSON,
  N.TYPE_JSONB,
  N.TYPE_DATE,
  N.TYPE_TIME,
  N.TYPE_TIMETZ,
  N.TYPE_TIMESTAMP,
  N.TYPE_TIMESTAMPTZ,
  N.TYPE_UUID
];
const g = class {
  constructor() {
    this.COLUMN_NAME = "", this.ORDINAL_POSITION = 0, this.COLUMN_DEFAULT = null, this.IS_NULLABLE = "YES", this.DATA_TYPE = "", this.CHARACTER_MAXIMUM_LENGTH = null, this.CHARACTER_OCTET_LENGTH = null, this.NUMERIC_PRECISION = null, this.NUMERIC_SCALE = null, this.DATETIME_PRECISION = null, this.COLUMN_TYPE = null, this.COLUMN_KEY = null, this.EXTRA = null, this.COLUMN_COMMENT = null, this.CHARACTER_SET_NAME = null, this.COLLATION_NAME = null, this.jsType = () => this.booleanType() ? "boolean" : this.integerFloatType() ? "number" : this.booleanType() ? "boolean" : "string", this.integerType = () => [g.TYPE_TINYINT, g.TYPE_SMALLINT, g.TYPE_MEDIUMINT, g.TYPE_INT, g.TYPE_BIGINT, g.TYPE_BIT, g.TYPE_YEAR].includes(this.DATA_TYPE.toUpperCase()), this.tinyintType = () => [g.TYPE_TINYINT].includes(this.DATA_TYPE.toUpperCase()), this.floatType = () => [g.TYPE_DECIMAL, g.TYPE_NUMERIC, g.TYPE_FLOAT, g.TYPE_DOUBLE].includes(this.DATA_TYPE.toUpperCase()), this.integerFloatType = () => this.integerType() || this.floatType(), this.booleanType = () => [g.TYPE_BIT].includes(this.DATA_TYPE.toUpperCase()), this.dateType = () => [g.TYPE_DATE, g.TYPE_TIME, g.TYPE_DATETIME, g.TYPE_TIMESTAMP].includes(this.DATA_TYPE.toUpperCase()), this.generalStringType = () => !this.integerFloatType() && !this.booleanType(), this.blobType = () => [g.TYPE_TINYTEXT, g.TYPE_TEXT, g.TYPE_MEDIUMTEXT, g.TYPE_LONGTEXT, g.TYPE_TINYBLOB, g.TYPE_BLOB, g.TYPE_MEDIUMBLOB, g.TYPE_LONGBLOB].includes(this.DATA_TYPE.toUpperCase()), this.otherType = () => [g.TYPE_GEOMETRY, g.TYPE_POINT, g.TYPE_LINESTRING, g.TYPE_POLYGON, g.TYPE_GEOMETRYCOLLECTION, g.TYPE_MULTILINESTRING, g.TYPE_MULTIPOINT, g.TYPE_MULTIPOLYGON].includes(this.DATA_TYPE.toUpperCase());
  }
};
let p = g;
p.TYPE_TINYINT = "TINYINT";
p.TYPE_SMALLINT = "SMALLINT";
p.TYPE_MEDIUMINT = "MEDIUMINT";
p.TYPE_INT = "INT";
p.TYPE_BIGINT = "BIGINT";
p.TYPE_DECIMAL = "DECIMAL";
p.TYPE_NUMERIC = "NUMERIC";
p.TYPE_FLOAT = "FLOAT";
p.TYPE_DOUBLE = "DOUBLE";
p.TYPE_BIT = "BIT";
p.TYPE_CHAR = "CHAR";
p.TYPE_VARCHAR = "VARCHAR";
p.TYPE_BINARY = "BINARY";
p.TYPE_VARBINARY = "VARBINARY";
p.TYPE_TINYBLOB = "TINYBLOB";
p.TYPE_BLOB = "BLOB";
p.TYPE_MEDIUMBLOB = "MEDIUMBLOB";
p.TYPE_LONGBLOB = "LONGBLOB";
p.TYPE_TINYTEXT = "TINYTEXT";
p.TYPE_TEXT = "TEXT";
p.TYPE_MEDIUMTEXT = "MEDIUMTEXT";
p.TYPE_LONGTEXT = "LONGTEXT";
p.TYPE_ENUM = "ENUM";
p.TYPE_SET = "SET";
p.TYPE_DATE = "DATE";
p.TYPE_TIME = "TIME";
p.TYPE_DATETIME = "DATETIME";
p.TYPE_TIMESTAMP = "TIMESTAMP";
p.TYPE_YEAR = "YEAR";
p.TYPE_GEOMETRY = "GEOMETRY";
p.TYPE_POINT = "POINT";
p.TYPE_LINESTRING = "LINESTRING";
p.TYPE_POLYGON = "POLYGON";
p.TYPE_GEOMETRYCOLLECTION = "GEOMETRYCOLLECTION";
p.TYPE_MULTILINESTRING = "MULTILINESTRING";
p.TYPE_MULTIPOINT = "MULTIPOINT";
p.TYPE_MULTIPOLYGON = "MULTIPOLYGON";
p.TYPE_JSON = "JSON";
class Ie {
  constructor(n) {
    this.columnNames = [], this.primaryTable = "", this.primaryColumns = [], this.onDelete = "RESTRICT", this.onUpdate = "RESTRICT", n && this.deserialize(n);
  }
  deserialize(n) {
    const e = Object.keys(this);
    for (const s of e)
      n.hasOwnProperty(s) && (this[s] = n[s]);
  }
  fkName(n) {
    return n.name + "_" + this.columnNames.map((e) => e.substr(-25)).join("_") + "_fkey";
  }
  ddlConstraintDefinition(n) {
    return `
		DO $$
		BEGIN
			IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '${this.fkName(n)}') THEN
				ALTER TABLE "${n.name}"
					ADD CONSTRAINT "${this.fkName(n)}"
					FOREIGN KEY ("${this.columnNames.join('","')}") REFERENCES "${this.primaryTable}"("${this.primaryColumns.join(
      '","'
    )}") DEFERRABLE INITIALLY DEFERRED;
			END IF;
		END;
		$$;`;
  }
}
class ge {
  constructor(n) {
    this.columns = [], this.whereCondition = null, this.isUnique = !1, this.concurrently = !1, this.using = "BTREE", n && this.deserialize(n);
  }
  deserialize(n) {
    const e = Object.keys(this);
    for (const s of e)
      n.hasOwnProperty(s) && (this[s] = n[s]);
  }
  name(n) {
    return "idx_" + n.name.substr(-25) + "_" + this.columns.map(
      (e) => e.replace(" ASC", "").replace(" DESC", "").replace(" NULLS", "").replace(" FIRST", "").replace(" LAST", "").replace("(", "_").replace(")", "_").trim().substr(-25)
    ).join("_");
  }
  ddlDefinition(n) {
    let e = "CREATE ";
    return this.isUnique && (e += "UNIQUE "), e += "INDEX IF NOT EXISTS ", e += `"${this.name(n)}" `, e += "ON ", e += `"${n.name}" `, e += "USING btree ", e += "(" + this.columns.join(",") + ")", this.whereCondition && (e += " WHERE " + this.whereCondition), e += ";", e;
  }
}
const d = `
`, wt = {
  startPosition: 0
};
class ie {
  constructor(n) {
    this.name = "", this.description = "", this.check = null, this.inherits = [], this.columns = [], this.indexes = [], this.foreignKeys = [], this.importWithTypes = !1, n && this.deserialize(n);
  }
  deserialize(n) {
    const e = Object.keys(this);
    for (const s of e)
      if (n.hasOwnProperty(s))
        switch (s) {
          case "columns":
            for (const i of n[s])
              this[s].push(new M(i));
            break;
          case "indexes":
            for (const i of n[s])
              this[s].push(new ge(i));
            break;
          case "foreignKeys":
            for (const i of n[s])
              this[s].push(new Ie(i));
            break;
          default:
            this[s] = n[s];
            break;
        }
  }
  indexOfColumn(n) {
    return this.columns.findIndex((e) => e.column_name === n);
  }
  indexesOfForeignKeyByColumn(n) {
    let e = [];
    for (let s = 0; s < this.foreignKeys.length; s++)
      this.foreignKeys[s].columnNames.includes(n) && e.push(s);
    return e;
  }
  getForeignKeysByColumn(n) {
    let e = [];
    const s = this.indexesOfForeignKeyByColumn(n);
    for (const i of s)
      e.push(this.foreignKeys[i]);
    return e;
  }
  removeForeignKeysByColumn(n) {
    this.foreignKeys = this.foreignKeys.filter((e) => !e.columnNames.includes(n));
  }
  renameForeignKeysByColumn(n, e, s) {
    const i = this;
    this.foreignKeys.forEach((r) => {
      r.columnNames.includes(n) && (r.columnNames = [...r.columnNames.filter((a) => a !== n), e]);
    }), s && s.filter((r) => r.name !== i.name).forEach((r) => {
      r.foreignKeys.forEach((a) => {
        a.primaryTable === i.name && a.primaryColumns.includes(n) && (a.primaryColumns = [...a.primaryColumns.filter((l) => l !== n), e]);
      });
    });
  }
  removeIndexsByColumn(n) {
    this.indexes = this.indexes.filter((e) => !e.columns.includes(n));
  }
  renameIndexsByColumn(n, e) {
    this.indexes.forEach((s) => {
      s.columns.includes(n) && (s.columns = [...s.columns.filter((i) => i !== n), e]);
    });
  }
  addForeignKey(n) {
    this.foreignKeys.push(n);
  }
  getColumn(n) {
    var e;
    return (e = this.columns.find((s) => s.column_name === n)) != null ? e : null;
  }
  removeColumn(n) {
    this.getColumn(n) && (this.removeForeignKeysByColumn(n), this.removeIndexsByColumn(n), this.columns = this.columns.filter((s) => s.column_name !== n), this.reOrderColumns());
  }
  renameColumn(n, e, s) {
    const i = this.getColumn(n);
    i && (i.column_name = e, this.renameForeignKeysByColumn(n, e, s), this.renameIndexsByColumn(n, e));
  }
  addColumn(n) {
    const e = new M(n);
    e.ordinal_position || (e.ordinal_position = 999999), this.columns = this.columns.filter((s) => s.column_name !== e.column_name);
    for (let s = 0; s < this.columns.length; s++)
      this.columns[s].ordinal_position >= e.ordinal_position && this.columns[s].ordinal_position++;
    this.columns.push(e), this.reOrderColumns();
  }
  reOrderColumns() {
    this.columns = this.columns.sort((e, s) => e.ordinal_position - s.ordinal_position);
    let n = 0;
    for (let e = 0; e < this.columns.length; e++)
      n++, this.columns[e].ordinal_position = n;
  }
  addIndex(n) {
    this.indexes.push(n);
  }
  tableHeaderText(n, e = "DO NOT MODIFY") {
    let s = "/**" + d;
    return s += " * Automatically generated: " + We("now") + d, s += " * © " + new Date().getFullYear() + ", Solid Basis Ventures, LLC." + d, s += ` * ${e}` + d, s += " *" + d, s += " * " + n + ": " + this.name + d, this.description && (s += " *" + d, s += " * " + ie.CleanComment(this.description) + d), s += " */" + d, s += d, s;
  }
  /**
   * Generates type definitions for a table.
   *
   * @param options
   */
  tsText(n) {
    var l, u, c, m, w, R, k, Y, b, $, A, h, U, F, j, Q, ee;
    let e = this.tableHeaderText("Table Manager for");
    if (n != null && n.includeConstraint && (e += `import type {TObjectConstraint} from '@solidbasisventures/intelliwaketsfoundation'${d}`), this.inherits.length > 0)
      for (const o of this.inherits)
        this.importWithTypes ? (e += `import type {I${o}} from './I${o}'${d}`, e += `import {initial_${o}} from './I${o}'${d}`) : e += `import {I${o}, initial_${o}} from './I${o}'${d}`;
    const s = Array.from(
      new Set(
        [
          ...this.columns.map((o) => ({
            column_name: o.column_name,
            enum_name: typeof o.udt_name != "string" ? o.udt_name.enumName : ""
          })),
          ...this.columns.map((o) => ({
            column_name: o.column_name,
            enum_name: typeof o.udt_name == "string" && o.udt_name.startsWith("e_") ? fe.TypeName(o.udt_name) : ""
          })),
          ...this.columns.map((o) => {
            var B, H, v, X, z, V;
            const _ = /{([^}]*)}/.exec(o.column_comment);
            if (_ && _[1]) {
              const J = _[1].split(",");
              for (const re of J) {
                const Z = re.split(":");
                if (((B = Z[0]) != null ? B : "").toLowerCase().trim() === "enum") {
                  const q = (v = (H = Z[1]) == null ? void 0 : H.split(".")[0]) == null ? void 0 : v.trim();
                  let W = (V = (z = we((X = Z[1]) == null ? void 0 : X.split(".")[1], Z[2], o.column_default)) == null ? void 0 : z.toString()) == null ? void 0 : V.trim();
                  if (W != null && W.startsWith("'{}'") && (W = "[]"), !q)
                    throw new Error("Enum requested in comment, but not specified  - Format {Enum: ETest} for nullable or {Enum: ETest.FirstValue}");
                  if (!D(o.is_nullable) && !W && !o.array_dimensions.length)
                    throw new Error("Not Nullable Enum requested in comment, but no default value specified - Format {Enum: ETest.FirstValue}");
                  return {
                    column_name: o.column_name,
                    enum_name: q,
                    default_value: o.array_dimensions.length > 0 ? D(o.is_nullable) ? "null" : W != null ? W : "[]" : W ? `${q}.${W}` : "null"
                  };
                }
              }
            }
            return { column_name: o.column_name, enum_name: "" };
          })
        ].filter((o) => !!o.enum_name)
      )
    ), i = Array.from(
      new Set(
        [
          ...this.columns.map((o) => {
            var B, H, v, X, z, V, J;
            const _ = /{([^}]*)}/.exec(o.column_comment);
            if (_ && _[1]) {
              const re = _[1].split(",");
              for (const Z of re) {
                const q = Z.split(":");
                if (((B = q[0]) != null ? B : "").toLowerCase().trim() === "interface") {
                  const W = (v = (H = q[1]) == null ? void 0 : H.split(".")[0]) == null ? void 0 : v.trim();
                  let te = (J = (V = (z = we((X = q[1]) == null ? void 0 : X.split(".")[1], q[2], o.column_default)) == null ? void 0 : z.toString()) == null ? void 0 : V.trim()) != null ? J : D(o.is_nullable) ? "null" : "{}";
                  if (!W)
                    throw new Error("Interface requested in comment, but not specified  - Format {Interface: ITest} for nullable or {Interface: ITest.initialValue}");
                  return {
                    column_name: o.column_name,
                    interface_name: W,
                    otherImportItem: te,
                    default_value: o.array_dimensions.length > 0 ? D(o.is_nullable) ? "null" : te != null ? te : "[]" : te
                  };
                }
              }
            }
            return { column_name: o.column_name, interface_name: "" };
          })
        ].filter((o) => !!o.interface_name)
      )
    ), r = Array.from(
      new Set(
        [
          ...this.columns.map((o) => {
            var B, H, v;
            const _ = /{([^}]*)}/.exec(o.column_comment);
            if (_ && _[1]) {
              const X = _[1].split(",");
              for (const z of X) {
                const V = z.split(":");
                if (((B = V[0]) != null ? B : "").toLowerCase().trim() === "type") {
                  const J = (v = (H = V[1]) == null ? void 0 : H.split(".")[0]) == null ? void 0 : v.trim();
                  if (!J)
                    throw new Error("Type requested in comment, but not specified  - Format {type: TTest}");
                  return {
                    column_name: o.column_name,
                    type_name: J
                  };
                }
              }
            }
            return { column_name: o.column_name, type_name: "" };
          })
        ].filter((o) => !!o.type_name)
      )
    );
    s.map((o) => o.enum_name).reduce((o, f) => o.includes(f) ? o : [...o, K("[]", "", f)], []).forEach((o) => {
      e += `import ${this.importWithTypes && !this.columns.some((f) => {
        var _, B, H, v;
        return K(" ", "", (_ = f.column_comment) != null ? _ : "").toLowerCase().includes(`{enum:${o.toLowerCase()}`) && (K(" ", "", (B = f.column_comment) != null ? B : "").toLowerCase().includes(`{enum:${o.toLowerCase()}.`) || !!f.column_default && !((H = f.column_default) != null ? H : "").toString().includes("{}") && ((v = f.column_default) != null ? v : "").toString().toLowerCase() !== "null");
      }) ? "type " : ""}{${o}} from "../Enums/${o}"${d}`;
    }), i.map((o) => o).reduce((o, f) => o.some((_) => _.interface_name === f.interface_name && (!!_.otherImportItem || !f.otherImportItem)) ? o : [...o.filter((_) => _.interface_name !== f.interface_name), f], []).forEach((o) => {
      var f;
      e += `import ${this.importWithTypes ? "type " : ""}{${o.interface_name}${!o.otherImportItem || ((f = o == null ? void 0 : o.otherImportItem) == null ? void 0 : f.toLowerCase()) === "null" ? "" : `, ${o.otherImportItem}`}} from "../Interfaces/${o.interface_name}"${d}`;
    }), (s.length > 0 || i.length > 0) && (e += d), r.map((o) => o).reduce((o, f) => o.some((_) => _.type_name === f.type_name) ? o : [...o.filter((_) => _.type_name !== f.type_name), f], []).forEach((o) => {
      e += `import ${this.importWithTypes ? "type " : ""}{${o.type_name}} from "../Types/${o.type_name}"${d}`;
    }), r.length > 0 && (e += d), e += `export interface I${this.name}`, this.inherits.length > 0 && (e += ` extends I${this.inherits.join(", I")}`), e += " {" + d;
    for (const o of this.columns)
      ie.CleanComment(o.column_comment) && (e += "	/** ", e += `${ie.CleanComment(o.column_comment)} `, e += `*/${d}`), e += "	", e += o.column_name, e += ": ", e += K("[]", "", (R = (w = (c = (l = s.find((f) => f.column_name === o.column_name)) == null ? void 0 : l.enum_name) != null ? c : (u = i.find((f) => f.column_name === o.column_name)) == null ? void 0 : u.interface_name) != null ? w : (m = r.find((f) => f.column_name === o.column_name)) == null ? void 0 : m.type_name) != null ? R : o.jsType()).trim(), o.array_dimensions.length > 0 && (e += `[${o.array_dimensions.map(() => "").join("],[")}]`), D((k = o.is_nullable) != null ? k : "YES") && (e += " | null"), e += d;
    e += "}" + d, e += d, e += `export const initial_${this.name}: I${this.name} = {` + d;
    let a = !1;
    this.inherits.length > 0 && (e += `	...initial_${this.inherits.join(`,${d}	...initial_`)},${d}`);
    for (const o of this.columns) {
      a && (e += "," + d), e += "	", e += o.column_name, e += ": ";
      const f = ($ = (Y = s.find((_) => _.column_name === o.column_name)) == null ? void 0 : Y.default_value) != null ? $ : (b = i.find((_) => _.column_name === o.column_name)) == null ? void 0 : b.default_value;
      if (f)
        f.endsWith(".") && D(o.is_nullable) && !o.column_default ? e += "null" : e += f;
      else if (o.array_dimensions.length > 0)
        D(o.is_nullable) ? e += "null" : e += `[${o.array_dimensions.map(() => "").join("],[")}]`;
      else if (o.blobType())
        e += "''";
      else if (D(o.is_identity) && o.isAutoIncrement)
        e += "0";
      else if (o.booleanType())
        D(o.is_nullable) ? e += "null" : e += D(o.column_default) ? "true" : "false";
      else if (o.column_default || typeof o.udt_name != "string" && o.udt_name.defaultValue)
        if (o.dateType())
          e += "''";
        else if (o.jsonType())
          e += ((A = o.column_default) != null ? A : "{}").toString().substring(1, ((h = o.column_default) != null ? h : "").toString().indexOf("::") - 1);
        else if (o.integerFloatType() || o.dateType())
          e += o.column_default;
        else if (typeof o.udt_name != "string")
          e += "'" + ((F = (U = o.column_default) != null ? U : o.udt_name.defaultValue) != null ? F : "") + "' as " + o.jsType();
        else if (o.column_default && o.column_default.toString().includes("::"))
          if (o.udt_name.startsWith("e_")) {
            const _ = o.column_default.toString();
            e += fe.TypeName(o.udt_name), e += ".", e += _.substr(1, _.indexOf("::") - 2);
          } else
            e += "'" + ((j = o.column_default) != null ? j : "").toString().substring(1, ((Q = o.column_default) != null ? Q : "").toString().indexOf("::") - 1) + "'";
        else
          e += "'" + ((ee = o.column_default) != null ? ee : "") + "'";
      else
        D(o.is_nullable) ? e += "null" : o.booleanType() ? e += "true" : o.integerFloatType() ? e += "0" : (o.dateType(), e += "''");
      a = !0;
    }
    if (e += d + "}" + d, n != null && n.includeConstraint) {
      const o = {};
      for (const f of this.columns) {
        const _ = {};
        f.booleanType() ? (_.type = "boolean", f.column_default && !f.isArray() && (_.default = D(f.column_default))) : f.integerFloatType() ? (_.type = "number", f.numeric_precision && (_.length = y(f.numeric_precision)), f.column_default && !f.isArray() && (_.default = y(f.column_default))) : f.jsonType() ? _.type = "object" : f.dateOnlyType() ? (_.type = "date", f.column_default && !f.isArray() && (_.default = "now")) : f.dateTimeOnlyType() ? (_.type = "datetime", f.column_default && !f.isArray() && (_.default = "now")) : f.timeOnlyType() ? (_.type = "time", f.column_default && !f.isArray() && (_.default = "now")) : (_.type = "string", f.character_maximum_length && (_.length = f.character_maximum_length), f.column_default && !f.isArray() && (_.default = "")), _.nullable = D(f.is_nullable), f.isArray() && (_.isArray = !0, _.nullable || (_.default = [])), o[f.column_name] = _;
      }
      e += d + `export const Constraint_${this.name}: TObjectConstraint<I${this.name}> = ${JSON.stringify(o, void 0, 4)}` + d;
    }
    return e;
  }
  /*export class Cprogress_report_test extends _CTable<Iprogress_report_test> {
  	public readonly table: TTables
  
  	constructor(responseContext: ResponseContext, initialValues?: Partial<Iprogress_report_test>) {
  		super(responseContext, initialValues, {...initial_progress_report_test})
  
  		this.table = 'progress_report_test'
  	}
  }*/
  static TSTables(n) {
    let e = "export type TTables =";
    return e += d, e += "	", e += n.filter((s) => !!s).sort((s, i) => Dt(s, i)).map((s) => `'${s}'`).join(d + "	| "), e += d, e;
  }
  /**
   * Generates the text for a class that manages the table itself.  Must inherit from a local _CTable base class.
   *
   * @param relativePaths
   */
  tsTextTable(n) {
    var i, r, a, l, u;
    const e = {
      initials: he("/", (i = n == null ? void 0 : n.initials) != null ? i : "@Common/Tables", !0),
      tTables: he("/", (r = n == null ? void 0 : n.tTables) != null ? r : "../Database", !0),
      responseContext: he("/", (a = n == null ? void 0 : n.responseContext) != null ? a : "../MiddleWare/ResponseContext", !0),
      responseContextName: (l = n == null ? void 0 : n.responseContextName) != null ? l : "responseContext",
      responseContextClass: (u = n == null ? void 0 : n.responseContextClass) != null ? u : "ResponseContext",
      includeConstraint: !!(n != null && n.includeConstraint)
    };
    let s = this.tableHeaderText("Table Class for", "MODIFICATIONS WILL NOT BE OVERWRITTEN");
    this.importWithTypes ? (s += `import {initial_${this.name}${e.includeConstraint ? `, Constraint_${this.name}` : ""}} from '${e.initials}/I${this.name}'` + d, s += `import type {I${this.name}} from '${e.initials}/I${this.name}'` + d) : s += `import {initial_${this.name}, I${this.name}} from '${e.initials}/I${this.name}'` + d, s += `import ${this.importWithTypes ? "type " : ""}{TTables} from '${e.tTables}/TTables'` + d, s += "import {_CTable} from './_CTable'" + d, s += `import ${this.importWithTypes ? "type " : ""}{${e.responseContextClass}} from '${e.responseContext}'` + d;
    for (const c of this.inherits)
      s += `import {_C${c}} from "./_C${c}"` + d;
    return s += d, s += `export class C${this.name} extends _CTable<I${this.name}>`, this.inherits.length > 0 && (s += `, C${this.inherits.join(", C")}`), s += " {" + d, s += "	public readonly table: TTables" + d, s += d, s += `	constructor(${e.responseContextName}: ${e.responseContextClass}) {` + d, s += `		super(${e.responseContextName}, {...initial_${this.name}})` + d, s += d, e.includeConstraint && (s += `		this.constraint = Constraint_${this.name}` + d), s += `		this.table = '${this.name}'` + d, s += "	}" + d, s += "}" + d, s;
  }
  ddlPrimaryKey() {
    let n = !1, e = 'PRIMARY KEY ("';
    for (const s of this.columns)
      D(s.is_identity) && (n && (e += '","'), e += s.column_name, n = !0);
    return n ? (e += '")', e) : null;
  }
  ddlCreateTableText(n, e, s = !0) {
    let i = "";
    s && (i += `DROP TABLE IF EXISTS ${this.name} CASCADE;` + d), i += `CREATE TABLE ${this.name}
				(` + d;
    let r = null;
    for (const l of this.columns)
      r !== null && (i += "," + d), i += "	" + l.ddlDefinition(), r = l;
    const a = this.ddlPrimaryKey();
    if (a && (i += "," + d + "	" + a), this.check) {
      const l = (typeof this.check == "string" ? [this.check] : this.check).filter((u) => !!u);
      for (const u of l)
        i += `,${d}	CHECK (${u})`;
    }
    i += d, i += ")", this.inherits.length > 0 && (i += d + `INHERITS (${this.inherits.join(",")})`), i += ";", e && (i += this.ddlCreateIndexes()), n && (i += this.ddlCreateForeignKeysText());
    for (const l of this.columns.filter((u) => !!u.column_comment))
      i += d + `COMMENT ON COLUMN ${this.name}.${l.column_name} IS '${ie.CleanComment(l.column_comment, !1)}';`;
    return i;
  }
  ddlCreateIndexes() {
    let n = "";
    for (const e of this.indexes)
      n += d + e.ddlDefinition(this);
    return n;
  }
  ddlCreateForeignKeysText() {
    let n = "";
    for (const e of this.foreignKeys)
      n += e.ddlConstraintDefinition(this) + d;
    return n;
  }
  static CleanComment(n, e = !0) {
    return n && (e ? n.replace(/[\n\r]/g, " ").replace(/\{(.+?)\}/g, "").trim() : n.replace(/[\n\r]/g, " ").trim());
  }
  fixedWidthMap(n) {
    var a;
    const e = G(G({}, wt), n);
    let s = e.startPosition, i = !e.startColumnName, r = [];
    for (const l of this.columns) {
      if (e.stopBeforeColumnName && l.column_name.toLowerCase() === e.stopBeforeColumnName.toLowerCase())
        break;
      if (i || l.column_name.toLowerCase() === e.startColumnName && (i = !0), i) {
        const u = (a = l.character_maximum_length) != null ? a : 0;
        u || console.warn("Could not determine length for FixedWidthMap", l.column_name, l.udt_name), r.push({
          column_name: l.column_name,
          startPosition: s,
          positionWidth: u
        }), s += u;
      }
      if (e.lastColumnName && l.column_name.toLowerCase() === e.lastColumnName.toLowerCase())
        break;
    }
    return r;
  }
}
class Rt extends ie {
  constructor(n, e) {
    super(n), this.myTable = e;
  }
}
var $e;
((t) => {
  t.GetPGTable = (n) => {
    const e = new Rt();
    e.name = n.name.toLowerCase();
    for (const s of n.columns) {
      const i = (0, t.GetPGColumn)(s);
      e.columns.push(i);
    }
    for (const s of n.foreignKeys) {
      const i = (0, t.GetPGForeignKey)(s);
      e.foreignKeys.push(i);
    }
    for (const s of n.indexes) {
      const i = (0, t.GetPGIndex)(s);
      e.indexes.push(i);
    }
    return e.myTable = n, e;
  }, t.GetPGColumn = (n) => {
    var s;
    const e = new M();
    return e.column_name = n.COLUMN_NAME, e.ordinal_position = n.ORDINAL_POSITION, e.udt_name = (0, t.UDTNameFromDataType)(n.DATA_TYPE), e.is_nullable = D(n.IS_NULLABLE) ? "YES" : "NO", e.column_default = e.udt_name === M.TYPE_BOOLEAN ? n.COLUMN_DEFAULT === null ? null : D(n.COLUMN_DEFAULT) : n.COLUMN_DEFAULT, e.character_maximum_length = n.CHARACTER_MAXIMUM_LENGTH, e.numeric_precision = n.NUMERIC_PRECISION, e.numeric_scale = n.NUMERIC_SCALE, e.datetime_precision = n.DATETIME_PRECISION, e.isAutoIncrement = n.EXTRA === "auto_increment", e.is_identity = n.COLUMN_KEY === "PRI" ? "YES" : "NO", e.column_comment = (s = n.COLUMN_COMMENT) != null ? s : "", e;
  }, t.GetPGForeignKey = (n) => {
    const e = new Ie();
    return e.columnNames = n.columnNames.map((s) => s.toLowerCase()), e.primaryTable = n.primaryTable.toLowerCase(), e.primaryColumns = n.primaryColumns.map((s) => s.toLowerCase()), e;
  }, t.GetPGIndex = (n) => {
    const e = new ge();
    return e.columns = n.columns.map((s) => s.toLowerCase()), e.isUnique = n.isUnique, e.whereCondition = n.where, e;
  }, t.UDTNameFromDataType = (n) => {
    switch (n.toUpperCase()) {
      case p.TYPE_TINYINT:
        return M.TYPE_BOOLEAN;
      case p.TYPE_FLOAT:
        return M.TYPE_FLOAT8;
      case p.TYPE_DATETIME:
        return M.TYPE_TIMESTAMP;
      case p.TYPE_INT:
      case p.TYPE_SMALLINT:
        return M.TYPE_INTEGER;
      case p.TYPE_BINARY:
        return M.TYPE_BYTEA;
      case p.TYPE_DECIMAL:
      case p.TYPE_DOUBLE:
        return M.TYPE_NUMERIC;
      case p.TYPE_MEDIUMTEXT:
        return M.TYPE_TEXT;
      default:
        return n.toLowerCase();
    }
  };
})($e || ($e = {}));
class Ke extends p {
  constructor(n) {
    super(), this.isPK = !1, this.isAutoIncrement = !1, n && this.deserialize(n);
  }
  deserialize(n) {
    const e = Object.keys(this);
    for (const s of e)
      n.hasOwnProperty(s) && (this[s] = n[s]);
  }
  clean() {
  }
  ddlDefinition(n, e, s) {
    var r;
    let i = "`" + this.COLUMN_NAME + "` ";
    if (i += this.DATA_TYPE, this.integerType())
      switch (this.DATA_TYPE) {
        case p.TYPE_BIT:
          i += " ";
          break;
        case p.TYPE_TINYINT:
          i += "(4) ";
          break;
        case p.TYPE_SMALLINT:
          i += "(6) ";
          break;
        case p.TYPE_MEDIUMINT:
          i += "(8) ";
          break;
        case p.TYPE_INT:
          i += "(11) ";
          break;
        case p.TYPE_BIGINT:
          i += "(20) ";
          break;
        default:
          i += "(" + this.NUMERIC_PRECISION + ") ";
          break;
      }
    else
      this.floatType() ? i += "(" + this.NUMERIC_PRECISION + "," + this.NUMERIC_SCALE + ") " : this.booleanType() ? i += "(1) " : this.DATA_TYPE === p.TYPE_DATE ? i += " " : this.dateType() ? ((r = this.DATETIME_PRECISION) != null ? r : 0) > 0 ? i += "(" + this.DATETIME_PRECISION + ") " : i += " " : this.generalStringType() && (this.blobType() ? i += " " : i += "(" + this.CHARACTER_MAXIMUM_LENGTH + ") ", i += "CHARACTER SET " + (this.CHARACTER_SET_NAME ? this.CHARACTER_SET_NAME : n.CHARSET) + " ", i += "COLLATE " + (this.COLLATION_NAME ? this.COLLATION_NAME : n.COLLATE) + " ");
    return D(this.IS_NULLABLE) || (i += "NOT NULL "), this.blobType() || (this.isAutoIncrement || this.EXTRA === "auto_increment" ? i += "AUTO_INCREMENT " : this.COLUMN_DEFAULT ? this.integerFloatType() || this.dateType() ? i += "DEFAULT " + this.COLUMN_DEFAULT + " " : i += "DEFAULT '" + this.COLUMN_DEFAULT + "' " : D(this.IS_NULLABLE) ? i += "DEFAULT NULL " : this.integerFloatType() ? i += "DEFAULT 0 " : this.dateType() ? this.COLUMN_TYPE != p.TYPE_DATE && (i += "DEFAULT CURRENT_TIMESTAMP", this.DATETIME_PRECISION ? i += "(" + this.DATETIME_PRECISION + ") " : i += " ") : i += "DEFAULT '' "), this.EXTRA && this.EXTRA !== "auto_increment" && (i += this.EXTRA + " "), this.COLUMN_COMMENT && (i += "COMMENT '" + this.COLUMN_COMMENT + "' "), i.trim();
  }
}
class ve {
  constructor(n) {
    this.columnNames = [], this.primaryTable = "", this.primaryColumns = [], this.isUnique = !1, this.keyName = "", this.onDelete = "RESTRICT", this.onUpdate = "RESTRICT", n && this.deserialize(n);
  }
  deserialize(n) {
    const e = Object.keys(this);
    for (const s of e)
      n.hasOwnProperty(s) && (this[s] = n[s]);
  }
  fkName(n, e) {
    return e + "_" + n.name.substr(-25) + "_" + this.columnNames.map((s) => s.substr(0, -10)).join("_");
  }
  ddlKeyDefinition(n, e) {
    let s = "";
    return e && (s += "ADD "), this.isUnique && (s += "UNIQUE "), s += "KEY ", s += "`" + this.fkName(n, "idx") + "` ", s += "(`" + this.columnNames.join("`,`") + "`)", s;
  }
  ddlConstraintDefinition(n, e) {
    let s = "";
    return e && (s += "ADD "), s += "CONSTRAINT ", s += "`" + this.fkName(n, "fk") + "` ", s += "FOREIGN KEY ", s += "(`" + this.columnNames.join("`,`") + "`) ", s += "REFERENCES ", s += "`" + this.primaryTable + "` ", s += "(`" + this.primaryColumns.join("`,`") + "`)", s;
  }
}
class je {
  constructor(n) {
    this.columns = [], this.isUnique = !1, this.using = "BTREE", this.indexName = "", this.where = null, n && this.deserialize(n);
  }
  deserialize(n) {
    const e = Object.keys(this);
    for (const s of e)
      n.hasOwnProperty(s) && (this[s] = n[s]);
  }
  name(n) {
    return "idx_" + n.name.substr(-25) + "_" + this.columns.map((e) => e.substr(0, -25)).join("_");
  }
  // @ts-ignore
  ddlDefinition(n, e) {
    let s = "";
    return this.isUnique && (s += "UNIQUE "), s += "KEY ", s += "`" + this.name(n) + "` ", s += "(`" + this.columns.join("`,`") + "`)", s;
  }
}
const C = `\r
`, O = class {
  constructor(t) {
    this.name = "", this.description = "", this.ENGINE = "InnoDB", this.CHARSET = "utf8mb4", this.COLLATE = "utf8mb4_unicode_ci", this.ROW_FORMAT = "COMPACT", this.columns = [], this.indexes = [], this.foreignKeys = [], t && this.deserialize(t);
  }
  deserialize(t) {
    const n = Object.keys(this);
    for (const e of n)
      if (t.hasOwnProperty(e))
        switch (e) {
          case "columns":
            for (const s of t[e])
              this[e].push(new Ke(s));
            break;
          case "indexes":
            for (const s of t[e])
              this[e].push(new je(s));
            break;
          case "foreignKeys":
            for (const s of t[e])
              this[e].push(new ve(s));
            break;
          default:
            this[e] = t[e];
            break;
        }
  }
  indexOfColumn(t) {
    return this.columns.findIndex((n) => n.COLUMN_NAME === t);
  }
  indexesOfForeignKeyByColumn(t) {
    let n = [];
    for (let e = 0; e < this.foreignKeys.length; e++)
      this.foreignKeys[e].columnNames.includes(t) && n.push(e);
    return n;
  }
  getForeignKeysByColumn(t) {
    let n = [];
    const e = this.indexesOfForeignKeyByColumn(t);
    for (const s of e)
      n.push(this.foreignKeys[s]);
    return n;
  }
  removeForeignKeysByColumn(t) {
    this.foreignKeys = this.foreignKeys.filter((n) => !n.columnNames.includes(t));
  }
  addForeignKey(t) {
    this.foreignKeys.push(t);
  }
  getColumn(t) {
    var n;
    return (n = this.columns.find((e) => e.COLUMN_NAME === t)) != null ? n : null;
  }
  removeColumn(t) {
    this.getColumn(t) && (this.removeForeignKeysByColumn(t), this.columns.filter((e) => e.COLUMN_NAME !== t), this.reOrderColumns());
  }
  addColumn(t) {
    t.ORDINAL_POSITION || (t.ORDINAL_POSITION = 999999), this.columns = this.columns.filter((n) => n.COLUMN_NAME !== t.COLUMN_NAME);
    for (let n = 0; n < this.columns.length; n++)
      this.columns[n].ORDINAL_POSITION >= t.ORDINAL_POSITION && this.columns[n].ORDINAL_POSITION++;
    this.columns.push(t), this.reOrderColumns();
  }
  reOrderColumns() {
    this.columns = this.columns.sort(
      (n, e) => n.ORDINAL_POSITION - e.ORDINAL_POSITION
    );
    let t = 0;
    for (let n = 0; n < this.columns.length; n++)
      t++, this.columns[n].ORDINAL_POSITION = t;
  }
  addIndex(t) {
    this.indexes.push(t);
  }
  tableHeaderText(t) {
    let n = "/**" + C;
    return n += " * Automatically generated: " + We("now") + C, n += " * © " + new Date().getFullYear() + ", Solid Basis Ventures, LLC." + C, n += " * DO NOT MODIFY" + C, n += " *" + C, n += " * " + t + ": " + this.name + C, this.description && (n += " *" + C, n += " * " + O.CleanComment(this.description) + C), n += " */" + C, n += C, n;
  }
  tsText() {
    var s;
    let t = this.tableHeaderText("Table Manager for");
    t += `export interface I${this.name} {` + C;
    let n = !1, e = "";
    for (const i of this.columns)
      n && (t += "," + e + C), t += "	", t += i.COLUMN_NAME, t += ": ", t += i.jsType(), D((s = i.IS_NULLABLE) != null ? s : "YES") && (t += " | null"), i.COLUMN_COMMENT ? e = " // " + O.CleanComment(i.COLUMN_COMMENT) : e = "", n = !0;
    t += e + C, t += "}" + C, t += C, t += `export const initial_${this.name}: I${this.name} = {` + C, n = !1, e = "";
    for (const i of this.columns)
      n && (t += "," + C), t += "	", t += i.COLUMN_NAME, t += ": ", i.blobType() ? t += "''" : i.isAutoIncrement || i.EXTRA === "auto_increment" ? t += "0" : i.COLUMN_DEFAULT ? i.booleanType() ? t += D(i.COLUMN_DEFAULT) ? "true" : "false" : i.dateType() ? t += "''" : i.integerFloatType() || i.dateType() ? t += i.COLUMN_DEFAULT : t += "'" + i.COLUMN_DEFAULT + "'" : D(i.IS_NULLABLE) ? t += "null" : i.booleanType() ? t += "true" : i.integerFloatType() ? t += "0" : (i.dateType(), t += "''"), n = !0;
    return t += e + C, t += "};" + C, t;
  }
  tsTextTable() {
    let t = this.tableHeaderText("Table Class for");
    return t += `import {initial_${this.name}, I${this.name}} from "../../../app/src/Common/Tables/${this.name}";` + C, t += 'import {TTables} from "../Database/Tables";' + C, t += 'import {TConnection} from "../Database/mysqlConnection";' + C, t += 'import {_Table} from "./_Table";' + C, t += C, t += `export class C${this.name} extends _CTable<I${this.name}> {` + C, t += "	public readonly table: TTables;" + C, t += C, t += `	constructor(connection: TConnection, initialValues?: I${this.name} | any) {` + C, t += `		super(connection, initialValues, initial_${this.name});` + C, t += C, t += `		this.table = '${this.name}';` + C, t += "	}" + C, t += "}" + C, t;
  }
  ddlPrimaryKey(t) {
    let n = !1, e = "PRIMARY KEY (`";
    for (const s of this.columns)
      s.isPK && (n && (e += "`,`"), e += s.COLUMN_NAME, n = !0);
    return n ? (e += "`)", e) : null;
  }
  ddlText(t, n, e = !1) {
    return E(this, null, function* () {
      var i, r, a, l;
      let s = "";
      if (e) {
        let u = !1;
        if (s += `ALTER TABLE ${this.name}` + C, n) {
          for (const c of this.indexes)
            u && (s += "," + C), u = !0, s += "	" + c.ddlDefinition(this, e);
          for (const c of this.foreignKeys)
            u && (s += "," + C), u = !0, s += "	" + c.ddlKeyDefinition(this, e);
          for (const c of this.foreignKeys)
            u && (s += "," + C), u = !0, s += "	" + c.ddlConstraintDefinition(this, e);
        }
        u && (s += C, s += ";");
      } else {
        e && (s += `DROP TABLE ${this.name} CASCADE;` + C), s += `CREATE TABLE ${this.name}
              (` + C;
        let u = null;
        for (const m of this.columns)
          u !== null && (s += "," + C), s += "	" + m.ddlDefinition(this, u, e), u = m;
        const c = this.ddlPrimaryKey(e);
        c && (s += "," + C + "	" + c);
        for (const m of this.indexes)
          s += "," + C + "	" + m.ddlDefinition(this, e);
        if (n) {
          for (const m of this.foreignKeys)
            s += "," + C + "	" + m.ddlKeyDefinition(this, e);
          for (const m of this.foreignKeys)
            s += "," + C + "	" + m.ddlConstraintDefinition(this, e);
        }
        s += C, s += ") ", s += "ENGINE=" + ((i = this.ENGINE) != null ? i : "InnoDB") + " ", s += "DEFAULT CHARSET=" + ((r = this.CHARSET) != null ? r : "utf8mb4") + " ", s += "COLLATE=" + ((a = this.COLLATE) != null ? a : "utf8mb4_unicode_ci") + " ", s += "ROW_FORMAT=" + ((l = this.ROW_FORMAT) != null ? l : "COMPACT"), s += ";";
      }
      return s;
    });
  }
  save() {
    for (let t = 0; t < this.columns.length; t++)
      this.columns[t].clean();
    O.SetPermissions(), S.mkdirSync(O.TS_INTERFACE_DIR + "/New/", { recursive: !0 }), S.mkdirSync(O.TS_CLASS_DIR + "/New/", { recursive: !0 }), O.writeFileIfDifferent(O.DEFINITIONS_DIR + "/" + this.name + ".json", JSON.stringify(this), !1), O.writeFileIfDifferent(O.TS_INTERFACE_DIR + "/New/I" + this.name + ".ts", this.tsText(), !0), O.writeFileIfDifferent(O.TS_CLASS_DIR + "/New/C" + this.name + ".ts", this.tsTextTable(), !0, !0);
  }
  static ExistsNewTS() {
    var t, n;
    return S.existsSync(O.TS_INTERFACE_DIR + "/New") && ((t = S.readdirSync(O.TS_INTERFACE_DIR + "/New")) != null ? t : []).filter((e) => e.endsWith(".ts")).length > 0 || S.existsSync(O.TS_CLASS_DIR + "/New") && ((n = S.readdirSync(O.TS_CLASS_DIR + "/New")) != null ? n : []).filter((e) => e.endsWith(".ts")).length > 0;
  }
  moveInNewTS() {
    let t = O.TS_INTERFACE_DIR + "/New/I" + this.name + ".ts";
    S.existsSync(t) && S.renameSync(t, t.replace("/New/", "/")), t = O.TS_CLASS_DIR + "/New/C" + this.name + ".ts", S.existsSync(t) && S.renameSync(t, t.replace("/New/", "/"));
  }
  static writeFileIfDifferent(t, n, e, s = !1) {
    if (O.SetPermissions(), !(s && (S.existsSync(t.replace("/New/", "/")) || S.existsSync(t)))) {
      if (e) {
        let i = n.indexOf("Solid Basis Ventures");
        if (i && S.existsSync(t.replace("/New/", "/")) && (!t.includes("/New/") || !S.existsSync(t))) {
          const r = S.readFileSync(t.replace("/New/", "/"), "utf8"), a = r.indexOf("Solid Basis Ventures"), l = r.substr(a), u = n.substr(i);
          if (l === u)
            return !0;
        }
      } else if (S.existsSync(t) && S.readFileSync(t, "utf8") === n)
        return !0;
      return S.writeFileSync(t, n);
    }
  }
  static writeFileIfNotExists(t, n) {
    O.SetPermissions(), S.existsSync(t) || S.writeFileSync(t, n);
  }
  syncToDB(t, n = !1) {
    return E(this, null, function* () {
      return !!(yield this.ddlText(!0, t, n));
    });
  }
  static SaveAll(t) {
    for (let n = 0; n < t.length; n++)
      t[n].save();
  }
  static Load(t) {
    O.SetPermissions();
    let n = t;
    return n.endsWith(".json") || (n += ".json"), n.startsWith(O.DEFINITIONS_DIR) || (n = O.DEFINITIONS_DIR + "/" + n), new O(JSON.parse(S.readFileSync(n)));
  }
  static LoadAll() {
    O.SetPermissions();
    let t = S.readdirSync(O.DEFINITIONS_DIR), n = [];
    for (const e of t)
      if (e.endsWith(".json")) {
        const s = O.Load(e);
        s && n.push(s);
      }
    return n;
  }
  // noinspection JSUnusedLocalSymbols
  static DeleteAll() {
    O.SetPermissions();
    let t = S.readdirSync(O.DEFINITIONS_DIR);
    for (const n of t)
      n.endsWith(".json") && S.unlinkSync(O.DEFINITIONS_DIR + "/" + n);
    t = S.readdirSync(O.TS_INTERFACE_DIR);
    for (const n of t)
      n.endsWith(".json") && S.unlinkSync(O.TS_INTERFACE_DIR + "/" + n);
  }
  // static ArePermissionsSet = false;
  static SetPermissions() {
  }
  static CleanComment(t) {
    return t && t.replace(/[\n\r]/g, " ");
  }
};
let de = O;
de.DEFINITIONS_DIR = S.resolve("./") + "/src/Assets/Tables";
de.TS_INTERFACE_DIR = S.resolve("./") + "/../app/src/Common/Tables";
de.TS_CLASS_DIR = S.resolve("./") + "/src/Tables";
var Fe;
((t) => {
  t.TableRowCount = (n, e) => E(void 0, null, function* () {
    return yield new Promise((s) => {
      n.query(`SELECT COUNT(*) AS count FROM ${e}`, (i, r, a) => {
        var l, u;
        if (i)
          throw i;
        s((u = ((l = (r != null ? r : [])[0]) != null ? l : {}).count) != null ? u : 0);
      });
    });
  }), t.TableExists = (n, e) => E(void 0, null, function* () {
    return yield new Promise((s) => {
      n.query(`SELECT COUNT(*) AS count
                      FROM information_schema.tables
                      WHERE TABLE_SCHEMA = '${n.config.database}'
                        AND TABLE_NAME = '${e}'`, (i, r, a) => {
        var l, u;
        if (i)
          throw i;
        s(((u = ((l = (r != null ? r : [])[0]) != null ? l : {}).count) != null ? u : 0) > 0);
      });
    });
  }), t.Tables = (n) => E(void 0, null, function* () {
    return yield new Promise((e) => {
      n.query(`SELECT TABLE_NAME
                      FROM information_schema.tables
                      WHERE TABLE_SCHEMA = '${n.config.database}'`, (s, i, r) => {
        if (s)
          throw s;
        e((i != null ? i : []).map((a) => a.TABLE_NAME).sort((a, l) => a.localeCompare(l)));
      });
    });
  }), t.TableColumnExists = (n, e, s) => E(void 0, null, function* () {
    return yield new Promise((i) => {
      n.query(`SELECT COUNT(*) AS count
                      FROM information_schema.COLUMNS
                      WHERE TABLE_SCHEMA = '${n.config.database}'
                        AND TABLE_NAME = '${e}'
                        AND COLUMN_NAME = '${s}'`, (r, a, l) => {
        var u, c;
        if (r)
          throw r;
        i(((c = ((u = (a != null ? a : [])[0]) != null ? u : {}).count) != null ? c : 0) > 0);
      });
    });
  }), t.TableColumns = (n, e) => E(void 0, null, function* () {
    return yield new Promise((s) => {
      n.query(`SELECT *
                      FROM information_schema.COLUMNS
                      WHERE TABLE_SCHEMA = '${n.config.database}'
                        AND TABLE_NAME = '${e}'
                        ORDER BY ORDINAL_POSITION`, (i, r, a) => {
        if (i)
          throw i;
        s([...r != null ? r : []]);
      });
    });
  }), t.TableFKs = (n, e) => E(void 0, null, function* () {
    return yield new Promise((s) => {
      n.query(`SELECT TABLE_NAME,COLUMN_NAME,CONSTRAINT_NAME, REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME
				FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
				WHERE REFERENCED_TABLE_SCHEMA = '${n.config.database}'
				  AND TABLE_NAME = '${e}'`, (i, r, a) => {
        if (i)
          throw i;
        let l = [];
        for (const u of r) {
          const c = l.find((m) => m.keyName === u.CONSTRAINT_NAME);
          if (c)
            c.columnNames = [...c.columnNames, u.COLUMN_NAME], c.primaryColumns = [...c.primaryColumns, u.REFERENCED_COLUMN_NAME];
          else {
            const m = new ve();
            m.keyName = u.CONSTRAINT_NAME, m.columnNames = [u.COLUMN_NAME], m.primaryTable = u.REFERENCED_TABLE_NAME, m.primaryColumns = [u.REFERENCED_COLUMN_NAME], l.push(m);
          }
        }
        s(l);
      });
    });
  }), t.TableIndexes = (n, e) => E(void 0, null, function* () {
    return yield new Promise((s) => {
      n.query(`SELECT INDEX_NAME, COLUMN_NAME, NON_UNIQUE
				FROM INFORMATION_SCHEMA.STATISTICS
				WHERE TABLE_SCHEMA = '${n.config.database}'
					AND TABLE_NAME = '${e}'
				ORDER BY INDEX_NAME`, (i, r, a) => {
        if (i)
          throw i;
        let l = [];
        for (const u of r) {
          const c = l.find((m) => m.indexName === u.INDEX_NAME);
          if (c)
            c.columns = [...c.columns, u.COLUMN_NAME];
          else {
            const m = new je();
            m.indexName = u.INDEX_NAME, m.columns = [u.COLUMN_NAME], m.isUnique = !D(u.NON_UNIQUE), l.push(m);
          }
        }
        s(l);
      });
    });
  }), t.GetMyTable = (n, e) => E(void 0, null, function* () {
    const s = new de();
    s.name = e;
    const i = yield (0, t.TableColumns)(n, e);
    for (const r of i) {
      const a = new Ke(r);
      s.columns.push(a);
    }
    return s.foreignKeys = yield (0, t.TableFKs)(n, e), s.indexes = yield (0, t.TableIndexes)(n, e), s;
  });
})(Fe || (Fe = {}));
class le {
  constructor() {
    this.lastPosition = 0, this.values = [];
  }
  reset() {
    this.lastPosition = 0, this.values = [];
  }
  add(n) {
    return this.lastPosition++, this.values.push(n), `$${this.lastPosition}`;
  }
  addLike(n) {
    return this.add(`%${n}%`);
  }
  addEqualNullable(n, e) {
    return e == null ? `${n} IS NULL` : `${n} = ${this.add(e)}`;
  }
  replaceSQLWithValues(n) {
    let e = n;
    for (let s = this.values.length; s > 0; s--)
      e = K(`$${s}`, typeof this.values[s - 1] == "string" ? `'${this.values[s - 1]}'` : this.values[s - 1], e);
    return e;
  }
}
var ne;
((t) => {
  t.SetDBMSAlert = (e) => {
    e ? process.env.DB_MS_ALERT = e.toString() : delete process.env.DB_MS_ALERT;
  }, t.query = (e, s, i) => E(void 0, null, function* () {
    try {
      if (process.env.DB_MS_ALERT) {
        const r = Date.now(), a = yield e.query(s, i), l = Date.now() - r;
        return l > y(process.env.DB_MS_ALERT) && (console.log("----- Long SQL Query", l / 1e3, "ms"), console.log(s), console.log(i)), a;
      } else
        return yield e.query(s, i);
    } catch (r) {
      throw console.log("------------ SQL Query"), console.log(Nt("LocalDateTime", "now", "America/New_York")), console.log(r.message), console.log(s), console.log(i), r;
    }
  }), t.timeout = (e) => E(void 0, null, function* () {
    return new Promise((s) => {
      setTimeout(s, e);
    });
  }), t.TableRowCount = (e, s, i) => E(void 0, null, function* () {
    var a, l, u;
    return (u = ((l = ((a = (yield (0, t.query)(e, `SELECT COUNT(*) AS count
											  FROM ${(i ? `${i}.` : "") + s}`, void 0)).rows) != null ? a : [])[0]) != null ? l : {}).count) != null ? u : 0;
  }), t.CurrentSchema = (e) => e != null ? e : "public", t.TableExists = (e, s, i) => E(void 0, null, function* () {
    var l, u, c;
    const r = `SELECT COUNT(*) AS count
					 FROM information_schema.tables
					 WHERE table_schema = '${(0, t.CurrentSchema)(i)}'
					   AND table_name = '${s}'`;
    return ((c = ((u = ((l = (yield (0, t.query)(e, r, void 0)).rows) != null ? l : [])[0]) != null ? u : {}).count) != null ? c : 0) > 0;
  }), t.TableColumnExists = (e, s, i, r) => E(void 0, null, function* () {
    var u, c, m;
    const a = `SELECT COUNT(*) AS count
					 FROM information_schema.COLUMNS
					 WHERE table_schema = '${(0, t.CurrentSchema)(r)}'
					   AND table_name = '${s}'
					   AND column_name = '${i}'`;
    return ((m = ((c = ((u = (yield (0, t.query)(e, a, void 0)).rows) != null ? u : [])[0]) != null ? c : {}).count) != null ? m : 0) > 0;
  }), t.TriggerExists = (e, s, i) => E(void 0, null, function* () {
    var l, u, c;
    const r = `SELECT COUNT(*) AS count
					 FROM information_schema.triggers
					 WHERE trigger_schema = '${(0, t.CurrentSchema)(i)}'
					   AND trigger_name = '${s}'`;
    return ((c = ((u = ((l = (yield (0, t.query)(e, r, void 0)).rows) != null ? l : [])[0]) != null ? u : {}).count) != null ? c : 0) > 0;
  }), t.TableResetIncrement = (e, s, i, r) => E(void 0, null, function* () {
    return r ? t.Execute(
      e,
      `SELECT setval(pg_get_serial_sequence('${s}', '${i}'), ${r});
			`
    ) : t.Execute(
      e,
      `SELECT SETVAL(PG_GET_SERIAL_SEQUENCE('${s}', '${i}'), MAX(${i}))
				 FROM ${s};
				`
    );
  }), t.ConstraintExists = (e, s, i) => E(void 0, null, function* () {
    var l, u, c;
    const r = `
			SELECT COUNT(*) AS count
			FROM information_schema.table_constraints
			WHERE constraint_schema = '${(0, t.CurrentSchema)(i)}'
			  AND constraint_name = '${s}'`;
    return ((c = ((u = ((l = (yield (0, t.query)(e, r, void 0)).rows) != null ? l : [])[0]) != null ? u : {}).count) != null ? c : 0) > 0;
  }), t.FKConstraints = (e, s) => E(void 0, null, function* () {
    const i = `
			SELECT table_name, constraint_name
			FROM information_schema.table_constraints
			WHERE constraint_schema = '${(0, t.CurrentSchema)(s)}'
			  AND constraint_type = 'FOREIGN KEY'`;
    return t.FetchMany(e, i);
  }), t.Functions = (e, s) => E(void 0, null, function* () {
    const i = `
			SELECT routines.routine_name
			FROM information_schema.routines
			WHERE routines.specific_schema = '${(0, t.CurrentSchema)(s)}'
			  AND routine_type = 'FUNCTION'
			ORDER BY routines.routine_name`;
    return (yield t.FetchArray(e, i)).filter((r) => r.startsWith("func_"));
  }), t.IndexExists = (e, s, i, r) => E(void 0, null, function* () {
    var u, c, m;
    const a = `SELECT COUNT(*) AS count
					 FROM pg_indexes
					 WHERE schemaname = '${(0, t.CurrentSchema)(r)}'
					   AND tablename = '${s}'
					   AND indexname = '${i}'`;
    return ((m = ((c = ((u = (yield (0, t.query)(e, a, void 0)).rows) != null ? u : [])[0]) != null ? c : {}).count) != null ? m : 0) > 0;
  }), t.GetByID = (e, s, i) => E(void 0, null, function* () {
    var r, a;
    if (i) {
      const l = `SELECT *
						 FROM ${s}
						 WHERE id = $1`, u = yield (0, t.query)(e, l, [i]);
      return ((r = u.rows) != null ? r : [])[0] ? G({}, ((a = u.rows) != null ? a : [])[0]) : null;
    } else
      return Promise.resolve(null);
  }), t.GetCountSQL = (e, s, i) => E(void 0, null, function* () {
    var a, l, u, c, m;
    const r = yield (0, t.query)(e, s, i);
    return y((m = ((l = ((a = r.rows) != null ? a : [])[0]) != null ? l : {}).count) != null ? m : ((c = ((u = r.rows) != null ? u : [])[0]) != null ? c : {})[0], 0);
  }), t.FetchOne = (e, s, i) => E(void 0, null, function* () {
    var a, l;
    const r = yield (0, t.query)(e, s, i);
    return ((a = r.rows) != null ? a : [])[0] ? G({}, ((l = r.rows) != null ? l : [])[0]) : null;
  }), t.FetchOneValue = (e, s, i) => E(void 0, null, function* () {
    var r, a;
    return (a = Object.values((r = yield (0, t.FetchOne)(e, s, i)) != null ? r : {})[0]) != null ? a : null;
  }), t.FetchMany = (e, s, i) => E(void 0, null, function* () {
    var a;
    return (a = (yield (0, t.query)(e, s, i)).rows) != null ? a : [];
  }), t.FetchArray = (e, s, i) => E(void 0, null, function* () {
    var a;
    return ((a = (yield (0, t.query)(e, s, i)).rows) != null ? a : []).map((l) => l[Object.keys(l)[0]]);
  }), t.FetchExists = (e, s, i) => E(void 0, null, function* () {
    var a, l;
    return !!((l = ((a = (yield (0, t.query)(e, `SELECT EXISTS (${s}) as does_exist`, i)).rows) != null ? a : [])[0]) != null && l.does_exist);
  }), t.InsertAndGetReturning = (e, s, i) => E(void 0, null, function* () {
    var c;
    let r = G({}, i);
    r.id || delete r.id;
    let a = new le();
    const l = `
			INSERT INTO ${s}
				("${Object.keys(r).join('","')}")
			VALUES (${Object.values(r).map((m) => a.add(m)).join(",")})
			RETURNING *`;
    return ((c = (yield (0, t.query)(e, l, a.values)).rows) != null ? c : [])[0];
  }), t.InsertAndGetID = (e, s, i) => E(void 0, null, function* () {
    var m;
    let r = G({}, i);
    r.id || delete r.id;
    let a = new le();
    const l = `
			INSERT INTO ${s}
				("${Object.keys(r).join('","')}")
			VALUES (${Object.values(r).map((w) => a.add(w)).join(",")})
			RETURNING id`, c = (m = (yield (0, t.query)(e, l, a.values)).rows[0]) == null ? void 0 : m.id;
    if (!c)
      throw new Error("Could not load ID");
    return c;
  }), t.InsertBulk = (e, s, i) => E(void 0, null, function* () {
    let r = new le();
    const a = `
			INSERT INTO ${s}
				("${Object.keys(i).join('","')}")
			VALUES (${Object.values(i).map((l) => r.add(l)).join(",")})`;
    yield (0, t.query)(e, a, r.values);
  }), t.UpdateAndGetReturning = (e, s, i, r) => E(void 0, null, function* () {
    let a = new le();
    const l = `UPDATE ${s}
					 SET ${(0, t.BuildSetComponents)(r, a)}
					 WHERE ${(0, t.BuildWhereComponents)(
      i,
      a
    )}
					 RETURNING *`;
    return (yield (0, t.query)(e, l, a.values)).rows[0];
  }), t.BuildWhereComponents = (e, s) => Object.keys(e).map((i) => e[i] === void 0 || e[i] === null ? `"${i}" IS NULL` : `"${i}"=${s.add(e[i])}`).join(" AND "), t.BuildSetComponents = (e, s) => Object.keys(e).map((i) => `"${i}"=${s.add(e[i])}`).join(","), t.Save = (e, s, i) => E(void 0, null, function* () {
    if (i.id) {
      let r = { id: i.id };
      return (0, t.UpdateAndGetReturning)(e, s, r, i);
    } else
      return (0, t.InsertAndGetReturning)(e, s, i);
  }), t.Delete = (e, s, i) => E(void 0, null, function* () {
    let r = new le();
    const a = `DELETE
					 FROM ${s}
					 WHERE ${(0, t.BuildWhereComponents)(i, r)}`;
    yield (0, t.query)(e, a, r.values);
  }), t.ExecuteRaw = (e, s) => E(void 0, null, function* () {
    return (0, t.Execute)(e, s);
  }), t.Execute = (e, s, i) => E(void 0, null, function* () {
    try {
      if (process.env.DB_MS_ALERT) {
        const r = Date.now(), a = yield e.query(s, i), l = Date.now() - r;
        return l > y(process.env.DB_MS_ALERT) && (console.log("----- Long SQL Query", l / 1e3, "ms"), console.log(s), console.log(i)), a;
      } else
        return yield e.query(s, i);
    } catch (r) {
      throw console.log("------------ SQL Execute"), console.log(r.message), console.log(s), console.log(i), new Error(r.message);
    }
  }), t.TruncateAllTables = (r, ...a) => E(void 0, [r, ...a], function* (e, s = [], i = !1) {
    let l = yield (0, t.TablesArray)(e);
    yield (0, t.Execute)(e, "START TRANSACTION"), yield (0, t.Execute)(e, "SET CONSTRAINTS ALL DEFERRED");
    try {
      for (const u of l)
        s.includes(u) && (yield (0, t.Execute)(e, `TRUNCATE TABLE ${u} RESTART IDENTITY` + (i ? " CASCADE" : ""), void 0));
      yield (0, t.Execute)(e, "COMMIT");
    } catch (u) {
      return yield (0, t.Execute)(e, "ROLLBACK"), !1;
    }
    return !0;
  }), t.TruncateTables = (e, s, i = !1) => E(void 0, null, function* () {
    for (const r of s)
      yield (0, t.Execute)(e, `TRUNCATE TABLE ${r} RESTART IDENTITY` + (i ? " CASCADE" : ""));
  }), t.TablesArray = (e, s) => E(void 0, null, function* () {
    return (0, t.FetchArray)(
      e,
      `
				SELECT table_name
				FROM information_schema.tables
				WHERE table_schema = '${(0, t.CurrentSchema)(s)}'
				  AND table_type = 'BASE TABLE'`
    );
  }), t.ViewsArray = (e, s) => E(void 0, null, function* () {
    return yield (0, t.FetchArray)(
      e,
      `
				SELECT table_name
				FROM information_schema.tables
				WHERE table_schema = '${(0, t.CurrentSchema)(s)}'
				  AND table_type = 'VIEW'`
    );
  }), t.ViewsMatArray = (e, s) => E(void 0, null, function* () {
    return yield (0, t.FetchArray)(
      e,
      `
				SELECT matviewname
				FROM pg_matviews
				WHERE schemaname = '${(0, t.CurrentSchema)(s)}'`
    );
  }), t.TypesArray = (e) => E(void 0, null, function* () {
    return yield (0, t.FetchArray)(
      e,
      `
				SELECT typname
				FROM pg_type
				WHERE typcategory = 'E'
				ORDER BY typname`
    );
  }), t.FunctionsArray = (e, s) => E(void 0, null, function* () {
    return yield (0, t.FetchArray)(
      e,
      `
				SELECT f.proname
				FROM pg_catalog.pg_proc f
						 INNER JOIN pg_catalog.pg_namespace n ON (f.pronamespace = n.oid)
				WHERE n.nspname = '${(0, t.CurrentSchema)(s)}'
				  AND f.proname ILIKE 'func_%'`
    );
  }), t.FunctionsOIDArray = (e, s) => E(void 0, null, function* () {
    return yield (0, t.FetchArray)(
      e,
      `
				SELECT f.oid
				FROM pg_catalog.pg_proc f
						 INNER JOIN pg_catalog.pg_namespace n ON (f.pronamespace = n.oid)
				WHERE n.nspname = '${(0, t.CurrentSchema)(s)}'
				  AND f.proname ILIKE 'func_%'`
    );
  }), t.ExtensionsArray = (e) => E(void 0, null, function* () {
    return yield (0, t.FetchArray)(
      e,
      `
				SELECT extname
				FROM pg_extension
				WHERE extname != 'plpgsql'`
    );
  }), t.TableData = (e, s, i) => E(void 0, null, function* () {
    return (0, t.FetchOne)(
      e,
      `
				SELECT *
				FROM information_schema.tables
				WHERE table_schema = '${(0, t.CurrentSchema)(i)}'
				  AND table_type = 'BASE TABLE'
				  AND table_name = $1`,
      [s]
    );
  }), t.TableColumnsData = (e, s, i) => E(void 0, null, function* () {
    return (0, t.FetchMany)(
      e,
      `
				SELECT *
				FROM information_schema.columns
				WHERE table_schema = '${(0, t.CurrentSchema)(i)}'
				  AND table_name = $1
				ORDER BY ordinal_position`,
      [s]
    );
  }), t.TableFKsData = (e, s, i) => E(void 0, null, function* () {
    return (0, t.FetchMany)(
      e,
      `
				SELECT tc.table_schema,
					   tc.constraint_name,
					   tc.table_name,
					   MAX(tc.enforced),
					   JSON_AGG(kcu.column_name) AS "columnNames",
					   MAX(ccu.table_schema)     AS foreign_table_schema,
					   MAX(ccu.table_name)       AS "primaryTable",
					   JSON_AGG(ccu.column_name) AS "primaryColumns"
				FROM information_schema.table_constraints AS tc
						 JOIN information_schema.key_column_usage AS kcu
							  ON tc.constraint_name = kcu.constraint_name
								  AND tc.table_schema = kcu.table_schema
						 JOIN information_schema.constraint_column_usage AS ccu
							  ON ccu.constraint_name = tc.constraint_name
								  AND ccu.table_schema = tc.table_schema
				WHERE tc.table_schema = '${(0, t.CurrentSchema)(i)}'
				  AND tc.constraint_type = 'FOREIGN KEY'
				  AND tc.table_name = $1
				GROUP BY tc.table_schema,
						 tc.constraint_name,
						 tc.table_name`,
      [s]
    );
  }), t.TableIndexesData = (e, s, i) => E(void 0, null, function* () {
    return (0, t.FetchMany)(
      e,
      `
				SELECT *
				FROM pg_indexes
				WHERE schemaname = '${(0, t.CurrentSchema)(i)}'
				  AND tablename = $1
				  AND (indexname NOT ILIKE '%_pkey'
					OR indexdef ILIKE '%(%,%)%')`,
      [s]
    );
  }), t.ViewData = (e, s) => E(void 0, null, function* () {
    var i, r;
    return (r = (i = yield (0, t.FetchOne)(
      e,
      `
          select pg_get_viewdef($1, true) as viewd`,
      [s]
    )) == null ? void 0 : i.viewd) != null ? r : null;
  }), t.ViewsMatData = (e, s) => E(void 0, null, function* () {
    var i, r;
    return (r = (i = yield (0, t.FetchOne)(
      e,
      `
          select pg_get_viewdef($1, true) as viewd`,
      [s]
    )) == null ? void 0 : i.viewd) != null ? r : null;
  }), t.FunctionData = (e, s) => E(void 0, null, function* () {
    var i, r;
    return (r = (i = yield (0, t.FetchOne)(
      e,
      `
          select pg_get_functiondef($1) as viewd`,
      [s]
    )) == null ? void 0 : i.viewd) != null ? r : null;
  }), t.TypeData = (e, s) => E(void 0, null, function* () {
    return (0, t.FetchArray)(
      e,
      `
                SELECT unnest(enum_range(NULL::${s}))`
    );
  }), t.SortColumnSort = (e) => {
    let s = "";
    if (e.primarySort) {
      if (s += "ORDER BY ", !e.primaryAscending)
        s += `${n(e.primarySort)} DESC`;
      else
        switch (e.primaryEmptyToBottom) {
          case "string":
            s += `NULLIF(${e.primarySort}, '')`;
            break;
          case "number":
            s += `NULLIF(${e.primarySort}, 0)`;
            break;
          default:
            s += `${n(e.primarySort)}`;
            break;
        }
      if (e.primaryEmptyToBottom && (s += " NULLS LAST"), e.secondarySort) {
        if (s += ", ", !e.secondaryAscending)
          s += `${n(e.secondarySort)} DESC`;
        else
          switch (e.secondaryEmptyToBottom) {
            case "string":
              s += `NULLIF(${e.secondarySort}, '')`;
              break;
            case "number":
              s += `NULLIF(${e.secondarySort}, 0)`;
              break;
            default:
              s += `${n(e.secondarySort)}`;
              break;
          }
        e.secondaryEmptyToBottom && (s += " NULLS LAST");
      }
    }
    return s;
  }, t.PaginatorOrderBy = (e) => (0, t.SortColumnSort)(e.sortColumns), t.LimitOffset = (e, s) => ` LIMIT ${e} OFFSET ${s} `, t.PaginatorLimitOffset = (e) => (0, t.LimitOffset)(e.countPerPage, e.currentOffset);
  const n = (e) => e === "appointment_date" ? "concat_ws(' ', appointment_date, appointment_time)" : e;
  t.CalcOffsetFromPage = (e, s, i) => {
    if (y(i) > 0) {
      const r = (0, t.CalcPageCount)(s, i);
      return y(e) < 1 && (e = 1), y(e) > y(r) && (e = r), (y(e) - 1) * y(s);
    } else
      return e = 1, 0;
  }, t.CalcPageCount = (e, s) => y(s) > 0 ? Math.floor((y(s) + (y(e) - 1)) / y(e)) : 0, t.ResetIDs = (e) => E(void 0, null, function* () {
    let s = yield t.TablesArray(e);
    for (const i of s)
      (yield (0, t.TableColumnExists)(e, i, "id")) && (yield (0, t.TableResetIncrement)(e, i, "id"));
  }), t.GetTypes = (e) => E(void 0, null, function* () {
    const s = yield (0, t.TypesArray)(e);
    let i = [];
    for (const r of s)
      i.push(
        new fe({
          enumName: r,
          values: yield (0, t.TypeData)(e, r),
          defaultValue: void 0
        })
      );
    return i;
  }), t.TableColumnComments = (e, s, i) => E(void 0, null, function* () {
    return t.FetchMany(e, `
			SELECT cols.column_name,
				   (SELECT pg_catalog.COL_DESCRIPTION(c.oid, cols.ordinal_position::INT)
					FROM pg_catalog.pg_class c
					WHERE c.oid = (SELECT cols.table_name::REGCLASS::OID)
					  AND c.relname = cols.table_name) AS column_comment

			FROM information_schema.columns cols
			WHERE cols.table_schema = '${(0, t.CurrentSchema)(i)}'
			  AND cols.table_name = '${s}'`);
  }), t.GetPGTable = (e, s, i) => E(void 0, null, function* () {
    var m, w, R, k, Y;
    const r = new ie();
    r.name = s;
    const a = yield (0, t.TableColumnComments)(e, s, i), l = yield (0, t.TableColumnsData)(e, s, i);
    for (const b of l) {
      const $ = new M(Me(G({}, b), {
        generatedAlwaysAs: b.generation_expression,
        isAutoIncrement: D(b.identity_increment),
        udt_name: b.udt_name.toString().startsWith("_") ? b.udt_name.toString().substr(1) : b.udt_name,
        array_dimensions: b.udt_name.toString().startsWith("_") ? [null] : [],
        column_default: ((m = b.column_default) != null ? m : "").toString().startsWith("'NULL'") || ((w = b.column_default) != null ? w : "").toString().startsWith("NULL::") ? null : ((R = b.column_default) != null ? R : "").toString().startsWith("''::") ? "" : b.column_default,
        column_comment: (Y = (k = a.find((A) => A.column_name === b.column_name)) == null ? void 0 : k.column_comment) != null ? Y : ""
      }));
      r.columns.push($);
    }
    const u = yield (0, t.TableFKsData)(e, s);
    for (const b of u) {
      const $ = new Ie({
        columnNames: b.columnNames.reduce((A, h) => A.includes(h) ? A : [...A, h], []),
        primaryTable: b.primaryTable,
        primaryColumns: b.primaryColumns.reduce((A, h) => A.includes(h) ? A : [...A, h], [])
      });
      r.foreignKeys.push($);
    }
    const c = yield (0, t.TableIndexesData)(e, s);
    for (const b of c) {
      const $ = b.indexdef, A = $.toUpperCase().indexOf(" WHERE "), h = new ge({
        columns: $.substring($.indexOf("(") + 1, A > 0 ? A - 1 : $.length - 1).split(",").map((U) => U.trim()).filter((U) => !!U),
        isUnique: $.includes(" UNIQUE "),
        whereCondition: A > 0 ? $.substring(A + 7).trim() : null
      });
      r.indexes.push(h);
    }
    return r;
  }), t.CleanSQL = (e) => K(";", "", e);
})(ne || (ne = {}));
class Ve {
  constructor(n) {
    this.name = "", this.definition = "", n && this.deserialize(n);
  }
  deserialize(n) {
    const e = Object.keys(this);
    for (const s of e)
      n.hasOwnProperty(s) && (this[s] = n[s]);
  }
  static GetFromDB(n, e) {
    return E(this, null, function* () {
      const s = yield ne.ViewData(n, e);
      return s ? new Ve({ name: e, definition: s }) : null;
    });
  }
  ddlDefinition() {
    return `CREATE OR REPLACE VIEW ${this.name} AS ${this.definition}`;
  }
  writeToDB(n) {
    return E(this, null, function* () {
      return this.name && this.definition ? ne.Execute(n, this.ddlDefinition()) : null;
    });
  }
}
class qe {
  constructor(n) {
    this.name = "", this.definition = "", n && this.deserialize(n);
  }
  deserialize(n) {
    const e = Object.keys(this);
    for (const s of e)
      n.hasOwnProperty(s) && (this[s] = n[s]);
  }
  static GetFromDB(n, e) {
    return E(this, null, function* () {
      const s = yield ne.ViewsMatData(n, e);
      return s ? new qe({ name: e, definition: s }) : null;
    });
  }
  ddlDefinition() {
    return `CREATE MATERIALIZED VIEW ${this.name} AS ${this.definition}`;
  }
  writeToDB(n) {
    return E(this, null, function* () {
      return this.name && this.definition ? yield ne.Execute(n, this.ddlDefinition()) : null;
    });
  }
}
class Xe {
  constructor(n) {
    this.name = "", this.definition = "", n && this.deserialize(n);
  }
  deserialize(n) {
    const e = Object.keys(this);
    for (const s of e)
      n.hasOwnProperty(s) && (this[s] = n[s]);
  }
  static GetFromDB(n, e) {
    return E(this, null, function* () {
      const s = yield ne.ViewData(n, e);
      return s ? new Xe({ name: e, definition: s }) : null;
    });
  }
  ddlDefinition() {
    return this.definition;
  }
  writeToDB(n) {
    return E(this, null, function* () {
      return this.name && this.definition ? ne.Execute(n, this.ddlDefinition()) : null;
    });
  }
}
const Pt = (t, n, e, s = !0) => {
  let i = "", r = !1;
  if (t && e.length > 0) {
    const a = Mt(t);
    for (const l of a)
      (r || s) && (i += "AND "), r = !0, i += "CONCAT_WS('|'," + e.join(",") + `) ILIKE ${n.addLike(l)} `;
  }
  return i;
};
export {
  p as ColumnDefinition,
  $t as ExecuteScript,
  Ut as KeyboardKey,
  Yt as KeyboardLine,
  Ke as MyColumn,
  ve as MyForeignKey,
  je as MyIndex,
  Fe as MySQL,
  de as MyTable,
  $e as MyToPG,
  M as PGColumn,
  fe as PGEnum,
  Ie as PGForeignKey,
  Xe as PGFunc,
  ge as PGIndex,
  qe as PGMatView,
  le as PGParams,
  ne as PGSQL,
  ie as PGTable,
  Rt as PGTableMy,
  Ve as PGView,
  Pt as PGWhereSearchClause,
  xt as PaginatorApplyRowCount,
  bt as PaginatorInitializeResponseFromRequest,
  Ft as PaginatorResponseFromRequestCount,
  St as PaginatorReturnRowCount,
  wt as initialFixedWidthMapOptions
};
