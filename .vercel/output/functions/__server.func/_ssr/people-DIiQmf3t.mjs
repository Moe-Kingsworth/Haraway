import { r as createServerFn } from "./ssr.mjs";
import { n as authMiddleware } from "./format-Tz25-cit.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/people-DIiQmf3t.js
var listStaff = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("63f578b0001a0076ae4ad6802503147e33eb149b3792a3c64021fd5217c0bf9b"));
var upsertStaff = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("3cd65b1299964a539175fc797d57cf4b1a1ae4454a82ce2be0170735e01eacec"));
var listAttendance = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("c3cb4cf8fb5d688d0766adebc89152d72e18b78ae115d9d2629ce4c187253ca6"));
var clockToday = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("0d203d19e74912dc40cc9c6182e6bd6906f6e6236dc4c6ec75ce809186c5b794"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("181472c3e29145e1c187199f74d151cb7b9fa360e0be5338885002ebd1415f58"));
var listLeave = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("6cfdf2c29e1518d88d993eb7acb638dec5382a1f5974ce0913e578ae83b8177d"));
var requestLeave = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("0c7dd88c03051607a5a681452d1d7990d5b8fd2d78ab70c86a99d2f45c38ce59"));
var reviewLeave = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("077ce5117434f40a76369690e4f0903078bf83d15c784801ee32deffb82a70d0"));
var listPayroll = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("805a7ec6e9cbb8246a98c23854c430b8bff59b3058ebe2b6d45b09ab6054ebb7"));
var processPayroll = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("99136bff47d0ec90e470b6766cccfebded93cf5c443e0e08de08f81b74d22347"));
var listTasks = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e5e17cb4b7700162469edb9e725b220cb72dea7869806246b50e5c159c84c1e4"));
var upsertTask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("fe154cb5e78d6438eeaf2df2306295ccb0373d3d6fcf54cdc9c2d2d32c41965d"));
var listReviews = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("7e7488ad3a89e002aadc4376594be764dfd3000b1d9a73089689b43408b4608b"));
var upsertReview = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("b116b3a6538dda78c590771d4d7c3baad2ff09e555e26cc9a566f49463311ed2"));
//#endregion
export { listReviews as a, processPayroll as c, upsertReview as d, upsertStaff as f, listPayroll as i, requestLeave as l, listAttendance as n, listStaff as o, upsertTask as p, listLeave as r, listTasks as s, clockToday as t, reviewLeave as u };
